import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Phone, Eye } from "lucide-react";
import { useItems } from "../hooks/useItems";
import AddItemDialog from "./AddItemDialog";

const RecentItemsSection = () => {
  const { getRecentItems } = useItems();
  const recentItems = getRecentItems(4);

  if (recentItems.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Recent Items
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Latest lost and found items from your university community. Act fast to help reunite items with their owners.
            </p>
          </div>

          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Eye className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                No Items Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to help your community by reporting a lost or found item.
              </p>
              <AddItemDialog 
                trigger={
                  <Button variant="hero" size="lg">
                    Report First Item
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Recent Items
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Latest lost and found items from your university community. Act fast to help reunite items with their owners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {recentItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border-0">
              <div className="relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Eye className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge 
                  className={`absolute top-3 left-3 ${
                    item.status === 'found' 
                      ? 'bg-success text-white' 
                      : 'bg-warning text-white'
                  }`}
                >
                  {item.status === 'found' ? 'Found' : 'Lost'}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-card-foreground">
                      {item.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
                  className="flex-1"
                  onClick={() => {
                    // Show phone number in an alert for now
                    alert(`Contact: ${item.phone}`);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => console.log(`View details clicked for: ${item.title}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            View All Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentItemsSection;