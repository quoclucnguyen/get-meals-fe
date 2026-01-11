import {
  Sparkles,
  Clock,
  ChefHat,
  Flame,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Recommendation } from "@/lib/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept: () => void;
  onSkip: () => void;
}

export function RecommendationCard({
  recommendation,
  onAccept,
  onSkip,
}: Readonly<RecommendationCardProps>) {
  return (
    <Card className="group stacked-card transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-card via-background to-muted/10">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-copper to-gold" />
      
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-gold" />
                <div className="absolute inset-0 blur-md bg-gold/40" />
              </div>
              <Badge className="bg-gradient-to-r from-gold/10 to-copper/10 text-foreground border-2 border-primary/30 font-semibold shadow-md">
                AI Gợi ý
              </Badge>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-gradient-gold transition-all duration-500">
              {recommendation.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        {recommendation.description && (
          <p className="text-base text-muted-foreground leading-relaxed font-light pl-2 border-l-2 border-primary/30">
            {recommendation.description}
          </p>
        )}

        {/* Reasoning */}
        {recommendation.reasoning && (
          <div className="relative bg-gradient-to-br from-gold/5 via-copper/5 to-sage/5 rounded-2xl p-6 border border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-copper flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground mb-2 tracking-wide uppercase">
                  Tại sao gợi ý này?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {recommendation.reasoning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cooking Time */}
          {recommendation.cookingTime && (
            <div className="flex items-center gap-3 text-foreground bg-gradient-to-br from-muted/50 to-transparent rounded-xl p-4 border border-primary/10 transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-copper/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Thời gian
                </p>
                <p className="font-bold text-lg truncate">
                  {recommendation.cookingTime}
                </p>
              </div>
            </div>
          )}

          {/* Difficulty */}
          {recommendation.difficulty && (
            <div className="flex items-center gap-3 text-foreground bg-gradient-to-br from-muted/50 to-transparent rounded-xl p-4 border border-primary/10 transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-copper/20 to-gold/20 flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-copper" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Độ khó
                </p>
                <p className="font-bold text-lg truncate">
                  {recommendation.difficulty}
                </p>
              </div>
            </div>
          )}

          {/* Calories */}
          {recommendation.calories && (
            <div className="flex items-center gap-3 text-foreground bg-gradient-to-br from-muted/50 to-transparent rounded-xl p-4 border border-primary/10 transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Calo
                </p>
                <p className="font-bold text-lg truncate">
                  {recommendation.calories}
                </p>
              </div>
            </div>
          )}

          {/* Protein */}
          {recommendation.protein && (
            <div className="flex items-center gap-3 text-foreground bg-gradient-to-br from-muted/50 to-transparent rounded-xl p-4 border border-primary/10 transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-sage/20 to-green-600/20 flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-br from-sage to-green-600 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Protein
                </p>
                <p className="font-bold text-lg truncate">
                  {recommendation.protein}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Ingredients */}
        {recommendation.ingredients &&
          recommendation.ingredients.length > 0 && (
            <div>
              <p className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-0.5 bg-gradient-to-r from-gold to-transparent" />
                Nguyên liệu chính
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendation.ingredients
                  .slice(0, 6)
                  .map((ingredient: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm font-medium bg-gradient-to-r from-sage/10 to-green-600/10 text-sage border-sage/30 hover:from-sage/20 hover:to-green-600/20 transition-all hover:scale-105"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                {recommendation.ingredients.length > 6 && (
                  <Badge variant="outline" className="text-sm border-primary/30">
                    +{recommendation.ingredients.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          )}
      </CardContent>

      <CardFooter className="flex gap-3 px-8 py-5 bg-gradient-to-r from-muted/50 via-transparent to-muted/50 border-t border-border/50 group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-500">
        <Button
          variant="outline"
          size="lg"
          onClick={onSkip}
          className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 hover:-translate-y-0.5 transition-all duration-300 gap-2 font-semibold"
        >
          <XCircle className="h-5 w-5" />
          <span>Bỏ qua</span>
        </Button>
        <Button
          size="lg"
          onClick={onAccept}
          className="flex-1 bg-gradient-to-r from-gold to-copper hover:from-gold/90 hover:to-copper/90 text-white shadow-lg shadow-gold/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 gap-2 font-semibold"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Chọn món này</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
