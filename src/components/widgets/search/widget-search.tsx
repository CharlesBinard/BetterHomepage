"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import WidgetBase, {
  defaultBaseData,
  WidgetDataBase,
} from "@/components/widgets/base/widget-base";
import WidgetSearchConfigForm from "@/components/widgets/search/widget-search-config-from";
import {
  CommonWidgetProps,
  WidgetType,
} from "@/components/widgets/widget-types";
import useWidgetConfigDialog from "@/hooks/use-widget-config-dialog";
import { Globe, History, Image, Newspaper, Search, Video } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";

export type SearchScope = "web" | "images" | "videos" | "news" | "maps";
export type SearchLanguage =
  | "auto"
  | "en"
  | "fr"
  | "de"
  | "es"
  | "it"
  | "pt"
  | "ru"
  | "ja"
  | "zh";
export type SearchRegion =
  | "auto"
  | "us"
  | "uk"
  | "ca"
  | "au"
  | "in"
  | "fr"
  | "de"
  | "jp"
  | "br";

export interface WidgetSearchData extends WidgetDataBase {
  type: WidgetType.SEARCH;
  engine: "google" | "bing" | "duckduckgo" | "ecosia";
  newTab: boolean;
  displayMode: "minimal" | "standard" | "advanced";
  defaultScope: SearchScope;
  language: SearchLanguage;
  region: SearchRegion;
  safeSearch: boolean;
  showQuickLinks: boolean;
  trackHistory: boolean;
  maxHistoryItems: number;
  customPlaceholder?: string;
  autoFocus: boolean;
  searchHistory?: Array<{ query: string; timestamp: number }>;
}

export interface WidgetSearchProps extends CommonWidgetProps {
  data: WidgetSearchData;
}

export const defaultSearchData: WidgetSearchData = {
  ...defaultBaseData,
  type: WidgetType.SEARCH,
  size: {
    width: 30, // percentage of viewport width
    height: 15, // percentage of viewport height
  },
  engine: "google",
  newTab: false,
  displayMode: "standard",
  defaultScope: "web",
  language: "auto",
  region: "auto",
  safeSearch: true,
  showQuickLinks: true,
  trackHistory: true,
  maxHistoryItems: 5,
  customPlaceholder: "Search the web...",
  autoFocus: false,
  searchHistory: [],
};

const getSearchUrl = (
  data: WidgetSearchData,
  query: string,
  scope: SearchScope = "web"
): string => {
  query = encodeURIComponent(query);
  const language = data.language !== "auto" ? data.language : "";
  const region = data.region !== "auto" ? data.region : "";
  const safeSearch = data.safeSearch;

  switch (data.engine) {
    case "google":
      let googleUrl = `https://www.google.com/search?q=${query}`;
      if (scope === "images")
        googleUrl = `https://www.google.com/search?tbm=isch&q=${query}`;
      if (scope === "videos")
        googleUrl = `https://www.google.com/search?tbm=vid&q=${query}`;
      if (scope === "news")
        googleUrl = `https://www.google.com/search?tbm=nws&q=${query}`;
      if (scope === "maps")
        googleUrl = `https://www.google.com/maps/search/${query}`;
      if (language) googleUrl += `&hl=${language}`;
      if (region) googleUrl += `&gl=${region}`;
      if (safeSearch) googleUrl += "&safe=active";
      return googleUrl;

    case "bing":
      let bingUrl = `https://www.bing.com/search?q=${query}`;
      if (scope === "images")
        bingUrl = `https://www.bing.com/images/search?q=${query}`;
      if (scope === "videos")
        bingUrl = `https://www.bing.com/videos/search?q=${query}`;
      if (scope === "news")
        bingUrl = `https://www.bing.com/news/search?q=${query}`;
      if (scope === "maps") bingUrl = `https://www.bing.com/maps?q=${query}`;
      if (language) bingUrl += `&setlang=${language}`;
      if (safeSearch) bingUrl += "&adlt=strict";
      return bingUrl;

    case "duckduckgo":
      let ddgUrl = `https://duckduckgo.com/?q=${query}`;
      if (scope === "images")
        ddgUrl = `https://duckduckgo.com/?q=${query}&iax=images&ia=images`;
      if (scope === "videos")
        ddgUrl = `https://duckduckgo.com/?q=${query}&iax=videos&ia=videos`;
      if (scope === "news")
        ddgUrl = `https://duckduckgo.com/?q=${query}&iar=news&ia=news`;
      if (scope === "maps")
        ddgUrl = `https://duckduckgo.com/?q=${query}&iaxm=maps&ia=maps`;
      if (region) ddgUrl += `&kl=${region}`;
      if (safeSearch) ddgUrl += "&kp=1";
      return ddgUrl;

    case "ecosia":
      let ecosiaUrl = `https://www.ecosia.org/search?q=${query}`;
      if (scope === "images")
        ecosiaUrl = `https://www.ecosia.org/images?q=${query}`;
      if (scope === "videos")
        ecosiaUrl = `https://www.ecosia.org/videos?q=${query}`;
      if (scope === "news")
        ecosiaUrl = `https://www.ecosia.org/news?q=${query}`;
      if (scope === "maps")
        ecosiaUrl = `https://www.ecosia.org/maps?q=${query}`;
      if (language) ecosiaUrl += `&lang=${language}`;
      return ecosiaUrl;

    default:
      return `https://www.google.com/search?q=${query}`;
  }
};

