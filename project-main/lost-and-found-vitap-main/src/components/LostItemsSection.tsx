import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Phone, Eye } from "lucide-react";
import { useItems } from "../hooks/useItems";
import AddItemDialog from "./AddItemDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useAuth } from "../hooks/useAuth";

const LostItemsSection = () => {
  const { items, removeItem } = useItems();
  const { regNo, isLoggedIn } = useAuth();
  const lostItems = items
    .filter((item) => item.status === "lost")
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (lostItems.length === 0) {
    return (
      <section id="lost-items" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Lost Items</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No lost items yet. Report the first lost item to help the community.
            </p>
          </div>

          <div className="text-center py-12">
            <AddItemDialog
              trigger={
                <Button variant="hero" size="lg">
                  Report Lost Item
                </Button>
              }
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lost-items" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Lost Items</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recently reported lost items from your university community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {lostItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border-0"
            >
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
                <Badge className="absolute top-3 left-3 bg-warning text-white">
                  Lost
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
                    alert(`Contact: ${item.phone}`);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                {isLoggedIn && regNo === item.regNo && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">Delete</Button>
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
      </div>
    </section>
  );
};

export default LostItemsSection;


