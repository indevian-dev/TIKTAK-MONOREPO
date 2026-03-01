"use client";

import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

interface PaginationPrimitiveProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * Reusable pagination component with page numbers, prev/next, and smart ellipsis.
 * Follows app design: rounded-app, brand colors, dark mode support.
 */
export function PaginationPrimitive({ currentPage, totalPages, onPageChange }: PaginationPrimitiveProps) {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    // Build page numbers with ellipsis
    const getPageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];
        const range = 2; // pages around current

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - range && i <= currentPage + range)
            ) {
                pages.push(i);
            } else if (
                pages[pages.length - 1] !== "ellipsis"
            ) {
                pages.push("ellipsis");
            }
        }
        return pages;
    };

    const baseBtn = "flex items-center justify-center min-w-[40px] h-10 rounded-app text-sm font-bold transition-all duration-200";
    const activeBtn = `${baseBtn} bg-app-bright-purple text-white`;
    const inactiveBtn = `${baseBtn} bg-black/5 dark:bg-white/5 text-app-dark-purple dark:text-white hover:bg-app-bright-purple/10 dark:hover:bg-app-bright-purple/20 border border-black/8 dark:border-white/10`;
    const disabledBtn = `${baseBtn} bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 cursor-not-allowed border border-black/5 dark:border-white/5`;

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {/* Previous */}
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={currentPage === 1 ? disabledBtn : inactiveBtn}
                aria-label="Previous page"
            >
                <PiCaretLeftBold size={16} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((item, index) =>
                item === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className="px-1 text-black/30 dark:text-white/30 font-bold select-none">
                        ···
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => onPageChange(item)}
                        className={item === currentPage ? activeBtn : inactiveBtn}
                        aria-label={`Page ${item}`}
                        aria-current={item === currentPage ? "page" : undefined}
                    >
                        {item}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={handleNext}
                disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? disabledBtn : inactiveBtn}
                aria-label="Next page"
            >
                <PiCaretRightBold size={16} />
            </button>
        </div>
    );
}
