'use client'

import {
  useState,
  useEffect
} from "react";
import {
  PiDatabaseFill,
  PiMagnifyingGlassBold,
  PiStackFill,
  PiTrashFill,
  PiHardDrivesFill,
  PiCpuFill,
  PiMemoryFill,
  PiCheckCircleFill,
  PiWarningCircleFill,
} from "react-icons/pi";

interface SearchStats {
  totalIndices?: number;
  totalDocs?: number;
  deletedDocs?: number;
  totalShards?: number;
  storeSize?: number;
  clusterStatus?: string;
  clusterName?: string;
  nodeCount?: number;
  cpuPercent?: number;
  heapUsed?: number;
  heapMax?: number;
  memTotal?: number;
  memUsed?: number;
  memUsedPercent?: number;
  version?: string;
}

export function StaffSearchStatsWidget() {
  const [stats, setStats] = useState<SearchStats | null>(null);

  useEffect(() => {
    fetch('/api/staff/open-search/stats')
      .then(res => res.json())
      .then(data => {
        if (data?.success && data.stats) {
          const indices = data.stats.indices || {};
          const nodes = data.stats.nodes || {};
          setStats({
            totalIndices: indices.count,
            totalDocs: indices.docs?.count,
            deletedDocs: indices.docs?.deleted,
            totalShards: indices.shards?.total,
            storeSize: indices.store?.size_in_bytes,
            clusterStatus: data.stats.status,
            clusterName: data.stats.cluster_name,
            nodeCount: nodes.count?.total,
            cpuPercent: nodes.process?.cpu?.percent,
            heapUsed: nodes.jvm?.mem?.heap_used_in_bytes,
            heapMax: nodes.jvm?.mem?.heap_max_in_bytes,
            memTotal: nodes.os?.mem?.total_in_bytes,
            memUsed: nodes.os?.mem?.used_in_bytes,
            memUsedPercent: nodes.os?.mem?.used_percent,
            version: nodes.versions?.[0],
          });
        } else {
          setStats(null);
        }
      })
      .catch(() => setStats(null));
  }, []);

  function formatBytes(bytes: number | undefined): string {
    if (!bytes && bytes !== 0) return "--";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="text-2xl font-bold text-bd col-span-1  sm:col-span-2 lg:col-span-4 mb-4">
        {stats?.clusterName ?? "--"}
      </div>
      <StatCard
        icon={<PiDatabaseFill size={32} className="text-bd" />}
        label="Total Indices"
        value={stats?.totalIndices ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiMagnifyingGlassBold size={32} className="text-bl" />}
        label="Total Documents"
        value={stats?.totalDocs ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiTrashFill size={32} className="text-rose-500" />}
        label="Deleted Documents"
        value={stats?.deletedDocs ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiStackFill size={32} className="text-bd" />}
        label="Total Shards"
        value={stats?.totalShards ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiHardDrivesFill size={32} className="text-bl" />}
        label="Store Size"
        value={formatBytes(stats?.storeSize)}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={
          stats?.clusterStatus === "green"
            ? <PiCheckCircleFill size={32} className="text-emerald-500" />
            : <PiWarningCircleFill size={32} className="text-rose-500" />
        }
        label="Cluster Status"
        value={stats?.clusterStatus ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiCpuFill size={32} className="text-bd" />}
        label="CPU Usage"
        value={stats?.cpuPercent !== undefined ? `${stats.cpuPercent}%` : "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiMemoryFill size={32} className="text-bl" />}
        label="Heap Used"
        value={formatBytes(stats?.heapUsed)}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiMemoryFill size={32} className="text-bd" />}
        label="Heap Max"
        value={formatBytes(stats?.heapMax)}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiMemoryFill size={32} className="text-bl" />}
        label="RAM Used"
        value={formatBytes(stats?.memUsed)}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiMemoryFill size={32} className="text-bd" />}
        label="RAM Used %"
        value={stats?.memUsedPercent !== undefined ? `${stats.memUsedPercent}%` : "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiDatabaseFill size={32} className="text-bl" />}
        label="Node Count"
        value={stats?.nodeCount ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
      <StatCard
        icon={<PiDatabaseFill size={32} className="text-bl" />}
        label="OpenSearch Version"
        value={stats?.version ?? "--"}
        bg="bg-brandPrimaryLightBg"
      />
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
}

function StatCard({ icon, label, value, bg }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-4 ${bg} rounded-xl p-6 transition hover:shadow-lg hover:bg-bl/20`}
    >
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate overflow-hidden whitespace-nowrap word-break-none">{label}</div>
        <div className="text-2xl font-bold text-bd">{value}</div>
      </div>
    </div>
  );
}
