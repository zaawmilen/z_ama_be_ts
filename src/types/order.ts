export interface Order {
    id: number;
    userId: number;
    productIds: number[];
    status: string;
    totalAmount: number;
  }
  