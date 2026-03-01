'use client';

import {
  useState,
  useEffect
} from 'react';
import { toast }
  from 'react-toastify';
import type { Workspace } from '@tiktak/shared/types/domain/Workspace.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { BlockPrimitive } from '@/app/primitives/Block.primitive';
import { apiGet, apiRequest } from '@/lib/utils/ApiRequest.util';
import { PaginationPrimitive } from '@/app/primitives/Pagination.primitive';

type WorkspaceApplication = Workspace.Application;

export function StaffStoresApplicationsListWidget() {
  const [applications, setApplications] = useState<WorkspaceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<WorkspaceApplication | null>(null);

  const pageSize = 10;

  // Fetch workspace applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ applications: WorkspaceApplication[]; total: number }>(
        `/api/staff/stores/applications?page=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`
      );
      setApplications(data.applications || []);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
    } catch (error) {
      ConsoleLogger.error('Error fetching workspace applications:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch applications';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentPage, searchTerm]);

  // Handle approval
  const handleApprove = async (applicationId: string) => {
    setProcessingId(applicationId);
    try {
      await apiRequest(`/api/staff/stores/applications/update/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({ approved: true }),
      });
      toast.success('Application approved successfully');
      fetchApplications();
    } catch (error) {
      ConsoleLogger.error('Error approving application:', error);
      const message = error instanceof Error ? error.message : 'Failed to approve application';
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!selectedApplication || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessingId(selectedApplication.id);
    try {
      await apiRequest(`/api/staff/stores/applications/update/${selectedApplication.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          approved: false,
          reason: rejectReason.trim()
        }),
      });
      toast.success('Application rejected successfully');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      ConsoleLogger.error('Error rejecting application:', error);
      const message = error instanceof Error ? error.message : 'Failed to reject application';
      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (application: WorkspaceApplication) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedApplication(null);
  };

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Workspace Applications</h2>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no workspace applications to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Application Info */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{application.store_name}</h3>
                        <p className="text-sm text-gray-600">Contact: {application.contact_name}</p>
                        <p className="text-sm text-gray-600">Email: {application.email}</p>
                        <p className="text-sm text-gray-600">Phone: {application.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">VOEN: {application.voen}</p>
                        <p className="text-sm text-gray-600">Address: {application.store_address}</p>
                        <p className="text-sm text-gray-500">Applied: {formatDate(application.created_at)}</p>
                        {application.status && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${application.status === 'approved' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <button
                      onClick={() => handleApprove(application.id)}
                      disabled={processingId === application.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {processingId === application.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Approve'
                      )}
                    </button>

                    <button
                      onClick={() => openRejectModal(application)}
                      disabled={processingId === application.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <PaginationPrimitive
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <BlockPrimitive variant="modal">
          <BlockPrimitive variant="default">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Application: {selectedApplication?.store_name}
            </h3>

            <div className="mb-4">
              <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection *
              </label>
              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this application..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejectModal}
                disabled={processingId === selectedApplication?.id}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingId === selectedApplication?.id || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {processingId === selectedApplication?.id ? 'Processing...' : 'Reject Application'}
              </button>
            </div>
          </BlockPrimitive>
        </BlockPrimitive>
      )}
    </div>
  );
}
