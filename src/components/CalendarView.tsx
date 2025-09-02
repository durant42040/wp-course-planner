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
  // Simple deterministic color palette
  const palette: Array<{ bg: string; border: string }> = [
    { bg: "#fee2e2", border: "#fecaca" }, // red-100/200
    { bg: "#ffedd5", border: "#fed7aa" }, // orange-100/200
    { bg: "#fef3c7", border: "#fde68a" }, // amber-100/200
    { bg: "#ecfccb", border: "#d9f99d" }, // lime-100/200
    { bg: "#dcfce7", border: "#bbf7d0" }, // green-100/200
    { bg: "#ccfbf1", border: "#99f6e4" }, // teal-100/200
    { bg: "#e0f2fe", border: "#bae6fd" }, // sky-100/200
    { bg: "#dbeafe", border: "#bfdbfe" }, // blue-100/200
    { bg: "#ede9fe", border: "#ddd6fe" }, // violet-100/200
    { bg: "#fae8ff", border: "#f5d0fe" }, // fuchsia-100/200
  ];

  const hashString = (value: string): number => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const getCourseColors = (course: Course) => {
    const key = course.ser_no || `${course.cou_cname}-${course.tea_cname}`;
    const idx = hashString(key) % palette.length;
    return palette[idx];
  };
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
    const periods: number[] = course.time.split("").flatMap(ch => {
      if (ch === "0") return [10]; // map 0 -> 10th period
      const digit = parseInt(ch, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= 9) return [digit];
      const map: Record<string, number> = { A: 11, B: 12, C: 13, D: 14 };
      const upper = ch.toUpperCase();
      if (upper in map) return [map[upper]];
      return [];
    });
    const groups = groupContiguousPeriods(periods);
    for (const g of groups) {
      dayToBlocks[course.day]?.push({ start: g.start, span: g.span, course });
    }
  });

  const dayLabels = ["一", "二", "三", "四", "五", "六"]; // 1..6
  const totalPeriods = 14; // 1..10 then A..D

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
                {period <= 10 ? period : ["A", "B", "C", "D"][period - 11]}
              </td>
              {Array.from({ length: 6 }, (_, dIdx) => dIdx + 1).map(day => {
                const blocks = dayToBlocks[day] ?? [];
                const activeBlocks = blocks.filter(
                  b => b.start <= period && period < b.start + b.span
                );
                return (
                  <td
                    key={day}
                    className="border border-gray-300 p-1 w-40 h-16 align-top"
                  >
                    {activeBlocks.length > 0 ? (
                      <div className="flex flex-col gap-1 h-full w-full">
                        {activeBlocks.map((blk, idx) => {
                          const c = blk.course;
                          const colors = getCourseColors(c);
                          return (
                            <div
                              key={`${c.ser_no}-${idx}`}
                              className="w-full px-2 py-1 h-8 border"
                              style={{
                                backgroundColor: colors.bg,
                                borderColor: colors.border,
                                borderRadius: 0,
                              }}
                            >
                              <div className="flex items-center gap-1 text-xs truncate">
                                <span className="font-semibold truncate">
                                  {c.cou_cname}
                                </span>
                                <span className="text-[10px] text-gray-600 truncate">
                                  {c.tea_cname}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
