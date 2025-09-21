import React from "react";
import Button from "./Button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface BackendPaginationProps {
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
}

export default function BackendPagination({
  paginationData,
  onPageChange,
  loading = false,
  className = "",
}: BackendPaginationProps) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
  } = paginationData;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages <= 1) return [1];

    // Calculate range around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Add middle range
    rangeWithDots.push(...range);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Calculate showing range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Showing {startItem}-{endItem} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1 order-1 sm:order-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage || loading}
          className="flex items-center px-3 py-2 text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <div className="px-3 py-2 text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`min-w-[40px] px-3 py-2 text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {loading && currentPage === page ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    page
                  )}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || loading}
          className="flex items-center px-3 py-2 text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Mobile page info */}
      <div className="text-xs text-gray-500 sm:hidden order-3">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}