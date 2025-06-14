"use client";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationNext,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState } from "nuqs"; // what is nuqs?  A hook to manage query parameters in the URL (?page=2).
import { useEffect, useState } from "react";
import { env } from "@/env";
import { cn } from "@/lib/utils";

interface PaginationProps {
  baseUrl: string; // base url for pagination links.
  totalPages: number;
  maxVisiblePages?: number;
  styles: {
    // styles for pagination elements.
    paginationRoot: string;
    paginationLink: string;
    paginationPrevious: string;
    paginationNext: string;
    paginationLinkActive: string;
  };
}

export const CustomPagination = (props: PaginationProps) => {
  // destructure props.
  const { baseUrl, totalPages, maxVisiblePages = 5, styles } = props;
  // use useQueryState when you want to sync local ui state with the url.
  const [currentPage, setCurrentPage] = useQueryState("page", {
    // "page" is the query parameter name.
    defaultValue: 1, // default value if the query parameter is not present.
    parse: (value) => {
      // parse the query parameter value to a number.
      const parsed = Number.parseInt(value, 10); // base 10
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed; // if the value is not a number or is less than 1, return 1.
    },
    serialize: (value) => value.toString(), // serialize the value to a string since the query parameter is always a string.
    shallow: false, // would update the url but without triggering a re-render
  });

  // state to store the visible range of pages.
  const [visibleRange, setVisibleRange] = useState({
    start: 1,
    end: Math.min(maxVisiblePages, totalPages),
  });

  // calculate the range of visible page numbers for pagination. Ensures that the current page is in the center of the visible range. The pagination component does not show all pages at once. The start and end are adjusted dynamically.
  useEffect(() => {
    const halfVisible = Math.floor(maxVisiblePages / 2); // calculate how many pages to show on each side of the current page.
    const newStart = Math.max(
      1,
      Math.min(currentPage - halfVisible, totalPages - maxVisiblePages + 1)
    ); // current page-halfVisible centers the current page as much as possible. totalPages - maxVisiblePages ensures we don't overshoot the total number of pages.
    const newEnd = Math.min(totalPages, newStart + maxVisiblePages - 1); // ensures the pagination range doesnt exceed totalPages.
    setVisibleRange({ start: newStart, end: newEnd });
  }, [currentPage, totalPages, maxVisiblePages]);

  const createPageUrl = (pageNumber: number) => {
    const url = new URL(baseUrl, env.NEXT_PUBLIC_APP_URL); // if baseUrl is relative, it will be converted to an absolute URL.
    url.searchParams.set("page", pageNumber.toString());
    return url.toString();
  };

  //  handles clicks on the ... (ellipsis) buttons that appear when the pagination has too many pages to display at once.
  /*
  When a user clicks ...:

If they click the left ellipsis ("left"), it moves them backward to an earlier page range.
If they click the right ellipsis ("right"), it moves them forward to a later page range.
*/
  const handleEllipsisClick = (direction: "left" | "right") => {
    const newPage =
      direction === "left"
        ? Math.max(1, visibleRange.start - maxVisiblePages) // moves back by maxVisiblePages. 1 to ensure we don't go below page 1.
        : Math.min(totalPages, visibleRange.end + maxVisiblePages); // moves forward by maxVisiblePages. totalPages to ensure we don't go beyond the total number of pages.
    setCurrentPage(newPage);
  };

  return (
    <PaginationRoot className={styles.paginationRoot}>
      <PaginationContent className="justify-end lg:gap-4">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage <= 1 && "hidden",
              styles.paginationPrevious
            )}
            href={createPageUrl(currentPage - 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1); // if the current page is greater than 1, move to the previous page.
            }}
          />
        </PaginationItem>
        {/* show only when we're past the visible range */}
        {visibleRange.start > 1 && (
          <PaginationItem className="hidden lg:block">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEllipsisClick("left");
              }}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}
        {Array.from(
          { length: visibleRange.end - visibleRange.start + 1 }, // from creates n elements(from visible start to end) + 1 so both start and end are included that is populated by the second argument. which we have the actual variable which we don't need in this case.
          (_, index) => visibleRange.start + index
        ).map((pageNumber) => {
          const isActive = currentPage === pageNumber;
          let rel = ""; // good for SEO since it allow search engines to crawl each page in your paginated stack,

          if (pageNumber === currentPage - 1) rel = "prev"; // indicates the current page has a previous page.
          if (pageNumber === currentPage + 1) rel = "next"; // indicates the current page has a next page.

          return (
            <PaginationItem key={pageNumber}>
              {/* important for seo because if you dynamically show pages that are generated by javascript buttons for example, the search engine will not be able to crawl them */}
              <PaginationLink
                isActive={isActive}
                href={createPageUrl(pageNumber)}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(pageNumber);
                }}
                className={cn(
                  styles.paginationLink,
                  isActive && styles.paginationLinkActive
                )}
                {...(rel ? { rel } : {})} // if rel is present, add it to the element.
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {/* show when there are more pages to the right */}
        {visibleRange.end < totalPages && (
          <PaginationItem className="hidden lg:block">
            <PaginationLink
              className={styles.paginationLink}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEllipsisClick("right");
              }}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}
        {/* next button */}
        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages && "hidden",
              styles.paginationNext
            )}
            href={createPageUrl(currentPage + 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};