// Quick links for common searches
const quickLinks = [
  { name: "Weather", query: "weather forecast today" },
  { name: "News", query: "latest news headlines" },
  { name: "YouTube", query: "youtube.com" },
  { name: "Translator", query: "translate" },
];

// Modern search engine logos as SVG or styled elements
const getSearchEngineLogo = (engine: string) => {
  switch (engine) {
    case "google":
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
          G
        </div>
      );
    case "bing":
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-teal-400 to-cyan-600 text-white font-bold text-sm">
          B
        </div>
      );
    case "duckduckgo":
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm">
          D
        </div>
      );
    case "ecosia":
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm">
          E
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm">
          S
        </div>
      );
  }
};

const getScopeIcon = (scope: SearchScope) => {
  switch (scope) {
    case "web":
      return <Globe className="h-4 w-4" />;
    case "images":
      return <Image className="h-4 w-4" />;
    case "videos":
      return <Video className="h-4 w-4" />;
    case "news":
      return <Newspaper className="h-4 w-4" />;
    case "maps":
      return <Globe className="h-4 w-4" />;
    default:
      return <Search className="h-4 w-4" />;
  }
};

// Theme colors for each engine
const getEngineColors = (
  engine: string
): {
  primary: string;
  background: string;
  darkBackground: string;
  text: string;
  darkText: string;
} => {
  switch (engine) {
    case "google":
      return {
        primary: "from-blue-500 to-purple-600",
        background: "bg-gradient-to-r from-blue-50 to-indigo-50",
        darkBackground:
          "dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-indigo-950/40",
        text: "text-blue-800",
        darkText: "dark:text-blue-200",
      };
    case "bing":
      return {
        primary: "from-teal-500 to-cyan-600",
        background: "bg-gradient-to-r from-teal-50 to-cyan-50",
        darkBackground:
          "dark:bg-gradient-to-r dark:from-teal-950/40 dark:to-cyan-950/40",
        text: "text-teal-800",
        darkText: "dark:text-teal-200",
      };
    case "duckduckgo":
      return {
        primary: "from-orange-500 to-amber-600",
        background: "bg-gradient-to-r from-orange-50 to-amber-50",
        darkBackground:
          "dark:bg-gradient-to-r dark:from-orange-950/40 dark:to-amber-950/40",
        text: "text-orange-800",
        darkText: "dark:text-orange-200",
      };
    case "ecosia":
      return {
        primary: "from-green-500 to-emerald-600",
        background: "bg-gradient-to-r from-green-50 to-emerald-50",
        darkBackground:
          "dark:bg-gradient-to-r dark:from-green-950/40 dark:to-emerald-950/40",
        text: "text-green-800",
        darkText: "dark:text-green-200",
      };
    default:
      return {
        primary: "from-blue-500 to-indigo-600",
        background: "bg-gradient-to-r from-blue-50 to-indigo-50",
        darkBackground:
          "dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-indigo-950/40",
        text: "text-blue-800",
        darkText: "dark:text-blue-200",
      };
  }
};

