import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  className,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        const isHalfFilled = starValue - 0.5 <= rating && starValue > rating;

        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : isHalfFilled
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
            )}
          />
        );
      })}
    </div>
  );
};
