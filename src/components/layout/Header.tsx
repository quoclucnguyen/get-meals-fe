import { Link, useLocation } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/history', label: 'Lịch sử' },
  { href: '/recommendations', label: 'Gợi ý' },
  { href: '/settings', label: 'Cài đặt' },
];

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 md:h-20 items-center px-4 md:px-8">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-copper text-white shadow-lg shadow-gold/30 transition-transform group-hover:scale-105">
            <Utensils className="h-5 w-5" />
          </div>
          <span className="hidden font-bold sm:inline-block text-gradient-gold text-xl tracking-tight">
            Smart Meal
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 md:space-x-2 ml-8">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-md ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-gold/10 to-copper/10 text-foreground font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
