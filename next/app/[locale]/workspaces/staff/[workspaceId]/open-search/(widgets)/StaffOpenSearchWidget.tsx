'use client'

import {
  useState
} from "react";
import { StaffSearchMappingsWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/open-search/(widgets)/StaffSearchMappingsWidget';
import { StaffSearchStatsWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/open-search/(widgets)/StaffSearchStatsWidget';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { StaffSearchSyncWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/open-search/(widgets)/StaffSearchSyncWidget';

export function StaffOpenSearchWidget() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'success' | 'error' | null>(null);

  async function handleSync() {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      // Call the sync endpoint (adjust locale if needed)
      const response = await apiCallForSpaHelper({
        method: 'GET',
        url: '/api/staff/open-search/sync',
        params: { secret: '123123' }
      });
      if (response.status === 200) {
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (e) {
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1>OpenSearch Administration</h1>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-bd hover:bg-bl text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50"
        >
          {isSyncing ? 'Syncing...' : 'Sync Cards'}
        </button>
      </div>
      {syncStatus === 'success' && (
        <div className="text-emerald-500">Sync completed successfully.</div>
      )}
      {syncStatus === 'error' && (
        <div className="text-rose-500">Sync failed. Please try again.</div>
      )}
      <StaffSearchStatsWidget />
      <StaffSearchMappingsWidget />
      <StaffSearchSyncWidget />
    </div>
  );
}