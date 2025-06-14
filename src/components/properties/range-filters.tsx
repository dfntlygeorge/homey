import { AwaitedPageProps, FilterOptions } from "@/config/types";
import { ChangeEvent, useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { RangeSelect } from "../ui/range-select";

interface RangeFiltersProps extends AwaitedPageProps {
  label: string;
  minName: string;
  maxName: string;
  defaultMin: number;
  defaultMax: number;
  increment?: number;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const RangeFilters = (props: RangeFiltersProps) => {
  const {
    label,
    minName,
    maxName,
    defaultMin,
    defaultMax,
    increment,
    handleChange,
    searchParams,
  } = props;

  const getInitialState = () => {
    const state: FilterOptions<string, number> = [];
    let iterator = defaultMin - (increment ?? 1);

    do {
      if (increment) {
        iterator += increment;
      } else {
        iterator++;
      }
      state.push({
        label: formatPrice(iterator),
        value: iterator,
      });
    } while (iterator < defaultMax);

    return state;
  };

  const initialState = getInitialState();

  const [minOptions, setMinOptions] =
    useState<FilterOptions<string, number>>(initialState);
  const [maxOptions, setMaxOptions] = useState<FilterOptions<string, number>>(
    initialState.toReversed()
  );

  useEffect(() => {
    if (searchParams?.[minName]) {
      setMaxOptions(
        initialState.filter(
          ({ value }) => value > Number(searchParams?.[minName])
        )
      );
    }
    if (searchParams?.[maxName]) {
      setMinOptions(
        initialState.filter(
          ({ value }) => value < Number(searchParams?.[maxName])
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.[minName], searchParams?.[maxName]]);

  return (
    <div className="space-y-3">
      {label && (
        <h4 className="text-sm font-medium text-foreground/90">{label}</h4>
      )}
      <RangeSelect
        label=""
        minSelect={{
          name: minName,
          value: Number(searchParams?.[minName] || ""),
          onChange: handleChange,
          options: minOptions,
        }}
        maxSelect={{
          name: maxName,
          value: Number(searchParams?.[maxName] || ""),
          onChange: handleChange,
          options: maxOptions,
        }}
      />
    </div>
  );
};
