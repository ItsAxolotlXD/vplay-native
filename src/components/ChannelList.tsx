import React, { useState } from "react";
import { 
  Heart, 
  Search, 
  Grid, 
  List, 
  Radio, 
  Tv, 
  SlidersHorizontal,
  BookmarkCheck,
  Flame,
  Volume2
} from "lucide-react";
import { Channel, CATEGORIES } from "../channelsData";

interface ChannelListProps {
  channels: Channel[];
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  currentChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  themeColor: string;
}

export default function ChannelList({
  channels,
  favorites,
  onToggleFavorite,
  currentChannel,
  onSelectChannel,
  themeColor
}: ChannelListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubTab, setSelectedSubTab] = useState("Tất cả");
  const [viewCompact, setViewCompact] = useState(false);

  // Filter channels according to search and categories tabs
  const filteredChannels = channels.filter((ch) => {
    // Search matching
    const matchesSearch = ch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ch.group.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab matching
    if (selectedSubTab === "Tất cả") return true;
    if (selectedSubTab === "Yêu thích") return favorites.includes(ch.id);
    return ch.group === selectedSubTab;
  });

  // Active theme classes helper
  const getThemeColorClass = () => {
    switch (themeColor) {
      case "emerald":
        return "bg-[#386a20] text-emerald-100";
      case "ocean":
        return "bg-[#0961a4] text-blue-100";
      case "amber":
        return "bg-[#b16a00] text-amber-100";
      case "charcoal":
        return "bg-[#60616b] text-gray-100";
      default:
        return "bg-[#4f378b] text-[#e6e1e6]"; // Lavender standard M3
    }
  };

  const getThemeTextClass = () => {
    switch (themeColor) {
      case "emerald": return "text-emerald-400";
      case "ocean": return "text-blue-400";
      case "amber": return "text-amber-400";
      case "charcoal": return "text-gray-400";
      default: return "text-[#d0bcff]";
    }
  };

  const getThemeBorderClass = () => {
    switch (themeColor) {
      case "emerald": return "border-emerald-500/20";
      case "ocean": return "border-blue-500/20";
      case "amber": return "border-amber-500/20";
      case "charcoal": return "border-slate-500/20";
      default: return "border-purple-500/20";
    }
  };

  const isFavorited = (id: string) => favorites.includes(id);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Input and Density controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm kênh, đài phát thanh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1f1f23] text-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121318] focus:ring-white/20 transition-all border border-white/5 placeholder-gray-500"
          />
        </div>

        {/* View density toggle */}
        <button
          onClick={() => setViewCompact(!viewCompact)}
          className="p-3 bg-[#1f1f23] hover:bg-white/5 rounded-full border border-white/5 text-gray-400 hover:text-white transition-colors"
          title={viewCompact ? "Hiển thị dạng lưới" : "Hiển thị danh sách dọc"}
        >
          {viewCompact ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
        </button>
      </div>

      {/* Categories horizontal list tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((tab) => {
          const isActive = selectedSubTab === tab;
          
          // Check count in favorites
          const count = tab === "Yêu thích" 
            ? favorites.length 
            : tab === "Tất cả" 
              ? channels.length 
              : channels.filter(c => c.group === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedSubTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? getThemeColorClass()
                  : "bg-[#1f1f23] hover:bg-white/5 border border-white/5 text-gray-300"
              }`}
              id={`tab-btn-${tab}`}
            >
              {tab === "Yêu thích" && <Heart className={`w-3 h-3 ${isActive ? "fill-current" : "text-rose-400"}`} />}
              {tab === "Phát thanh" && <Radio className="w-3 h-3 text-cyan-400" />}
              {tab === "Tất cả" && <Tv className="w-3 h-3" />}
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-white/5 text-gray-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Channels matching list */}
      {filteredChannels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#1f1f23] border border-white/5 rounded-3xl text-center">
          <SlidersHorizontal className="w-10 h-10 text-gray-600 mb-2" />
          <p className="text-gray-400 text-sm font-medium">Không tìm thấy kênh phù hợp</p>
          <p className="text-gray-600 text-xs mt-1">Vui lòng kiểm tra lại từ khóa hoặc danh mục yêu thích</p>
        </div>
      ) : viewCompact ? (
        // COMPACT LIST VIEW
        <div className="flex flex-col gap-2">
          {filteredChannels.map((channel, i) => {
            const isPlaying = currentChannel.id === channel.id;
            const isFav = isFavorited(channel.id);

            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-white/5 border transition-colors group ${
                  isPlaying 
                    ? `bg-[#1f1f23] ${getThemeBorderClass()}` 
                    : "bg-[#1f1f23]/60 border-transparent hover:border-white/5"
                }`}
                id={`chan-compact-${channel.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";
                      }}
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="flex gap-0.5 items-end h-3 w-3">
                          <span className="w-0.5 bg-emerald-400 animate-[bounce_1s_infinite_100ms] h-full" />
                          <span className="w-0.5 bg-emerald-400 animate-[bounce_1s_infinite_300ms] h-2/3" />
                          <span className="w-0.5 bg-emerald-400 animate-[bounce_1s_infinite_500ms] h-4/5" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-500 font-mono">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className={`text-xs font-semibold leading-tight truncate ${isPlaying ? getThemeTextClass() : "text-gray-300"}`}>
                      {channel.name}
                    </h4>
                    <span className="text-[9px] text-gray-500 font-medium">
                      {channel.group}
                    </span>
                  </div>
                </div>

                {/* Right Favoriting control button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(channel.id);
                  }}
                  className="p-2 text-gray-400 hover:text-rose-400 rounded-full hover:bg-white/5 transition-colors"
                  id={`fav-compact-btn-${channel.id}`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // Standard Grid View (Material You elegant Cards)
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredChannels.map((channel, i) => {
            const isPlaying = currentChannel.id === channel.id;
            const isFav = isFavorited(channel.id);

            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className={`relative flex flex-col p-4 rounded-3xl cursor-pointer border transition-all justify-between h-36 ${
                  isPlaying 
                    ? `bg-[#28272f] ${getThemeBorderClass()} shadow-md` 
                    : "bg-[#1f1f23]/80 border-transparent hover:border-white/5 hover:bg-[#25242c]"
                }`}
                id={`chan-card-${channel.id}`}
              >
                {/* Play and Favorite row */}
                <div className="flex items-start justify-between">
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(channel.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-400 rounded-full hover:bg-white/5 transition-colors"
                    id={`fav-grid-btn-${channel.id}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Logo and metadata row */}
                <div className="flex items-center gap-2.5 mt-2 min-w-0">
                  <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 p-1 border border-white/5">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1542204172-e7052809a862?auto=format&fit=crop&w=120&q=80";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold leading-snug truncate ${isPlaying ? getThemeTextClass() : "text-gray-200"}`}>
                      {channel.name}
                    </h4>
                    <span className="text-[10px] text-gray-500 block truncate leading-tight mt-0.5">
                      {channel.group}
                    </span>
                  </div>
                </div>

                {/* Playing Now status Pill at the bottom */}
                {isPlaying && (
                  <div className="absolute bottom-2 right-4 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                    <span>ĐANG PHÁT</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
