import { useState } from 'react';
import { Filter, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import {
  useMealsQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} from '@/hooks/useMeals';
import { useCreateRatingMutation } from '@/hooks/useRatings';
import { MealCard } from '@/components/meals/MealCard';
import { MealForm } from '@/components/meals/MealForm';
import { RatingDialog } from '@/components/ratings/RatingDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import type { Meal, CreateMealInput, UpdateMealInput } from '@/lib/types';

const mealTypes = ['ALL', 'BREAKFAST', 'LUNCH', 'DINNER'] as const;
const mealTypeLabels: Record<string, string> = {
  ALL: 'Tất cả',
  BREAKFAST: 'Bữa Sáng',
  LUNCH: 'Bữa Trưa',
  DINNER: 'Bữa Tối',
};

export function History() {
  const [filter, setFilter] = useState<'ALL' | 'BREAKFAST' | 'LUNCH' | 'DINNER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [ratingMeal, setRatingMeal] = useState<Meal | null>(null);

  // Query hooks
  const { data: meals = [], isLoading, error } = useMealsQuery(
    filter === 'ALL' ? undefined : { mealType: filter }
  );

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
      console.error('Error saving meal:', err);
      throw err;
    }
  };

  const handleDeleteMeal = async (meal: Meal) => {
    if (!confirm('Bạn có chắc chắn muốn xóa món ăn này?')) return;
    
    try {
      await deleteMealMutation.mutateAsync(meal);
    } catch (err) {
      console.error('Error deleting meal:', err);
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
      console.error('Error submitting rating:', err);
      throw err;
    }
  };

  const filteredMeals = meals.filter((meal) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      meal.name.toLowerCase().includes(query) ||
      (meal.description && meal.description.toLowerCase().includes(query))
    );
  });

  const sortedMeals = [...filteredMeals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container px-4 py-8 md:py-12 space-y-8 md:space-y-12 animate-smooth">
      {/* Header */}
      <div className="space-y-6 md:space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gold to-copper" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gradient-gold text-center leading-tight">
            Lịch sử bữa ăn
          </h1>
          <p className="text-muted-foreground mt-4 md:mt-6 text-center text-base md:text-lg font-light">
            Xem lại và quản lý lịch sử bữa ăn của bạn
          </p>
        </div>
        <Button
          onClick={() => {
            setShowMealForm(true);
            setEditingMeal(null);
          }}
          className="gap-2"
        >
          <CalendarIcon className="h-4 w-4" />
          Thêm món ăn
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="animate-smooth border-2 border-destructive/30">
          <AlertDescription className="font-medium">Không thể tải lịch sử bữa ăn</AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-muted/10">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm món ăn..."
                  className="pl-9 border-primary/30 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as 'ALL' | 'BREAKFAST' | 'LUNCH' | 'DINNER')}
              className="w-full md:w-auto"
            >
              <TabsList>
                {mealTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {mealTypeLabels[type]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sortedMeals.length === 0 ? (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-muted/30 to-transparent">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 mb-4">
              <CalendarIcon className="h-16 w-16 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">Chưa có bữa ăn</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6 text-base font-light">
              {filter === 'ALL'
                ? 'Bạn chưa có bữa ăn nào. Hãy thêm món ăn đầu tiên!'
                : `Chưa có món ăn ${mealTypeLabels[filter].toLowerCase()}`}
            </p>
            <Button
              onClick={() => {
                setShowMealForm(true);
                setEditingMeal(null);
              }}
              className="gap-2 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 font-semibold"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Thêm món ăn
            </Button>
          </CardContent>
        </Card>
        ) : (
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedMeals.map((meal: Meal) => (
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

      {/* Meal Form Dialog */}
      <MealForm
        open={showMealForm}
        onClose={() => {
          setShowMealForm(false);
          setEditingMeal(null);
        }}
        onSubmit={handleSubmitMeal}
        initialData={editingMeal ? {
          name: editingMeal.name,
          mealType: editingMeal.mealType,
          date: editingMeal.date,
          description: editingMeal.description || undefined,
        } : undefined}
        title={editingMeal ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
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
