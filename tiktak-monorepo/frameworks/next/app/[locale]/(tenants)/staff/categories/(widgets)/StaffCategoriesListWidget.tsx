"use client";

import { useState, useEffect }
  from 'react';
import { StaffCategoryAddModalWidget }
  from '@/app/[locale]/(tenants)/staff/categories/(widgets)/StaffCategoryAddModalWidget';
import { StaffCategoryEditModalWidget }
  from '@/app/[locale]/(tenants)/staff/categories/(widgets)/StaffCategoryEditModalWidget';
import { StaffConfirmationModalTile }
  from '@/app/[locale]/(tenants)/staff/categories/(tiles)/StaffConfirmationModalTile';
import { StaffCategorySelectModalWidget }
  from '@/app/[locale]/(tenants)/staff/categories/(widgets)/StaffCategorySelectModalWidget';
import { apiFetchHelper }
  from '@/lib/helpers/apiCallForSpaHelper';
import type { Category } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for staff categories (extends domain Category.PrivateAccess)
interface StaffCategoryApiResponse extends Category.PrivateAccess {
  parent_id: number | null; // API uses snake_case
  title: string; // API uses title instead of name
  children?: StaffCategoryApiResponse[]; // Recursive children
  [key: string]: any; // Allow additional API fields
}

interface VisibleCategories {
  [key: number]: boolean;
}

interface SelectedCategoryForUpdate {
  categoryId: number;
  newParentId?: number | null;
}

