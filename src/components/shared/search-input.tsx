"use client";

import { useQueryState } from "nuqs"; // works like useState, but the state is stored in the URL query string and is type-safe.
import {
  ChangeEvent,
  InputHTMLAttributes, // Type for input change events (helps TypeScript know the event type)
  useCallback, // Optimizes functions by preventing unnecessary re-creation on re-renders
  useRef, // Stores values or DOM references without causing re-renders
} from "react";
import debounce from "debounce"; // Debouncing limits how often a function runs, especially for events that happen quickly, like typing in a search box. It waits until the user stops typing for a set time before executing the function.
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounceFunc<T extends (...args: any) => any>(
  func: T, // The function to debounce, can be any function that takes any arguments
  wait: number, // How long to wait before calling the function
  opts: { immediate: boolean } // Whether to run immediately or after delay
) {
  return debounce(func, wait, opts); // Returns the debounced function
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = (props: SearchInputProps) => {
  const { className, ...rest } = props;
  const [q, setSearch] = useQueryState("q", {
    shallow: false, // updates the url and makes a request to the server. (causing a re-fetch of the data)
  });
  const inputRef = useRef<HTMLInputElement>(null); // persisting values without causing re-renders when the value change. This tells TypeScript what type of element the ref will hold, in this case an HTMLInputElement.

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    // a memoized, debounced function that updates the search query
    debounceFunc(
      (value: string) => {
        setSearch(value || null);
      },
      1000,
      { immediate: false }
    ),
    []
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleSearch(newValue); // calls the debounced function after 1s.
  };

  const clearSearch = () => {
    setSearch(null);
    if (inputRef.current) inputRef.current.value = ""; // checks if the reference exists and clears the input value
  };

  return (
    <form className="relative flex-1">
      <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
      <Input
        ref={inputRef} // attaches the ref to the input element, like an id.
        defaultValue={q || ""}
        className={cn("pl-8", className)}
        onChange={onChange}
        type="text"
        {...rest}
      />
      {q && (
        <XIcon
          className="absolute top-2.5 right-2.5 h-4 w-4 cursor-pointer rounded-full bg-gray-500 p-0.5 text-white"
          onClick={clearSearch}
        />
      )}
    </form>
  );
};
