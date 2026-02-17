"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { PublicStoresListItemWidget } from "@/app/[locale]/(public)/stores/(widgets)/PublicStoresListItemWidget";
import { PublicSectionTitleTile } from "@/app/[locale]/(public)/(tiles)/PublicSectionTitleTile";
import { GlobalSelectWidget } from "@/app/[locale]/(global)/(widgets)/GlobalSelectWidget";

interface Tag {
  id: number;
  tag_name: string;
}

import type { Store } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface PublicStoreListApiResponse extends Pick<Store.PublicAccess, 'id'> {
  [key: string]: unknown; // Allow additional store fields
}

function mapTagsToOptions(tags: Tag[]) {
  return (tags || []).map((t) => ({ value: String(t.id), label: t.tag_name }));
}

export function PublicStoresListWidget() {
  const [stores, setStores] = useState<PublicStoreListApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const tagOptions = useMemo(() => mapTagsToOptions(tags), [tags]);

  useEffect(() => {
    // initial load (backward compatible response shape when no params)
    loadStores({});
    loadTags();
  }, []);

  useEffect(() => {
    // reload stores when tag filter changes
    loadStores({ tagIds: selectedTagIds });
  }, [selectedTagIds]);

  async function loadTags() {
    try {
      const res = await apiCallForSpaHelper({ method: "GET", url: "/api/stores/tags" });
      if (res.status === 200) setTags(res.data.tags || []);
    } catch (e) {
      ConsoleLogger.error("Failed to load store tags", e);
    }
  }

  async function loadStores({ tagIds = [] }: { tagIds?: string[] }) {
    try {
      setIsLoading(true);
      const params: { tagIds?: string } = {};
      if (Array.isArray(tagIds) && tagIds.length > 0) params.tagIds = tagIds.join(",");

      const res = await apiCallForSpaHelper({ method: "GET", url: "/api/stores", params });

      if (res.status === 200) {
        // API returns array when no params; object with pagination when params exist
        const payload = res.data;
        const items = Array.isArray(payload) ? payload : payload.stores || [];
        setStores(items);
      }
    } catch (e) {
      ConsoleLogger.error("Failed to load stores", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative w-full my-4 md:my-6 lg:my-8">
      <div className="container m-auto max-w-7xl px-4 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <PublicSectionTitleTile sectionTitle="Stores" />

          <div className="w-full md:w-1/2">
            <GlobalSelectWidget
              options={tagOptions}
              placeholder="Filter by tags"
              isMulti
              value={selectedTagIds}
              onChange={setSelectedTagIds}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-dark/70">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {stores.map((store) => (
              <PublicStoresListItemWidget key={store.id} store={store} />
            ))}
            {stores.length === 0 && (
              <div className="col-span-full py-12 text-center text-dark/60">No stores found</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PublicStoresListWidget;


