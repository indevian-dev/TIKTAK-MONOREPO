'use client'

interface StaffSectionTitleTileProps {
  sectionTitle: string;
}

export function StaffSectionTitleTile({ sectionTitle }: StaffSectionTitleTileProps) {
  return (
    <div className="mb-2">
      <h2 className="text-md font-semibold text-semidark">
        {sectionTitle}
      </h2>
    </div>
  );
}

