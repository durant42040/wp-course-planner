import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
import { filterChinese, filterChineseAndNumbers } from "@/lib/utils";

interface ExcelRow {
  [key: string]: string | number | undefined;
}

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
  const coursesPerPage = 15;

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("/cou1002.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const filteredCourses: Course[] = (jsonData as ExcelRow[])
          .map((row: ExcelRow) => {
            const cleanCourseName = filterChinese(
              row.cou_cname?.toString() || ""
            );

            const cleanTeacherName = filterChinese(
              row.tea_cname?.toString() || ""
            );

            const classroom =
              row.clsrom_1 ||
              row.clsrom_2 ||
              row.clsrom_3 ||
              row.clsrom_4 ||
              row.clsrom_5 ||
              row.clsrom_6 ||
              "";
            const cleanClassroom = filterChineseAndNumbers(
              classroom.toString()
            );

            let day = 0;
            let time = "";

            for (let i = 1; i <= 5; i++) {
              const dayKey = `day${i}` as keyof ExcelRow;
              const dayValue = row[dayKey]?.toString();
              if (dayValue && dayValue.trim() !== "") {
                day = i;
                time = dayValue;
                break;
              }
            }

            return {
              ser_no: row.ser_no?.toString() || "",
              cou_cname: cleanCourseName,
              tea_cname: cleanTeacherName,
              credit: row.credit?.toString() || "",
              day,
              time,
              classroom: cleanClassroom,
            };
          })
          .filter(course => course.cou_cname && course.tea_cname);

        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
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
                        {["一", "二", "三", "四", "五"][course.day - 1]}{" "}
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

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No courses found. Please check the Excel file.
          </p>
        </div>
      )}

      {/* Pagination */}
      {courses.length > 0 && (
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
