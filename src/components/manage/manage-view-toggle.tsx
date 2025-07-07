"use client";

import { Archive, FolderOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ManageViewToggleProps {
  activeCount: number;
  archivedCount: number;
  isViewingArchived: boolean;
}

export const ManageViewToggle = ({
  activeCount,
  archivedCount,
  isViewingArchived,
}: ManageViewToggleProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (viewArchived: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (viewArchived) {
      params.set("view", "archived");
    } else {
      params.delete("view");
    }

    router.push(`?${params.toString()}`);
  };

  // Only show if user has both active and archived listings
  if (activeCount === 0 && archivedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        <button
          onClick={() => handleViewChange(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            !isViewingArchived
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          disabled={!isViewingArchived}
        >
          <FolderOpen className="h-4 w-4" />
          Active ({activeCount})
        </button>
        <button
          onClick={() => handleViewChange(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isViewingArchived
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          disabled={isViewingArchived}
        >
          <Archive className="h-4 w-4" />
          Archived ({archivedCount})
        </button>
      </div>
    </div>
  );
};
