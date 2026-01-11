import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Loader2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useRecommendationsQuery,
  useRefreshRecommendationsMutation,
} from '@/hooks/useRecommendations';
import { useCreateMealMutation } from '@/hooks/useMeals';
import { RecommendationCard } from '@/components/recommendations/RecommendationCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isToday, addDays, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Recommendation, CreateMealInput } from '@/lib/types';

const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'] as const;
const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Bữa Sáng',
  LUNCH: 'Bữa Trưa',
  DINNER: 'Bữa Tối',
};

export function Recommendations() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeMealType, setActiveMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('BREAKFAST');

  // Query hook with date parameter
  const { data: recommendationsResponse, isLoading, error } = useRecommendationsQuery(
    activeMealType,
    selectedDate.toISOString().split('T')[0]
  );
  const recommendations = recommendationsResponse?.recommendations || [];

  // Mutation hooks
  const refreshRecommendationsMutation = useRefreshRecommendationsMutation();
  const createMealMutation = useCreateMealMutation();

  const handleRefresh = async () => {
    try {
      await refreshRecommendationsMutation.mutateAsync({
        mealType: activeMealType,
        date: selectedDate.toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error refreshing recommendations:', err);
    }
  };

  const handleAccept = async (recommendation: Recommendation) => {
    try {
      const mealData: CreateMealInput = {
        name: recommendation.name,
        description: recommendation.description || undefined,
        mealType: activeMealType,
        date: selectedDate.toISOString().split('T')[0],
      };
      await createMealMutation.mutateAsync(mealData);
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      console.error('Error creating meal from recommendation:', err);
    }
  };

  const handleSkip = async () => {
    // Just refresh to get new recommendations
    handleRefresh();
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
    return format(date, 'EEEE', { locale: vi });
  };

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
            Gợi ý món ăn
          </h1>
          <p className="text-muted-foreground mt-4 md:mt-6 text-center text-base md:text-lg font-light">
            Nhận gợi ý thông minh cho bữa ăn của bạn
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
                    {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
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
            disabled={isToday(selectedDate)}
            className="h-11 px-6 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 font-semibold"
          >
            <span className="text-sm">Hôm nay</span>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="animate-smooth border-2 border-destructive/30">
          <AlertDescription className="font-medium">Không thể tải gợi ý</AlertDescription>
        </Alert>
      )}

      {/* Meal Type Tabs */}
      <Tabs
        value={activeMealType}
        onValueChange={(value) => setActiveMealType(value as 'BREAKFAST' | 'LUNCH' | 'DINNER')}
      >
        <TabsList className="grid w-full grid-cols-3">
          {mealTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {mealTypeLabels[type]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Recommendations */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : recommendations.length === 0 ? (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-muted/30 to-transparent">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 mb-4">
                <Sparkles className="h-16 w-16 text-muted-foreground opacity-40" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Không có gợi ý
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6 text-base font-light">
                {isToday(selectedDate)
                  ? `Chưa có gợi ý cho ${mealTypeLabels[activeMealType].toLowerCase()} hôm nay. Hãy thử làm mới!`
                  : `Chưa có gợi ý cho ${mealTypeLabels[activeMealType].toLowerCase()} ngày ${getDayName(selectedDate)}. Hãy thử làm mới!`
                }
              </p>
              <Button onClick={handleRefresh} className="gap-2 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 font-semibold">
                <Sparkles className="h-4 w-4" />
                Làm mới gợi ý
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 font-semibold"
              >
                <Sparkles className="h-4 w-4" />
                Làm mới
              </Button>
            </div>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={recommendation}
                  onAccept={() => handleAccept(recommendation)}
                  onSkip={handleSkip}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
