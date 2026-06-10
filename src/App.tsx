import React, { useState, useEffect } from "react";
import { 
  Tv, 
  Smartphone, 
  Info, 
  ListPlus, 
  Radio, 
  X, 
  Check, 
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";
import { CHANNELS_DATA, Channel } from "./channelsData";
import MaterialPlayer from "./components/MaterialPlayer";
import ChannelList from "./components/ChannelList";

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

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vplay-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save custom channels to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vplay-custom-channels", JSON.stringify(customChannels));
  }, [customChannels]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Select channel group
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

  return (
    <div className="min-h-screen bg-[#121212] text-[#f1f1f1] pb-10 font-sans rounded-none flex flex-col">
      
      {/* SOLID MATERIAL BLUE TOP BAR - FLAT DESIGN */}
      <header className="sticky top-0 z-40 bg-[#1a73e8] text-white shadow-md border-b border-[#1557b0] rounded-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo Title (No subtitles or extra badges) */}
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-white" />
            <span className="font-bold text-lg tracking-tight text-white leading-none">
              Vplay Native
            </span>
          </div>

          {/* Top Bar Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Custom stream adding button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 hover:bg-white/10 active:bg-white/15 text-white transition-colors cursor-pointer relative rounded-none"
              title="Thêm luồng m3u8 tự chọn"
              id="btn-add-stream"
            >
              <ListPlus className="w-5 h-5" />
              {customChannels.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-none animate-pulse" />
              )}
            </button>

            {/* Help Info Toggle button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 hover:bg-white/10 active:bg-white/15 text-white transition-colors cursor-pointer rounded-none"
              title="Hướng dẫn sử dụng"
              id="btn-help"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Layout: Optimized vertical single column for mobile first */}
      <main className="max-w-7xl w-full mx-auto px-3 py-3 flex flex-col gap-3 flex-grow">
        
        {/* Dynamic Player Screen and Title Container */}
        <div className="flex flex-col gap-3 rounded-none">
          
          {/* Live Player Element */}
          <MaterialPlayer 
            currentChannel={currentChannel} 
            themeColor="ocean" 
          />

          {/* Active play information banner (No Heart rating / No rounded corners) */}
          <div className="flex items-center justify-between bg-[#1e1e21] border border-white/5 p-3 rounded-none gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-white/10 p-0.5 flex items-center justify-center flex-shrink-0 rounded-none border border-white/5">
                <img 
                  src={currentChannel.logo} 
                  alt={currentChannel.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-bold text-white truncate leading-none">
                    {currentChannel.name}
                  </h2>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#1a73e8] text-white rounded-none leading-none">
                    {currentChannel.group}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate mt-1">
                  Đang phát nội dung trực tuyến m3u8
                </p>
              </div>
            </div>

            {/* Quick reset playback helper */}
            <button 
              onClick={() => {
                setCurrentChannel(CHANNELS_DATA[0]);
              }}
              className="p-2 hover:bg-white/5 bg-white/10 text-gray-300 hover:text-white transition-colors rounded-none text-xs flex items-center gap-1 font-semibold"
              title="Khởi động lại kênh mặc định"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Khôi phục</span>
            </button>
          </div>

        </div>

        {/* Info panel section if toggled */}
        {showHelp && (
          <div className="relative bg-[#1c1b1f] border border-[#1a73e8]/30 p-4 rounded-none text-xs leading-relaxed text-gray-300">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-3.5 right-3.5 p-1 hover:bg-white/10 text-gray-400 hover:text-white rounded-none"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-[#1a73e8] text-sm mb-2 flex items-center gap-1.5 uppercase">
              <Info className="w-4 h-4" /> Thiết kế tối ưu hóa cho Mobile
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-gray-400">
              <li>Mỗi ô lưới kênh hiển thị duy nhất <span className="text-white">biểu tượng (Logo)</span> tối giản của nhà đài giúp thao tác chuyển nhanh thân thiện với ngón tay.</li>
              <li>Sử dụng tính năng <span className="text-white font-semibold">Tỉ lệ khung hình</span> trong trình phát để điều chỉnh tràn viền hoặc khít với màn hình điện thoại của bạn.</li>
              <li>Chạm vào nút Smartphone <Smartphone className="inline w-3 h-3 mx-1 text-sky-400" /> để chạy chế độ cửa sổ nổi <span className="text-white">Picture-in-Picture</span> tuyệt vời cho di động.</li>
              <li>Hệ thống liên kết m3u8 nạp nhanh qua cơ chế luồng chất lượng cao.</li>
            </ul>
          </div>
        )}

        {/* Custom channel addition sheet form */}
        {showAddForm && (
          <div className="bg-[#1f1f23] p-4 rounded-none border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <ListPlus className="w-4 h-4 text-[#1a73e8]" /> Thêm Luồng Kênh M3U8 Tự Chọn
              </h3>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="p-1 hover:bg-white/5 text-gray-400 hover:text-white rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomChannel} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Tên Kênh Truyền Hình *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: VTV3 SD, Kênh Phim Mỹ,..." 
                  value={newChanName}
                  onChange={(e) => setNewChanName(e.target.value)}
                  className="bg-[#121212] py-2 px-3 rounded-none text-xs text-white focus:outline-none border border-white/5 focus:border-[#1a73e8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase font-mono">Đường Dẫn Liên Kết M3U8 *</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://example.com/playlist/chunklist.m3u8" 
                  value={newChanUrl}
                  onChange={(e) => setNewChanUrl(e.target.value)}
                  className="bg-[#121212] py-2 px-3 rounded-none text-xs text-white focus:outline-none border border-white/5 focus:border-[#1a73e8] font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Đường Dẫn Biểu Tượng Logo</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/logo.png" 
                  value={newChanLogo}
                  onChange={(e) => setNewChanLogo(e.target.value)}
                  className="bg-[#121212] py-2 px-3 rounded-none text-xs text-white focus:outline-none border border-white/5 focus:border-[#1a73e8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Nhóm Phân Loại (Group-Title)</label>
                <select
                  value={newChanGroup}
                  onChange={(e) => setNewChanGroup(e.target.value)}
                  className="bg-[#121212] py-2 px-3 rounded-none text-xs text-white focus:outline-none border border-white/5 focus:border-[#1a73e8] cursor-pointer"
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
                <div className="bg-[#1a73e8]/20 text-[#1a73e8] p-2 rounded-none text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Thêm kênh thành công! Đang tải luồng...
                </div>
              ) : (
                <div className="flex gap-2 justify-end mt-2">
                  {customChannels.length > 0 && (
                    <button 
                      type="button"
                      onClick={handleClearCustomChannels}
                      className="py-2 px-4 rounded-none text-xs font-semibold bg-red-950/40 text-red-350 border border-red-500/10 hover:bg-red-900/30 transition-colors cursor-pointer"
                    >
                      Xóa Kênh Đã Thêm
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="py-2 px-5 rounded-none text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-colors cursor-pointer"
                  >
                    Xác Nhận Thêm
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Channel Grid List Module */}
        <div className="flex flex-col gap-3 rounded-none">
          <div className="bg-[#1e1e21] p-3 rounded-none border border-white/5 flex flex-col gap-3">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <h3 className="font-bold text-white text-sm uppercase">
                  Danh Sách Kênh Miễn Phí
                </h3>
              </div>
            </div>

            {/* Flat channel list component */}
            <ChannelList
              channels={allChannels}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              currentChannel={currentChannel}
              onSelectChannel={handleSelectChannel}
              themeColor="ocean"
            />

          </div>
        </div>

      </main>

      {/* Elegant, clean Footer */}
      <footer className="w-full mt-4 py-4 px-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-500 font-medium">
          Vplay Native © 2026 • Giao diện Thiết kế Phẳng Không Bo Góc và Roboto.
        </p>
      </footer>
    </div>
  );
}
