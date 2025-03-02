"use client";

import { Button } from "@/components/ui/button";
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
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";
import { Search } from "lucide-react";
import React, { FormEvent, useState } from "react";

export interface WidgetSearchData extends WidgetDataBase {
  type: WidgetType.SEARCH;
  engine: "google" | "bing" | "duckduckgo" | "ecosia";
  newTab: boolean;
}

export interface WidgetSearchProps extends CommonWidgetProps {
  data: WidgetSearchData;
}

export const defaultSearchData: WidgetSearchData = {
  ...defaultBaseData,
  size: {
    width: 500,
    height: 500,
  },
  type: WidgetType.SEARCH,
  engine: "google",
  newTab: false,
};

const getSearchUrl = (engine: string, query: string): string => {
  query = encodeURIComponent(query);
  switch (engine) {
    case "google":
      return `https://www.google.com/search?q=${query}`;
    case "bing":
      return `https://www.bing.com/search?q=${query}`;
    case "duckduckgo":
      return `https://duckduckgo.com/?q=${query}`;
    case "ecosia":
      return `https://www.ecosia.org/search?q=${query}`;
    default:
      return `https://www.google.com/search?q=${query}`;
  }
};

const WidgetSearch: React.FC<WidgetSearchProps> = ({
  data,
  onUpdateData,
  ...rest
}) => {
  const { WidgetConfigDialog, closeDialog } = useWidgetConfigDialog();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const searchUrl = getSearchUrl(data.engine, searchQuery.trim());
    if (data.newTab) {
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = searchUrl;
    }
  };

  return (
    <WidgetBase data={data} {...rest}>
      {/* Search Form */}
      <div className="flex flex-col justify-center items-center h-full p-4">
        <form onSubmit={handleSearch} className="w-full max-w-lg">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search the web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" variant="default">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs mt-2 text-muted-foreground text-center">
            Searching with{" "}
            {data.engine.charAt(0).toUpperCase() + data.engine.slice(1)}
          </div>
        </form>
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
