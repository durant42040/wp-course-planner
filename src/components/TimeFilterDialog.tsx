import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface TimeFilterDialogProps {
  selectedCells: Set<string>;
  onSelectedCellsChange: (cells: Set<string>) => void;
}

export function TimeFilterDialog({
  selectedCells,
  onSelectedCellsChange,
}: TimeFilterDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setDragStart({ row, col });
    onSelectedCellsChange(new Set([getCellKey(row, col)]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging && dragStart) {
      const newSelection = new Set<string>();
      const startRow = Math.min(dragStart.row, row);
      const endRow = Math.max(dragStart.row, row);
      const startCol = Math.min(dragStart.col, col);
      const endCol = Math.max(dragStart.col, col);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          newSelection.add(getCellKey(r, c));
        }
      }
      onSelectedCellsChange(newSelection);
    }
  };

  const handleCellMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Filter by Time</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>Filter By Time</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[500px] bg-white rounded-lg border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 rounded-tl-lg"></th>
                <th className="border border-gray-300 p-2 bg-gray-50">一</th>
                <th className="border border-gray-300 p-2 bg-gray-50">二</th>
                <th className="border border-gray-300 p-2 bg-gray-50">三</th>
                <th className="border border-gray-300 p-2 bg-gray-50">四</th>
                <th className="border border-gray-300 p-2 bg-gray-50">五</th>
                <th className="border border-gray-300 p-2 bg-gray-50 rounded-tr-lg">
                  六
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-gray-300 p-2 bg-gray-50 font-medium">
                    {rowIndex + 1}
                  </td>
                  {Array.from({ length: 6 }, (_, colIndex) => {
                    const cellKey = getCellKey(rowIndex, colIndex);
                    const isSelected = selectedCells.has(cellKey);
                    return (
                      <td
                        key={colIndex}
                        className={`border border-gray-300 p-2 cursor-pointer select-none ${
                          isSelected ? "bg-blue-200" : "hover:bg-gray-100"
                        } ${
                          rowIndex === 13 && colIndex === 5
                            ? "rounded-br-lg"
                            : ""
                        } ${rowIndex === 13 && colIndex === 0 ? "rounded-bl-lg" : ""}`}
                        onMouseDown={() =>
                          handleCellMouseDown(rowIndex, colIndex)
                        }
                        onMouseEnter={() =>
                          handleCellMouseEnter(rowIndex, colIndex)
                        }
                        onMouseUp={handleCellMouseUp}
                      >
                        {/* Empty cell content */}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onSelectedCellsChange(new Set());
            }}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false);
            }}
          >
            Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
