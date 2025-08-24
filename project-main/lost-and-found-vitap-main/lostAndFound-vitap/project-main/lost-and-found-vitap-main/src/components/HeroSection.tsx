import { Button } from "./ui/button";
import { Upload, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import AddItemDialog from "./AddItemDialog";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="University Lost and Found"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
          Lost Something?
          <br />
          <span className="text-primary-glow">Found Something?</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Connect with your university community to reunite lost items with their owners. 
          Quick, secure, and designed for students.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <AddItemDialog 
            trigger={
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg bg-white/20 hover:bg-white/30 border-white/30 text-white shadow-strong transition-all duration-300 backdrop-blur-sm border hover-scale hover-glow"
              >
                <Upload className="mr-2 h-5 w-5" />
                Report an Item
              </Button>
            }
          />
        </div>

        {/* Stats removed as requested */}
      </div>
    </section>
  );
};

export default HeroSection;