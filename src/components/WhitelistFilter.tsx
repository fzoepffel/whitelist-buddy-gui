
import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  field: string;
  value: boolean | null;
}

interface WhitelistFilterProps {
  onFilter: (filters: FilterOption[]) => void;
  onClearFilter: () => void;
  activeFilters: FilterOption[];
}

const WhitelistFilter: React.FC<WhitelistFilterProps> = ({
  onFilter,
  onClearFilter,
  activeFilters,
}) => {
  const [selectedField, setSelectedField] = useState<string>("test_payment_allowed");
  const [selectedValue, setSelectedValue] = useState<string>("enabled");

  const handleApplyFilter = () => {
    const value = selectedValue === "all" 
      ? null 
      : selectedValue === "enabled" 
        ? true 
        : false;
    
    // Check if this filter already exists
    const filterExists = activeFilters.some(
      filter => filter.field === selectedField && filter.value === value
    );

    if (filterExists) return;
    
    // Add new filter to existing filters
    const newFilters = [...activeFilters, {
      field: selectedField,
      value: value,
    }];
    
    onFilter(newFilters);
  };

  const handleRemoveFilter = (fieldToRemove: string, valueToRemove: boolean | null) => {
    const newFilters = activeFilters.filter(
      filter => !(filter.field === fieldToRemove && filter.value === valueToRemove)
    );
    
    if (newFilters.length === 0) {
      onClearFilter();
    } else {
      onFilter(newFilters);
    }
  };

  const getFieldDisplayName = (field: string): string => {
    switch (field) {
      case "test_payment_allowed": return "Test Payment";
      case "activity_api": return "Activity API";
      case "sso_mock_allowed": return "SSO Mock";
      default: return field;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
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
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="blue" 
            size="sm"
            onClick={handleApplyFilter}
          >
            Add Filter
          </Button>
          
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-auto"
              onClick={onClearFilter}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={`${filter.field}-${filter.value}-${index}`} 
              variant="secondary"
              className="flex items-center gap-1 py-1"
            >
              {getFieldDisplayName(filter.field)}: {filter.value === true ? "Enabled" : "Disabled"}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleRemoveFilter(filter.field, filter.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhitelistFilter;
