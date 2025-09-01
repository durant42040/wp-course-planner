import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/shadcn-io/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
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

  useEffect(() => {
    console.log(selectedCells);
  }, [selectedCells]);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setDragStart({ row, col });
    setSelectedCells(new Set([getCellKey(row, col)]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging && dragStart) {
      const newSelection = new Set<string>();
      const startRow = Math.min(dragStart.row, row);
      const endRow = Math.max(dragStart.row, row);
      const startCol = Math.min(dragStart.col, col);
      const endCol = Math.max(dragStart.col, col);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.add(getCellKey(r, c));
        }
      }
      setSelectedCells(newSelection);
    }
  };

  const handleCellMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const filteredCourses = courses.filter(course => {
    // Search filter
    const matchesSearch =
      course.cou_cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tea_cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.ser_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.classroom.toLowerCase().includes(searchTerm.toLowerCase());

    // Time filter - only show courses that have time information

    return matchesSearch;
  });

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

      {/* Search Input and Filter */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Search course name, teacher, serial number, or classroom"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Filter by Time</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-white">
              <DialogHeader>
                <DialogTitle>Filter By Time</DialogTitle>
              </DialogHeader>
              <div className="overflow-auto max-h-[500px] bg-white rounded-lg border border-gray-300">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 bg-gray-50 rounded-tl-lg"></th>
                      <th className="border border-gray-300 p-2 bg-gray-50">
                        一
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-50">
                        二
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-50">
                        三
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-50">
                        四
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-50">
                        五
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-50 rounded-tr-lg">
                        六
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 14 }, (_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border border-gray-300 p-2 bg-gray-50 font-medium">
                          {rowIndex + 1 > 10
                            ? String.fromCharCode(65 + rowIndex - 10)
                            : rowIndex + 1}
                        </td>
                        {Array.from({ length: 6 }, (_, colIndex) => {
                          const cellKey = getCellKey(rowIndex, colIndex);
                          const isSelected = selectedCells.has(cellKey);
                          return (
                            <td
                              key={colIndex}
                              className={`border border-gray-300 p-2 cursor-pointer select-none ${
                                isSelected ? "bg-blue-200" : "hover:bg-gray-100"
                              } ${
                                rowIndex === 13 && colIndex === 5
                                  ? "rounded-br-lg"
                                  : ""
                              } ${rowIndex === 13 && colIndex === 0 ? "rounded-bl-lg" : ""}`}
                              onMouseDown={() =>
                                handleCellMouseDown(rowIndex, colIndex)
                              }
                              onMouseEnter={() =>
                                handleCellMouseEnter(rowIndex, colIndex)
                              }
                              onMouseUp={handleCellMouseUp}
                            >
                              {/* Empty cell content */}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log(
                      "Filtering with selected cells:",
                      selectedCells
                    );
                    setIsDialogOpen(false);
                  }}
                >
                  Filter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
