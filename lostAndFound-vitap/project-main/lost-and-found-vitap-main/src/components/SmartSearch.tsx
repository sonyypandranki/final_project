import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Tag, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import { CATEGORIES } from "../types/item";
import { LostFoundItem } from "../types/item";

interface SearchResult {
  type: 'category' | 'item';
  data: any;
  relevance: number;
}

const SmartSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { items, searchItems } = useItems();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || searchResults.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(searchResults[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Handle search input changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSelectedIndex(-1);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    // Simulate search delay for better UX
    setTimeout(() => {
      performSearch(query);
      setIsLoading(false);
    }, 300);
  };

  // Perform smart search
  const performSearch = (query: string) => {
    const queryLower = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 1. Check for exact category matches first
    const exactCategoryMatch = CATEGORIES.find(
      category => category.toLowerCase() === queryLower
    );
    
    if (exactCategoryMatch) {
      results.push({
        type: 'category',
        data: exactCategoryMatch,
        relevance: 100
      });
    }

    // 2. Check for partial category matches
    CATEGORIES.forEach(category => {
      if (category.toLowerCase().includes(queryLower) && category !== exactCategoryMatch) {
        results.push({
          type: 'category',
          data: category,
          relevance: 80
        });
      }
    });

    // 3. Search through items
    const itemResults = searchItems(query);
    itemResults.forEach(item => {
      let relevance = 0;
      
      // Title match (highest priority)
      if (item.title.toLowerCase().includes(queryLower)) {
        relevance += 60;
      }
      
      // Description match
      if (item.description.toLowerCase().includes(queryLower)) {
        relevance += 40;
      }
      
      // Category match
      if (item.category.toLowerCase().includes(queryLower)) {
        relevance += 30;
      }
      
      // Location match
      if (item.location.toLowerCase().includes(queryLower)) {
        relevance += 20;
      }

      if (relevance > 0) {
        results.push({
          type: 'item',
          data: item,
          relevance
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Limit results to top 10
    setSearchResults(results.slice(0, 10));
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'category') {
      // Navigate to category page
      const urlCategory = result.data.replace(/\s+/g, '-');
      navigate(`/category/${urlCategory}`);
    } else {
      // Scroll to item or show item details
      const item = result.data as LostFoundItem;
      const el = document.getElementById(`item-${item.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    setIsOpen(false);
    setSearchQuery("");
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim().length === 0) return;

    // If there are results, click the first one
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    } else {
      // Perform search and show results
      performSearch(searchQuery);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Try: 'Electronics', 'ID Card', 'laptop'..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 w-full max-w-sm md:max-w-md lg:max-w-lg border-0 bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
            onFocus={() => {
              if (searchQuery.trim().length > 0) {
                setIsOpen(true);
              }
            }}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted-foreground/20"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
                             {searchResults.map((result, index) => (
                 <div
                   key={index}
                   className={`px-4 py-3 cursor-pointer transition-colors ${
                     index === selectedIndex 
                       ? 'bg-primary/10 border-l-2 border-primary' 
                       : 'hover:bg-muted'
                   }`}
                   onClick={() => handleResultClick(result)}
                   onMouseEnter={() => setSelectedIndex(index)}
                 >
                  {result.type === 'category' ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {result.data}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Browse {result.data.toLowerCase()} items
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary">
                        <Search className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground line-clamp-1">
                          {result.data.title}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {result.data.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {result.data.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.data.status}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
                     ) : searchQuery.trim().length > 0 ? (
             <div className="p-4 text-center text-muted-foreground">
               <div className="text-sm mb-2">No results found</div>
               <div className="text-xs">Try searching for a category or different keywords</div>
             </div>
           ) : null}
           
           {/* Keyboard shortcuts hint */}
           {searchResults.length > 0 && (
             <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/50">
               <span className="mr-2">↑↓ Navigate</span>
               <span className="mr-2">Enter Select</span>
               <span>Esc Close</span>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
