export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'e_wallet';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: OrderStatus;
  products: OrderProduct[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  // Thông tin chuyển khoản
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  transferContent?: string;
  // Thông tin thẻ tín dụng
  transactionId?: string;
  paymentGateway?: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderFilter {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export interface OrderSort {
  field: 'orderNumber' | 'orderDate' | 'customerName' | 'totalAmount' | 'status';
  direction: 'asc' | 'desc';
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
} 