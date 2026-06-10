import React, { useState, useEffect } from "react";
import { 
  Smartphone, 
  Info, 
  X, 
  RefreshCw,
  Search,
  LayoutGrid
} from "lucide-react";
import { CHANNELS_DATA, Channel } from "./channelsData";
import MaterialPlayer from "./components/MaterialPlayer";
import ChannelList from "./components/ChannelList";

type AppTab = "trang-chu" | "truc-tiep" | "package" | "cai-dat";

export default function App() {
  // Load Dark Mode state (default is false/off as specified)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dark-mode");
      return saved === "true"; // default is false unless saved as true
    } catch {
      return false;
    }
  });

  // Load favorites from local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vplay-favorites");
      return saved ? JSON.parse(saved) : ["vtv1-hd", "vtv3-hd", "kplus-sport-1-hd"];
    } catch {
      return ["vtv1-hd", "vtv3-hd", "kplus-sport-1-hd"];
    }
  });

  // Load grid columns count (default is 3, optional is 2)
  const [columnsCount, setColumnsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("vplay-columns-count");
      return saved === "2" ? 2 : 3;
    } catch {
      return 3;
    }
  });

  const allChannels = CHANNELS_DATA;

  // Active playing channel
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    return allChannels[0];
  });

  // Tab State & Dropdown toggle
  const [activeTab, setActiveTab] = useState<AppTab>("truc-tiep");
  const [showAppsMenu, setShowAppsMenu] = useState(false);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedSubTab, setSelectedSubTab] = useState("Tất cả");

  // Show App Help/Info dialog
  const [showHelp, setShowHelp] = useState(false);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vplay-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Persist dark mode setting
  useEffect(() => {
    localStorage.setItem("vplay-dark-mode", String(darkMode));
  }, [darkMode]);

  // Persist grid columns setting
  useEffect(() => {
    localStorage.setItem("vplay-columns-count", String(columnsCount));
  }, [columnsCount]);

  // Toggle Favorite helper
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

  // Dynamic values based on Dark Mode setting (Removed transition-colors & duration classes to prevent transitions/fade)
  const appBgClass = darkMode ? "bg-[#121212] text-[#f1f1f1]" : "bg-white text-[#111111]";
  const subPanelBgClass = darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen pb-10 font-sans rounded-none flex flex-col antialiased ${appBgClass}`}>
      
      {/* SOLID MATERIAL BLUE TOP BAR - FLAT DESIGN */}
      <header className="sticky top-0 z-40 bg-[#1a73e8] text-white shadow-md border-b border-[#1557b0] rounded-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
          
          {/* Logo Title (Removed TV Icon next to Vplay Native) */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white leading-none selection:bg-white/30">
              Vplay Native
            </span>
          </div>

          {/* Top Bar Action Buttons */}
          <div className="flex items-center gap-1.5">

            {/* Toggle Search Icon Button */}
            {activeTab === "truc-tiep" && (
              <button
                onClick={() => {
                  const nextSearch = !showSearchInput;
                  setShowSearchInput(nextSearch);
                  if (!nextSearch) {
                    setSearchTerm("");
                  }
                }}
                className={`p-2 cursor-pointer rounded-none relative ${
                  showSearchInput ? "bg-white text-[#1a73e8]" : "hover:bg-white/10 active:bg-white/15 text-white"
                }`}
                title="Tìm kiếm kênh"
                id="btn-top-search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Apps Launcher Button (Triggers solid flat white dropdown menu) */}
            <div className="relative">
              <button
                onClick={() => setShowAppsMenu(!showAppsMenu)}
                className={`p-2 cursor-pointer rounded-none relative ${
                  showAppsMenu ? "bg-white text-[#1a73e8]" : "hover:bg-white/10 active:bg-white/15 text-white"
                }`}
                title="Ứng dụng hệ thống"
                id="btn-apps"
              >
                <LayoutGrid className="w-5 h-5 whitespace-nowrap" />
              </button>

              {/* Dropdown Menu: ALWAYS flat square edges, solid white background with gray text. NO icons, NO status dots */}
              {showAppsMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowAppsMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-xl z-50 rounded-none overflow-hidden py-1">
                    
                    <button
                      onClick={() => {
                        setActiveTab("trang-chu");
                        setShowAppsMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold font-sans ${
                        activeTab === "trang-chu" 
                          ? "bg-gray-100 text-[#1a73e8]" 
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>Trang chủ</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("truc-tiep");
                        setShowAppsMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold font-sans ${
                        activeTab === "truc-tiep" 
                          ? "bg-gray-100 text-[#1a73e8]" 
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>Trực tiếp</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("package");
                        setShowAppsMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold font-sans ${
                        activeTab === "package" 
                          ? "bg-gray-100 text-[#1a73e8]" 
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>Package</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("cai-dat");
                        setShowAppsMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold font-sans ${
                        activeTab === "cai-dat" 
                          ? "bg-gray-100 text-[#1a73e8]" 
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>Cài đặt</span>
                    </button>

                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Dynamic Search Box displayed immediately below top bar in Trực tiếp tab, conditionally toggled */}
      {activeTab === "truc-tiep" && showSearchInput && (
        <div className={`border-b ${darkMode ? "bg-[#18181a] border-white/5" : "bg-gray-50 border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-3 py-2">
            <div className={`flex items-center gap-2 px-3 py-2 border rounded-none shadow-sm ${
              darkMode ? "bg-[#1e1e21] border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search TV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs w-full focus:outline-none font-roboto font-medium placeholder-gray-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-550 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container Layout: Optimized vertical single column for mobile first */}
      <main className="max-w-7xl w-full mx-auto px-3 py-3 flex flex-col gap-3 flex-grow">
        
        {/* =============== VIEW 1: TRANG CHỦ (COMING SOON SIMPLIFIED) =============== */}
        {activeTab === "trang-chu" && (
          <div className="flex-grow flex items-center justify-center py-24 text-center rounded-none bg-transparent">
            <div className={`font-roboto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className="text-sm font-bold mb-1">Coming soon.</div>
              <div className="text-[11px] font-medium opacity-85">To get started, go to Live tab</div>
            </div>
          </div>
        )}

        {/* =============== VIEW 2: TRỰC TIẾP (MAIN PLAYER & CHANNELS GRID) =============== */}
        {activeTab === "truc-tiep" && (
          <>
            {/* Dynamic Player Screen and Title Container */}
            <div className="flex flex-col gap-3 rounded-none">
              
              {/* Live Player Element */}
              <MaterialPlayer 
                currentChannel={currentChannel} 
                themeColor="ocean" 
              />

              {/* Active play information banner (completely clean & simplified flat design) */}
              <div className={`p-3 rounded-none border ${subPanelBgClass}`}>
                <h2 className={`text-sm font-bold truncate leading-none ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {currentChannel.name}
                </h2>
              </div>

            </div>

            {/* Info panel section if toggled */}
            {showHelp && (
              <div className={`relative border p-4 rounded-none text-xs leading-relaxed ${
                darkMode ? "bg-[#1c1b1f] border-[#1a73e8]/30 text-gray-300" : "bg-blue-50/50 border-[#1a73e8]/20 text-gray-700"
              }`}>
                <button 
                  onClick={() => setShowHelp(false)}
                  className={`absolute top-3.5 right-3.5 p-1 rounded-none ${
                    darkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-[#1a73e8] text-sm mb-2 flex items-center gap-1.5 uppercase">
                  Thiết kế tối ưu hóa cho Mobile
                </h3>
                <ul className={`list-disc pl-4 space-y-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <li>Tỷ lệ ô lưới hiển thị <span className="font-semibold">Hình chữ nhật (Rectangular Aspect Ratio)</span> thuận tiện cho giao diện lướt dọc bằng ngón tay.</li>
                  <li>Dễ dàng lọc tìm kiếm kênh thời gian thực thông qua công cụ tìm kiếm trực tiếp đặt tại Header Blue Topbar.</li>
                  <li>Sử dụng tính năng <span className="font-semibold">Tỉ lệ khung hình</span> trong trình phát để điều chỉnh tràn viền hoặc khít với màn hình di động của bạn.</li>
                  <li>Chạm vào nút Smartphone để chạy chế độ cửa sổ nổi <span className="font-semibold">Picture-in-Picture (PiP)</span> tiện lợi.</li>
                </ul>
              </div>
            )}

            {/* Channel Grid List Module (Removed title heading) */}
            <div className="flex flex-col gap-3 rounded-none">
              <div className={`p-3 rounded-none border ${subPanelBgClass}`}>
                
                {searchTerm ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center rounded-none font-roboto">
                    <div className="text-sm font-bold text-[#1a73e8] mb-1">Search function is coming soon.</div>
                    <div className={`text-[11px] opacity-75 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Search capability is under construction
                    </div>
                  </div>
                ) : (
                  /* Flat channel list component with rectangular tiles */
                  <ChannelList
                    channels={allChannels}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    currentChannel={currentChannel}
                    onSelectChannel={handleSelectChannel}
                    themeColor="ocean"
                    searchTerm={searchTerm}
                    selectedSubTab={selectedSubTab}
                    setSelectedSubTab={setSelectedSubTab}
                    darkMode={darkMode}
                    columnsCount={columnsCount}
                  />
                )}

              </div>
            </div>
          </>
        )}

        {/* =============== VIEW 3: PACKAGE (COMING SOON SIMPLIFIED) =============== */}
        {activeTab === "package" && (
          <div className="flex-grow flex items-center justify-center py-24 text-center rounded-none bg-transparent">
            <div className={`font-roboto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className="text-sm font-bold mb-1">Coming soon.</div>
              <div className="text-[11px] font-medium opacity-85">To get started, go to Live tab</div>
            </div>
          </div>
        )}

        {/* =============== VIEW 4: CÀI ĐẶT (SETTINGS BLENDED WITH THE APP BACKGROUND) =============== */}
        {activeTab === "cai-dat" && (
          <div className="flex flex-col gap-1 rounded-none px-1">
            
            {/* App Settings list - blended option list (no encapsulating dark boxes, direct background flow) */}
            <div className="flex flex-col text-xs">
              
              {/* Option 1: Dark Mode Toggle with blue Toggle Switch as requested */}
              <div className={`flex items-center justify-between py-4 border-b ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <div>
                  <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Chế độ tối</h4>
                  <p className={`text-[10px] mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tiết kiệm pin và bảo vệ mắt vào ban đêm</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                    darkMode ? "bg-[#1a73e8]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Option 2: Grid column tiles layout selector (flat rectangular selection) */}
              <div className={`flex items-center justify-between py-4 border-b ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <div>
                  <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Số ô kênh hiển thị</h4>
                  <p className={`text-[10px] mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Cấu hình hiển thị theo dòng trên màn hình</p>
                </div>
                <div className={`flex p-0.5 border ${
                  darkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-300"
                }`}>
                  <button
                    onClick={() => setColumnsCount(2)}
                    className={`px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-none cursor-pointer transition-all ${
                      columnsCount === 2 
                        ? "bg-[#1a73e8] text-white" 
                        : darkMode 
                          ? "text-gray-400 hover:text-white" 
                          : "text-gray-700 hover:text-[#1a73e8]"
                    }`}
                  >
                    2 ô/dòng
                  </button>
                  <button
                    onClick={() => setColumnsCount(3)}
                    className={`px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-none cursor-pointer transition-all ${
                      columnsCount === 3 
                        ? "bg-[#1a73e8] text-white" 
                        : darkMode 
                          ? "text-gray-400 hover:text-white" 
                          : "text-gray-700 hover:text-[#1a73e8]"
                    }`}
                  >
                    3 ô/dòng
                  </button>
                </div>
              </div>

              {/* Option 3: Version Info option - blended wrapper */}
              <div className={`flex items-center justify-between py-4 border-b ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <div>
                  <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Phiên bản ứng dụng</h4>
                  <p className={`text-[10px] mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Bản phát hành chính thức cho nền tảng di động</p>
                </div>
                <span className={`font-mono text-[11px] font-bold px-2 py-1 rounded-none ${
                  darkMode ? "bg-white/10 text-white" : "bg-gray-150 text-gray-800"
                }`}>
                  0.1_beta_android_native_preview
                </span>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Elegant, completely clean empty space footer */}
      <footer className="w-full mt-4 py-2 text-center" />
    </div>
  );
}
