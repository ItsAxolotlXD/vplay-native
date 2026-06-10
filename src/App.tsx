import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Tv, 
  Menu, 
  Smartphone, 
  Info, 
  ListPlus, 
  Radio, 
  Sparkles, 
  X, 
  Volume2, 
  Plus, 
  Check, 
  Bookmark,
  RefreshCw,
  HelpCircle,
  Clock
} from "lucide-react";
import { CHANNELS_DATA, Channel } from "./channelsData";
import MaterialPlayer from "./components/MaterialPlayer";
import ChannelList from "./components/ChannelList";
import ThemePicker from "./components/ThemePicker";

export default function App() {
  // Load favorites from local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vplay-favorites");
      return saved ? JSON.parse(saved) : ["vtv1-hd", "vtv3-hd", "kplus-sport-1-hd"];
    } catch {
      return ["vtv1-hd", "vtv3-hd", "kplus-sport-1-hd"];
    }
  });

  // Load custom channels from local storage
  const [customChannels, setCustomChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem("vplay-custom-channels");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active theme accent (lavender, emerald, ocean, amber, charcoal)
  const [themeColor, setThemeColor] = useState<string>(() => {
    return localStorage.getItem("vplay-theme") || "lavender";
  });

  // All channels data (static list + user's custom streams)
  const allChannels = [...CHANNELS_DATA, ...customChannels];

  // Active playing channel
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    return allChannels[0];
  });

  // Show custom stream sheet
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChanName, setNewChanName] = useState("");
  const [newChanUrl, setNewChanUrl] = useState("");
  const [newChanLogo, setNewChanLogo] = useState("");
  const [newChanGroup, setNewChanGroup] = useState("Địa phương");

  // Show App Help/Info dialog
  const [showHelp, setShowHelp] = useState(false);

  // Success indicator for custom channel adding
  const [addSuccess, setAddSuccess] = useState(false);

  // Clock state for TV App top bar
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const offset = 7; // Ho Chi Minh time zone (UTC+7)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const tzDate = new Date(utc + (3600000 * offset));
      
      const hours = String(tzDate.getHours()).padStart(2, "0");
      const mins = String(tzDate.getMinutes()).padStart(2, "0");
      const secs = String(tzDate.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${mins}:${secs}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vplay-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save custom channels to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vplay-custom-channels", JSON.stringify(customChannels));
  }, [customChannels]);

  // Save active theme
  useEffect(() => {
    localStorage.setItem("vplay-theme", themeColor);
  }, [themeColor]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Select channel
  const handleSelectChannel = (channel: Channel) => {
    setCurrentChannel(channel);
    // Smooth scroll top on mobile layout
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add a new custom m3u8 channel
  const handleAddCustomChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName.trim() || !newChanUrl.trim()) return;

    const newId = `custom-${Date.now()}`;
    const cleanLogoUrl = newChanLogo.trim() || "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";

    const newChan: Channel = {
      id: newId,
      name: newChanName.trim(),
      url: newChanUrl.trim(),
      logo: cleanLogoUrl,
      group: newChanGroup
    };

    const updated = [...customChannels, newChan];
    setCustomChannels(updated);
    
    // Auto select the newly added channel
    setCurrentChannel(newChan);

    // Reset Form state
    setNewChanName("");
    setNewChanUrl("");
    setNewChanLogo("");
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  // Delete all custom channels input
  const handleClearCustomChannels = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả các luồng kênh tự thêm không?")) {
      setCustomChannels([]);
      setCurrentChannel(CHANNELS_DATA[0]);
    }
  };

  // Dynamic color palette generator based on theme selection
  const getThemeColors = () => {
    switch (themeColor) {
      case "emerald":
        return {
          bgPrimary: "bg-[#11140e]",
          textPrimary: "text-[#e2e3db]",
          accentPill: "bg-[#386a20]",
          accentText: "text-[#62c036]",
          badgeActive: "bg-[#386a20] text-emerald-100",
          accentBorder: "border-emerald-500/15",
          accentShadow: "shadow-emerald-950/20",
          cardActiveBg: "bg-[#1f231b]"
        };
      case "ocean":
        return {
          bgPrimary: "bg-[#0b131c]",
          textPrimary: "text-[#e1e2ec]",
          accentPill: "bg-[#0961a4]",
          accentText: "text-[#3da0ff]",
          badgeActive: "bg-[#0961a4] text-blue-100",
          accentBorder: "border-blue-500/15",
          accentShadow: "shadow-blue-950/20",
          cardActiveBg: "bg-[#17212e]"
        };
      case "amber":
        return {
          bgPrimary: "bg-[#18120b]",
          textPrimary: "text-[#ece0d5]",
          accentPill: "bg-[#b16a00]",
          accentText: "text-[#f9b13d]",
          badgeActive: "bg-[#b16a00] text-amber-100",
          accentBorder: "border-amber-500/15",
          accentShadow: "shadow-amber-950/20",
          cardActiveBg: "bg-[#251b11]"
        };
      case "charcoal":
        return {
          bgPrimary: "bg-[#141416]",
          textPrimary: "text-[#e5e5e8]",
          accentPill: "bg-[#60616b]",
          accentText: "text-[#bfbfc7]",
          badgeActive: "bg-[#60616b] text-gray-100",
          accentBorder: "border-slate-500/15",
          accentShadow: "shadow-slate-900/20",
          cardActiveBg: "bg-[#202023]"
        };
      default: // lavender (Android 14 standard)
        return {
          bgPrimary: "bg-[#121318]", // deep midnight violet
          textPrimary: "text-[#e2e2e9]",
          accentPill: "bg-[#4f378b]",
          accentText: "text-[#d0bcff]",
          badgeActive: "bg-[#4f378b] text-[#e6e1e6]",
          accentBorder: "border-purple-500/15",
          accentShadow: "shadow-purple-950/20",
          cardActiveBg: "bg-[#232129]"
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className={`min-h-screen ${colors.bgPrimary} ${colors.textPrimary} transition-colors duration-300 pb-12 font-sans`}>
      
      {/* Native-like Android Navigation Bar / Header */}
      <header className="sticky top-0 z-40 bg-black/60 shadow-lg backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & App Info */}
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full ${colors.accentPill} flex items-center justify-center text-white shadow-md ${colors.accentShadow}`}>
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-base tracking-tight text-white">Vplay Native</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest bg-white/10 ${colors.accentText}`}>
                  BASE-M3
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5 font-medium">
                Android Material TV Player
              </span>
            </div>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Clock Widget */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-[11px] font-mono font-medium text-gray-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeStr || "14:00:00"}</span>
              <span className="text-emerald-500 font-bold">• ICT (VN)</span>
            </div>

            {/* Custom stream adding modal switch */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`p-2 rounded-full hover:bg-white/10 text-gray-300 transition-colors cursor-pointer relative`}
              title="Thêm luồng m3u8 tự chọn"
              id="btn-add-stream"
            >
              <ListPlus className="w-5 h-5" />
              {customChannels.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Help / Information banner toggle */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-350 transition-colors cursor-pointer text-gray-400"
              title="Hướng dẫn sử dụng"
              id="btn-help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Player & Diagnostic Panels (Cols span 7 on large layout) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Active play information banner (Material M3 pill style) */}
          <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-3xl p-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 p-1 flex items-center justify-center flex-shrink-0">
                <img 
                  src={currentChannel.logo} 
                  alt={currentChannel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white leading-tight truncate">
                    {currentChannel.name}
                  </h2>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${colors.badgeActive}`}>
                    {currentChannel.group}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Đang phát từ nguồn liên kết m3u8
                </p>
              </div>
            </div>

            {/* Favoriting button */}
            <button
              onClick={() => handleToggleFavorite(currentChannel.id)}
              className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-full border border-white/5 text-gray-300 hover:text-rose-400"
              title="Thêm vào danh sách yêu thích"
              id="btn-toggle-favorite-banner"
            >
              <Heart className={`w-5 h-5 ${favorites.includes(currentChannel.id) ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          {/* Actual live-TV streamer module */}
          <MaterialPlayer 
            currentChannel={currentChannel} 
            themeColor={themeColor} 
          />

          {/* Help & setup banner info */}
          {showHelp && (
            <div className="relative bg-[#1c1b1f] border border-blue-500/15 p-5 rounded-3xl text-sm leading-relaxed text-gray-300">
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5 text-blue-400">
                <Info className="w-4 h-4" /> Hướng Dẫn Kỹ Thuật "Vplay Native"
              </h3>
              <ul className="list-disc pl-5 mt-1 text-xs text-gray-400 space-y-1.5">
                <li>Ứng dụng phát trực tuyến luồng HLS (.m3u8) tối ưu hóa của Việt Nam thông qua <span className="text-white">hls.js</span>.</li>
                <li>Hầu hết các kênh VTV, HTV, VTC và các đài Địa phương đều tải trực tiếp từ m3u8 chất lượng cao gốc Việt Nam.</li>
                <li><span className="text-white font-bold">Lưu ý Kênh VTV6 HD:</span> Nguồn trong play gốc cung cấp hình ảnh tĩnh. Ứng dụng đã xử lý lỗi tải để ngăn không làm đơ trình duyệt.</li>
                <li>Sử dụng chức năng chọn <span className="text-white font-semibold">Tỉ lệ hình ảnh</span> (Crop, Tràn viền, Kéo dãn) để tối ưu hiển thị phù hợp với thiết bị của bạn.</li>
                <li>Nhấn nút hình điện thoại <Smartphone className="inline w-3 h-3 mx-1" /> để bật chế độ <span className="text-white">Ảnh trong Ảnh (Picture-in-Picture)</span> tiếp tục xem TV khi chuyển sang tab khác.</li>
              </ul>
            </div>
          )}

          {/* Theme Dynamic picker inside left column */}
          <ThemePicker 
            activeTheme={themeColor} 
            onChangeTheme={(colorId) => setThemeColor(colorId)} 
          />

          {/* Custom channel addition sheet form */}
          {showAddForm && (
            <div className="bg-[#1f1f23] p-5 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ListPlus className={`w-4 h-4 ${colors.accentText}`} /> Thêm Luồng Kênh M3U8 Tự Chọn
                </h3>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCustomChannel} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-400 font-semibold uppercase">Tên Kênh Truyền Hình *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ví dụ: VTV3 SD, Kênh Phim Mỹ,..." 
                    value={newChanName}
                    onChange={(e) => setNewChanName(e.target.value)}
                    className="bg-[#121318] py-2 px-3.5 rounded-xl text-xs text-white focus:outline-none border border-white/5 focus:border-white/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-400 font-semibold uppercase font-mono">Đường Dẫn Liên Kết M3U8 (Live HLS Source) *</label>
                  <input 
                    type="url" 
                    required
                    placeholder="https://example.com/playlist/chunklist.m3u8" 
                    value={newChanUrl}
                    onChange={(e) => setNewChanUrl(e.target.value)}
                    className="bg-[#121318] py-2 px-3.5 rounded-xl text-xs text-white focus:outline-none border border-white/5 focus:border-white/20 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-400 font-semibold uppercase">Đường Dẫn Biểu Tượng Logo (Ảnh PNG/JPG tùy chọn)</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/logo.png" 
                    value={newChanLogo}
                    onChange={(e) => setNewChanLogo(e.target.value)}
                    className="bg-[#121318] py-2 px-3.5 rounded-xl text-xs text-white focus:outline-none border border-white/5 focus:border-white/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-400 font-semibold uppercase">Nhóm Phân Loại (Group-Title)</label>
                  <select
                    value={newChanGroup}
                    onChange={(e) => setNewChanGroup(e.target.value)}
                    className="bg-[#121318] py-2 px-3 px-3.5 rounded-xl text-xs text-white focus:outline-none border border-white/5 focus:border-white/20 cursor-pointer"
                  >
                    <option value="VTV">Phân Khúc VTV</option>
                    <option value="K+">Thể Thao & K+</option>
                    <option value="VTC">Truyền Hình VTC</option>
                    <option value="HTV">Tổng Hợp HTV</option>
                    <option value="VTVcab">Dịch Vụ VTVcab</option>
                    <option value="Địa phương">Kênh Đài Địa phương</option>
                    <option value="Thiết yếu">Kênh Thiết yếu, ANTV, QPVN</option>
                    <option value="Phát thanh">Kênh Đài Phát thanh / Radio</option>
                  </select>
                </div>

                {addSuccess ? (
                  <div className="bg-emerald-950/40 text-emerald-400 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Thêm kênh thành công! Đang tải luồng...
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end mt-2">
                    {customChannels.length > 0 && (
                      <button 
                        type="button"
                        onClick={handleClearCustomChannels}
                        className="py-2.5 px-4 rounded-full text-xs font-semibold bg-red-950/40 text-red-300 border border-red-500/10 hover:bg-red-900/30 transition-colors cursor-pointer"
                      >
                        Xóa Kênh Đã Thêm
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`py-2.5 px-5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer ${colors.accentPill}`}
                    >
                      Xác Nhận Thêm
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Interactive Channels list database sidebar (Cols span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#1f1f23] p-5 rounded-3xl border border-white/5 flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Bookmark className={`w-4 h-4 ${colors.accentText}`} /> Danh Sách Truyền Hình
                </h3>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Chọn kênh từ {allChannels.length} nguồn có sẵn bên dưới
                </span>
              </div>

              {/* Reset playback button */}
              <button 
                onClick={() => {
                  setCurrentChannel(allChannels[0]);
                }}
                className="p-1.5 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                title="Khởi động lại kênh mặc định"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* List selector module */}
            <ChannelList
              channels={allChannels}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              currentChannel={currentChannel}
              onSelectChannel={handleSelectChannel}
              themeColor={themeColor}
            />

          </div>
        </div>

      </main>

      {/* Humble, clean Footer in accordance with design principles */}
      <footer className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-500 font-medium">
          Vplay Native © 2026 • Giao diện Thiết kế Android Material 3 và Roboto.
        </p>
        <p className="text-[9px] text-gray-600 font-mono mt-1">
          Ứng dụng khách phát IPTV tĩnh. Toàn bộ tài nguyên video được liên kết công khai qua internet.
        </p>
      </footer>
    </div>
  );
}
