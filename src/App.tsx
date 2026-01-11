import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Recommendations } from './pages/Recommendations';
import { Settings } from './pages/Settings';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Grain Overlay for texture */}
        <div className="grain-overlay" />
        <Header />
        <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <MobileNav />
        <Toaster />
      </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
