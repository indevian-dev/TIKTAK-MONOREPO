export function GlobalLoaderTile() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}