import { Home, ScrollText, Sparkles, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/history', label: 'Lịch sử', icon: ScrollText },
  { href: '/recommendations', label: 'Gợi ý', icon: Sparkles },
  { href: '/settings', label: 'Cài đặt', icon: Settings },
];

export function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-primary/20 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-18 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 mx-1',
                'active:scale-95',
                isActive(item.href)
                  ? 'bg-gradient-to-t from-gold/20 via-copper/10 to-transparent text-gold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon
                className={cn(
                  'h-5 w-5 mb-1 transition-all duration-300',
                  isActive(item.href) && 'scale-110 drop-shadow-md'
                )}
              />
              <span className={cn(
                'text-[10px] font-semibold transition-all duration-300',
                isActive(item.href) ? 'font-bold' : 'font-medium'
              )}>
                {item.label}
              </span>
              {isActive(item.href) && (
                <div className="w-1 h-1 rounded-full bg-gradient-to-r from-gold to-copper mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
