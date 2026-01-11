import { useState } from "react";
import { Settings as SettingsIcon, Loader2 } from "lucide-react";
import {
  usePreferencesQuery,
  useUpdatePreferencesMutation,
} from "@/hooks/usePreferences";
import { PreferencesForm } from "@/components/preferences/PreferencesForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Settings() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Query hook
  const {
    data: preferences,
    isLoading: loading,
    error,
  } = usePreferencesQuery();

  // Mutation hook
  const updatePreferencesMutation = useUpdatePreferencesMutation();

  const handleSubmit = async (data: {
    dietaryRestrictions?: string[];
    favoriteCuisines?: string[];
    dislikedIngredients?: string[];
    locationName?: string;
  }) => {
    try {
      await updatePreferencesMutation.mutateAsync(data);
      setSuccessMessage("Đã lưu preferences thành công!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error saving preferences:", err);
      throw err;
    }
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
            Cài đặt
          </h1>
          <p className="text-muted-foreground mt-4 md:mt-6 text-center text-base md:text-lg font-light">
            Quản lý preferences và cài đặt của bạn
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="animate-smooth border-2 border-destructive/30"
        >
          <AlertDescription className="font-medium">
            Không thể tải preferences
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert className="animate-smooth border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <AlertDescription className="font-medium">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Preferences Form */}
      {loading ? (
        <Card className="border-primary/20 bg-gradient-to-br from-card to-muted/10">
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : preferences ? (
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-muted/10 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-copper to-gold" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-gold/10 to-copper/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-sage/10 to-green-600/10 rounded-full blur-2xl" />

          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-gold/20 to-copper/20">
                <SettingsIcon className="h-6 w-6 text-gold" />
              </div>
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesForm
              preferences={preferences}
              onSubmit={handleSubmit}
              loading={updatePreferencesMutation.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}
