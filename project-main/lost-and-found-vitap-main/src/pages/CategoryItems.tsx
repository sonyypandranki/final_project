import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Phone, Eye, ArrowLeft, Filter } from "lucide-react";
import { useItems } from "../hooks/useItems";
import { useAuth } from "../hooks/useAuth";
import { CATEGORIES } from "../types/item";
import AddItemDialog from "../components/AddItemDialog";
import Header from "../components/Header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const CategoryItems = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { items, removeItem } = useItems();
  const { regNo, isLoggedIn } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found'>('all');

  // Decode the category from URL (replace hyphens with spaces and handle special cases)
  const decodedCategory = category ? decodeURIComponent(category).replace(/-/g, ' ') : '';
  
  // Validate if the category exists
  const isValidCategory = CATEGORIES.includes(decodedCategory as any);

  // Filter items by category and status
  const filteredItems = items
    .filter((item) => {
      const categoryMatch = item.category === decodedCategory;
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      return categoryMatch && statusMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // If category is invalid, redirect to home
  useEffect(() => {
    if (category && !isValidCategory) {
      navigate('/');
    }
  }, [category, isValidCategory, navigate]);

  if (!isValidCategory) {
    return null;
  }

  const handleBackToHome = () => {
    navigate('/');
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Electronics: "📱",
      Accessories: "💼",
      Bags: "👜",
      Documents: "📄",
      "ID Card": "🆔",
      Keys: "🔑",
      Clothing: "👕",
      Books: "📚",
      Others: "📦",
    };
    return iconMap[categoryName] || "📦";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header */}
      <div className="bg-gradient-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="text-foreground hover:bg-background/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-in">
              {getCategoryIcon(decodedCategory)}
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground animate-slide-down">
              {decodedCategory}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Browse all {decodedCategory.toLowerCase()} items that have been lost or found in your university community.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Add Item Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by status:</span>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'lost' | 'found') => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="lost">Lost Only</SelectItem>
                <SelectItem value="found">Found Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AddItemDialog
            trigger={
              <Button variant="hero" size="lg">
                Add {decodedCategory} Item
              </Button>
            }
          />
        </div>

        {/* Items Count */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            {filteredItems.length === 0 ? (
              `No ${decodedCategory.toLowerCase()} items found`
            ) : (
              `Showing ${filteredItems.length} ${decodedCategory.toLowerCase()} item${filteredItems.length === 1 ? '' : 's'}`
            )}
          </p>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              No {decodedCategory} Items Yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to report a {decodedCategory.toLowerCase()} item. Your report could help someone find what they're looking for.
            </p>
            <AddItemDialog
              trigger={
                <Button variant="hero" size="lg">
                  Report {decodedCategory} Item
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
                             <Card
                 key={item.id}
                 id={`item-${item.id}`}
                 className="group overflow-hidden shadow-soft hover-lift hover-glow border-0 animate-fade-in"
                 style={{ animationDelay: `${index * 0.1}s` }}
               >
                <div className="relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
                      <Eye className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  )}
                  <Badge 
                    className={`absolute top-3 left-3 ${
                      item.status === 'lost' 
                        ? 'bg-warning text-white' 
                        : 'bg-success text-white'
                    }`}
                  >
                    {item.status === 'lost' ? 'Lost' : 'Found'}
                  </Badge>
                  <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-card-foreground line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button
                    variant="hero"
                    size="sm"
                    className="flex-1 hover-scale hover-glow transition-all duration-300"
                    onClick={() => {
                      alert(`Contact: ${item.phone}`);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  
                  {isLoggedIn && regNo === item.regNo && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="hover-scale hover-glow transition-all duration-300">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the item from the list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeItem(item.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItems;
