import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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
        <Card
          key={course.ser_no}
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
                      onClick={() => onRemoveCourse(course)}
                      className="hover:bg-gray-200 hover:border-gray-300"
                    >
                      Remove
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
                  onClick={() => onRemoveCourse(course)}
                  className="hover:bg-gray-200 hover:border-gray-300"
                >
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
