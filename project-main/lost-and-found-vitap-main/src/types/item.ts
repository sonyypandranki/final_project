export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  status: 'lost' | 'found';
  image?: string;
  phone: string;
  regNo?: string;
  createdAt: Date;
}

export const CATEGORIES = [
  "Electronics",
  "Accessories", 
  "Bags",
  "Documents",
  "ID Card",
  "Keys",
  "Clothing",
  "Books",
  "Others"
] as const;

export const LOCATION_CATEGORIES = [
  {
    label: "Academic Blocks",
    options: ["AB-1 Block", "AB-2 Block", "CB (Central Block)"]
  },
  {
    label: "Campus Common Areas",
    options: ["Rock Plaza", "Food Street"]
  },
  {
    label: "Men’s Hostels (MH)",
    options: [
      "MH-1 Hostel",
      "MH-2 Hostel",
      "MH-3 Hostel",
      "MH-4 Hostel",
      "MH-5 Hostel"
    ]
  },
  {
    label: "Ladies’ Hostels (LH)",
    options: ["LH-1 Hostel", "LH-2 Hostel", "LH-3 Hostel"]
  }
] as const;