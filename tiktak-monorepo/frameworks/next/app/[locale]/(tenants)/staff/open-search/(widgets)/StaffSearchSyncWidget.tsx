"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import { useState }
    from "react";
import { apiFetchHelper }
    from '@/lib/helpers/apiCallForSpaHelper';
import { toast }
    from "react-toastify";

export function StaffSearchSyncWidget() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState("cards_index");

    const handleSync = async () => {
        try {
            setIsLoading(true);
            const response = await apiFetchHelper({
                method: 'GET',
                url: '/api/staff/open-search/sync',
                params: {
                    secret: '123123',
                    indexName: selectedIndex
                }
            });

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error((errorData as any)?.message || "Failed to sync cards");
            }

            const result = response.data;
            toast.success(`Card sync completed successfully to ${selectedIndex}. Synced: ${(result as any)?.stats?.success || 0} cards`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to sync cards";
            toast.error(errorMessage);
            ConsoleLogger.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium">Sync Cards to OpenSearch</h3>
                        <p className="text-sm text-gray-500">
                            Synchronize all cards data to the search database
                        </p>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={isLoading}
                        className="bg-brandPrimary hover:bg-bd text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Syncing...
                            </>
                        ) : (
                            <>
                                Sync Cards
                            </>
                        )}
                    </button>
                </div>

                {/* Index Mode Selection */}
                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Index
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="indexMode"
                                value="cards_index"
                                checked={selectedIndex === "cards_index"}
                                onChange={(e) => setSelectedIndex(e.target.value)}
                                className="mr-2 text-brandPrimary focus:ring-brand"
                                disabled={isLoading}
                            />
                            <span className="text-sm">
                                <span className="font-medium">Production</span>
                                <span className="text-gray-500 ml-1">(cards_index)</span>
                            </span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="indexMode"
                                value="cards_index_dev"
                                checked={selectedIndex === "cards_index_dev"}
                                onChange={(e) => setSelectedIndex(e.target.value)}
                                className="mr-2 text-brandPrimary focus:ring-brand"
                                disabled={isLoading}
                            />
                            <span className="text-sm">
                                <span className="font-medium">Development</span>
                                <span className="text-gray-500 ml-1">(cards_index_dev)</span>
                            </span>
                        </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Selected index: <span className="font-medium">{selectedIndex}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
