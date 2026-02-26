interface PublicSectionTitleTileProps {
  sectionTitle: string;
}

export function PublicSectionTitleTile({ sectionTitle }: PublicSectionTitleTileProps) {
  return (
    <h2 className="py-2 text-left w-full flex flex-wrap justify-start relative text-xl md:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
      {sectionTitle}
    </h2>
  );
}