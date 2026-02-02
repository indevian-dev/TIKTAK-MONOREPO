"use client";

import { useState }
    from 'react';
import { apiFetchHelper }
    from '@/lib/helpers/apiCallForSpaHelper';

interface StaffCategoryAddModalWidgetProps {
    parentId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newCategory: any) => void;
}

export function StaffCategoryAddModalWidget({ parentId, isOpen, onClose, onAdd = () => { } }: StaffCategoryAddModalWidgetProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('standard'); // Default to 'standard'

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await apiFetchHelper({ method: 'POST', url: '/api/staff/categories/create', params: {}, body: { title, description, parent_id: parentId, type } });

        if (response.status === 200 || response.status === 201) {
            onClose(); // Close the modal on successful addition
            onAdd(response.data.category);
        }
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-slate-950 bg-opacity-90 z-50 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded w-full my-8 lg:w-1/2">
                {/* Title Input */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>

                {/* Type Select */}
                <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    >
                        <option value="standard" className=''>Standard</option>
                        <option value="digital" className=''>Digital</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-black hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Add Category
                    </button>
                </div>
            </form>
        </div>
    );
}
