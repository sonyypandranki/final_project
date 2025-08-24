import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Filter, ArrowLeft, MapPin, Calendar, User, Phone } from "lucide-react";
import Header from "../components/Header";
import { LostFoundItem, CATEGORIES, LOCATION_CATEGORIES } from "../types/item";

const LostItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostFoundItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration - replace with Firebase data
  useEffect(() => {
    const mockItems: LostFoundItem[] = [
      {
        id: "1",
        title: "iPhone 15 Pro",
        description: "Lost my iPhone 15 Pro near the library. Has a black case with a cracked screen protector.",
        category: "Electronics",
        location: "Library",
        status: "lost",
        contactNumber: "9876543210",
        registrationNumber: "22BCE9126",
        imageUrl: "",
        createdAt: new Date("2025-01-20"),
        userId: "user1"
      },
      {
        id: "2",
        title: "Student ID Card",
        description: "Lost my student ID card in the cafeteria. Name: John Doe, Reg No: 22BCE9126",
        category: "ID Card",
        location: "Cafeteria",
        status: "lost",
        contactNumber: "9876543210",
        registrationNumber: "22BCE9126",
        imageUrl: "",
        createdAt: new Date("2025-01-19"),
        userId: "user1"
      },
      {
        id: "3",
        title: "Laptop Charger",
        description: "Lost my Dell laptop charger in AB-1 Block. It's a 65W charger with a black cable.",
        category: "Electronics",
        location: "AB-1 Block",
        status: "lost",
        contactNumber: "9876543210",
        registrationNumber: "22BCE9126",
        imageUrl: "",
        createdAt: new Date("2025-01-18"),
        userId: "user1"
      }
    ];

    setItems(mockItems);
    setFilteredItems(mockItems);
    setIsLoading(false);
  }, []);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = items.filter(item => item.status === "lost");

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, selectedLocation]);

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocationLabel = (location: string) => {
    for (const category of LOCATION_CATEGORIES) {
      if (category.options.includes(location)) {
        return `${category.label} - ${location}`;
      }
    }
    return location;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading lost items...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Lost Items
          </h1>
          <p className="text-xl text-white/90 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Browse through all reported lost items. Help your fellow students by keeping an eye out for these items.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {LOCATION_CATEGORIES.flatMap(cat => cat.options).map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedLocation("");
              }}
              className="w-full md:w-auto hover-scale hover-glow transition-all duration-300"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredItems.length} lost item{filteredItems.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && ` in ${selectedCategory}`}
            {selectedLocation && ` at ${selectedLocation}`}
          </p>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No lost items found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory || selectedLocation 
                ? "Try adjusting your search or filters"
                : "No lost items have been reported yet"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Card key={item.id} className="hover-lift hover-glow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Category and Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 hover-scale"
                           onClick={() => handleCategoryClick(item.category)}>
                      {item.category}
                    </Badge>
                    <Badge variant="destructive" className="animate-pulse-slow">Lost</Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{getLocationLabel(item.location)}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Lost on {formatDate(item.createdAt)}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="h-4 w-4" />
                      <span>Reg: {item.registrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{item.contactNumber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostItems;
