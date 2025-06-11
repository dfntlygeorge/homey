"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

interface AddressSuggestion {
  id: string;
  place_name: string;
  text: string;
}

interface MapboxResponse {
  features: MapboxFeature[];
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}
type MapboxFeature = {
  id: string;
  place_name: string;
  text: string;
};
/**
 * This component returns an input field with live addresses suggestions using the mapbox api. As you type, it shows a dropdown with matching addresses that you can select.
 */
export const AddressAutocomplete = ({
  value,
  onChange,
  onBlur,
  placeholder = "Enter your complete address",
  className,
}: AddressAutocompleteProps) => {
  // state management, useState trigger re-renders when changed
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]); // storage for the address suggestions
  const [isLoading, setIsLoading] = useState(false); // show or hide the spinner
  const [showSuggestions, setShowSuggestions] = useState(false); // show or hide the dropdown
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // for keyboard navigation
  // useRef - storing references without triggering re-renders when changed.
  const inputRef = useRef<HTMLInputElement>(null); // direct reference to the input element for focusing
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]); // Array of references for suggestions for scrolling
  const debounceRef = useRef<NodeJS.Timeout>(null as unknown as NodeJS.Timeout); // stores the timeoutId for the debounce functionality????
  // NOTE: use useRef when the values dont need to trigger re render when changed, we need direct dom manipulation, they need to persist between re renders.

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("Mapbox access token is not configured");
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${accessToken}&autocomplete=true&limit=5&types=address,poi`;

      const data = await api.get<MapboxResponse>(url);
      console.log(data);

      const formattedSuggestions: AddressSuggestion[] =
        data.features.map((feature) => ({
          id: feature.id,
          place_name: feature.place_name,
          text: feature.text,
        })) || [];

      console.log(formattedSuggestions);

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current); // reset the timeout every time it input change
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 800); // gets cleared if user types less than 800ms
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return; // if no suggestions or dropdown is close do nothing

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      onBlur?.();
    }, 150);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  // basically scrolls the highlighted suggestion(when using keyboard nav) to view.
  useEffect(() => {
    if (
      activeSuggestionIndex >= 0 &&
      suggestionRefs.current[activeSuggestionIndex]
    ) {
      suggestionRefs.current[activeSuggestionIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeSuggestionIndex]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      // cleanup function, runs only on unmount or before re running the effect
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={cn("pr-8", className)}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              ref={(el) => {
                suggestionRefs.current[index] = el;
              }}
              className={cn(
                "px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                "flex items-start gap-3",
                activeSuggestionIndex === index && "bg-blue-50 text-blue-900"
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.text}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {suggestion.place_name}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
