import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CommentsSheet } from "./CommentsSheet";

interface Course {
  ser_no: string;
  cou_cname: string;
  tea_cname: string;
  credit: string;
  day: number;
  time: string;
  classroom: string;
}

interface CourseCardProps {
  course: Course;
  showMyCourses: boolean;
  onAddCourse?: (course: Course) => void;
  onRemoveCourse?: (course: Course) => void;
}

export function CourseCard({
  course,
  showMyCourses,
  onAddCourse,
  onRemoveCourse,
}: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
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
                  {`${["一", "二", "三", "四", "五", "六"][course.day - 1]} ${course.time}`}
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
              <div className="flex gap-2 sm:hidden mt-2 items-center">
                {showMyCourses ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveCourse?.(course)}
                    className="hover:bg-gray-200 hover:border-gray-300"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddCourse?.(course)}
                    className="hover:bg-gray-200 hover:border-gray-300"
                  >
                    Add
                  </Button>
                )}
                {!showMyCourses && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const searchQuery = `${course.cou_cname} ${course.tea_cname}`;
                      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                      window.open(googleUrl, "_blank");
                    }}
                    className="hover:bg-gray-200 hover:border-gray-300"
                  >
                    Google
                  </Button>
                )}
                <CommentsSheet
                  courseId={course.ser_no}
                  courseName={course.cou_cname}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-1 ml-4">
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
          <div className="col-span-3 hidden sm:flex gap-2 items-center">
            {showMyCourses ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveCourse?.(course)}
                className="hover:bg-gray-200 hover:border-gray-300"
              >
                Remove
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddCourse?.(course)}
                className="hover:bg-gray-200 hover:border-gray-300"
              >
                Add
              </Button>
            )}
            {!showMyCourses && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const searchQuery = `${course.cou_cname} ${course.tea_cname}`;
                  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                  window.open(googleUrl, "_blank");
                }}
                className="hover:bg-gray-200 hover:border-gray-300"
              >
                Google
              </Button>
            )}
            <CommentsSheet
              courseId={course.ser_no}
              courseName={course.cou_cname}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
