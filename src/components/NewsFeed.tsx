import { useState, useEffect } from 'react';
import { NewsArticle, NewsCategory, fetchNews } from '@/services/newsService';
import NewsCard from './NewsCard';
import NewsFilter from './NewsFilter';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NewsFeedProps {
  category?: NewsCategory;
  onArticleSelect: (article: NewsArticle) => void;
  currentSpeakingArticleId?: string;
}

const NewsFeed = ({ 
  category: initialCategory = 'general', 
  onArticleSelect,
  currentSpeakingArticleId 
}: NewsFeedProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [category, setCategory] = useState<NewsCategory>(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  useEffect(() => {
    // Load saved articles from localStorage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  // Load articles when category changes
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      const fetchedArticles = await fetchNews(category);
      setArticles(fetchedArticles);
      setIsLoading(false);
    };
    
    loadArticles();
  }, [category]);

  const handleCategoryChange = (newCategory: NewsCategory) => {
    setCategory(newCategory);
  };

  const handleSaveArticle = (article: NewsArticle) => {
    const newSavedArticles = [...savedArticles];
    
    // Check if already saved, if so remove it
    const index = newSavedArticles.indexOf(article.id);
    if (index !== -1) {
      newSavedArticles.splice(index, 1);
    } else {
      // Otherwise add it
      newSavedArticles.push(article.id);
    }
    
    setSavedArticles(newSavedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(newSavedArticles));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <NewsFilter 
          currentCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            Try changing the category or check back later
          </p>
          <Button 
            onClick={() => setCategory('general')}
            variant="outline"
          >
            View all categories
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              isSpeaking={article.id === currentSpeakingArticleId}
              onReadArticle={onArticleSelect}
              onSaveArticle={handleSaveArticle}
              isSaved={savedArticles.includes(article.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
