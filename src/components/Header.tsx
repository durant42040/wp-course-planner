import { Button } from "./ui/button";

interface HeaderProps {
  showMyCourses: boolean;
  savedCoursesCount: number;
  onToggleMyCourses: () => void;
}

export function Header({
  showMyCourses,
  savedCoursesCount,
  onToggleMyCourses,
}: HeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="relative flex items-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900 flex-1 text-center">
          Course Planner
        </h1>
        <Button
          variant="outline"
          onClick={onToggleMyCourses}
          className="absolute right-0 hidden sm:block"
        >
          {showMyCourses ? "All Courses" : `My Courses (${savedCoursesCount})`}
        </Button>
      </div>
      <p className="text-lg text-gray-600">
        {showMyCourses
          ? "Your saved courses"
          : "Plan your academic journey with our course planner"}
      </p>
      {/* My Courses button for mobile */}
      <div className="flex justify-center mt-4 sm:hidden">
        <Button variant="outline" onClick={onToggleMyCourses}>
          {showMyCourses ? "All Courses" : `My Courses (${savedCoursesCount})`}
        </Button>
      </div>
    </div>
  );
}
