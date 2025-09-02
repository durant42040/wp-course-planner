import { useState, useEffect } from "react";
import { CourseCard } from "./CourseCard";
import { CoursePagination } from "./Pagination";

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

    const charToRowIndex = (ch: string): number | null => {
      if (ch === "0") return 9; // 10th period -> row index 9
      const digit = parseInt(ch, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= 9) return digit - 1;
      const map: Record<string, number> = { A: 10, B: 11, C: 12, D: 13 };
      const upper = ch.toUpperCase();
      if (upper in map) return map[upper];
      return null;
    };

    for (const ch of course.time.split("")) {
      const rowIndex = charToRowIndex(ch);
      if (rowIndex === null) continue;
      const cellKey = getCellKey(rowIndex, course.day - 1);
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
          <CourseCard
            key={startIndex + index}
            course={course}
            showMyCourses={false}
            onAddCourse={onAddCourse}
          />
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
        <CoursePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
