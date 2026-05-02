export type MarketStatus = "active" | "resolved" | "cancelled";
export type Category = "Crypto" | "Politics" | "Sports" | "Science" | "Other";

export interface MarketOption {
  id: string;
  name: string;
  probability: number; // 0 to 100
}

export interface Market {
  id: string;
  title: string;
  category: Category;
  volume: number;
  endDate: string;
  status: MarketStatus;
  options: MarketOption[];
  imageUrl?: string;
}
