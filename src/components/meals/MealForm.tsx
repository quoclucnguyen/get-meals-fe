import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMealNameAutocomplete } from "@/hooks/useMealNameAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import type { CreateMealInput, UpdateMealInput } from "@/lib/types";

const mealSchema = z.object({
  name: z.string().min(1, "Tên món là bắt buộc").max(255, "Tên món quá dài"),
  description: z.string().optional(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
  date: z.string().min(1, "Ngày là bắt buộc"),
});

type FormData = z.infer<typeof mealSchema>;

interface MealFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMealInput | UpdateMealInput) => Promise<void>;
  initialData?: Partial<FormData>;
  title?: string;
}

const mealTypeOptions = [
  { value: "BREAKFAST" as const, label: "Bữa Sáng" },
  { value: "LUNCH" as const, label: "Bữa Trưa" },
  { value: "DINNER" as const, label: "Bữa Tối" },
];

export function MealForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Món ăn",
}: Readonly<MealFormProps>) {
  const form = useForm<FormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      mealType: initialData?.mealType || "LUNCH",
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
    },
  });

  const currentName = form.watch("name");
  const { data: mealNameData } = useMealNameAutocomplete(currentName);

  const autocompleteOptions = mealNameData?.names.map((name: string) => ({
    value: name,
    label: name,
  })) || [];

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên món *</FormLabel>
                  <FormControl>
                    <Autocomplete
                      value={field.value}
                      onChange={field.onChange}
                      options={autocompleteOptions}
                      placeholder="Nhập tên món ăn"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mealType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bữa *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bữa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mealTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về món ăn (tùy chọn)"
                      className="resize-none"
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
                {form.formState.isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
