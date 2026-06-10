import React from "react";
import { Check, Sparkles } from "lucide-react";

export interface ColorTheme {
  id: string;
  name: string;
  primary: string; // HEX color for visual presentation
  accentClasses: string;
}

export const THEMES: ColorTheme[] = [
  { id: "lavender", name: "Lavender M3", primary: "#6750a4", accentClasses: "bg-[#6750a4]" },
  { id: "emerald", name: "Basil Green", primary: "#386a20", accentClasses: "bg-[#386a20]" },
  { id: "ocean", name: "Ocean Wave", primary: "#0961a4", accentClasses: "bg-[#0961a4]" },
  { id: "amber", name: "Peach Terracotta", primary: "#b16a00", accentClasses: "bg-[#b16a00]" },
  { id: "charcoal", name: "Nordic Charcoal", primary: "#60616b", accentClasses: "bg-[#60616b]" }
];

interface ThemePickerProps {
  activeTheme: string;
  onChangeTheme: (themeId: string) => void;
}

export default function ThemePicker({ activeTheme, onChangeTheme }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-[#1f1f23] rounded-3xl border border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Dynamic Color (Material You)
        </span>
      </div>
      <div className="flex items-center gap-3 mt-1 overflow-x-auto pb-1">
        {THEMES.map((theme) => {
          const isActive = theme.id === activeTheme;
          return (
            <button
              key={theme.id}
              onClick={() => onChangeTheme(theme.id)}
              className="group relative flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
              title={theme.name}
              id={`theme-btn-${theme.id}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${theme.accentClasses} ${
                  isActive ? "ring-2 ring-white ring-offset-2 ring-offset-[#1f1f23]" : ""
                }`}
              >
                {isActive && <Check className="w-5 h-5 text-white" />}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? "text-white font-bold" : "text-gray-400"}`}>
                {theme.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
