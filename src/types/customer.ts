export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  customerCode: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilter {
  search?: string;
  status?: CustomerStatus;
}

export interface CustomerSort {
  field: 'fullName' | 'phone' | 'email' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
} 