const WidgetSearch: React.FC<WidgetSearchProps> = ({
  data,
  onUpdateData,
  ...rest
}) => {
  const { WidgetConfigDialog, closeDialog } = useWidgetConfigDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScope, setSelectedScope] = useState<SearchScope>(
    data.defaultScope
  );
  const [searchHistory, setSearchHistory] = useState<
    Array<{ query: string; timestamp: number }>
  >(data.searchHistory || []);

  // Apply autofocus if configured
  useEffect(() => {
    if (data.autoFocus) {
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, [data.autoFocus]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Create search URL with all parameters
    const searchUrl = getSearchUrl(data, searchQuery.trim(), selectedScope);

    // Track history if enabled
    if (data.trackHistory) {
      const updatedHistory = [
        { query: searchQuery, timestamp: Date.now() },
        ...searchHistory.filter((item) => item.query !== searchQuery),
      ].slice(0, data.maxHistoryItems);

      setSearchHistory(updatedHistory);

      // Update widget data with new history
      onUpdateData(data.id, {
        ...data,
        searchHistory: updatedHistory,
      });
    }

    // Navigate based on configuration
    if (data.newTab) {
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = searchUrl;
    }
  };

  const handleQuickLinkClick = (query: string) => {
    setSearchQuery(query);
    // Auto-submit for quick links if desired
    // handleSearch(new Event('submit') as any);
  };

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    onUpdateData(data.id, {
      ...data,
      searchHistory: [],
    });
  };

  const colors = getEngineColors(data.engine);

  return (
    <WidgetBase data={data} {...rest}>
      <div>
        <div
          className={`w-full p-6 flex flex-col ${
            data.displayMode === "minimal" ? "justify-center" : "justify-start"
          }`}
        >
          {/* Engine Logo/Name with enhanced styling */}
          <div className="flex justify-center mb-5">
            <div
              className={`flex items-center px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-md border border-white/50 dark:border-gray-700/50 ${colors.text} ${colors.darkText} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
            >
              <div className="mr-2">{getSearchEngineLogo(data.engine)}</div>
              <span className="font-medium">
                {data.engine.charAt(0).toUpperCase() + data.engine.slice(1)}
              </span>
            </div>
          </div>

          {/* Search Form with enhanced styling */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-lg mx-auto transition-all duration-300"
          >
            <div className="flex gap-2 p-2 px-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all duration-300 hover:shadow-xl">
              <Input
                id="search-input"
                type="text"
                placeholder={data.customPlaceholder || "Search the web..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow border-0 bg-transparent focus:ring-0 px-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              />

              {/* Search Scope Selector with improved styling */}
              {data.displayMode !== "minimal" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {getScopeIcon(selectedScope)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 animate-in fade-in-50 zoom-in-95 duration-150"
                  >
                    <DropdownMenuItem
                      onClick={() => setSelectedScope("web")}
                      className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Globe className="mr-2 h-4 w-4" /> Web
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedScope("images")}
                      className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Image className="mr-2 h-4 w-4" /> Images
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedScope("videos")}
                      className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Video className="mr-2 h-4 w-4" /> Videos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedScope("news")}
                      className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Newspaper className="mr-2 h-4 w-4" /> News
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedScope("maps")}
                      className="rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Globe className="mr-2 h-4 w-4" /> Maps
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                type="submit"
                variant="outline"
                size="icon"
                className={`rounded-md bg-gradient-to-r ${colors.primary} hover:opacity-90 hover:shadow-md transition-all duration-200 transform hover:scale-105`}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Quick Links with improved styling */}
          {data.showQuickLinks && data.displayMode === "advanced" && (
            <div className="flex justify-center gap-2 mt-5">
              {quickLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLinkClick(link.query)}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-700/90 border border-white/50 dark:border-gray-700/50 shadow-sm rounded-full px-4 text-xs transition-all duration-150 hover:shadow hover:-translate-y-0.5"
                >
                  {link.name}
                </Button>
              ))}
            </div>
          )}

          {/* Search History with improved styling */}
          {data.trackHistory &&
            data.displayMode === "advanced" &&
            searchHistory.length > 0 && (
              <div className="mt-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl border border-white/30 dark:border-gray-700/30 shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium flex items-center text-gray-800 dark:text-gray-200">
                    <History className="h-3.5 w-3.5 mr-2 opacity-70" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-7 text-xs hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-full px-3 transition-colors duration-150"
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-white/50 dark:border-gray-600/50 shadow-sm py-1 px-3 rounded-full transition-all duration-150 hover:-translate-y-0.5"
                      onClick={() => handleHistoryItemClick(item.query)}
                    >
                      <History className="h-3 w-3 mr-1 opacity-70" />
                      {item.query}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {/* Region and Language indicator with improved styling */}
          {data.displayMode === "advanced" &&
            (data.language !== "auto" || data.region !== "auto") && (
              <div className="mt-4 text-xs text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm py-2 px-4 rounded-full shadow-sm inline-flex self-center items-center text-gray-700 dark:text-gray-300 transition-all duration-300">
                {data.language !== "auto" && (
                  <span className="mr-2 font-medium opacity-70">
                    {data.language.toUpperCase()}
                  </span>
                )}
                {data.region !== "auto" && (
                  <span className="font-medium opacity-70">
                    {data.region.toUpperCase()}
                  </span>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Configuration Dialog */}
      <WidgetConfigDialog type={WidgetType.SEARCH}>
        <WidgetSearchConfigForm
          data={data}
          onSubmit={(newData) => {
            onUpdateData(data.id, newData);
            closeDialog();
          }}
        />
      </WidgetConfigDialog>
    </WidgetBase>
  );
};

export default WidgetSearch;
