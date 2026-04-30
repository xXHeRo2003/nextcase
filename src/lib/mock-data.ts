import { Market } from "@/types/market";

export const MOCK_MARKETS: Market[] = [
  {
    id: "1",
    title: "Will Bitcoin hit $100,000 by the end of 2026?",
    category: "Crypto",
    volume: 1250000,
    endDate: "2026-12-31T23:59:59Z",
    status: "active",
    options: [
      { id: "yes", name: "Yes", probability: 65 },
      { id: "no", name: "No", probability: 35 },
    ],
  },
  {
    id: "2",
    title: "Who will win the 2026 FIFA World Cup?",
    category: "Sports",
    volume: 5000000,
    endDate: "2026-07-19T20:00:00Z",
    status: "active",
    options: [
      { id: "brazil", name: "Brazil", probability: 15 },
      { id: "france", name: "France", probability: 12 },
      { id: "argentina", name: "Argentina", probability: 10 },
      { id: "other", name: "Other", probability: 63 },
    ],
  },
  {
    id: "3",
    title: "Will the next US President be a Democrat?",
    category: "Politics",
    volume: 3200000,
    endDate: "2028-11-07T23:59:59Z",
    status: "active",
    options: [
      { id: "yes", name: "Yes", probability: 48 },
      { id: "no", name: "No", probability: 52 },
    ],
  },
  {
    id: "4",
    title: "Will Ethereum 2.0 transaction fees drop below $0.01?",
    category: "Crypto",
    volume: 850000,
    endDate: "2026-06-30T23:59:59Z",
    status: "active",
    options: [
      { id: "yes", name: "Yes", probability: 25 },
      { id: "no", name: "No", probability: 75 },
    ],
  },
  {
    id: "5",
    title: "Will a human set foot on Mars before 2030?",
    category: "Science",
    volume: 150000,
    endDate: "2029-12-31T23:59:59Z",
    status: "active",
    options: [
      { id: "yes", name: "Yes", probability: 15 },
      { id: "no", name: "No", probability: 85 },
    ],
  },
];

export const fetchMarkets = async (category?: string, search?: string): Promise<Market[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filtered = [...MOCK_MARKETS];

  if (category && category !== "All") {
    filtered = filtered.filter((m) => m.category === category);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((m) => m.title.toLowerCase().includes(s));
  }

  return filtered;
};
