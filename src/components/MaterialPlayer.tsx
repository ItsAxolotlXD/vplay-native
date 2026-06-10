import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Info, 
  Tv, 
  Radio,
  Image,
  Sparkles,
  ExternalLink,
  Smartphone
} from "lucide-react";
import { Channel } from "../channelsData";

interface MaterialPlayerProps {
  currentChannel: Channel;
  themeColor: string;
}

export default function MaterialPlayer({ currentChannel, themeColor }: MaterialPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("vplay-volume");
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"fill" | "contain" | "cover" | "16/9">("contain");
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    resolution: "Calculating...",
    bitrate: "0 kbps",
    fps: "30",
    engine: "Native HTML5",
    latency: "0s"
  });

  // Track state of current stream & load source
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset player state
    setLoading(true);
    setErrorMsg(null);
    setIsPlaying(false);

    // Filter out obvious visual/static files or mock links
    if (currentChannel.url.endsWith(".png") || currentChannel.url.endsWith(".jpg") || !currentChannel.url.startsWith("http")) {
      setLoading(false);
      setErrorMsg("Kênh này không cung cấp luồng phát m3u8 hợp lệ (Liên kết tĩnh/Hình ảnh hoặc luồng đã ngoại tuyến).");
      return;
    }

    // Clean previous HLS reference
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Test for standard HLS stream or hls.js decoder
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsRef.current = hls;
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Auto play might be blocked by browser on first load
            setIsPlaying(false);
          });
      });

      hls.on(Hls.Events.FRAG_CHANGED, (_, data) => {
        const quality = (hls.levels[hls.currentLevel] || {}) as any;
        const width = quality.width || "720";
        const height = quality.height || "480";
        const bitrate = quality.bitrate ? `${Math.round(quality.bitrate / 1000)} kbps` : "Auto";
        setStats({
          resolution: `${width}x${height}px`,
          bitrate,
          fps: "30",
          engine: "Hls.js Engine",
          latency: `${(data.frag.start + data.frag.duration).toFixed(1)}s`
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn("HLS Error:", data);
          setLoading(false);
          setErrorMsg("Không thể tải nguồn phát. Luồng truyền hình có thể đang ngoại tuyến hoặc bị giới hạn quốc gia.");
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari support
      video.src = currentChannel.url;
      video.addEventListener("canplay", () => {
        setLoading(false);
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      });
      video.addEventListener("error", () => {
        setLoading(false);
        setErrorMsg("Thiết bị không hỗ trợ phát luồng m3u8 trực tiếp.");
      });
    } else {
      setLoading(false);
      setErrorMsg("Trình duyệt của bạn không hỗ trợ định dạng Live Stream HLS (.m3u8).");
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentChannel]);

  // Sync volume state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || loading || errorMsg) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    localStorage.setItem("vplay-volume", val.toString());
    if (val > 0) setIsMuted(false);
  };

  const toggleFullscreen = () => {
    const playerContainer = document.getElementById("vplay-player-viewport");
    if (!playerContainer) return;

    if (!isFullscreen) {
      if (playerContainer.requestFullscreen) {
        playerContainer.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const triggerPip = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video !== document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (e) {
      console.warn("PiP not supported or failed", e);
    }
  };

  // Helper theme backgrounds
  const activeBgClass = () => {
    switch(themeColor) {
      case "emerald": return "bg-[#386a20] hover:bg-[#467d2d]";
      case "ocean": return "bg-[#0961a4] hover:bg-[#1272be]";
      case "amber": return "bg-[#b16a00] hover:bg-[#d07e05]";
      case "charcoal": return "bg-[#60616b] hover:bg-[#71727c]";
      default: return "bg-[#6750a4] hover:bg-[#7b62bf]"; // Purple default
    }
  };

  const activeTextClass = () => {
    switch(themeColor) {
      case "emerald": return "text-[#62c036]";
      case "ocean": return "text-[#3da0ff]";
      case "amber": return "text-[#f9b13d]";
      case "charcoal": return "text-[#bfbfc7]";
      default: return "text-[#d0bcff]";
    }
  };

  const activeAccentBorder = () => {
    switch(themeColor) {
      case "emerald": return "border-emerald-500/20";
      case "ocean": return "border-blue-500/20";
      case "amber": return "border-amber-500/20";
      case "charcoal": return "border-slate-500/20";
      default: return "border-purple-500/20";
    }
  };

  return (
    <div className="relative flex flex-col gap-3 w-full">
      {/* Player Frame Viewport */}
      <div 
        id="vplay-player-viewport" 
        className="relative group w-full bg-[#1c1b1f] aspect-video overflow-hidden rounded-none shadow-xl border border-white/5 flex items-center justify-center"
      >
        {/* Dynamic Aspect Ratio Setup */}
        <video
          ref={videoRef}
          onClick={togglePlay}
          referrerPolicy="no-referrer"
          className="w-full h-full cursor-pointer transition-all duration-200"
          style={{
            objectFit: aspectRatio === "16/9" ? "fill" : aspectRatio,
            aspectRatio: aspectRatio === "16/9" ? "16/9" : "auto"
          }}
          playsInline
        />

        {/* Video Overlays (Loading & Error States) */}
        {loading && (
          <div className="absolute inset-0 bg-[#121212] flex items-center justify-center font-roboto">
            <div className="text-gray-300 text-sm font-medium tracking-wide">
              Loading stream.
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="absolute inset-0 bg-[#121212] flex items-center justify-center font-roboto">
            <div className="text-gray-300 text-sm font-medium tracking-wide">
              Playback error.
            </div>
          </div>
        )}

        {/* Centered Play/Pause Button - ONLY control kept in player */}
        {!errorMsg && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }} 
              className={`pointer-events-auto p-4 rounded-none text-white transition-all transform hover:scale-110 active:scale-95 shadow-lg ${activeBgClass()}`}
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current stroke-none" />
              ) : (
                <Play className="w-6 h-6 fill-current stroke-none ml-0.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
