"use client";

import { useState, useEffect } from "react";
import OfficersRosterMedia from "@/features/cms/components/OfficersRosterMedia";

type OfficersTabsProps = {
  rosterImage: string | undefined;
  image2Url: string | undefined;
  image3Url: string | undefined;
  button1Label: string;
  button2Label: string;
  button3Label: string;
};

export default function OfficersTabs({
  rosterImage,
  image2Url,
  image3Url,
  button1Label,
  button2Label,
  button3Label,
}: OfficersTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("part-1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read hash on mount
    const hash = window.location.hash;
    if (hash === "#part-2" || hash === "#part-3") {
      setActiveTab(hash.replace("#", ""));
    }
  }, []);

  // Handle hash changes if user navigates back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#part-1" || hash === "#part-2" || hash === "#part-3") {
        setActiveTab(hash.replace("#", ""));
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.history.pushState(null, "", `#${tab}`);
  };

  // Prevent hydration mismatch on initial render
  if (!mounted) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-[#F26223]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
        <button
          onClick={() => handleTabChange("part-1")}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${
            activeTab === "part-1"
              ? "bg-[#F26223] text-white shadow-[0_8px_24px_rgba(242,98,35,0.4)] scale-105"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {button1Label}
        </button>
        <button
          onClick={() => handleTabChange("part-2")}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${
            activeTab === "part-2"
              ? "bg-[#F26223] text-white shadow-[0_8px_24px_rgba(242,98,35,0.4)] scale-105"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {button2Label}
        </button>
        <button
          onClick={() => handleTabChange("part-3")}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 ${
            activeTab === "part-3"
              ? "bg-[#F26223] text-white shadow-[0_8px_24px_rgba(242,98,35,0.4)] scale-105"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {button3Label}
        </button>
      </div>

      <div className="relative">
        {activeTab === "part-1" && rosterImage && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-300">
            <OfficersRosterMedia url={rosterImage} />
          </div>
        )}
        
        {activeTab === "part-2" && image2Url && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-300">
            <OfficersRosterMedia url={image2Url} />
          </div>
        )}
        
        {activeTab === "part-3" && image3Url && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-300">
            <OfficersRosterMedia url={image3Url} />
          </div>
        )}
        
        {/* Empty states for active tab */}
        {activeTab === "part-1" && !rosterImage && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center text-sm text-white/60 animate-in fade-in duration-300">
            No image uploaded for {button1Label} yet.
          </div>
        )}
        {activeTab === "part-2" && !image2Url && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center text-sm text-white/60 animate-in fade-in duration-300">
            No image uploaded for {button2Label} yet.
          </div>
        )}
        {activeTab === "part-3" && !image3Url && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center text-sm text-white/60 animate-in fade-in duration-300">
            No image uploaded for {button3Label} yet.
          </div>
        )}
      </div>
    </div>
  );
}
