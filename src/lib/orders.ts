export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  pickupDate: string;
  pickupTime: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
}

export function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`;
}

export const PICKUP_TIMES = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

export const TAX_RATE = 0.056; // Tucson sales tax
