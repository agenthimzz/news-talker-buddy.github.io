
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface TTSOptions {
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice;
}

interface UseTTSReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
  isSpeaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  currentVoice: SpeechSynthesisVoice | null;
  currentRate: number;
  currentPitch: number;
}

const useTTS = (initialOptions: TTSOptions = {}): UseTTSReturn => {
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentRate, setCurrentRate] = useState(initialOptions.rate || 1);
  const [currentPitch, setCurrentPitch] = useState(initialOptions.pitch || 1);
  
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis and load voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Load available voices
    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice (prefer a natural sounding English voice if available)
      if (!currentVoice && voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Daniel') || 
          voice.name.includes('Samantha') || 
          (voice.lang.includes('en') && voice.localService)
        ) || voices[0];
        
        setCurrentVoice(preferredVoice);
      }
    };
    
    loadVoices();
    
    // Chrome and some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Cleanup
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);
  
  // Initialize with provided options
  useEffect(() => {
    if (initialOptions.voice) setCurrentVoice(initialOptions.voice);
    if (initialOptions.rate) setCurrentRate(initialOptions.rate);
    if (initialOptions.pitch) setCurrentPitch(initialOptions.pitch);
  }, [initialOptions]);
  
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    
    // Stop any current speech
    if (synth.speaking) {
      synth.cancel();
    }
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    if (currentVoice) utterance.voice = currentVoice;
    utterance.rate = currentRate;
    utterance.pitch = currentPitch;
    
    // Add event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      currentUtteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('TTS Error:', event);
      toast.error('Speech synthesis failed. Please try again.');
      setIsSpeaking(false);
      setIsPaused(false);
      currentUtteranceRef.current = null;
    };
    
    // Save reference to current utterance
    currentUtteranceRef.current = utterance;
    
    // Start speaking
    try {
      synth.speak(utterance);
    } catch (error) {
      console.error('Error starting speech:', error);
      toast.error('Failed to start speech. Please try again.');
    }
  };
  
  const stop = () => {
    const synth = window.speechSynthesis;
    
    setIsSpeaking(false);
    setIsPaused(false);
    
    synth.cancel();
    currentUtteranceRef.current = null;
  };
  
  const pause = () => {
    const synth = window.speechSynthesis;
    
    if (synth.speaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    }
  };
  
  const resume = () => {
    const synth = window.speechSynthesis;
    
    if (synth.speaking && isPaused) {
      synth.resume();
      setIsPaused(false);
    }
  };
  
  const setVoice = (voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  };
  
  const setRate = (rate: number) => {
    setCurrentRate(rate);
  };
  
  const setPitch = (pitch: number) => {
    setCurrentPitch(pitch);
  };
  
  return {
    speak,
    stop,
    pause,
    resume,
    isPaused,
    isSpeaking,
    availableVoices,
    setVoice,
    setRate,
    setPitch,
    currentVoice,
    currentRate,
    currentPitch
  };
};

export default useTTS;
