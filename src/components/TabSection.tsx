import React from "react";

interface TabSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabSection({
  activeTab,
  setActiveTab,
}: TabSectionProps) {
  const tabs = ["All Songs", "Favorites", "Top Charts", "Genres"];

  return (
    <div className="flex items-center gap-6 mb-6 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`font-bold pb-1 whitespace-nowrap transition-colors ${
            activeTab === tab
              ? "text-white border-b-2 border-[#22c527]"
              : "text-white/40 hover:text-white border-b-2 border-transparent"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
