import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-sm">
      <div className="p-6">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            onClick={togglePlayPause}
            className="w-14 h-14 rounded-sm flex-shrink-0 border-border hover:bg-white/5"
            data-testid="audio-play-pause-button"
          >
            {isPlaying ? <Pause className="w-6 h-6 text-foreground" /> : <Play className="w-6 h-6 text-foreground" />}
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-small font-mono text-muted-foreground" data-testid="audio-guide-label">
                AUDIO GUIDE
              </span>
              <span className="text-small font-mono text-muted-foreground" data-testid="audio-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="h-1 bg-background relative w-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-linear" 
                style={{ width: `${progressPercentage}%` }}
                data-testid="audio-progress-bar"
              />
            </div>
          </div>
        </div>
        
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
    </div>
  );
}
