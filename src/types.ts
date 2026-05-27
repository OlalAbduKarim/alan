export type BookType = 'Hardcover' | 'eBook' | 'Workbook';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'A-Level' | 'O & A Level' | 'O-Level';

export interface Book {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  type: BookType;
  level: SkillLevel;
  price: number;
  ebookPrice: number;
  stock: number; // inventory status
  description: string;
  shortDescription: string;
  lookInside: string[];
  downloadUrl?: string;
  pages: number;
  isbn: string;
  publishYear: number;
  rating: number;
  reviewsCount: number;
  curriculumTags?: string[];
}

export interface Artwork {
  id: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  image: string;
  price: number;
  originalAvailable: boolean;
  status: 'available' | 'sold';
}

export interface PartnershipTier {
  id: string;
  title: string;
  badge: string;
  description: string;
  bullets: string[];
}

export interface PartnershipLead {
  id: string;
  name: string;
  email: string;
  organization: string;
  tierId: string;
  message: string;
  submittedAt: string;
  hotLead: boolean;
  priority: boolean; // .edu emails are priority
  crmStatus: 'Synced to Google Sheets / Airtable' | 'Pending Queue';
}

export interface CartItem {
  book: Book;
  purchaseType: 'Hardcover' | 'eBook' | 'Workbook';
  quantity: number;
  addBookplates: boolean; // signed bookplates for +$10 if qty > 5 and chosen
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    bookId: string;
    title: string;
    purchaseType: string;
    quantity: number;
    pricePaid: number;
    addBookplates: boolean;
  }[];
  totalPrice: number;
  isCompleted: boolean;
  createdAt: string;
  digitalDownloadsSent: { bookTitle: string; downloadUrl: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  quote: string;
  rating: number;
}
