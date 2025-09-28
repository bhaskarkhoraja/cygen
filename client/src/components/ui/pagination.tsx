"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  limit: number;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  limit,
  maxVisiblePages = 3,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Calculate start and end pages
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous Chevron
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>,
    );

    // Show first page and ellipsis if startPage > 2
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          1
        </button>,
      );
    }
    if (startPage > 2) {
      pageNumbers.push(
        <span
          key="start-ellipsis"
          className="w-8 h-8 flex items-center justify-center"
        >
          ...
        </span>,
      );
    }

    // Render main page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            currentPage === i
              ? "bg-foreground text-background"
              : "text-foreground hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Show ellipsis and last page if endPage < totalPages
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <span
          key="end-ellipsis"
          className="w-8 h-8 flex items-center justify-center text-sm"
        >
          ...
        </span>,
      );
    }
    if (endPage < totalPages) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-8 h-8 flex items-center justify-center text-sm rounded-full hover:bg-gray-100"
        >
          {totalPages}
        </button>,
      );
    }

    // Next Chevron
    pageNumbers.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:bg-gray-100"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>,
    );

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;
