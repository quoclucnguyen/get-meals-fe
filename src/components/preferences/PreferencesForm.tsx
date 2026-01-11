import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Preferences, UpdatePreferencesInput } from '@/lib/types';

const preferencesSchema = z.object({
  dietaryRestrictions: z.array(z.string()).optional(),
  favoriteCuisines: z.array(z.string()).optional(),
  dislikedIngredients: z.array(z.string()).optional(),
  locationName: z.string().optional(),
});

type FormData = z.infer<typeof preferencesSchema>;

interface PreferencesFormProps {
  preferences: Preferences | null;
  onSubmit: (data: UpdatePreferencesInput) => Promise<void>;
  loading?: boolean;
}

const dietaryOptions = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'low-sodium',
];

const cuisineOptions = [
  'Asian',
  'Italian',
  'Mexican',
  'French',
  'Indian',
  'American',
];

export function PreferencesForm({ preferences, onSubmit, loading }: PreferencesFormProps) {
  const [newIngredient, setNewIngredient] = useState('');
  const form = useForm<FormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      dietaryRestrictions: preferences?.dietaryRestrictions || [],
      favoriteCuisines: preferences?.favoriteCuisines || [],
      dislikedIngredients: preferences?.dislikedIngredients || [],
      locationName: preferences?.locationName || '',
    },
  });

  const handleToggleDietary = (value: string) => {
    const current = form.getValues('dietaryRestrictions') || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    form.setValue('dietaryRestrictions', updated);
  };

  const handleToggleCuisine = (value: string) => {
    const current = form.getValues('favoriteCuisines') || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    form.setValue('favoriteCuisines', updated);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    const current = form.getValues('dislikedIngredients') || [];
    if (!current.includes(newIngredient.trim())) {
      form.setValue('dislikedIngredients', [...current, newIngredient.trim()]);
    }
    setNewIngredient('');
  };

  const handleRemoveIngredient = (value: string) => {
    const current = form.getValues('dislikedIngredients') || [];
    form.setValue(
      'dislikedIngredients',
      current.filter((item) => item !== value)
    );
  };

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting preferences:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Dietary Restrictions */}
        <div className="space-y-3">
          <Label>Giới hạn ăn uống</Label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  (form.getValues('dietaryRestrictions') || []).includes(option)
                    ? 'default'
                    : 'outline'
                }
                onClick={() => handleToggleDietary(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div className="space-y-3">
          <Label>Ẩm thực yêu thích</Label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  (form.getValues('favoriteCuisines') || []).includes(option)
                    ? 'default'
                    : 'outline'
                }
                onClick={() => handleToggleCuisine(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Disliked Ingredients */}
        <div className="space-y-3">
          <Label>Nguyên liệu không thích</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập nguyên liệu và nhấn Enter hoặc bấm Thêm"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddIngredient();
                }
              }}
            />
            <Button type="button" onClick={handleAddIngredient}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.getValues('dislikedIngredients') || []).map((ingredient) => (
              <div
                key={ingredient}
                className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm"
              >
                <span>{ingredient}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thành phố</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên thành phố" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu preferences'}
        </Button>
      </form>
    </Form>
  );
}
