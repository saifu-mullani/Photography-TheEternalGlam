export interface Pkg { name: string; price: string; featured?: boolean; features: string[]; }

export const packages: Pkg[] = [
  { name: "Essence", price: "From INR 45,000", features: ["4 hours coverage", "1 photographer", "200+ edited images", "Online gallery"] },
  { name: "Heirloom", price: "From INR 95,000", featured: true, features: ["Full-day coverage", "Photographer + assistant", "500+ edited images", "Cinematic highlight film", "Fine-art album"] },
  { name: "Legacy", price: "From INR 1,75,000", features: ["Multi-day coverage", "Photo + film team", "Unlimited edited images", "Feature film", "Two albums + prints"] },
];
