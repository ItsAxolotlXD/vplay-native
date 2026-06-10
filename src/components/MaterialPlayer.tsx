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
          <div className="absolute inset-0 bg-[#121318]/90 flex flex-col items-center justify-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full border-4 border-white/10" />
              <div className="absolute w-12 h-12 rounded-full border-4 border-transparent border-t-white animate-spin" style={{ animationDuration: "1s" }} />
            </div>
            <div className="text-gray-300 font-medium text-sm text-center px-4">
              Đang kết nối luồng Live TV...
            </div>
            <div className="text-xs text-gray-500 max-w-sm text-center truncate px-6">
              {currentChannel.url}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="absolute inset-0 bg-[#121318]/95 flex flex-col items-center justify-center gap-4 text-center p-6 rounded-none">
            <div className="w-16 h-16 rounded-none bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              {currentChannel.url.endsWith(".png") || currentChannel.url.endsWith(".jpg") ? (
                <Image className="w-8 h-8" />
              ) : (
                <RotateCcw className="w-8 h-8" />
              )}
            </div>
            <div className="max-w-md">
              <h3 className="font-bold text-gray-200 text-base mb-1">
                Lỗi Phóng Phát Luồng
              </h3>
              <p className="text-red-300 text-sm leading-relaxed mb-4">
                {errorMsg}
              </p>
              {currentChannel.url.startsWith("http") && (
                <div className="bg-[#1c1b1f] border border-white/5 rounded-none p-3 flex items-center justify-between gap-3 text-left">
                  <div className="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap flex-grow">
                    Nguồn: {currentChannel.url}
                  </div>
                  <a 
                    href={currentChannel.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1.5 hover:bg-white/10 rounded-none text-gray-300 transition-colors flex-shrink-0"
                    title="Mở nguồn trực tiếp"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className={`px-5 py-2.5 rounded-none text-xs font-medium text-white flex items-center gap-2 transition-all ${activeBgClass()}`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Thử Tải Lại Ứng Dụng
            </button>
          </div>
        )}

        {/* Ambient Channel Name Floating HUD (Only shown if loaded & on hover) */}
        {!errorMsg && !loading && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md rounded-none py-1.5 pl-2 pr-4 border border-white/10">
              <img 
                src={currentChannel.logo} 
                alt="Logo" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-6 h-6 object-contain rounded-none" 
              />
              <div>
                <div className="text-white text-xs font-bold leading-tight truncate max-w-[140px]">
                  {currentChannel.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" /> Trực tiếp • {currentChannel.group}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowStats(!showStats)} 
              className="pointer-events-auto p-2 bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-none text-white transition-colors border border-white/10"
              title="Thông số kỹ thuật"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* HUD control overlap (Minimal Material design) */}
        {!errorMsg && !loading && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-12 pb-4 px-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:opacity-100 transition-all duration-200 flex flex-col gap-3">
            
            {/* Control elements */}
            <div className="flex items-center justify-between gap-4">
              
              {/* Play & Next buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={togglePlay} 
                  className={`p-3 rounded-none text-white transition-all transform hover:scale-105 active:scale-95 ${activeBgClass()}`}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                
                <span className="text-white text-xs px-2 select-none font-medium">
                  Luồng trực tuyến (LIVE)
                </span>
              </div>

              {/* Volume & Aspect Ratio & Fullscreen Right aligned controls */}
              <div className="flex items-center gap-3">
                
                {/* Volume slider control */}
                <div className="flex items-center gap-2 bg-black/40 rounded-none px-3 py-1.5 text-white/80 border border-white/5">
                  <button onClick={toggleMute} className="hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={isMuted ? 0 : volume} 
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 accent-current rounded-none appearance-none cursor-pointer"
                    style={{ color: "inherit" }}
                  />
                </div>

                {/* Scaling options (Aspect ratio helper) */}
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-black/60 hover:bg-black/80 border border-white/10 text-white text-[11px] rounded-none px-3 py-1.5 focus:outline-none cursor-pointer"
                  title="Tỉ lệ khung hình"
                >
                  <option value="contain">Contain (Thường)</option>
                  <option value="cover">Crop (Tràn viền)</option>
                  <option value="fill">Fill (Kéo dãn)</option>
                  <option value="16/9">16 : 9</option>
                </select>

                {/* PIP Option */}
                <button 
                  onClick={triggerPip} 
                  className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-none text-white transition-colors"
                  title="Thu nhỏ nổi (PiP)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>

                {/* Fullscreen Button */}
                <button 
                  onClick={toggleFullscreen} 
                  className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-none text-white transition-colors"
                  title="Toàn màn hình"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>

              </div>

            </div>

          </div>
        )}
      </div>

      {/* Tech stats Overlay - highly aesthetic & technical for live TV testing */}
      {showStats && (
        <div className={`text-xs bg-[#1f1f23] p-4 rounded-none border ${activeAccentBorder()} flex flex-col gap-2 font-mono text-gray-300`}>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-gray-200">
              <Sparkles className={`w-3.5 h-3.5 ${activeTextClass()}`} /> Chẩn Đoán Kỹ Thuật (Vplay Native Live Status)
            </span>
            <button 
              onClick={() => setShowStats(false)} 
              className="text-gray-400 hover:text-white px-2 py-0.5 bg-white/5 rounded"
            >
              Đóng
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Độ phân giải:</span>
              <span className="text-gray-300 font-semibold">{stats.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Băng thông:</span>
              <span className="text-gray-300 font-semibold">{stats.bitrate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Khung hình (FPS):</span>
              <span className="text-gray-300 font-semibold">{stats.fps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bộ tạo luồng:</span>
              <span className={`font-semibold ${activeTextClass()}`}>{stats.engine}</span>
            </div>
            <div className="flex justify-between col-span-2 border-t border-white/5 pt-2">
              <span className="text-gray-500">Mã luồng m3u8:</span>
              <span className="text-[10px] text-gray-400 select-all truncate max-w-[280px]" title={currentChannel.url}>
                {currentChannel.url}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
