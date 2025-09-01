import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Header } from "./Header";
import { Search } from "./Search";
import { AllCourses } from "./AllCourses";
import { MyCourses } from "./MyCourses";
import { Loading } from "./Loading";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [showMyCourses, setShowMyCourses] = useState(false);

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
    // Load saved courses from localStorage
    const saved = localStorage.getItem("savedCourses");
    if (saved) {
      setSavedCourses(JSON.parse(saved));
    }
  }, []);

  const handleAddCourse = (course: Course) => {
    // Check if course is already saved
    const isAlreadySaved = savedCourses.some(
      saved => saved.ser_no === course.ser_no
    );

    if (!isAlreadySaved) {
      const newSavedCourses = [...savedCourses, course];
      setSavedCourses(newSavedCourses);
      localStorage.setItem("savedCourses", JSON.stringify(newSavedCourses));
    }
  };

  const handleRemoveCourse = (courseToRemove: Course) => {
    const newSavedCourses = savedCourses.filter(
      course => course.ser_no !== courseToRemove.ser_no
    );
    setSavedCourses(newSavedCourses);
    localStorage.setItem("savedCourses", JSON.stringify(newSavedCourses));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6">
      <Header
        showMyCourses={showMyCourses}
        savedCoursesCount={savedCourses.length}
        onToggleMyCourses={() => setShowMyCourses(!showMyCourses)}
      />

      {!showMyCourses && (
        <Search
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCells={selectedCells}
          onSelectedCellsChange={setSelectedCells}
        />
      )}

      {showMyCourses ? (
        <MyCourses
          savedCourses={savedCourses}
          onRemoveCourse={handleRemoveCourse}
        />
      ) : (
        <AllCourses
          courses={courses}
          onAddCourse={handleAddCourse}
          searchTerm={searchTerm}
          selectedCells={selectedCells}
        />
      )}
    </div>
  );
}
