import { Card, CardContent } from "@/components/ui/card";
import { Building, MessageSquare, Eye } from "lucide-react";

interface UserStatsProps {
  listingCount: number;
  reviewCount: number;
  totalViews?: number;
}

export const UserStats = ({
  listingCount,
  reviewCount,
  totalViews,
}: UserStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {listingCount}
          </div>
          <div className="text-sm text-muted-foreground">Listings</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {reviewCount}
          </div>
          <div className="text-sm text-muted-foreground">Reviews</div>
        </CardContent>
      </Card>

      {typeof totalViews === "number" && totalViews > 0 && (
        <Card className="col-span-2">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {totalViews}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
