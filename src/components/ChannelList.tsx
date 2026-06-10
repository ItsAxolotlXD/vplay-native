import React, { useState } from "react";
import { 
  Search, 
  Tv, 
  Radio, 
  Compass,
  SlidersHorizontal
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

  const filteredCategories = CATEGORIES.filter(cat => cat !== "Yêu thích");

  // Filter channels according to search and categories tabs
  const filteredChannels = channels.filter((ch) => {
    // Search matching name or group
    const matchesSearch = ch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ch.group.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab matching
    if (selectedSubTab === "Tất cả") return true;
    return ch.group === selectedSubTab;
  });

  return (
    <div className="flex flex-col gap-3 w-full rounded-none">
      
      {/* Search Input - Flat square border */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm kênh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#252528] text-gray-100 text-xs rounded-none focus:outline-none border border-white/5 focus:border-[#1a73e8] transition-all placeholder-gray-500 font-sans"
        />
      </div>

      {/* Horizontal categories list flat tabs - Highly dense for mobile list sorting */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none rounded-none">
        {filteredCategories.map((tab) => {
          const isActive = selectedSubTab === tab;
          
          const count = tab === "Tất cả" 
            ? channels.length 
            : channels.filter(c => c.group === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedSubTab(tab)}
              className={`px-3 py-1.5 rounded-none text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                isActive
                  ? "bg-[#1a73e8] text-white font-bold"
                  : "bg-[#252528] hover:bg-white/5 border border-white/5 text-gray-305"
              }`}
            >
              {tab === "Phát thanh" && <Radio className="w-3.5 h-3.5 text-cyan-400" />}
              {tab === "Tất cả" && <Tv className="w-3.5 h-3.5" />}
              <span>{tab}</span>
              <span className={`text-[9px] px-1 font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Clean high-density Grid of purely logo tiles - no names, no stats, no hearts */}
      {filteredChannels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-[#1a1a1c] border border-white/5 rounded-none text-center">
          <SlidersHorizontal className="w-8 h-8 text-gray-600 mb-1.5" />
          <p className="text-gray-400 text-xs font-semibold">Không tìm thấy kênh phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 rounded-none">
          {filteredChannels.map((channel) => {
            const isPlaying = currentChannel.id === channel.id;

            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                title={channel.name} // Keeps name readable on hover of pure logo tiles
                className={`relative aspect-square flex items-center justify-center p-2.5 cursor-pointer transition-all rounded-none border group overflow-hidden ${
                  isPlaying 
                    ? "bg-[#28282c] border-[#1a73e8] ring-2 ring-[#1a73e8]" 
                    : "bg-[#1e1e21] border-white/5 hover:border-white/10 hover:bg-[#252529]"
                }`}
              >
                {/* Channel Logo full-fitted wrapper */}
                <div className="w-full h-full flex items-center justify-center bg-[#18181a] p-1 rounded-none">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain filter brightness-95 group-hover:brightness-100 transition-all"
                    onError={(e) => {
                      // fallback representation if logo is broken, show a sleek TV vector or initials
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallbackText = document.createElement('span');
                        fallbackText.className = 'text-[9px] font-bold text-gray-400 text-center leading-none tracking-tight block uppercase px-1';
                        fallbackText.innerText = channel.name.slice(0, 5);
                        parent.appendChild(fallbackText);
                      }
                    }}
                  />
                </div>

                {/* Direct active overlay status strip */}
                {isPlaying && (
                  <div className="absolute top-0 left-0 bg-[#1a73e8] text-white text-[8px] font-bold px-1 py-0.5 rounded-none tracking-widest leading-none select-none">
                    LIVE
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
