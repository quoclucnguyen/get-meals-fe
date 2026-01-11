import { Cloud, Sun, CloudRain, CloudDrizzle, Snowflake, Droplets } from "lucide-react";
import { useWeatherQuery } from "@/hooks/useWeather";
import { Card, CardContent } from "@/components/ui/card";

export function WeatherWidget() {
  const { data: weather, isLoading, error } = useWeatherQuery();

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-10 w-10" />;

    const condition = weather.condition.toLowerCase();
    if (condition.includes("rain") || condition.includes("mưa")) {
      return <CloudRain className="h-10 w-10" />;
    }
    if (condition.includes("drizzle") || condition.includes("mưa nhỏ")) {
      return <CloudDrizzle className="h-10 w-10" />;
    }
    if (condition.includes("snow") || condition.includes("tuyết")) {
      return <Snowflake className="h-10 w-10" />;
    }
    if (condition.includes("sun") || condition.includes("nắng")) {
      return <Sun className="h-10 w-10 text-gold" />;
    }
    return <Cloud className="h-10 w-10" />;
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-copper to-gold" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-primary/20" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-24 animate-pulse bg-primary/20 rounded" />
              <div className="h-4 w-32 animate-pulse bg-primary/10 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return null;
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-muted/10 transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-copper to-gold" />
      
      {/* Decorative Background Elements */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-gold/10 to-copper/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-sage/10 to-green-600/10 rounded-full blur-2xl" />
      
      <CardContent className="relative p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-copper/20 rounded-2xl blur-lg" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-muted/20 border border-primary/20">
              {getWeatherIcon()}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold text-gradient-gold">
                {Math.round(weather.temp)}°C
              </span>
            </div>
            <p className="text-base text-muted-foreground font-medium mt-1">
              {weather.condition}
            </p>
          </div>
          
          <div className="text-right space-y-1.5">
            <p className="text-sm font-semibold text-foreground flex items-center justify-end gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-gold to-copper" />
              {weather.location}
            </p>
            <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
              <Droplets className="h-3.5 w-3.5 text-sage" />
              <span className="font-medium">Độ ẩm: {weather.humidity}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
