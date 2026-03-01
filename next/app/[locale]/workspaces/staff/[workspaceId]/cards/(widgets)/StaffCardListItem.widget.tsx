"use client";

import { useState }
    from 'react';
import { StaffCardDetailsModalWidget }
    from '@/app/[locale]/workspaces/staff/[workspaceId]/cards/(widgets)/StaffCardDetailsModal.widget';
import { toast }
    from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';

import type { Card } from '@tiktak/shared/types/domain/Card.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
// API response type for staff card list items (extends domain Card.PrivateAccess)
interface StaffCardListItemApiResponse extends Omit<Card.PrivateAccess, 'images' | 'video' | 'price'> {
    created_at: Date; // API uses snake_case
    store_name?: string; // Joined data from workspace table
    is_approved: boolean;
    is_active: boolean;
    published_data?: any;
    has_pending_updates?: boolean;
    price?: { amount: number; currency: string } | number | null;
}

// API response type for staff card details modal (extends domain Card.PrivateAccess)
interface StaffCardDetailsApiResponse extends Omit<Card.PrivateAccess, 'images' | 'video' | 'price'> {
    created_at: Date; // API uses snake_case
    updated_at?: Date; // API uses snake_case
    description?: string; // API uses body instead of description
    images?: string[]; // API includes processed images array
    video?: {
        url: string;
        title?: string;
    }; // API includes video filename
    categories: string[] | null; // API includes category IDs
    storagePrefix?: string; // API includes storage prefix
    is_active: boolean; // API includes active status
    is_approved: boolean; // API includes approval status
    is_published?: boolean; // API includes published status
    store_display_name?: string; // Joined store display name
    published_data?: any; // Published data for comparison
    options?: any[]; // Card options/filters
    price?: { amount: number; currency: string } | number;
}

interface StaffCardListItemWidgetProps {
    card: StaffCardListItemApiResponse;
    onRefreshList: () => Promise<void>;
}

export function StaffCardListItemWidget({
    card,
    onRefreshList
}: StaffCardListItemWidgetProps) {

    // Modal state
    const [selectedCard, setSelectedCard] = useState<StaffCardDetailsApiResponse | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);


    // Modal handlers
    const showDetailsModal = async () => {
        setLoadingDetails(true);
        setDetailsModalOpen(true);
        setSelectedCard(null); // Clear previous card while loading

        const response = await apiCall({
            method: 'GET',
            url: `/api/staff/cards/${card.id}`,
            params: {},
            body: {}
        });

        if (response.status === 200) {
            // Store both card and published_data
            setSelectedCard({
                ...response.data.card,
                published_data: response.data.published_data,
                is_published: response.data.is_published
            });
        } else {
            ConsoleLogger.error('Error fetching card details:', response.data?.error || 'Unknown error');
            toast.error('Error fetching card details');
            setDetailsModalOpen(false);
        }
        setLoadingDetails(false);
    };

    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
        setSelectedCard(null);
        setLoadingDetails(false);
    };

    const handleApproveChanges = async (cardId: string) => {
        const response = await apiCall({
            method: 'PUT',
            url: `/api/staff/cards/approve/${cardId}`,
            params: {},
            body: {
                approved: true,
                reasons: [],
                reasonText: ''
            }
        });

        if (response.status === 200) {
            onRefreshList();
            closeDetailsModal();
            toast.success(response.data.message || 'Updates approved successfully');
        } else {
            toast.error(response.data?.error || 'Error approving update');
        }
    };

    const handleRejectChanges = async (cardId: string) => {
        const response = await apiCall({
            method: 'PUT',
            url: `/api/staff/cards/approve/${cardId}`,
            params: {},
            body: {
                approved: false,
                reasons: ['all'],
                reasonText: 'Rejected by admin'
            }
        });

        if (response.status === 200) {
            onRefreshList();
            closeDetailsModal();
            toast.success(response.data.message || 'Updates rejected successfully');
        } else {
            toast.error(response.data?.error || 'Error rejecting update');
        }
    };

    return (
        <div key={card.id} className="relative p-4 rounded w-full bg-app-bright-purple/10/50">
            {/* Header with ID and badges */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm bg-slate-200 px-2 py-1 rounded">ID: {card.id}</span>
                    {/* Absolutely positioned store/personal badge */}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.workspaceId
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                        {card.workspaceId ? 'Workspace' : 'Personal'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {!card.is_approved && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending Approval</span>}
                    {card.is_approved && !card.published_data && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Approved (Not Published)</span>}
                    {card.is_approved && card.published_data && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approved</span>}
                    {card.published_data && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Published</span>}
                    {card.published_data?.is_active && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">Active</span>}
                </div>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                {/* Column 1 - Title and Price (Latest Updates) */}
                <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-sm font-semibold text-blue-700 mb-2">Latest Updates</h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Title</label>
                                <h4 className="text-lg font-semibold text-slate-900 wrap-break-word">{card.title || 'No title'}</h4>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">Price</label>
                                <div className='text-lg text-slate-900 font-bold'>${typeof card.price === 'object' && card.price !== null ? card.price.amount : (card.price ?? 0)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2 - Published Title and Price */}
                <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="text-sm font-semibold text-green-700 mb-2">Published Data</h3>

                        {card.published_data ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 font-medium">Title</label>
                                    <h4 className="text-lg font-semibold text-green-900 wrap-break-word">{card.published_data.title || 'No title'}</h4>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 font-medium">Price</label>
                                    <div className='text-lg text-green-800 font-bold'>${card.published_data.price || 0}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400 italic text-sm">
                                No published data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3 - Statuses, Store Owner, Card Author Type */}
                <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="text-sm font-semibold text-purple-700 mb-2">Status & Details</h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Store Owner</label>
                                <div className='text-sm text-slate-700'>{card.store_name || 'Individual User'}</div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">Posted Date</label>
                                <div className='text-sm text-slate-700'>{new Date(card.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions - Only Show Details Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    onClick={showDetailsModal}
                    className={`text-white py-2 px-6 rounded-md transition-colors bg-gray-900`}
                >
                    {card.has_pending_updates ? 'Review & Approve' : 'Show Details'}
                </button>
            </div>

            {/* Details Modal */}
            <StaffCardDetailsModalWidget
                selectedCard={selectedCard}
                isOpen={detailsModalOpen}
                onClose={closeDetailsModal}
                onApprove={handleApproveChanges}
                onReject={handleRejectChanges}
                loading={loadingDetails}
            />
        </div>
    );
}

