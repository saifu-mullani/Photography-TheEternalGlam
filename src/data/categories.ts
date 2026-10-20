export interface Category { id: string; label: string; folder: string; }

// id = filter key, folder = folder name under public/images/
export const categories: Category[] = [
  { id: "wedding", label: "Weddings", folder: "wedding" },
  { id: "pre-wedding", label: "Pre-Wedding", folder: "pre-wedding" },
  { id: "post-wedding", label: "Post-Wedding", folder: "post-wedding" },
  { id: "engagement", label: "Engagement", folder: "engagement" },
  { id: "couple", label: "Couple Portraits", folder: "couple" },
  { id: "maternity-newborn", label: "Maternity & Newborn", folder: "maternity-newborn" },
  { id: "family-lifestyle", label: "Family & Lifestyle", folder: "family-lifestyle" },
  { id: "fashion-editorial", label: "Fashion & Editorial", folder: "fashion-editorial" },
  { id: "events", label: "Events & Celebrations", folder: "events" },
  { id: "travel-destination", label: "Travel & Destination", folder: "travel-destination" },
  { id: "custom-concepts", label: "Custom Concepts", folder: "custom-concepts" },
];
