
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Calendar, Clock, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchArticleById, NewsArticle } from '@/services/newsService';
import useTTS from '@/hooks/useTTS';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from 'sonner';

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const { 
    speak, 
    stop, 
    pause, 
    resume, 
    isSpeaking, 
    isPaused, 
    availableVoices,
    setVoice,
    setRate,
    setPitch,
    currentVoice,
    currentRate,
    currentPitch
  } = useTTS();
  
  // Fetch article data
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const fetchedArticle = await fetchArticleById(id);
      setArticle(fetchedArticle);
      setIsLoading(false);
    };
    
    loadArticle();
    
    // Cleanup - stop speaking when leaving the page
    return () => {
      stop();
    };
  }, [id, stop]);
  
  // Check if article is saved
  useEffect(() => {
    const savedArticlesStr = localStorage.getItem('savedArticles');
    if (savedArticlesStr && id) {
      const savedArticles = JSON.parse(savedArticlesStr);
      setIsSaved(savedArticles.includes(id));
    }
  }, [id]);
  
  const handlePlayPause = () => {
    if (!article) return;
    
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      const textToRead = `${article.title}. ${article.content}`;
      speak(textToRead);
    }
  };
  
  const handleSaveArticle = () => {
    if (!article) return;
    
    const savedArticlesStr = localStorage.getItem('savedArticles');
    let savedArticles: string[] = [];
    
    if (savedArticlesStr) {
      savedArticles = JSON.parse(savedArticlesStr);
    }
    
    if (isSaved) {
      // Remove from saved
      const index = savedArticles.indexOf(article.id);
      if (index !== -1) {
        savedArticles.splice(index, 1);
        toast.success('Article removed from saved');
      }
    } else {
      // Add to saved
      if (!savedArticles.includes(article.id)) {
        savedArticles.push(article.id);
        toast.success('Article saved successfully');
      }
    }
    
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    setIsSaved(!isSaved);
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-24">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-2/3"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-2">Article not found</h2>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 pb-24">
      <article className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="mb-4 -ml-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to articles
            </Link>
          </Button>
          
          <Badge 
            variant="secondary" 
            className={`mb-4 ${getCategoryColor(article.category)}`}
          >
            {article.category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{article.source.name}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePlayPause}
              className="flex items-center"
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="mr-1 h-4 w-4" />
                  Pause reading
                </>
              ) : (
                <>
                  <Play className="mr-1 h-4 w-4" />
                  {isSpeaking && isPaused ? 'Resume reading' : 'Read aloud'}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveArticle}
              className="flex items-center"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="mr-1 h-4 w-4 text-primary" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-1 h-4 w-4" />
                  Save article
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center"
            >
              <Link to={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                View original
              </Link>
            </Button>
          </div>
        </div>
        
        <div 
          className={`relative aspect-[16/9] rounded-lg overflow-hidden mb-8 ${!imageLoaded ? 'bg-muted' : ''}`}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <span className="text-muted-foreground">Loading image...</span>
            </div>
          )}
          <img
            src={article.image}
            alt={article.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div className="prose dark:prose-invert prose-lg max-w-none mb-8">
          <p className="text-xl font-medium text-muted-foreground mb-4">{article.description}</p>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Source: <a 
                href={article.source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {article.source.name}
              </a>
            </p>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveArticle}
              className="text-sm"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="mr-1 h-4 w-4 text-primary" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-1 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </article>
      
      <AudioPlayer
        isPlaying={isSpeaking}
        isPaused={isPaused}
        onPlay={resume}
        onPause={pause}
        onStop={stop}
        currentArticleTitle={article.title}
        availableVoices={availableVoices}
        currentVoice={currentVoice}
        currentRate={currentRate}
        currentPitch={currentPitch}
        onVoiceChange={setVoice}
        onRateChange={setRate}
        onPitchChange={setPitch}
      />
    </div>
  );
};

export default ArticleDetail;
