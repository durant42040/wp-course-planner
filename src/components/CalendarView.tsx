interface Course {
  ser_no: string;
  cou_cname: string;
  tea_cname: string;
  credit: string;
  day: number; // 1..6 (Mon..Sat)
  time: string; // e.g. "123" means periods 1,2,3
  classroom: string;
}

interface CalendarViewProps {
  courses: Course[];
}

type TimeBlock = {
  start: number; // 1-based period
  span: number; // number of periods
  course: Course;
};

function groupContiguousPeriods(
  periods: number[]
): Array<{ start: number; span: number }> {
  if (periods.length === 0) return [];
  const sorted = [...periods].sort((a, b) => a - b);
  const groups: Array<{ start: number; span: number }> = [];
  let runStart = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    groups.push({ start: runStart, span: prev - runStart + 1 });
    runStart = current;
    prev = current;
  }
  groups.push({ start: runStart, span: prev - runStart + 1 });
  return groups;
}

export function CalendarView({ courses }: CalendarViewProps) {
  // Build blocks per day
  const dayToBlocks: Record<number, TimeBlock[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  courses.forEach(course => {
    if (!course.day || !course.time) return;
    const periods: number[] = course.time
      .split("")
      .map(p => parseInt(p, 10))
      .filter(n => !Number.isNaN(n));
    const groups = groupContiguousPeriods(periods);
    for (const g of groups) {
      dayToBlocks[course.day]?.push({ start: g.start, span: g.span, course });
    }
  });

  const dayLabels = ["一", "二", "三", "四", "五", "六"]; // 1..6
  const totalPeriods = 10; // rows 1..10

  // For rendering rowSpans, track occupied cells per day/row
  const occupied: Record<number, Set<number>> = {
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
    5: new Set(),
    6: new Set(),
  };

  return (
    <div className="overflow-auto rounded-lg border border-gray-300">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-50 w-12"></th>
            {dayLabels.map((label, idx) => (
              <th
                key={idx}
                className="border border-gray-300 p-2 bg-gray-50 w-40"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: totalPeriods }, (_, i) => i + 1).map(period => (
            <tr key={period}>
              <td className="border border-gray-300 p-2 bg-gray-50 font-medium w-12 h-16 text-center align-middle">
                {period}
              </td>
              {Array.from({ length: 6 }, (_, dIdx) => dIdx + 1).map(day => {
                // If this cell is occupied by a previous rowSpan, skip rendering a td
                if (occupied[day].has(period)) {
                  return null;
                }
                // Find a block that starts at this period
                const blocks = dayToBlocks[day];
                const block = blocks?.find(b => b.start === period);
                if (block) {
                  // Mark subsequent periods as occupied
                  for (let p = period + 1; p <= period + block.span - 1; p++) {
                    occupied[day].add(p);
                  }
                  const c = block.course;
                  return (
                    <td
                      key={day}
                      className="border border-gray-300 align-top p-1 w-40"
                      rowSpan={block.span}
                    >
                      <div
                        className="rounded-md bg-blue-50 border border-blue-200 p-2 h-full"
                        style={{ minHeight: `${block.span * 4}rem` }}
                      >
                        <div className="text-sm font-semibold truncate">
                          {c.cou_cname}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">
                          {c.tea_cname}
                        </div>
                        {c.classroom && (
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {c.classroom}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                }
                // Empty cell
                return (
                  <td
                    key={day}
                    className="border border-gray-300 p-1 w-40 h-16"
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
