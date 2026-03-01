'use client';

import {
    useState,
    useEffect
} from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { PaginationPrimitive }
    from '@/app/primitives/Pagination.primitive';
import { toast }
    from 'react-toastify';
import { GlobalLoaderTile }
    from '@/app/[locale]/(global)/(tiles)/GlobalLoader.tile';
// Inline store type covering fields used in this widget
interface StoreType {
    id: number;
    name?: string;
    title?: string;
    slug?: string;
    logo?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    is_approved?: boolean;
    is_blocked?: boolean;
    is_active?: boolean;
    verificationStatus?: 'pending' | 'approved' | 'suspended' | null;
    status?: 'active' | 'inactive' | null;
    createdAt?: string;
    created_at?: string;
    updated_at?: string;
}
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { BlockPrimitive } from '@/app/primitives/Block.primitive';
import {
    PiStorefront,
    PiEye,
    PiTrash,
    PiCheck,
    PiWarning
} from 'react-icons/pi';
import Image
    from 'next/image';
import { generateSlug }
    from '@/lib/utils/Formatter.Slugify.util';

type ModalType = 'view' | 'approve' | 'block' | 'delete' | '';

export function StaffStoresListWidget() {
    const [stores, setStores] = useState<StoreType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeSearch, setActiveSearch] = useState('');
    const [activeSearchType, setActiveSearchType] = useState('title');
    const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalType>('');

    useEffect(() => {
        fetchStores();
    }, [page, activeSearch, activeSearchType]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = {
                page
            };

            if (activeSearch) {
                params.search = activeSearch;
                params.searchType = activeSearchType;
            }

            const response = await apiCall({
                method: 'GET',
                url: '/api/staff/stores',
                params,
                body: {}
            });

            if (response.status === 200) {
                const data = response.data;
                setStores(data.stores);
                setTotalPages(Math.ceil(data.total / data.pageSize));
            } else {
                setError('Failed to fetch stores');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores';
            setError(errorMessage);
            ConsoleLogger.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearch(search);
        setActiveSearchType(searchType);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const openModal = (store: StoreType, type: ModalType) => {
        setSelectedStore(store);
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedStore(null);
        setModalType('');
        setIsModalOpen(false);
    };

    const handleStoreAction = async (storeId: number, action: string, value: boolean | null = null) => {
        try {
            const response = await apiCall({
                method: 'PATCH',
                url: `/api/staff/stores/${storeId}`,
                body: { [action]: value }
            });

            if (response.status === 200) {
                toast.success(`Store ${action} updated successfully`);
                fetchStores(); // Refresh the list
                closeModal();
            } else {
                toast.error(`Failed to update store ${action}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error updating store';
            toast.error(`Error updating store: ${errorMessage}`);
        }
    };

    const handleDeleteStore = async (storeId: number) => {
        try {
            const response = await apiCall({
                method: 'DELETE',
                url: `/api/staff/stores/${storeId}`,
                body: {}
            });

            if (response.status === 200) {
                toast.success('Store deleted successfully');
                fetchStores();
                closeModal();
            } else {
                toast.error('Failed to delete store');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error deleting store';
            toast.error(`Error deleting store: ${errorMessage}`);
        }
    };

    const getStatusBadge = (store: StoreType) => {
        if (store.verificationStatus === 'suspended') {
            return <span className="px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-800">Blocked</span>;
        }
        if (store.verificationStatus === 'pending') {
            return <span className="px-2 py-1 text-xs rounded-full bg-warning text-gray-800">Pending Approval</span>;
        }
        if (store.status === 'inactive') {
            return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
        }
        return <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">Active</span>;
    };

    if (loading && stores.length === 0) {
        return <GlobalLoaderTile />;
    }

    if (error) {
        return (
            <div className="w-full p-4">
                <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className='w-full p-4'>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Stores Management</h1>
                <p className="text-gray-600">Manage and monitor all stores in the platform</p>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-wrap gap-2">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-700 bg-white"
                    >
                        <option value="title">Store Name</option>
                        <option value="address">Address</option>
                        <option value="phone">Phone</option>
                    </select>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search by ${searchType}...`}
                        className="flex-1 px-3 py-2 text-sm rounded border border-gray-300"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                    >
                        Search
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setActiveSearch('');
                                setPage(1);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </form>

            {loading && <div className="my-4 text-center">Loading stores...</div>}

            {/* Stores List */}
            <div className="grid grid-cols-1 gap-4">
                {stores.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <PiStorefront className="mx-auto text-4xl mb-2" />
                        <p>No stores found</p>
                    </div>
                ) : (
                    stores.map((store) => (
                        <div key={store.id} className="bg-white rounded-lg shadow border p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Store Info */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-start gap-4">
                                        {store.logo && (
                                            <Image
                                                src={Bun.env.NEXT_PUBLIC_S3_PREFIX + '/stores/' + store.id + '/' + store.logo}
                                                alt={store.name ?? ''}
                                                className="w-16 h-16 rounded-lg object-cover"
                                                width={64}
                                                height={64}
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {store.name || 'Untitled Store'}
                                                </h3>
                                                {getStatusBadge(store)}
                                            </div>

                                            {store.description && (
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                    {store.description}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                                                {store.address && (
                                                    <div>
                                                        <span className="font-medium">Address:</span> {store.address}
                                                    </div>
                                                )}
                                                {store.phone && (
                                                    <div>
                                                        <span className="font-medium">Phone:</span> {store.phone}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-medium">Slug:</span> {generateSlug(store.name || 'store')}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Created:</span> {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => openModal(store, 'view')}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                    >
                                        <PiEye /> View Details
                                    </button>

                                    {!store.is_approved && (
                                        <button
                                            onClick={() => openModal(store, 'approve')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
                                        >
                                            <PiCheck /> Approve
                                        </button>
                                    )}

                                    <button
                                        onClick={() => openModal(store, 'block')}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded ${store.is_blocked
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : 'bg-warning text-gray-800 hover:bg-yellow-400'
                                            }`}
                                    >
                                        {store.is_blocked ? <PiCheck /> : <PiWarning />}
                                        {store.is_blocked ? 'Unblock' : 'Block'}
                                    </button>

                                    <button
                                        onClick={() => openModal(store, 'delete')}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-rose-500 text-white rounded hover:bg-rose-600"
                                    >
                                        <PiTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <PaginationPrimitive
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Modal */}
            {isModalOpen && selectedStore && (
                <BlockPrimitive variant="modal">
                    <BlockPrimitive variant="default">
                        {modalType === 'view' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">Store Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-medium">Name:</span> {selectedStore.title || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Description:</span> {selectedStore.description || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Address:</span> {selectedStore.address || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Phone:</span> {selectedStore.phone || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Slug:</span> {generateSlug(selectedStore.title || 'store')}
                                    </div>
                                    <div>
                                        <span className="font-medium">Status:</span> {getStatusBadge(selectedStore)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span> {selectedStore.created_at ? new Date(selectedStore.created_at).toLocaleDateString() : 'N/A'}
                                    </div>
                                    {selectedStore.updated_at && (
                                        <div>
                                            <span className="font-medium">Updated:</span> {new Date(selectedStore.updated_at).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {modalType === 'approve' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">Approve Store</h3>
                                <p className="mb-4">Are you sure you want to approve "{selectedStore.title}"?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStoreAction(selectedStore.id, 'is_approved', true)}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}

                        {modalType === 'block' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    {selectedStore.is_blocked ? 'Unblock' : 'Block'} Store
                                </h3>
                                <p className="mb-4">
                                    Are you sure you want to {selectedStore.is_blocked ? 'unblock' : 'block'} "{selectedStore.title}"?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStoreAction(selectedStore.id, 'is_blocked', !selectedStore.is_blocked)}
                                        className={`px-4 py-2 rounded text-white ${selectedStore.is_blocked
                                            ? 'bg-emerald-500 hover:bg-emerald-600'
                                            : 'bg-rose-500 hover:bg-rose-600'
                                            }`}
                                    >
                                        {selectedStore.is_blocked ? 'Unblock' : 'Block'}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}

                        {modalType === 'delete' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-rose-600">Delete Store</h3>
                                <p className="mb-4">
                                    Are you sure you want to permanently delete "{selectedStore.title}"? This action cannot be undone.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDeleteStore(selectedStore.id)}
                                        className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </BlockPrimitive>
                </BlockPrimitive>
            )}
        </div>
    );
}
