"use client";

import {
    useState,
    useEffect
} from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import type { CategoryFilterDbRecord, CategoryFilterOptionDbRecord } from '@/lib/domain/categories/_Categories.index';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { BlockPrimitive } from '@/app/primitives/Block.primitive';
interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

// Simple Modal Component
const Modal = ({ title, children, onClose }: ModalProps) => (
    <BlockPrimitive variant="modal">
        <BlockPrimitive variant="default">
            <h4 className="text-lg font-medium">{title}</h4>
            {children}
            <button onClick={onClose} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">Close</button>
        </BlockPrimitive>
    </BlockPrimitive>
);

interface FilterWithOptions extends CategoryFilterDbRecord {
    category_filter_options: CategoryFilterOptionDbRecord[];
}

interface StaffCategoryFiltersEditWidgetProps {
    categoryId: string;
}

/** Helper: extract displayable title from JSONB */
function displayTitle(title: any): string {
    if (!title || typeof title !== 'object') return String(title || '');
    return title.az || title.en || title.ru || '';
}

export function StaffCategoryFiltersEditWidget({ categoryId }: StaffCategoryFiltersEditWidgetProps) {
    const [filters, setFilters] = useState<FilterWithOptions[]>([]);

    // JSONB title fields for new filter
    const [newFilterTitleAz, setNewFilterTitleAz] = useState('');
    const [newFilterTitleEn, setNewFilterTitleEn] = useState('');
    const [newFilterTitleRu, setNewFilterTitleRu] = useState('');

    // JSONB title fields for new option
    const [newOptionTitleAz, setNewOptionTitleAz] = useState('');
    const [newOptionTitleEn, setNewOptionTitleEn] = useState('');
    const [newOptionTitleRu, setNewOptionTitleRu] = useState('');

    const [filterType, setFilterType] = useState('DYNAMIC');
    const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false);

    useEffect(() => {
        if (categoryId) {
            fetchFilters();
        }
    }, [categoryId]);

    const fetchFilters = async () => {
        try {
            const response = await apiCall({ method: 'GET', url: '/api/staff/categories/' + categoryId + '/filters', params: {}, body: {} });

            if (response.status === 200) {
                setFilters(response.data.filters);
            }
        } catch (error: any) {
            ConsoleLogger.error('Error fetching filters:', error.message);
        }
    };

    const addFilter = async () => {
        try {
            const title = { az: newFilterTitleAz, en: newFilterTitleEn, ru: newFilterTitleRu };
            const response = await apiCall({ method: 'POST', url: '/api/staff/categories/' + categoryId + '/filters/create', params: {}, body: { title, type: filterType } });

            if (response.status === 200) {
                setNewFilterTitleAz('');
                setNewFilterTitleEn('');
                setNewFilterTitleRu('');
                setFilterType('DYNAMIC');
                fetchFilters();
            }
        } catch (error: any) {
            ConsoleLogger.error('Error adding filter:', error.message);
        }
    };

    const deleteFilter = async (filterId: string) => {
        try {
            const response = await apiCall({ method: 'DELETE', url: '/api/staff/categories/' + categoryId + '/filters/' + filterId + '/delete', params: {}, body: {} });

            if (response.status === 200) {
                fetchFilters();
            }
        } catch (error: any) {
            ConsoleLogger.error('Error deleting filter:', error.message);
        }
    };

    const addOption = async () => {
        try {
            const title = { az: newOptionTitleAz, en: newOptionTitleEn, ru: newOptionTitleRu };
            const response = await apiCall({ method: 'POST', url: '/api/staff/categories/' + categoryId + '/filters/' + selectedFilterId + '/options/create', params: {}, body: { title } });

            if (response.status === 200) {
                setNewOptionTitleAz('');
                setNewOptionTitleEn('');
                setNewOptionTitleRu('');
                fetchFilters();
            }
        } catch (error: any) {
            ConsoleLogger.error('Error adding option:', error.message);
        }
    };

    const deleteOption = async (optionId: string) => {
        try {
            const response = await apiCall({ method: 'DELETE', url: '/api/staff/categories/' + categoryId + '/filters/' + selectedFilterId + '/options/' + optionId + '/delete', params: {}, body: {} });

            if (response.status === 200) {
                fetchFilters();
            }
        } catch (error: any) {
            ConsoleLogger.error('Error deleting option:', error.message);
        }
    };

    return (
        <div className=' bg-gray-200 rounded-lg my-4 p-4'>
            <h3 className="text-lg font-medium p-4">Filters</h3>
            {filters.map(filter => (
                <div key={filter.id} className="mb-4 p-4 bg-white ">
                    <div className='p-4'>
                        Filter id: {filter.id} - Adi <span className='font-bold'>{displayTitle(filter.title)}</span> novu -({filter.type})
                        <button onClick={() => deleteFilter(filter.id)} className="ml-2 px-2 py-1 bg-gray-600 text-white rounded">Delete Filter</button>
                    </div>
                    <ul className='grid grid-cols-1 gap-4 p-4 border border-gray-200 rounded-lg'>
                        {filter.category_filter_options?.map(option => (
                            <li className="bg-gray-300 text-black p-3 rounded-lg" key={option.id}>
                                Option id{option.id}: Adi <span className='font-bold'>{displayTitle(option.title)}</span>
                                <button onClick={() => deleteOption(option.id)} className="ml-2 px-2 py-1 bg-gray-600 text-white rounded">Delete Option</button>
                            </li>
                        ))}
                    </ul>
                    {filter.type === 'STATIC' && (
                        <button type="button" onClick={() => { setSelectedFilterId(filter.id); setShowOptionModal(true); }} className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">Add Option</button>
                    )}
                </div>
            ))}
            <button type="button" onClick={() => setShowFilterModal(true)} className="mt-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Add New Filter</button>

            {/* Filter Modal */}
            {showFilterModal && (
                <Modal title="Add New Filter" onClose={() => setShowFilterModal(false)}>
                    <input
                        type="text"
                        value={newFilterTitleAz}
                        onChange={(e) => setNewFilterTitleAz(e.target.value)}
                        placeholder="Title (AZ)"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        value={newFilterTitleEn}
                        onChange={(e) => setNewFilterTitleEn(e.target.value)}
                        placeholder="Title (EN)"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        value={newFilterTitleRu}
                        onChange={(e) => setNewFilterTitleRu(e.target.value)}
                        placeholder="Title (RU)"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    >
                        <option value="DYNAMIC">DYNAMIC</option>
                        <option value="STATIC">STATIC</option>
                    </select>
                    <button type='button'
                        onClick={() => { addFilter(); setShowFilterModal(false); }}
                        className="mt-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Add Filter
                    </button>
                </Modal>
            )}

            {/* Option Modal */}
            {showOptionModal && (
                <Modal title="Add New Option" onClose={() => setShowOptionModal(false)}>
                    <input
                        type="text"
                        value={newOptionTitleAz}
                        onChange={(e) => setNewOptionTitleAz(e.target.value)}
                        placeholder="Option Title (AZ)"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        value={newOptionTitleEn}
                        onChange={(e) => setNewOptionTitleEn(e.target.value)}
                        placeholder="Title (EN)"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        value={newOptionTitleRu}
                        onChange={(e) => setNewOptionTitleRu(e.target.value)}
                        placeholder="Title (RU)"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    />
                    <button type='button'
                        onClick={() => { addOption(); setShowOptionModal(false); }}
                        className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                        Add Option
                    </button>
                </Modal>
            )}
        </div>
    );
}
