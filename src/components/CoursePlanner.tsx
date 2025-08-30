import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ExcelRow {
  [key: string]: string | number | undefined;
}

interface Course {
  ser_no: string;
  cou_cname: string;
  tea_cname: string;
  credit: string;
}

export function CoursePlanner() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

        // Filter and map the data to only include the required fields
        const filteredCourses = (jsonData as ExcelRow[])
          .map((row: ExcelRow) => {
            // Remove English characters from course name, keep only Chinese/Mandarin text
            let cleanCourseName = row.cou_cname?.toString() || "";

            // Remove English text (including hyphens, spaces, and other punctuation that might follow English text)
            // This will keep only Chinese characters and remove everything after English text
            const chineseOnly = cleanCourseName.match(/[\u4e00-\u9fff]+/);
            if (chineseOnly) {
              cleanCourseName = chineseOnly.join("");
            }

            // Remove English characters and numbers from teacher name, keep only Chinese/Mandarin text
            let cleanTeacherName = row.tea_cname?.toString() || "";

            // Remove English text, numbers, and punctuation, keep only Chinese characters
            const teacherChineseOnly =
              cleanTeacherName.match(/[\u4e00-\u9fff]+/);
            if (teacherChineseOnly) {
              cleanTeacherName = teacherChineseOnly.join("");
            }

            return {
              ser_no: row.ser_no?.toString() || "",
              cou_cname: cleanCourseName,
              tea_cname: cleanTeacherName,
              credit: row.credit?.toString() || "",
            };
          })
          .filter(course => course.cou_cname && course.tea_cname); // Filter out empty courses

        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

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

      <div className="space-y-4">
        {courses.map((course, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <Badge variant="secondary" className="text-sm">
                    {course.ser_no}
                  </Badge>
                </div>
                <div className="col-span-5">
                  <h3 className="font-semibold text-lg">{course.cou_cname}</h3>
                </div>
                <div className="col-span-3">
                  <span className="text-gray-600">{course.tea_cname}</span>
                </div>
                <div className="col-span-1">
                  <Badge variant="outline" className="text-sm">
                    {course.credit}
                  </Badge>
                </div>
                <div className="col-span-1 flex gap-2">
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
    </div>
  );
}
