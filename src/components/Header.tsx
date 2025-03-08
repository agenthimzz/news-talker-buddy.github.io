
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, MicOff, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  onOpenSettings: () => void;
}

const Header = ({ isSpeaking, onToggleSpeech, onOpenSettings }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4 md:px-10',
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-foreground transition-transform duration-300 hover:scale-105"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">N</span>
          </div>
          <span className="font-semibold text-xl">NewsVoice</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-all duration-200 hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-foreground/80"
            )}
          >
            Home
          </Link>
          <Link 
            to="/categories" 
            className={cn(
              "text-sm font-medium transition-all duration-200 hover:text-primary",
              location.pathname.includes("/categories") ? "text-primary" : "text-foreground/80"
            )}
          >
            Categories
          </Link>
          <Link 
            to="/saved" 
            className={cn(
              "text-sm font-medium transition-all duration-200 hover:text-primary",
              location.pathname === "/saved" ? "text-primary" : "text-foreground/80"
            )}
          >
            Saved
          </Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSpeech}
            className="transition-all duration-300 hover:bg-primary/10"
            aria-label={isSpeaking ? "Stop speaking" : "Start speaking"}
          >
            {isSpeaking ? (
              <MicOff className="h-5 w-5 text-destructive" />
            ) : (
              <Mic className="h-5 w-5 text-primary" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="transition-all duration-300 hover:bg-primary/10"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-all duration-300 hover:bg-primary/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background">
          <nav className="flex flex-col p-6 space-y-6 animate-fade-in">
            <Link 
              to="/" 
              className={cn(
                "text-lg font-medium transition-all duration-200",
                location.pathname === "/" ? "text-primary" : "text-foreground/80"
              )}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={cn(
                "text-lg font-medium transition-all duration-200",
                location.pathname.includes("/categories") ? "text-primary" : "text-foreground/80"
              )}
            >
              Categories
            </Link>
            <Link 
              to="/saved" 
              className={cn(
                "text-lg font-medium transition-all duration-200",
                location.pathname === "/saved" ? "text-primary" : "text-foreground/80"
              )}
            >
              Saved
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
