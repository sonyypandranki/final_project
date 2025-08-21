import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
// import RecentItemsSection from "../components/RecentItemsSection";
// import StatsSection from "../components/StatsSection";
import AddItemDialog from "../components/AddItemDialog";
import LostItemsSection from "../components/LostItemsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <LostItemsSection />
      {/* <RecentItemsSection /> */}
      {/* <StatsSection /> */}
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Lost & Found
              </h3>
              <p className="text-background/80 leading-relaxed">
                Connecting university students to help recover lost items quickly and securely.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-background/80">
                <li><a href="#" className="hover:text-background transition-colors">Browse Items</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Report Lost Item</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Report Found Item</a></li>
                <li><a href="#" className="hover:text-background transition-colors">My Account</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-background/80">
                <li><a href="#" className="hover:text-background transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <p>&copy; 2024 University Lost & Found.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;