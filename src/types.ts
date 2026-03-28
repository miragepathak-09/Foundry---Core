export type ItemType = 'lost' | 'found' | 'lending' | 'borrowing';
export type ItemStatus = 'active' | 'resolved' | 'on-loan' | 'rented';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: boolean;
  social?: string;
}

export interface Item {
  id: string;
  userId: string;
  type: ItemType;
  title: string;
  description: string;
  coordinates: Coordinates;
  createdAt: number;
  status: ItemStatus;
  contactInfo?: ContactInfo;
  homeLocation?: string;
  tags?: string[];
  loanedTo?: string;
  loanedAt?: number;
  pricePerDay?: number; // NPR
  deposit?: number; // NPR
  rentedBy?: string;
  rentalEndDate?: number;
  authorName?: string;
  authorRating?: number;
  neighborhood?: string;
  image?: string;
  isNew?: boolean;
}

export interface User {
  id: string;
  uid: string; // FD-2026-X
  name: string;
  email: string;
  phone?: string;
  neighborhood: string;
  karma: number;
  level: number; // Level 3: Fully Verified
  isVerified: boolean;
  photoURL?: string;
  rating?: number;
  earnings?: number;
  spending?: number;
  idVerified?: boolean;
  biometricsRegistered?: boolean;
  verificationDetails?: {
    idNumber: string;
    issueDistrict: string;
    address: string;
    verificationHash: string;
  };
  reviews?: {
    id: string;
    authorUid: string;
    authorName: string;
    rating: number;
    comment: string;
    date: number;
  }[];
}

export interface Transaction {
  id: string;
  ref?: string; // #TXN-991
  itemId: string;
  itemName: string;
  amount: number;
  type: 'rental' | 'deposit' | 'earning' | 'payout';
  status: 'pending' | 'completed' | 'escrow' | 'processing';
  timestamp: number;
  hash: string;
  counterparty: string;
  payoutMethod?: 'eSewa' | 'Khalti' | 'IME Pay';
  metadata?: any;
}

export interface WalletState {
  available: number;
  escrow: number;
  history: Transaction[];
}

export interface Match {
  lostItem: Item;
  foundItem: Item;
  distance: number;
  similarity: number;
}
