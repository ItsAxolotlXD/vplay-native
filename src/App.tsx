import React, { useState, useEffect } from "react";
import { 
  Smartphone, 
  Info, 
  X, 
  RefreshCw,
  Search,
  MoreVertical,
  Menu
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CHANNELS_DATA, Channel } from "./channelsData";
import MaterialPlayer from "./components/MaterialPlayer";
import ChannelList from "./components/ChannelList";

type AppTab = "trang-chu" | "truc-tiep" | "package" | "cai-dat" | "sign-in" | "vplay-native-la-gi";

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

  // Load dev search mode setting (default is false)
  const [searchEnabled, setSearchEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-search");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load dev hamburger menu setting (default is false)
  const [hamburgerEnabled, setHamburgerEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-hamburger");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load dev bottom bar setting (default is false)
  const [bottomBarEnabled, setBottomBarEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-bottombar");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Load dev status bar clock setting (default is false)
  const [displayClockEnabled, setDisplayClockEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-clock");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Real-time clock state
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load dev home recommendation setting (default is false)
  const [homeRecommendationEnabled, setHomeRecommendationEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-dev-home");
      return saved === "true";
    } catch {
      return false;
    }
  });

  const allChannels = CHANNELS_DATA;

  // Active playing channel
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    return allChannels[0];
  });

  // Previous playing channel trace for rewind/back to previous channel feature
  const [previousChannel, setPreviousChannel] = useState<Channel | null>(null);

  // Tab State & Dropdown toggle
  const [activeTab, setActiveTab] = useState<AppTab>("truc-tiep");
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [logoScale, setLogoScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("vplay-logo-scale");
      return saved !== null ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  const switchTab = (tab: AppTab) => {
    if (tab === "package") {
      setAppCrashed(true);
      return;
    }
    if (activeTab === tab) return;
    setIsNavigating(true);
    setActiveTab(tab);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedSubTab, setSelectedSubTab] = useState("Tất cả");

  // Show App Help/Info dialog
  const [showHelp, setShowHelp] = useState(false);

  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("vplay-logged-in");
      return saved === "true";
    } catch {
      return false;
    }
  });
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [appCrashed, setAppCrashed] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("vplay-logo-scale", String(logoScale));
  }, [logoScale]);

  // Persist Developer settings
  useEffect(() => {
    localStorage.setItem("vplay-dev-search", String(searchEnabled));
  }, [searchEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-hamburger", String(hamburgerEnabled));
  }, [hamburgerEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-bottombar", String(bottomBarEnabled));
  }, [bottomBarEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-clock", String(displayClockEnabled));
  }, [displayClockEnabled]);

  useEffect(() => {
    localStorage.setItem("vplay-dev-home", String(homeRecommendationEnabled));
  }, [homeRecommendationEnabled]);

  // Toggle Favorite helper
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Select channel group
  const handleSelectChannel = (channel: Channel): boolean => {
    const nameOrId = `${channel.name} ${channel.id}`.toUpperCase();
    const needsLogin = nameOrId.includes("ON") || nameOrId.includes("HTV") || nameOrId.includes("VTV");
    if (!isLoggedIn && needsLogin) {
      setShowLoginPopup(true);
      return false;
    }

    if (currentChannel && currentChannel.id !== channel.id) {
      setPreviousChannel(currentChannel);
    }
    setCurrentChannel(channel);
    // Smooth scroll top on mobile layout
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  };

  const handleRewind = () => {
    if (previousChannel) {
      const temp = currentChannel;
      setCurrentChannel(previousChannel);
      setPreviousChannel(temp);
      switchTab("truc-tiep");
    }
  };

  // Dynamic values based on Dark Mode setting (Removed transition-colors & duration classes to prevent transitions/fade)
  const appBgClass = darkMode ? "bg-[#121212] text-[#f1f1f1]" : "bg-white text-[#111111]";
  const subPanelBgClass = darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen ${bottomBarEnabled ? "pb-24" : "pb-10"} font-sans rounded-none flex flex-col antialiased ${appBgClass}`}>
      
      {/* SOLID MATERIAL DARK GREY TOP BAR - FLAT DESIGN */}
      <header className="sticky top-0 z-40 bg-[#343434] text-white shadow-md border-b border-[#242424] rounded-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
          
          {/* Logo Title (Removed TV Icon next to Vplay Android) */}
          <div className="flex items-center gap-2.5">
            {hamburgerEnabled && !bottomBarEnabled && (
              <button
                onClick={() => setShowAppsMenu(!showAppsMenu)}
                className="p-1.5 hover:bg-white/10 active:bg-white/15 text-white cursor-pointer rounded-none border-none focus:outline-none transition-all mr-0.5"
                title="Menu"
                id="btn-hamburger-left"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <span className="font-bold text-lg tracking-tight text-white leading-none selection:bg-white/30">
              Vplay Android
            </span>
            {displayClockEnabled && (
              <span className="ml-3 font-roboto text-xs font-semibold tracking-wider text-gray-300 bg-black/20 px-2 py-0.5 rounded-xs" style={{ fontFamily: "'Roboto', sans-serif" }} id="top-bar-clock">
                {timeStr}
              </span>
            )}
          </div>

          {/* Top Bar Action Buttons */}
          <div className="flex items-center gap-1.5">

            {/* Rewind/Back to last viewed channel Button */}
            <button
              onClick={handleRewind}
              disabled={!previousChannel}
              className={`p-2 rounded-none relative transition-all ${
                previousChannel 
                  ? "hover:bg-white/10 active:bg-white/15 text-white cursor-pointer" 
                  : "opacity-40 text-white/50 cursor-not-allowed"
              }`}
              title={previousChannel ? `Quay lại kênh xem gần đây: ${previousChannel.name}` : "Chưa có kênh xem gần nhất"}
              id="btn-top-rewind"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current stroke-none flex-shrink-0">
                <path d="M19 21L6 12L19 3V21Z" />
              </svg>
            </button>

            {/* Toggle Search Icon Button */}
            <button
              onClick={() => {
                const nextSearch = !showSearchInput;
                setShowSearchInput(nextSearch);
                if (nextSearch && activeTab !== "truc-tiep") {
                  switchTab("truc-tiep");
                }
                if (!nextSearch) {
                  setSearchTerm("");
                }
              }}
              className={`p-2 cursor-pointer rounded-none relative ${
                showSearchInput ? "bg-white text-[#343434]" : "hover:bg-white/10 active:bg-white/15 text-white"
              }`}
              title="Tìm kiếm kênh"
              id="btn-top-search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Apps Launcher Button (Triggers solid flat white dropdown menu) - Only when not in hamburger mode and not in bottom bar mode */}
            {!hamburgerEnabled && !bottomBarEnabled && (
              <div className="relative">
                <button
                  onClick={() => setShowAppsMenu(!showAppsMenu)}
                  className={`p-2 cursor-pointer rounded-none relative ${
                    showAppsMenu ? "bg-white text-[#343434]" : "hover:bg-white/10 active:bg-white/15 text-white"
                  }`}
                  title="Ứng dụng hệ thống"
                  id="btn-apps"
                >
                  <MoreVertical className="w-5 h-5" />
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
                          switchTab("trang-chu");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "trang-chu" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Trang chủ</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("truc-tiep");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "truc-tiep" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Trực tiếp</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("package");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "package" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Package</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("cai-dat");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "cai-dat" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Cài đặt</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("sign-in");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "sign-in" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Sign in</span>
                      </button>

                      <button
                        onClick={() => {
                          switchTab("vplay-native-la-gi");
                          setShowAppsMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold font-sans cursor-pointer ${
                          activeTab === "vplay-native-la-gi" 
                            ? "bg-gray-100 text-[#1a73e8]" 
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span>Vplay Android là gì?</span>
                      </button>

                    </div>
                  </>
                )}
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Drawer Menu for Hamburger layout (Left to Right sliding) */}
      <AnimatePresence>
        {hamburgerEnabled && showAppsMenu && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs cursor-pointer"
              onClick={() => setShowAppsMenu(false)} 
            />
            {/* Drawer Container (Slides L -> R) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-55 flex flex-col rounded-none text-gray-800"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-end p-4 border-b border-gray-200 bg-gray-50">
                <button 
                  onClick={() => setShowAppsMenu(false)}
                  className="p-1 hover:bg-gray-200 active:bg-gray-300 text-gray-600 rounded-none cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Drawer Links */}
              <div className="flex-grow overflow-y-auto py-2">
                <button
                  onClick={() => {
                    switchTab("trang-chu");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "trang-chu" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Trang chủ
                </button>

                <button
                  onClick={() => {
                    switchTab("truc-tiep");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "truc-tiep" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Trực tiếp
                </button>

                <button
                  onClick={() => {
                    switchTab("package");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "package" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Package
                </button>

                <button
                  onClick={() => {
                    switchTab("cai-dat");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "cai-dat" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Cài đặt
                </button>

                <button
                  onClick={() => {
                    switchTab("sign-in");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer border-b border-gray-100 ${
                    activeTab === "sign-in" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Sign in
                </button>

                <button
                  onClick={() => {
                    switchTab("vplay-native-la-gi");
                    setShowAppsMenu(false);
                  }}
                  className={`w-full text-left px-5 py-4 text-xs font-bold font-sans cursor-pointer ${
                    activeTab === "vplay-native-la-gi" 
                      ? "bg-gray-100 text-[#1a73e8]" 
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Vplay Android là gì?
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Search Box displayed immediately below top bar, conditionally toggled */}
      {showSearchInput && (
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
      <main className="max-w-7xl w-full mx-auto px-3 py-3 flex flex-col gap-3 flex-grow min-h-[350px]">
        
        {isNavigating ? (
          <div className="flex-grow flex flex-col items-center justify-center py-24 text-center rounded-none bg-transparent">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent animate-spin rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* =============== VIEW 1: TRANG CHỦ (COMMUNITY RECOMMENDATIONS IF ENABLED) =============== */}
            {activeTab === "trang-chu" && (
              homeRecommendationEnabled ? (
                <div className="flex flex-col gap-3 rounded-none">
                  <div className={`p-4 rounded-none border ${subPanelBgClass}`}>
                    <h3 className={`font-bold text-xs uppercase tracking-wider mb-2 text-[#1a73e8]`}>
                      Đề xuất kênh ngẫu nhiên
                    </h3>
                    <p className={`text-[10px] mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Trải nghiệm nội dung phong phú được đề xuất trực tuyến từ hệ thống Vplay.
                    </p>
                    <div className={`grid gap-2 rounded-none ${columnsCount === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                      {allChannels
                        .slice()
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 6)
                        .map((channel) => {
                          const isPlaying = currentChannel.id === channel.id;
                          return (
                            <div
                              key={channel.id}
                              onClick={() => {
                                if (handleSelectChannel(channel)) {
                                  switchTab("truc-tiep");
                                }
                              }}
                              className={`flex flex-col p-2.5 border cursor-pointer select-none transition-all active:scale-98 rounded-none relative overflow-hidden ${
                                isPlaying
                                  ? "bg-blue-50/20 border-red-500"
                                  : darkMode
                                    ? "bg-[#252528] border-white/5 hover:border-white/10 hover:bg-[#2c2c2f]"
                                    : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100/70"
                              }`}
                            >
                              <div className={`h-11 flex items-center justify-center p-1 rounded-none bg-white ${
                                darkMode ? "bg-opacity-5" : ""
                              }`}>
                                <img
                                  src={channel.logo}
                                  alt={channel.name}
                                  referrerPolicy="no-referrer"
                                  className="max-h-full max-w-full object-contain transition-all"
                                  style={{ transform: `scale(${logoScale / 100})` }}
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";
                                  }}
                                />
                              </div>
                              <div className="mt-2 min-w-0 text-center">
                                <p className="text-[10px] font-bold truncate tracking-tight">{channel.name}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center py-24 text-center rounded-none bg-transparent">
                  <div className={`font-roboto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <div className="text-sm font-bold mb-1">Coming soon.</div>
                    <div className="text-[11px] font-medium opacity-85">To get started, go to Live tab</div>
                  </div>
                </div>
              )
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
              <div className={`p-3 rounded-none ${subPanelBgClass}`}>
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
                
                {searchTerm && !searchEnabled ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center rounded-none font-roboto">
                    <div className="text-sm font-bold text-[#343434] mb-1">Search function is coming soon.</div>
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
                    logoScale={logoScale}
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

              {/* Option 3: Phóng to biểu tượng logo */}
              <div className={`flex flex-col py-4 border-b gap-2 ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Phóng to biểu tượng</h4>
                  </div>
                  <span className={`font-mono text-xs font-bold text-[#1a73e8]`}>
                    {logoScale}%
                  </span>
                </div>
                <div className="flex items-center gap-3 py-1 bg-transparent">
                  <span className="text-[10px] text-gray-400 font-mono">0</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="flex-grow accent-[#1a73e8] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 font-mono">100</span>
                </div>
              </div>

              {/* Option 4: Version Info option - blended wrapper */}
              <div className={`flex items-center justify-between py-4 border-b ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <div>
                  <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Phiên bản ứng dụng</h4>
                </div>
                <span className={`font-mono text-[11px] font-bold px-2 py-1 rounded-none ${
                  darkMode ? "bg-white/10 text-white" : "bg-gray-150 text-gray-800"
                }`}>
                  0.1_beta_android_native_preview
                </span>
              </div>

              {/* Option 4: Developer settings (Cài đặt nhà phát triển) - Toggle options */}
              <div className={`mt-6 pt-6 border-t ${
                darkMode ? "border-white/10" : "border-gray-200"
              }`}>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-2 text-[#1a73e8]">
                  Cài đặt nhà phát triển
                </h3>
                
                {/* Dev Option A: Hamburger Menu switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Hamburger menu</h4>
                  </div>
                  <button
                    onClick={() => setHamburgerEnabled(!hamburgerEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      hamburgerEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        hamburgerEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option B: Search function switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Search function</h4>
                  </div>
                  <button
                    onClick={() => setSearchEnabled(!searchEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      searchEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        searchEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option C: Home page recommendations switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Thử nghiệm trang chủ</h4>
                  </div>
                  <button
                    onClick={() => setHomeRecommendationEnabled(!homeRecommendationEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      homeRecommendationEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        homeRecommendationEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option D: Bottom bar mode switch */}
                <div className={`flex items-center justify-between py-4 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Bottom bar</h4>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !bottomBarEnabled;
                      setBottomBarEnabled(newVal);
                      if (newVal) {
                        setAppCrashed(true);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      bottomBarEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        bottomBarEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dev Option E: Status bar clock switch */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Display clock</h4>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !displayClockEnabled;
                      setDisplayClockEnabled(newVal);
                      if (newVal) {
                        setAppCrashed(true);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center cursor-pointer focus:outline-none rounded-full ${
                      displayClockEnabled ? "bg-[#1a73e8]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                        displayClockEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =============== VIEW 5: SIGN IN (BETA LOGIN PAGE) =============== */}
        {activeTab === "sign-in" && (
          <div className="flex-grow flex items-center justify-center py-10 px-4 bg-transparent">
            <div className={`w-full max-w-sm p-6 border rounded-none shadow-md ${
              darkMode ? "bg-[#1e1e21] border-white/5" : "bg-white border-gray-200"
            }`}>
              {isLoggedIn ? (
                <div className="text-center py-4 space-y-4">
                  <h3 className={`text-base font-bold tracking-tight mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Đã đăng nhập tài khoản Vplay
                  </h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Chào mừng bạn đã trở lại! Bạn có thể trải nghiệm xem toàn bộ các kênh truyền hình của Vplay bao gồm các gói kênh chất lượng cao.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        localStorage.setItem("vplay-logged-in", "false");
                      }}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all shadow-sm"
                    >
                      Đăng xuất tài khoản
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className={`text-base font-bold tracking-tight mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Đăng nhập tài khoản Vplay
                    </h3>
                    <p className={`text-[10px] mt-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Trải nghiệm đầy đủ tính năng của Vplay bằng cách đăng nhập ngay.
                    </p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setIsLoggedIn(true);
                    localStorage.setItem("vplay-logged-in", "true");
                    alert("Đăng nhập thành công với chế độ thử nghiệm Beta!");
                  }} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Tài khoản hoặc Số điện thoại
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="example@vplay.vn"
                        className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                          darkMode 
                            ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className={`w-full p-2.5 text-xs rounded-none border focus:outline-none focus:border-[#1a73e8] ${
                          darkMode 
                            ? "bg-[#121212] border-white/10 text-white placeholder-gray-600" 
                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                        }`}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all shadow-sm"
                      >
                        Đăng nhập tài khoản
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* =============== VIEW 6: VPLAY ANDROID LÀ GÌ? =============== */}
        {activeTab === "vplay-native-la-gi" && (
          <div className="flex-grow flex items-center justify-center py-16 text-center rounded-none bg-transparent max-w-xl mx-auto px-4">
            <div className={`font-roboto flex flex-col items-center gap-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p className="text-sm font-medium leading-relaxed max-w-md">
                Vplay Android là dự án build ứng dụng xem truyền hình Vplay hoàn toàn native, không port từ phiên bản web của Vplay. Hiện ứng dụng vẫn đang trong quá trình phát triển nên rất nhiều tính năng sẽ bị thiếu và sẽ có rất nhiều lỗi.
              </p>
              <button
                onClick={() => switchTab("truc-tiep")}
                className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-md transition-all"
              >
                Đến tab Live
              </button>
            </div>
          </div>
        )}

          </>
        )}
      </main>

      {/* Elegant, completely clean empty space footer */}
      <footer className="w-full mt-4 py-2 text-center" />

      {/* Styled Android-style Dialog for login request popup (INSTANT TRANSITION - NO ANIMATION AT ALL) */}
      {showLoginPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/55 z-50 cursor-pointer"
            onClick={() => setShowLoginPopup(false)}
          />
          {/* Alert Dialog Container */}
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-[340px] bg-white text-gray-900 shadow-2xl p-6 pointer-events-auto rounded-none max-h-min border border-gray-100"
            >
              {/* Title left-aligned */}
              <h3 className="text-xl font-bold tracking-tight text-gray-950 mb-2 font-sans text-left">
                Yêu cầu đăng nhập
              </h3>
              
              {/* Message body left-aligned */}
              <p className="text-xs text-gray-600 leading-relaxed font-normal mb-6 text-left">
                Nội dung bạn muốn xem yêu cầu đăng nhập vào tài khoản. Vui lòng đi đến tab Đăng nhập để đăng nhập.
              </p>

              {/* Flat action buttons section */}
              <div className="flex items-center justify-end gap-1 font-sans">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    switchTab("sign-in");
                  }}
                  className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
                >
                  ĐẾN ĐĂNG NHẬP
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Styled Android-style Dialog for app crash simulation (INSTANT TRANSITION - NO ANIMATION AT ALL) */}
      {appCrashed && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/55 z-55 cursor-pointer"
            onClick={() => setAppCrashed(false)}
          />
          {/* Alert Dialog Container */}
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-[340px] bg-white text-gray-900 shadow-2xl p-6 pointer-events-auto rounded-none max-h-min border border-gray-100"
            >
              {/* Title left-aligned */}
              <h3 className="text-xl font-bold tracking-tight text-gray-950 mb-2 font-sans text-left">
                Something went wrong
              </h3>
              
              {/* Message body left-aligned */}
              <p className="text-xs text-gray-600 leading-relaxed font-normal mb-6 text-left">
                App crashed. Try to restart your app
              </p>

              {/* Flat action buttons section */}
              <div className="flex items-center justify-end font-sans">
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="px-3 py-2 text-[11px] font-bold text-[#1a73e8] hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-none border-none uppercase transition-colors"
                >
                  RESTART APP
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sticky Bottom Navigation Bar under Dev setting */}
      {bottomBarEnabled && (
        <div className={`fixed bottom-0 left-0 right-0 z-45 border-t flex items-center justify-around py-3 px-1 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${
          darkMode ? "bg-[#1c1c1f] border-white/5 text-gray-300" : "bg-white border-gray-200 text-gray-700"
        }`}>
          <button
            onClick={() => switchTab("trang-chu")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 transition-all rounded-none ${
              activeTab === "trang-chu" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            }`}
          >
            <span className="text-[10px] tracking-tight truncate">Trang chủ</span>
          </button>

          <button
            onClick={() => switchTab("truc-tiep")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 transition-all rounded-none ${
              activeTab === "truc-tiep" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            }`}
          >
            <span className="text-[10px] tracking-tight truncate">Trực tiếp</span>
          </button>

          <button
            onClick={() => switchTab("package")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 transition-all rounded-none ${
              activeTab === "package" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            }`}
          >
            <span className="text-[10px] tracking-tight truncate">Package</span>
          </button>

          <button
            onClick={() => switchTab("cai-dat")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 transition-all rounded-none ${
              activeTab === "cai-dat" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            }`}
          >
            <span className="text-[10px] tracking-tight truncate">Cài đặt</span>
          </button>

          <button
            onClick={() => switchTab("sign-in")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 transition-all rounded-none ${
              activeTab === "sign-in" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            }`}
          >
            <span className="text-[10px] tracking-tight truncate">Sign in</span>
          </button>

          <button
            onClick={() => switchTab("vplay-native-la-gi")}
            className={`flex flex-col items-center justify-center cursor-pointer flex-1 min-w-0 py-1 transition-all rounded-none ${
              activeTab === "vplay-native-la-gi" 
                ? "text-[#1a73e8] font-bold" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium"
            }`}
          >
            <span className="text-[10px] tracking-tight truncate">Intro</span>
          </button>
        </div>
      )}
    </div>
  );
}
