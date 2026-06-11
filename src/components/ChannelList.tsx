import React from "react";
import { 
  Tv, 
  Radio, 
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
  searchTerm: string; // Lifted to header/topbar
  selectedSubTab: string;
  setSelectedSubTab: (tab: string) => void;
  darkMode: boolean;
  columnsCount?: number;
  logoScale?: number;
  animationPreviewEnabled?: boolean;
}

export default function ChannelList({
  channels,
  currentChannel,
  onSelectChannel,
  searchTerm,
  selectedSubTab,
  setSelectedSubTab,
  darkMode,
  columnsCount = 3,
  logoScale = 100,
  animationPreviewEnabled = false
}: ChannelListProps) {
  // Filter channels according to search
  const filteredChannels = channels.filter((ch) => {
    return ch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           ch.group.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getLogoUrl = (ch: Channel) => {
    if (ch.id === "vietnam-today-hd") {
      return darkMode
        ? "https://static.wikia.nocookie.net/logos/images/f/f2/Logo_Vietnam_Today_07-2025_v2.png/revision/latest?cb=20260228060318&path-prefix=uk"
        : "https://static.wikia.nocookie.net/logos/images/e/e1/Logo_Vietnam_Today_07-2025.png/revision/latest?cb=20260228055912&path-prefix=uk";
    }
    return ch.logo;
  };

  return (
    <div className="flex flex-col gap-3 w-full rounded-none">
      
      {/* Clean rectangular logo tiles - exactly as specified: rectangular ratio, no titles, no hearts, no numbers */}
      {filteredChannels.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-8 rounded-none text-center ${
          darkMode ? "bg-[#1a1a1c] border border-white/5" : "bg-white border border-gray-200"
        }`}>
          <SlidersHorizontal className="w-8 h-8 text-gray-400 mb-1.5" />
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Không tìm thấy kênh phù hợp</p>
        </div>
      ) : (
        <div className={`grid gap-2 rounded-none ${columnsCount === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {filteredChannels.map((channel) => {
            const isPlaying = currentChannel.id === channel.id;

            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                title={channel.name} // Native tooltip on hover keeps identifier fully search-friendly/discoverable
                className={`relative aspect-[16/10] flex items-center justify-center p-2 cursor-pointer rounded-none group overflow-hidden ${
                  isPlaying 
                    ? darkMode
                      ? "bg-[#28282c] ring-1 ring-[#1a73e8]"
                      : "bg-gray-50 ring-1 ring-[#1a73e8]" 
                    : darkMode
                      ? "bg-[#1e1e21] hover:bg-[#252529]"
                      : "bg-white hover:bg-gray-50/50"
                } ${
                  animationPreviewEnabled 
                    ? "transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 active:scale-95 hover:shadow-lg" 
                    : "transition-none"
                }`}
                id={`chan-rect-${channel.id}`}
              >
                {/* Channel Logo fully-fitted wrapper */}
                <div className={`w-full h-full flex items-center justify-center p-1 rounded-none ${
                  darkMode ? "bg-[#18181a]" : "bg-gray-50"
                }`}>
                  {channel.group === "Phát thanh" ? (
                    <span className={`text-[9px] font-bold text-center leading-none tracking-tight block uppercase px-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      No image.
                    </span>
                  ) : (
                    <img
                      src={getLogoUrl(channel)}
                      alt={channel.name}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter brightness-95 group-hover:brightness-100 transition-all"
                      style={{ transform: `scale(${logoScale / 100})` }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          if (!parent.querySelector('.fallback-no-image')) {
                            const fallbackText = document.createElement('span');
                            fallbackText.className = `fallback-no-image text-[9px] font-bold text-center leading-none tracking-tight block uppercase px-1 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`;
                            fallbackText.innerText = "No image.";
                            parent.appendChild(fallbackText);
                          }
                        }
                      }}
                    />
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
