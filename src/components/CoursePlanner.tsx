import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/shadcn-io/spinner";
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

export function CoursePlanner() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const coursesPerPage = 10;

  const loadCourses = async () => {
    try {
      const response = await fetch("/cou1002.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const courseData = XLSX.utils.sheet_to_json(worksheet);

      setCourses(courseData as Course[]);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = courses.filter(
    course =>
      course.cou_cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tea_cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.ser_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
          <p className="mt-4 text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Course Planner
        </h1>
        <p className="text-lg text-gray-600">
          Plan your academic journey with our comprehensive course catalog
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search course name, teacher, or serial number"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

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
                <div className="col-span-3 flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button size="sm">Add</Button>
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
              : "No courses found. Please check the Excel file."}
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
                  setCurrentPage(prev => Math.max(prev - 1, 1));
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
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
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
    </div>
  );
}