export function StaffCategoriesListWidget() {
  const [categoriesList, setCategoriesList] = useState<StaffCategoryApiResponse[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<VisibleCategories>({});
  const [loading, setLoading] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<number | null>(null);
  const [currentEditCategoryId, setCurrentEditCategoryId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCategoryForUpdate, setSelectedCategoryForUpdate] = useState<SelectedCategoryForUpdate | null>(null);
  const [isCategorySelectModalOpen, setIsCategorySelectModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number, label: string }[]>([]);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedCategoryForDeletion, setSelectedCategoryForDeletion] = useState<number | null>(null);


  // Function to handle select change
  const handleParentCategoryChange = (categoryId: number) => {
    setSelectedCategoryForUpdate({ categoryId });
    setCategoryOptions(generateCategoryOptions(categoriesList)); // Assuming you have this function from your previous code
    setIsCategorySelectModalOpen(true);
  };

  const openAddCategoryModal = (parentId: number) => {
    setCurrentParentId(parentId);
    setIsAddCategoryModalOpen(true);
  };

  const openAddCategoryMainModal = () => {
    setCurrentParentId(null);
    setIsAddCategoryModalOpen(true);
  };

  const closeAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
    setCurrentParentId(null);
  };

  const openEditCategoryModal = (categoryId: number) => {
    setCurrentEditCategoryId(categoryId);
    setIsEditCategoryModalOpen(true);
  };

  const closeEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
    setCurrentEditCategoryId(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const response = await apiFetchHelper({ method: 'GET', url: '/api/staff/categories', params: {}, body: {} });

      if (response.status === 200) {
        const organizedCategories = organizeCategories(response.data.categories);
        setCategoriesList(organizedCategories);
      }
    } catch (error) {
      ConsoleLogger.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  // Generate options for category selection
  const generateCategoryOptions = (categories: StaffCategoryApiResponse[], prefix = ''): { id: number, label: string }[] => {
    let options: { id: number, label: string }[] = [];
    categories.forEach((category) => {
      const optionValue = prefix ? `${prefix} -> ${category.title}` : category.title;
      options.push({ id: category.id, label: optionValue });
      if (category.children && category.children.length) {
        options = [...options, ...generateCategoryOptions(category.children, optionValue)];
      }
    });
    return options;
  };

  const updateCategoryParent = async () => {
    if (!selectedCategoryForUpdate) return;
    const { categoryId, newParentId } = selectedCategoryForUpdate;

    // Supabase call to update the category's parent_id
    try {
      const response = await apiFetchHelper(
        {
          method: 'PUT',
          url: '/api/staff/categories/update/' + categoryId,
          params: {},
          body: { newParentId }
        }
      );

      if (response.status === 200) {
        // If the update is successful, close the modal and refresh categories list
        setShowConfirmationModal(false);
        fetchCategories(); // Make sure this function correctly re-fetches the updated categories list
      }
    } catch (error) {
      ConsoleLogger.error('Error updating parent:', error);
    }
  };

  // const openDeleteConfirmationModal = (categoryId: number) => {
  //   setSelectedCategoryForDeletion(categoryId);
  //   setShowDeleteConfirmationModal(true);
  // };

  // const closeDeleteConfirmationModal = () => {
  //   setShowDeleteConfirmationModal(false);
  //   setSelectedCategoryForDeletion(null);
  // };

  const deleteCategory = async () => {
    if (!selectedCategoryForDeletion) return;

    try {
      const response = await apiFetchHelper({ method: 'DELETE', url: '/api/staff/categories/delete/' + selectedCategoryForDeletion, params: {}, body: {} });

      if (response.status === 200) {
        fetchCategories();
        setShowDeleteConfirmationModal(false);
      }
    } catch (error) {
      ConsoleLogger.error('Error deleting category:', error);
    }
  };

  const toggleCategoryVisibility = (categoryId: number) => {
    setVisibleCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  function getCategoryClass(category: StaffCategoryApiResponse) {
    // Check if this is a child category (parent_id !== null) but its parent doesn't exist
    // This indicates a "dangling" reference that should be fixed
    return category.parent_id !== null && !categoriesList.find(cat => cat.id === category.parent_id) ? 'dangling-parent' : '';
  }

  const renderCategories = (categories: StaffCategoryApiResponse[], level = 1) => {
    // const categoryOptions = generateCategoryOptions(categoriesList); // Unused
    return categories.map((category) => (

      <div key={category.id} className={`${getCategoryClass(category)} pl-4 py-2 my-2 border-l-2 border-slate-700 rounded flex flex-col gap-4 ${category.type === 'digital' ? 'bg-semidark text-white' : 'bg-gray-200'}`}>
        <div className="flex justify-between items-center px-4">
          <h2 className={`text-md font-semibold w-2/5`}>ID: {category.id} - {category.title}</h2>
          <div className='flex gap-2'>
            {category.children && category.children.length > 0 && (
              <button
                onClick={() => toggleCategoryVisibility(category.id)}
                className="px-2 py-1 border rounded border-gray-700 bg-white text-dark"
              >
                {visibleCategories[category.id] ? 'Hide' : 'Show'}
              </button>
            )}
            <button
              onClick={() => handleParentCategoryChange(category.id)}
              className="px-2 py-1 border rounded  bg-white text-dark"
            >
              Change Parent
            </button>
            <button
              onClick={() => openEditCategoryModal(category.id)}
              className="px-2 py-1 border rounded  bg-white text-dark"
            >
              Edit
            </button>
            <button
              onClick={() => openAddCategoryModal(category.id)}
              className="px-2 py-1  border rounded bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Category
            </button>
            <button
              onClick={() => {
                setSelectedCategoryForDeletion(category.id);
                setShowDeleteConfirmationModal(true);
              }}
              className="px-2 py-1 border rounded bg-brandPrimary hover:bg-rose-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
        {visibleCategories[category.id] && category.children && category.children.length > 0 && (
          <div className="ml-4">
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => openAddCategoryMainModal()} // Use an arrow function to correctly handle the click event
        className="mb-4 px-4 py-2 border rounded bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        Add New Category
      </button>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {renderCategories(categoriesList)}
        </div>
      )}
      <StaffCategoryAddModalWidget parentId={currentParentId} isOpen={isAddModalOpen} onClose={closeAddCategoryModal} onAdd={() => {
        // If we add a new category, we should probably just refetch to get the correct order/tree structure
        // or add it to the list. For now, simple refetch is safer for tree structure.
        fetchCategories(); 
        closeAddCategoryModal();
      }} />
      <StaffCategoryEditModalWidget categoryId={currentEditCategoryId} isOpen={isEditModalOpen} onClose={closeEditCategoryModal} />
      <StaffConfirmationModalTile
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={updateCategoryParent}
        message="Are you sure you want to update the parent category?"
      />
      <StaffCategorySelectModalWidget
        isOpen={isCategorySelectModalOpen}
        options={categoryOptions}
        onSelect={(newParentId) => {
          setSelectedCategoryForUpdate((prev) => prev ? ({ categoryId: prev.categoryId, newParentId }) : null);
          setIsCategorySelectModalOpen(false);
          setShowConfirmationModal(true); // Show confirmation modal after selecting a new parent
        }}
        onClose={() => setIsCategorySelectModalOpen(false)}
      />
      {showDeleteConfirmationModal && (
        <div className="fixed inset-0 bg-brandPrimaryDarkBg bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteConfirmationModal(false)} className="px-4 py-2 bg-white hover:bg-gray-400 rounded">
                Cancel
              </button>
              <button onClick={deleteCategory} className="px-4 py-2 bg-brandPrimary hover:bg-rose-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/**
 * Organize flat categories array into hierarchical tree structure
 * 
 * Logic:
 * - Categories with parent_id === null are ROOT/PARENT categories
 * - Categories with parent_id !== null are CHILD categories
 * - Child categories are nested under their parent in the children array
 * 
 * @param categories - Flat array of categories from API
 * @returns Hierarchical array with only root categories (children are nested)
 */
const organizeCategories = (categories: StaffCategoryApiResponse[]): StaffCategoryApiResponse[] => {
  const map: { [key: number]: number } = {};
  const roots: StaffCategoryApiResponse[] = [];

  // Clone categories and initialize empty children arrays
  const cats: StaffCategoryApiResponse[] = categories.map(c => ({ ...c, children: [] as StaffCategoryApiResponse[] }));

  // Build index map for O(1) lookups
  for (let i = 0; i < cats.length; i += 1) {
    const cat = cats[i];
    if (cat) {
      map[cat.id] = i;
    }
  }

  // Build hierarchy
  for (let i = 0; i < cats.length; i += 1) {
    const node = cats[i];
    if (!node) continue;
    
    // If parent_id is null, this is a ROOT category
    if (node.parent_id === null) {
      roots.push(node);
    } 
    // If parent_id has a value, this is a CHILD category
    else if (map[node.parent_id] !== undefined) {
      const parentIndex = map[node.parent_id];
      if (parentIndex !== undefined) {
        const parent = cats[parentIndex];
        if (parent && parent.children) {
          parent.children.push(node);
        }
      }
    } 
    // Dangling reference - parent doesn't exist
    else {
      roots.push(node); // Include in roots so admin can see and fix
    }
  }
  return roots;
};
