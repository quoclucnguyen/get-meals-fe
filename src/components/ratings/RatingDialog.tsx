import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import type { Meal, CreateRatingInput } from "@/lib/types";

const ratingSchema = z.object({
  rating: z
    .number()
    .min(1, "Vui lòng chọn đánh giá")
    .max(5, "Đánh giá tối đa là 5 sao"),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof ratingSchema>;

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRatingInput) => Promise<void>;
  meal: Meal | null;
}

export function RatingDialog({
  open,
  onClose,
  onSubmit,
  meal,
}: Readonly<RatingDialogProps>) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const form = useForm<FormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!meal) return;

    try {
      await onSubmit({ mealId: meal.id, ...data });
      form.reset();
      setHoveredRating(0);
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Đánh giá món ăn</DialogTitle>
          {meal && <p className="text-sm text-muted-foreground">{meal.name}</p>}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={`h-8 w-8 transition-all ${
                              star <= (hoveredRating || field.value)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhận xét (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nhận xét về món ăn..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Đang lưu..." : "Lưu đánh giá"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
