import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";

interface Course {
  ser_no: string;
  cou_cname: string;
  tea_cname: string;
  credit: string;
  day: number;
  time: string;
  classroom: string;
}

interface AllCoursesProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  searchTerm: string;
  selectedCells: Set<string>;
}

export function AllCourses({
  courses,
  onAddCourse,
  searchTerm,
  selectedCells,
}: AllCoursesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const timeFilter = (course: Course, selectedCells: Set<string>) => {
    if (selectedCells.size === 0) {
      return true;
    }

    for (const time of course.time.split("")) {
      const cellKey = getCellKey(parseInt(time) - 1, course.day - 1);
      if (selectedCells.has(cellKey)) {
        return true;
      }
    }
    return false;
  };

  const filteredCourses = courses.filter(course => {
    // Search filter
    const matchesSearch =
      course.cou_cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tea_cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.ser_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.classroom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTime = timeFilter(course, selectedCells);

    return matchesSearch && matchesTime;
  });

  const coursesPerPage = 10;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <div className="space-y-2">
        {currentCourses.map((course, index) => (
          <Card
            key={startIndex + index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-3">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-6">
                  <h3 className="font-semibold text-lg">{course.cou_cname}</h3>
                  <div className="flex flex-col gap-1 mt-1">
                    {course.day !== 0 && course.time && (
                      <Badge
                        variant="outline"
                        className="text-sm text-gray-600 w-fit"
                      >
                        {["一", "二", "三", "四", "五", "六"][course.day - 1]}{" "}
                        {course.time}
                      </Badge>
                    )}
                    {course.classroom && (
                      <Badge
                        variant="outline"
                        className="text-sm text-gray-500 w-fit"
                      >
                        {course.classroom}
                      </Badge>
                    )}
                    <div className="flex gap-2 sm:hidden mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddCourse(course)}
                        className="hover:bg-gray-200 hover:border-gray-300"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <Badge variant="secondary" className="text-sm w-fit">
                    流水號：{course.ser_no}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    授課教師：{course.tea_cname}
                  </Badge>
                  <Badge variant="outline" className="text-sm w-fit">
                    學分：{course.credit}
                  </Badge>
                </div>
                <div className="col-span-3 hidden sm:flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddCourse(course)}
                    className="hover:bg-gray-200 hover:border-gray-300"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? `No courses found matching "${searchTerm}"`
              : "No courses found"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setCurrentPage(Math.max(currentPage - 1, 1));
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
              const endPage = Math.min(
                totalPages,
                startPage + maxVisiblePages - 1
              );

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
                        setCurrentPage(1);
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
                        setCurrentPage(i);
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
                        setCurrentPage(totalPages);
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
                  setCurrentPage(Math.min(currentPage + 1, totalPages));
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
