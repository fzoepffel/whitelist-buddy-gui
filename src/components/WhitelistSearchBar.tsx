
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WhitelistSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const WhitelistSearchBar: React.FC<WhitelistSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Search by email or SSO ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 w-full"
      />
    </div>
  );
};

export default WhitelistSearchBar;
