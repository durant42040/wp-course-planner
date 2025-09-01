import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";

interface CoursePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CoursePagination({
  currentPage,
  totalPages,
  onPageChange,
}: CoursePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault();
              onPageChange(Math.max(currentPage - 1, 1));
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {(() => {
          const pages = [];
          const maxVisiblePages = 3;
          let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
          );
          const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

          // Adjust start page if we're near the end
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }

          // Add first page and ellipsis if needed
          if (startPage > 1) {
            pages.push(
              <PaginationItem key={1}>
                <PaginationLink
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            );

            if (startPage > 2) {
              pages.push(
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
          }

          // Add visible page numbers
          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i}
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(i);
                  }}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }

          // Add last page and ellipsis if needed
          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push(
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            pages.push(
              <PaginationItem key={totalPages}>
                <PaginationLink
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            );
          }

          return pages;
        })()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault();
              onPageChange(Math.min(currentPage + 1, totalPages));
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
