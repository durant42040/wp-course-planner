import { useState } from "react";
import { CourseCard } from "./CourseCard";
import { Button } from "./ui/button";
import { CalendarView } from "./CalendarView";

interface Course {
  ser_no: string;
  cou_cname: string;
  tea_cname: string;
  credit: string;
  day: number;
  time: string;
  classroom: string;
}

interface MyCoursesProps {
  savedCourses: Course[];
  onRemoveCourse: (course: Course) => void;
}

export function MyCourses({ savedCourses, onRemoveCourse }: MyCoursesProps) {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{savedCourses.length} saved</div>
        <div>
          <Button
            variant="outline"
            onClick={() => setView(view === "list" ? "calendar" : "list")}
          >
            {view === "list" ? "Calendar" : "List"}
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <div className="space-y-2">
          {savedCourses.map(course => (
            <CourseCard
              key={course.ser_no}
              course={course}
              showMyCourses={true}
              onRemoveCourse={onRemoveCourse}
            />
          ))}

          {savedCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No saved courses yet. Add some courses to see them here!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {savedCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No saved courses yet. Add some courses to see them here!
              </p>
            </div>
          ) : (
            <CalendarView courses={savedCourses} />
          )}
        </div>
      )}
    </div>
  );
}
