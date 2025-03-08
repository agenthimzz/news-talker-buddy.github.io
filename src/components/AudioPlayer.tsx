
import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  currentArticleTitle?: string;
  availableVoices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  currentRate: number;
  currentPitch: number;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onRateChange: (rate: number) => void;
  onPitchChange: (pitch: number) => void;
}

const AudioPlayer = ({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onStop,
  currentArticleTitle,
  availableVoices,
  currentVoice,
  currentRate,
  currentPitch,
  onVoiceChange,
  onRateChange,
  onPitchChange
}: AudioPlayerProps) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const previousVolume = useRef(volume);
  
  // Control visibility of player
  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
    } else {
      // Delay hiding the player to allow for animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current);
      setIsMuted(false);
    } else {
      previousVolume.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-border/50 transition-all duration-300 ease-in-out",
          isPlaying ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-sm font-medium truncate">
              {currentArticleTitle || "Now playing"}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentVoice?.name || "Default voice"}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={isPaused ? onPlay : onPause}
              className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
            
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <div className="w-24">
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    const newVolume = value[0] / 100;
                    setVolume(newVolume);
                    setIsMuted(newVolume === 0);
                  }}
                  className="cursor-pointer"
                  aria-label="Volume control"
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Voice settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onStop}
              className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Stop playback"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Settings</DialogTitle>
            <DialogDescription>
              Customize the voice, speed, and pitch of the text-to-speech playback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select">Voice</Label>
              <Select
                value={currentVoice?.name}
                onValueChange={(value) => {
                  const voice = availableVoices.find(v => v.name === value);
                  if (voice) onVoiceChange(voice);
                }}
              >
                <SelectTrigger id="voice-select">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={`${voice.name}-${voice.lang}`} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rate-slider">Rate: {currentRate.toFixed(1)}x</Label>
              </div>
              <Slider
                id="rate-slider"
                value={[currentRate * 10]}
                min={5}
                max={20}
                step={1}
                onValueChange={(value) => onRateChange(value[0] / 10)}
                className="cursor-pointer"
                aria-label="Speech rate"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch-slider">Pitch: {currentPitch.toFixed(1)}</Label>
              </div>
              <Slider
                id="pitch-slider"
                value={[currentPitch * 10]}
                min={5}
                max={20}
                step={1}
                onValueChange={(value) => onPitchChange(value[0] / 10)}
                className="cursor-pointer"
                aria-label="Speech pitch"
              />
            </div>
          </div>
          
          <DialogClose asChild>
            <Button type="button" variant="default">
              Save Changes
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AudioPlayer;
