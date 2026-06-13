import React, { useEffect, useRef, useState } from 'react';
import { extractYouTubeId } from '../lib/utils';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface YouTubePlayerProps {
  urlOrId: string;
  fallbackQuery?: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function YouTubePlayer({ urlOrId, fallbackQuery }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState(false);
  const videoId = extractYouTubeId(urlOrId);

  useEffect(() => {
    if (!videoId) {
      setError(true);
      return;
    }

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      if (!containerRef.current) return;

      try {
        // Destroy existing player if it exists
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {
            console.warn('Error destroying YT player:', e);
          }
          playerRef.current = null;
        }

        // Create a dedicated inner element for YouTube to replace
        // This prevents YT from replacing the ref'd container itself which confuses React
        const playerDiv = document.createElement('div');
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(playerDiv);

        playerRef.current = new window.YT.Player(playerDiv, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onError: (event: any) => {
              console.error('YouTube Player Error event:', event.data);
              setError(true);
            },
          },
        });
      } catch (err) {
        console.error('Failed to initialize YouTube Player:', err);
        setError(true);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevOnReady) prevOnReady();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  if (error || !videoId) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center p-8 text-center bg-teal-950/20 border-2 border-dashed border-teal-500/30 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-black uppercase tracking-tight mb-2">Unavailable</h3>
        <p className="text-xs opacity-60 max-w-[250px] mb-6">
          🛸 Sorry! This video guide is currently unavailable or has been restricted.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {videoId && (
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-teal-500 transition-colors"
              >
                Watch on YouTube <ExternalLink className="w-3 h-3" />
              </a>
          )}
          {fallbackQuery && (
            <a 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackQuery)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#013E37] text-[10px] font-black uppercase tracking-widest rounded hover:bg-gray-100 transition-colors border-2 border-[#013E37]"
            >
              Search Fallback <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-teal-500/20 bg-black shadow-bento" style={{ position: 'relative' }}>
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
