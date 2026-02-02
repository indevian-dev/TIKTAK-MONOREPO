
'use client';

import {
  useEffect,
  useState
} from 'react';
import { GlobalLoaderTile }
  from '@/app/[locale]/(global)/(tiles)/GlobalLoaderTile';
import { GlobalErrorMessageTile }
  from '@/app/[locale]/(global)/(tiles)/GlobalErrorMessageTile';

interface IndexMapping {
  mappings?: Record<string, unknown>;
  [key: string]: unknown;
}

type MappingsData = Record<string, IndexMapping> | null;

export function StaffSearchMappingsWidget() {
  const [mappings, setMappings] = useState<MappingsData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [editJson, setEditJson] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch mappings
  function fetchMappings() {
    setIsLoading(true);
    setError('');
    fetch('/api/staff/open-search/mappings')
      .then(res => res.json())
      .then(setMappings)
      .catch(() => setError('Failed to load mappings'))
      .finally(() => setIsLoading(false));
  }

  useEffect(fetchMappings, []);

  // Handle edit
  function handleEdit(index: string) {
    setSelectedIndex(index);
    const mappingData = mappings?.[index]?.mappings || {};
    setEditJson(JSON.stringify(mappingData, null, 2));
    setIsEditing(true);
    setError('');
  }

  // Handle update
  async function handleUpdateMapping(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`/api/staff/open-search/mappings/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings: JSON.parse(editJson) }),
      });
      if (!res.ok) throw new Error('Update failed');
      setIsEditing(false);
      fetchMappings();
    } catch {
      setError('Failed to update mapping');
    }
  }

  return (
    <div className="w-full my-4">
      <div className="bg-white rounded p-4 mb-6">
        <h2 className="font-bold text-lg mb-2">Index Mappings</h2>
        {isLoading ? <GlobalLoaderTile /> : null}
        {error ? <GlobalErrorMessageTile message={error} /> : null}
        {mappings && (
          <div className="space-y-2">
            {Object.entries(mappings).map(([index, data]) => (
              <div key={index} className="border rounded p-2 bg-gray-50 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-bd">{index}</span>
                  <button
                    className="text-xs text-bl hover:underline"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                </div>
                <pre className="overflow-x-auto text-xs bg-gray-100 p-2 rounded mt-2">{JSON.stringify(data.mappings, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Mapping */}
      {isEditing && (
        <form
          className="bg-white rounded p-4 mb-6"
          onSubmit={handleUpdateMapping}
        >
          <h3 className="font-semibold mb-2">Edit Mapping: <span className="font-mono">{selectedIndex}</span></h3>
          <textarea
            className="w-full font-mono text-xs p-2 border rounded mb-2"
            rows={8}
            value={editJson}
            onChange={e => setEditJson(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-bl text-white px-4 py-1 rounded hover:bg-bd transition"
            >
              Update
            </button>
            <button
              type="button"
              className="text-gray-500 hover:underline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}