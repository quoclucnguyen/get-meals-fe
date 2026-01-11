import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Calendar as CalendarIcon,
  Sparkles,
  Utensils,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useMealsByDateQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} from "@/hooks/useMeals";
import { useCreateRatingMutation } from "@/hooks/useRatings";
import { WeatherWidget } from "@/components/layout/WeatherWidget";
import { MealCard } from "@/components/meals/MealCard";
import { MealForm } from "@/components/meals/MealForm";
import { RatingDialog } from "@/components/ratings/RatingDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isToday, addDays, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import type { Meal, CreateMealInput, UpdateMealInput } from "@/lib/types";

const mealTypeOrder = ["BREAKFAST", "LUNCH", "DINNER"] as const;
const mealTypeLabels: Record<string, string> = {
  BREAKFAST: "Bữa Sáng",
  LUNCH: "Bữa Trưa",
  DINNER: "Bữa Tối",
};

const mealTypeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  BREAKFAST: Sun,
  LUNCH: Utensils,
  DINNER: Moon,
};

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [ratingMeal, setRatingMeal] = useState<Meal | null>(null);

  // Query hooks
  const { data: todayMeals = [], isLoading, error } = useMealsByDateQuery(selectedDate);

  // Mutation hooks
  const createMealMutation = useCreateMealMutation();
  const updateMealMutation = useUpdateMealMutation();
  const deleteMealMutation = useDeleteMealMutation();
  const createRatingMutation = useCreateRatingMutation();

  const handleSubmitMeal = async (data: CreateMealInput | UpdateMealInput) => {
    try {
      if (editingMeal) {
        await updateMealMutation.mutateAsync({ id: editingMeal.id, input: data as UpdateMealInput });
        setEditingMeal(null);
      } else {
        await createMealMutation.mutateAsync(data as CreateMealInput);
      }
      setShowMealForm(false);
    } catch (err) {
      console.error("Error saving meal:", err);
      throw err;
    }
  };

  const handleDeleteMeal = async (meal: Meal) => {
    if (!confirm("Bạn có chắc chắn muốn xóa món ăn này?")) return;

    try {
      await deleteMealMutation.mutateAsync(meal);
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  const handleRate = (meal: Meal) => {
    setRatingMeal(meal);
    setShowRatingDialog(true);
  };

  const handleSubmitRating = async (data: { rating: number; comment?: string }) => {
    if (!ratingMeal) return;

    try {
      await createRatingMutation.mutateAsync({
        mealId: ratingMeal.id,
        ...data,
      });
      setShowRatingDialog(false);
      setRatingMeal(null);
    } catch (err) {
      console.error("Error submitting rating:", err);
      throw err;
    }
  };

  const getMealsByType = (type: string) => {
    return todayMeals.filter((meal) => meal.mealType === type);
  };

  const getQuickActionLabel = () => {
    const totalMeals = todayMeals.length;
    if (totalMeals === 0) return "Thêm món ăn đầu tiên";
    if (totalMeals < 3) return "Thêm món ăn";
    return "Xem lịch sử";
  };

  const getQuickActionPath = () => {
    const totalMeals = todayMeals.length;
    if (totalMeals < 3) return "/recommendations";
    return "/history";
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: vi });
  };

  const totalProgress = todayMeals.length;
  const progressPercentage = Math.min((totalProgress / 3) * 100, 100);

  return (
    <div className="container px-4 py-8 md:py-12 space-y-8 md:space-y-12 animate-smooth">
      {/* Header Section */}
      <div className="space-y-6 md:space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gold to-copper" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gradient-gold text-center leading-tight">
            {isToday(selectedDate)
              ? "Bữa ăn hôm nay"
              : `Bữa ăn ${getDayName(selectedDate)}`}
          </h1>
          <p className="text-muted-foreground mt-4 md:mt-6 text-center text-base md:text-lg font-light">
            Quản lý và theo dõi bữa ăn của bạn
          </p>
        </div>

        {/* Date Picker */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousDay}
              className="h-11 w-11 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 md:flex-none justify-start text-left font-normal h-11 px-4 border-primary/30 hover:border-primary/50 transition-all duration-300"
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  <span className="font-medium">
                    {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-primary/20 shadow-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  locale={vi}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextDay}
              className="h-11 w-11 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={goToToday}
            className="h-11 px-6 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 font-semibold"
          >
            <span className="text-sm">Hôm nay</span>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="relative h-3 md:h-4 bg-gradient-to-r from-primary/10 to-muted/30 rounded-full overflow-hidden shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold via-copper to-gold transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm md:text-base font-semibold text-gradient-gold">
              {totalProgress}/3
            </span>
            <span className="text-sm md:text-base text-muted-foreground font-light">
              bữa ăn hoàn thành
            </span>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="animate-smooth border-2 border-destructive/30"
        >
          <AlertDescription className="font-medium">Không thể tải bữa ăn</AlertDescription>
        </Alert>
      )}

      {/* Today's Meals */}
      <div className="space-y-6 md:space-y-8">
        {isLoading ? (
          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            {mealTypeOrder.map((type, index) => (
              <div
                key={type}
                className="h-72 md:h-80 rounded-2xl border-2 border-primary/20 bg-muted/10 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            {mealTypeOrder.map((type, index) => {
              const meals = getMealsByType(type);
              const Icon = mealTypeIcons[type];
              const isEmpty = meals.length === 0;

              return (
                <Card
                  key={type}
                  className={`transition-all duration-500 hover:shadow-2xl overflow-hidden border-2 ${
                    isEmpty
                      ? "border-dashed border-primary/30 bg-gradient-to-br from-muted/30 to-transparent hover:border-primary/50"
                      : "border-primary/20 bg-gradient-to-br from-card to-muted/10"
                  } animate-smooth`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 px-6 py-5 border-b border-primary/10">
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                      <div
                        className={`p-2 rounded-xl ${
                          isEmpty
                            ? "bg-muted/50"
                            : "bg-gradient-to-br from-gold/20 to-copper/20"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 md:h-6 md:w-6 ${
                            isEmpty ? "text-muted-foreground" : "text-gold"
                          }`}
                        />
                      </div>
                      <span className="font-bold">{mealTypeLabels[type]}</span>
                      <Badge
                        variant="outline"
                        className={`ml-auto shrink-0 border-2 font-semibold text-sm ${
                          isEmpty
                            ? "bg-muted/50 text-muted-foreground border-muted/50"
                            : "bg-gradient-to-r from-gold/10 to-copper/10 text-foreground border-primary/30"
                        }`}
                      >
                        {meals.length} món
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {isEmpty ? (
                      <div className="flex min-h-48 md:min-h-56 flex-col items-center justify-center text-center text-muted-foreground px-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 mb-4">
                          <CalendarIcon className="h-12 w-12 md:h-14 md:w-14 opacity-40" />
                        </div>
                        <p className="text-base md:text-lg font-semibold mb-2">
                          Chưa có món ăn
                        </p>
                        <p className="text-sm text-muted-foreground/70 mb-6 font-light">
                          Thêm món ăn cho bữa này
                        </p>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            setShowMealForm(true);
                            setEditingMeal(null);
                          }}
                          className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 font-semibold"
                        >
                          <Plus className="h-4 w-4" />
                          Thêm món
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {meals.map((meal) => (
                          <MealCard
                            key={meal.id}
                            meal={meal}
                            onEdit={handleEdit}
                            onDelete={handleDeleteMeal}
                            onRate={handleRate}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-muted/10 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-copper to-gold" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-gold/10 to-copper/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-green-600/10 rounded-full blur-2xl" />

        <CardContent className="relative p-6 md:p-10">
          <div className="flex flex-col gap-6 md:gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gradient-gold mb-3 md:mb-4 leading-tight">
                {todayMeals.length === 0
                  ? "Bắt đầu ngày mới!"
                  : todayMeals.length < 3
                  ? "Tiếp tục thêm món ăn"
                  : "Hoàn thành ngày hôm nay! 🎉"}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed font-light">
                {todayMeals.length === 0
                  ? "Bạn chưa thêm món ăn nào. Hãy bắt đầu với bữa sáng!"
                  : todayMeals.length < 3
                  ? `Đã thêm ${todayMeals.length}/3 bữa ăn. Còn ${
                      3 - todayMeals.length
                    } bữa nữa!`
                  : "Tuyệt vời! Bạn đã hoàn thành cả 3 bữa ăn hôm nay."}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:shrink-0">
              <Button
                onClick={() => {
                  setShowMealForm(true);
                  setEditingMeal(null);
                }}
                className="gap-2 bg-gradient-to-r from-gold to-copper hover:from-gold/90 hover:to-copper/90 text-white shadow-lg shadow-gold/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold px-6 py-6 text-base"
              >
                <Plus className="h-5 w-5" />
                <span>Thêm món ăn</span>
              </Button>
              <Button
                variant="outline"
                asChild
                className="gap-2 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-0.5 transition-all duration-300 font-semibold px-6 py-6 text-base"
              >
                <Link to={getQuickActionPath()}>
                  <Sparkles className="h-5 w-5" />
                  <span>{getQuickActionLabel()}</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Form Dialog */}
      <MealForm
        open={showMealForm}
        onClose={() => {
          setShowMealForm(false);
          setEditingMeal(null);
        }}
        onSubmit={handleSubmitMeal}
        initialData={
          editingMeal
            ? {
                name: editingMeal.name,
                mealType: editingMeal.mealType,
                date: selectedDate.toISOString().split("T")[0],
                description: editingMeal.description || undefined,
              }
            : undefined
        }
        title={editingMeal ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
      />

      {/* Rating Dialog */}
      <RatingDialog
        open={showRatingDialog}
        onClose={() => {
          setShowRatingDialog(false);
          setRatingMeal(null);
        }}
        onSubmit={handleSubmitRating}
        meal={ratingMeal}
      />
    </div>
  );
}
