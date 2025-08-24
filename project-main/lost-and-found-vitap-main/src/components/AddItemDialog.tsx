import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select";
import { Label } from "./ui/label";
import { Plus, Camera } from "lucide-react";
import { CATEGORIES, LOCATION_CATEGORIES } from "../types/item";
import { useItems } from "../hooks/useItems";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

interface AddItemDialogProps {
  trigger?: React.ReactNode;
}

const AddItemDialog = ({ trigger }: AddItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'lost' as 'lost' | 'found',
    phone: '',
    image: ''
  });
  const [phoneError, setPhoneError] = useState<string>('');

  const { addItem } = useItems();
  const { toast } = useToast();
  const { regNo } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (jpg, png, etc.)',
        variant: 'destructive',
      });
      return;
    }
    const MAX_SIZE_BYTES = 5_000_000; // ~5MB
    if (file.size > MAX_SIZE_BYTES) {
      toast({
        title: 'Image too large',
        description: 'Please choose an image smaller than 5 MB',
        variant: 'destructive',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: (reader.result as string) || '' }));
    };
    reader.readAsDataURL(file);
  };

  // Validate phone number (must be exactly 10 digits)
  const validatePhoneNumber = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  // Handle phone input change with validation
  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, phone }));
    
    if (phone.trim() === '') {
      setPhoneError('');
    } else if (!validatePhoneNumber(phone)) {
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setPhoneError(`Need ${10 - digitsOnly.length} more digit${10 - digitsOnly.length === 1 ? '' : 's'}`);
      } else if (digitsOnly.length > 10) {
        setPhoneError('Phone number is too long');
      } else {
        setPhoneError('Invalid phone number format');
      }
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must contain exactly 10 digits.",
        variant: "destructive"
      });
      return;
    }

    // Check if there are any validation errors
    if (phoneError) {
      toast({
        title: "Validation Error",
        description: "Please fix the phone number error before submitting.",
        variant: "destructive"
      });
      return;
    }

    addItem({
      ...formData,
      date: new Date().toLocaleDateString(),
      regNo,
    });

    toast({
      title: "Item Added Successfully",
      description: `Your ${formData.status} item has been posted to the community.`,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      status: 'lost',
      phone: '',
      image: ''
    });
    
    setPhoneError('');
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="shadow-soft">
      <Plus className="h-4 w-4 mr-2" />
      Report Item
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Report Lost/Found Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Label className="space-y-2">
              <span>Item Status *</span>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'lost' | 'found') => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost">Lost Item</SelectItem>
                  <SelectItem value="found">Found Item</SelectItem>
                </SelectContent>
              </Select>
            </Label>

            <Label className="space-y-2">
              <span>Category *</span>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
          </div>

          {/* Title */}
          <Label className="space-y-2">
            <span>Item Title *</span>
            <Input
              placeholder="e.g., Black iPhone 14 Pro"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </Label>

          {/* Description */}
          <Label className="space-y-2">
            <span>Description *</span>
            <Textarea
              placeholder="Describe the item in detail (color, brand, special marks, etc.)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </Label>

          {/* Location and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <Label className="space-y-2">
              <span>Location *</span>
              <Select 
                value={formData.location}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_CATEGORIES.map(group => (
                    <SelectGroup key={group.label}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group.options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </Label>

            <Label className="space-y-2">
              <span>Contact Number *</span>
              <Input
                placeholder=""
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={15}
                pattern="[0-9+\s-]*"
                title="Enter a 10-digit phone number"
                className={phoneError ? "border-destructive" : ""}
              />
              {phoneError && (
                <p className="text-xs text-destructive">
                  {phoneError}
                </p>
              )}
            </Label>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo (Optional)</Label>
            {formData.image ? (
              <div className="space-y-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md border"
                />
                <div className="flex gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a photo to help identify the item
                </p>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="mx-auto max-w-sm" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full">
            Post {formData.status === 'lost' ? 'Lost' : 'Found'} Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;