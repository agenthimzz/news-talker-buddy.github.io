
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ExternalLink, Bookmark, BookmarkCheck, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NewsArticle } from '@/services/newsService';

interface NewsCardProps {
  article: NewsArticle;
  isSpeaking: boolean;
  onReadArticle: (article: NewsArticle) => void;
  onSaveArticle?: (article: NewsArticle) => void;
  isSaved?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'technology':
      return 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300';
    case 'business':
      return 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300';
    case 'entertainment':
      return 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300';
    case 'sports':
      return 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300';
    case 'science':
      return 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300';
    case 'health':
      return 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950 dark:text-green-300';
    default:
      return 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
  }
};

const NewsCard = ({ article, isSpeaking, onReadArticle, onSaveArticle, isSaved = false }: NewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Check if image is already cached
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);
  
  return (
    <Card 
      className={cn(
        'overflow-hidden border border-border/40 h-full transition-all duration-300',
        'hover:shadow-lg hover:border-primary/20 hover:translate-y-[-2px]',
        isHovered ? 'scale-[1.01]' : 'scale-100'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
            <span className="text-muted-foreground">Loading</span>
          </div>
        )}
        <img
          ref={imageRef}
          src={article.image}
          alt={article.title}
          className={cn(
            'w-full h-full object-cover transition-all duration-700',
            imageLoaded ? 'opacity-100' : 'opacity-0',
            isHovered ? 'scale-[1.05]' : 'scale-100'
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={cn("font-medium capitalize", getCategoryColor(article.category))}
          >
            {article.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 flex flex-col space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.source.name}</span>
            </div>
          </div>
        </div>
        
        <div>
          <Link to={`/article/${article.id}`}>
            <h3 className="font-semibold text-lg leading-tight transition-colors duration-200 hover:text-primary mb-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center space-x-1 hover:bg-primary/10 transition-colors"
            onClick={() => onReadArticle(article)}
          >
            {isSpeaking ? (
              <Pause className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Play className="h-3.5 w-3.5 mr-1" />
            )}
            <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
          </Button>
          
          <div className="flex space-x-1">
            {onSaveArticle && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center space-x-1 hover:bg-primary/10 transition-colors"
                onClick={() => onSaveArticle(article)}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-3.5 w-3.5 mr-1 text-primary" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5 mr-1" />
                )}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="text-xs flex items-center space-x-1 hover:bg-primary/10 transition-colors"
            >
              <Link to={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                <span>Source</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
