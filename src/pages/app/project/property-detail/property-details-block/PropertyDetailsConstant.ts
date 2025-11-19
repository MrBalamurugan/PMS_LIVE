import type { UploadedDocument } from "../property-details-tabs/PropertyDetailsTab4";

export interface PropertyDetails {
  id: number;
  propertyName: string;
  propertyType: string;
  projectName: string;
  projectCode: string;
  address1: string;
  address2: string;
  rating: number;
  totalUnits: number;
  totalArea: number;
  status: string;
  stage: string;
  orientation: string;
  possessionDate: string;
  pricePerSqft: number;
  priceRange: string;
  description: string;
  salePrice?: number;
  offerPrice?: number;
  saleOfferPrice: number;
  saleValidity: Date;
  rentPrice?: number;
  rentOfferPrice?: number;
  rentValidity?: Date;
  currency: string;
  amenities?: string[];
  documents?: UploadedDocument[];
  carpetSizeSqft: number;
  carpetSizeSqm: number;
  buildUpSizeSqft?: number;
  buildUpSizeSqm?: number;
  structure?: string;
}

export const propertyDetails: PropertyDetails = {
  id: 1,
  carpetSizeSqft: 1500,
  carpetSizeSqm: 139.354,
  buildUpSizeSqft: 1800,
  buildUpSizeSqm: 167.225,
  structure: "Concrete Frame",
  propertyName: "Palm Heights",
  propertyType: "Residential",
  projectName: "Palm Heights Project",
  projectCode: "PH-2025",
  address1: "123 Palm Avenue",
  address2: "Downtown, Dubai",
  rating: 4.5,
  totalUnits: 120,
  totalArea: 250000, // sqft
  status: "Active",
  stage: "Construction",
  orientation: "North-East",
  possessionDate: "2026-12-31", // ISO string
  pricePerSqft: 1500,
  salePrice: 3200000,
  saleOfferPrice: 2800000,
  saleValidity: new Date(),
  rentPrice: 15000,
  rentOfferPrice: 12000,
  rentValidity: new Date(),
  currency: "AED",
  priceRange: "1.5M - 3.2M AED",
  description:
    "Palm Heights is a premium residential project located in the heart of Dubai, offering luxury apartments with world-class amenities.",
  amenities: [
    "Swimming Pool",
    "Gymnasium",
    "Children's Play Area",
    "24/7 Security",
    "Parking",
    "Landscaped Gardens",
  ],
  documents: [
    {
      name: "Sale_Agreement.pdf",
      type: "application/pdf",
      size: 245678, // ~240 KB
    },
    {
      name: "Property_Image1.jpg",
      type: "image/jpeg",
      size: 1560000, // ~1.5 MB
    },
    {
      name: "Legal_Document.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 78500, // ~78 KB
    },
    {
      name: "FloorPlan.png",
      type: "image/png",
      size: 220000, // ~215 KB
    },
  ],
};
