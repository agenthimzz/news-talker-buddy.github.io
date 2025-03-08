import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Header from '@/components/Header';
import NewsFeed from '@/components/NewsFeed';
import AudioPlayer from '@/components/AudioPlayer';
import useTTS from '@/hooks/useTTS';
import { NewsArticle } from '@/services/newsService';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  
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
  
  // Check if it's the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedNewsVoice');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisitedNewsVoice', 'true');
    }
  }, []);
  
  const handleArticleSelect = (article: NewsArticle) => {
    // If this is the currently playing article, toggle pause
    if (currentArticle?.id === article.id && isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
      return;
    }
    
    // Otherwise, start a new article
    setCurrentArticle(article);
    const textToRead = `${article.title}. ${article.description}`;
    speak(textToRead);
  };
  
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stop();
      setCurrentArticle(null);
    } else if (currentArticle) {
      const textToRead = `${currentArticle.title}. ${currentArticle.description}`;
      speak(textToRead);
    }
  };
  
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };
  
  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };
  
  return (
    <div className="min-h-screen pb-20">
      <Header 
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        onOpenSettings={handleOpenSettings}
      />
      
      <main className="container max-w-7xl mx-auto px-4 pt-24 animate-fade-in">
        <section className="mb-16">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Your News, <span className="text-primary">Your Voice</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Stay informed with the latest news, read aloud to you in a natural voice.
            </p>
          </div>
          
          <NewsFeed 
            onArticleSelect={handleArticleSelect}
            currentSpeakingArticleId={currentArticle?.id}
          />
        </section>
      </main>
      
      <AudioPlayer
        isPlaying={isSpeaking}
        isPaused={isPaused}
        onPlay={resume}
        onPause={pause}
        onStop={stop}
        currentArticleTitle={currentArticle?.title}
        availableVoices={availableVoices}
        currentVoice={currentVoice}
        currentRate={currentRate}
        currentPitch={currentPitch}
        onVoiceChange={setVoice}
        onRateChange={setRate}
        onPitchChange={setPitch}
      />
      
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Settings</DialogTitle>
            <DialogDescription>
              Customize the voice, speed, and pitch of the text-to-speech playback.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to NewsVoice</DialogTitle>
            <DialogDescription>
              Your personal news reader with text-to-speech capabilities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              NewsVoice brings you the latest news, read aloud in a natural voice. Simply click on any article to have it read to you.
            </p>
            <p>
              You can customize the voice, speed, and pitch in the settings, and save articles for later.
            </p>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleWelcomeClose}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
