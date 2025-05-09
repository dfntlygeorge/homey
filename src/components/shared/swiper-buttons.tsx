import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SwiperButtonProps {
  prevClassName?: string;
  nextClassName?: string;
}

export const SwiperButtons = (props: SwiperButtonProps) => {
  const { prevClassName, nextClassName } = props;

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        rel="prev"
        size="icon"
        className={cn(
          prevClassName,
          "swiper-button-prev absolute top-1/2 z-10 flex -translate-y-1/2 items-center rounded-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronLeft className="h-8 w-8" color="black" />
      </Button>
      <Button
        variant="ghost"
        type="button"
        rel="next"
        size="icon"
        className={cn(
          nextClassName,
          "swiper-button-next absolute top-1/2 z-10 flex -translate-y-1/2 items-center rounded-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronRight className="h-8 w-8" color="black" />
      </Button>
    </>
  );
};
