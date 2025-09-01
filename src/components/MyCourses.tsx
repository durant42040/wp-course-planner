import { CourseCard } from "./CourseCard";

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
  return (
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
  );
}
