
import React from "react";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface WhitelistFilterProps {
  onFilter: (filter: { field: string; value: boolean | null }) => void;
  onClearFilter: () => void;
  activeFilter: { field: string; value: boolean | null } | null;
}

const WhitelistFilter: React.FC<WhitelistFilterProps> = ({
  onFilter,
  onClearFilter,
  activeFilter,
}) => {
  const [selectedField, setSelectedField] = React.useState<string>(
    activeFilter?.field || "test_payment_allowed"
  );
  const [selectedValue, setSelectedValue] = React.useState<string>(
    activeFilter?.value === null 
      ? "all" 
      : activeFilter?.value 
        ? "enabled" 
        : "disabled"
  );

  const handleApplyFilter = () => {
    const value = selectedValue === "all" 
      ? null 
      : selectedValue === "enabled" 
        ? true 
        : false;
    
    onFilter({
      field: selectedField,
      value: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex items-center gap-1 mb-1 sm:mb-0">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Filter by:</span>
      </div>
      
      <div className="flex flex-1 flex-col sm:flex-row gap-2">
        <Select
          value={selectedField}
          onValueChange={setSelectedField}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test_payment_allowed">Test Payment</SelectItem>
            <SelectItem value="activity_api">Activity API</SelectItem>
            <SelectItem value="sso_mock_allowed">SSO Mock</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedValue}
          onValueChange={setSelectedValue}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto" 
            onClick={handleApplyFilter}
          >
            Apply Filter
          </Button>
          {activeFilter && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearFilter}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhitelistFilter;
