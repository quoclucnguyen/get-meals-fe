import { MoreHorizontal, Edit, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { type Meal } from "@/lib/types";

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
  onRate: (meal: Meal) => void;
}

export function MealCard({
  meal,
  onEdit,
  onDelete,
  onRate,
}: Readonly<MealCardProps>) {
  const mealTypeLabels: Record<string, { label: string; color: string }> = {
    BREAKFAST: {
      label: "Bữa Sáng",
      color:
        "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border-amber-300",
    },
    LUNCH: {
      label: "Bữa Trưa",
      color:
        "bg-gradient-to-r from-gold/10 to-copper/10 text-foreground border-primary/30",
    },
    DINNER: {
      label: "Bữa Tối",
      color:
        "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border-purple-300",
    },
  };

  const mealType = mealTypeLabels[meal.mealType] || {
    label: meal.mealType,
    color: "bg-gradient-to-r from-gray-100 to-slate-100",
  };
  const formattedDate = format(new Date(meal.date), "EEE, dd MMM yyyy", {
    locale: vi,
  });

  // Calculate average rating
  const averageRating =
    meal.ratings && meal.ratings.length > 0
      ? meal.ratings.reduce((sum, r) => sum + r.rating, 0) / meal.ratings.length
      : 0;

  return (
    <Card className="group stacked-card transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-primary/20 bg-gradient-to-br from-card to-muted/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-copper to-gold opacity-60" />

      <CardContent className="p-6 space-y-4">
        {/* Meal Type Badge */}
        <div className="flex items-start justify-between">
          <Badge
            className={`font-semibold border transition-all duration-300 hover:shadow-md ${mealType.color}`}
          >
            {mealType.label}
          </Badge>
          {averageRating > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gold/10 to-copper/10 border border-primary/30">
              <Star className="h-4 w-4 fill-current text-gold" />
              <span className="font-semibold text-sm bg-gradient-to-r from-gold to-copper bg-clip-text text-transparent">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Meal Name */}
        <div>
          <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-gradient-gold transition-all duration-300">
            {meal.name}
          </h3>
        </div>

        {/* Description */}
        {meal.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-light">
            {meal.description}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-1 h-4 bg-gradient-to-b from-gold to-copper rounded-full" />
          <span className="font-medium">{formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-muted/50 to-transparent border-t border-border/50 group-hover:from-primary/5 transition-colors duration-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRate(meal)}
          className="text-foreground hover:text-gold hover:bg-gold/10 transition-all duration-300 gap-2"
        >
          <Star className="h-4 w-4" />
          <span className="font-medium">Đánh giá</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-foreground transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border-primary/20 shadow-xl"
          >
            <DropdownMenuItem
              onClick={() => onEdit(meal)}
              className="cursor-pointer transition-colors hover:bg-primary/10"
            >
              <Edit className="h-4 w-4 mr-3" />
              <span className="font-medium">Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(meal)}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              <span className="font-medium">Xóa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
