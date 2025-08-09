import { OnboardingData } from "@/models/user";
import { useEffect, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

export function SearchBox<T extends { id: string; name: string }>({
    id,
    onUpdate,
    selectedId,
    error,
    data,
    isLoadingData,
    filteredData,
    setFilteredData,
  }: {
    id: string;
    onUpdate: (data: Partial<OnboardingData>) => void;
    setData: (data: T[]) => void;
    error?: string;
    data: T[];
    isLoadingData: boolean;
    filteredData: T[];
    selectedId: string | undefined;
    setFilteredData: (cities: T[]) => void;
  }){
    const [itemSearchQuery, setItemSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedItemName, setSelectedItemName] = useState("");
    // Load cities on component mount
    useEffect(() => {
      if (selectedId) {
        const selectedItem = data.find(
          (item) => item.id === selectedId
        );
        if (selectedItem) {
          setSelectedItemName(selectedItem.name);
          setItemSearchQuery(selectedItem.name);
        }
      }
    }, [selectedId]);
  
    // Filter cities based on search query
    useEffect(() => {
      if (itemSearchQuery.trim() === "") {
        setFilteredData(data);
      } else {
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
        );
        setFilteredData(filtered);
      }
    }, [itemSearchQuery, data]);
  
    const handleItemSelect = (item: any) => {
      onUpdate({[id]: item.id});
      setSelectedItemName(item.name);
      setItemSearchQuery(item.name);
      setShowDropdown(false);
    };
  
    const handleItemSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setItemSearchQuery(query);
      setShowDropdown(true);
  
      // Clear selection if user is typing
      if (query !== selectedItemName) {
        onUpdate({[id]: ''});
        setSelectedItemName("");
      }
    };
    return (
      <>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={itemSearchQuery}
              onChange={handleItemSearchChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search"
              className="
                  w-full pl-10 pr-10 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 
                  focus:outline-none transition-colors duration-200 text-gray-800
                "
              disabled={isLoadingData}
            />
            {isLoadingData && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
  
          {/* City Dropdown */}
          {showDropdown && !isLoadingData && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="
                        w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 
                        focus:outline-none transition-colors duration-150
                        border-b border-gray-100 last:border-b-0
                      "
                  >
                    <div className="font-medium text-gray-800">{item.name}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  {itemSearchQuery
                    ? "No cities found matching your search"
                    : "No cities available"}
                </div>
              )}
            </div>
          )}
        </div>
  
        {/* Selected City Display */}
        {selectedItemName && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-medium">
                Selected: {selectedItemName}
              </span>
            </div>
          </div>
        )}
  
        <p className="text-sm text-gray-500 mt-1">
          Start typing to search
        </p>
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
  
        {/* Help Text */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            <strong>Privacy Note:</strong> Your location information helps us
            provide region-specific content and connect you with nearby study
            groups. We never share your personal information with third parties.
          </p>
        </div>
  
        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </>
    );
  };