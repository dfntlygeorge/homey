"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Loader2, MapPin, Building2 } from "lucide-react";
import { cn, generateSessionToken } from "@/lib/utils";
import { api } from "@/lib/api-client";
import {
  AddressAutocompleteProps,
  AddressSuggestion,
  SearchBoxSuggestResponse,
} from "@/config/types/autocomplete-address.type";
import { toast } from "sonner";
import { env } from "@/env";

export const AddressAutocomplete = (props: AddressAutocompleteProps) => {
  const {
    value,
    onChange,
    onBlur,
    onSelect,
    placeholder = "Enter address or search for places",
    className,
    includeAddresses = true,
    includePois = true,
  } = props;
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [sessionToken] = useState(() => generateSessionToken()); // Generate once per component instance

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>(null as unknown as NodeJS.Timeout);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Mapbox access token is not configured");
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        q: query,
        access_token: accessToken,
        session_token: sessionToken,
        limit: "5",
        language: "en",
        country: "PH", // Focus on Philippines
      });

      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`;
      const data = await api.get<SearchBoxSuggestResponse>(url);

      let filteredSuggestions = data.suggestions;

      if (!includeAddresses || !includePois) {
        filteredSuggestions = data.suggestions.filter((suggestion) => {
          const isPoi = suggestion.feature_type === "poi";
          const isAddress = [
            "address",
            "place",
            "locality",
            "neighborhood",
          ].includes(suggestion.feature_type);

          return (includePois && isPoi) || (includeAddresses && isAddress);
        });
      }

      const formattedSuggestions: AddressSuggestion[] = filteredSuggestions.map(
        (suggestion) => ({
          mapbox_id: suggestion.mapbox_id,
          name: suggestion.name,
          name_preferred: suggestion.name_preferred,
          feature_type: suggestion.feature_type,
          address: suggestion.address,
          full_address: suggestion.full_address,
          place_formatted: suggestion.place_formatted,
          poi_category: suggestion.poi_category,
        })
      );

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
      toast.error("Something went wrong", {
        description:
          "We couldn't load suggestions. Check your internet or try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300); // Reduced debounce for better UX
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    // Use the most descriptive name available
    const displayName = suggestion.full_address || suggestion.name;
    onChange(displayName);

    // Notify parent component about the selection
    onSelect?.(suggestion);

    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

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
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      onBlur?.();
    }, 250);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Get appropriate icon for suggestion type
  const getSuggestionIcon = (suggestion: AddressSuggestion) => {
    if (suggestion.feature_type === "poi") {
      // You could further customize based on poi_category
      return <Building2 className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />;
    }
    return <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />;
  };

  // Format the display text for each suggestion
  const getDisplayText = (suggestion: AddressSuggestion) => {
    if (suggestion.feature_type === "poi") {
      return {
        primary: suggestion.name_preferred || suggestion.name,
        secondary: suggestion.address || suggestion.place_formatted || "",
      };
    } else {
      return {
        primary: suggestion.name,
        secondary: suggestion.full_address || suggestion.place_formatted || "",
      };
    }
  };

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

  useEffect(() => {
    return () => {
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
          {suggestions.map((suggestion, index) => {
            const { primary, secondary } = getDisplayText(suggestion);
            return (
              <li
                key={suggestion.mapbox_id}
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
                {getSuggestionIcon(suggestion)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {primary}
                  </div>
                  {secondary && (
                    <div className="text-xs text-gray-500 truncate">
                      {secondary}
                    </div>
                  )}
                  {suggestion.poi_category &&
                    suggestion.poi_category.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        {suggestion.poi_category.join(", ")}
                      </div>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
