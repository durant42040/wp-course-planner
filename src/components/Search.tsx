import { Input } from "./ui/input";
import { TimeFilterDialog } from "./TimeFilterDialog";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCells: Set<string>;
  onSelectedCellsChange: (cells: Set<string>) => void;
}

export function Search({
  searchTerm,
  onSearchChange,
  selectedCells,
  onSelectedCellsChange,
}: SearchProps) {
  return (
    <div className="mb-6 max-w-2xl mx-auto">
      <div className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Search course name, teacher, serial number, or classroom"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="flex-1"
        />
        <TimeFilterDialog
          selectedCells={selectedCells}
          onSelectedCellsChange={onSelectedCellsChange}
        />
      </div>
    </div>
  );
}
