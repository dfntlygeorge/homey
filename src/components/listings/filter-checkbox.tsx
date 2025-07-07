import { Checkbox } from "../ui/checkbox";

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const FilterCheckbox = ({
  id,
  label,
  checked,
  onCheckedChange,
  className = "",
}: FilterCheckboxProps) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors ${className}`}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};
