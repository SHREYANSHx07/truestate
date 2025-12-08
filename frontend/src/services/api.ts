/**
 * API Service - Handles all API calls to backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Transaction {
  transaction_id: number;
  date: string;
  customer_id: string;
  customer_name: string;
  phone_number: string;
  gender: string;
  age: number;
  customer_region: string;
  customer_type: string;
  product_id: string;
  product_name: string;
  brand: string;
  product_category: string;
  tags: string;
  quantity: number;
  price_per_unit: number;
  discount_percentage: number;
  total_amount: number;
  final_amount: number;
  payment_method: string;
  order_status: string;
  delivery_type: string;
  store_id: string;
  store_location: string;
  salesperson_id: string;
  employee_name: string;
}

export interface PaginatedResponse {
  transactions: Transaction[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FilterOptions {
  regions: string[];
  genders: string[];
  categories: string[];
  tags: string[];
  payment_methods: string[];
  age_range: {
    min: number;
    max: number;
  };
}

export interface TransactionFilters {
  search?: string;
  customer_regions?: string[];
  genders?: string[];
  age_min?: number;
  age_max?: number;
  product_categories?: string[];
  tags?: string[];
  payment_methods?: string[];
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

export const salesAPI = {
  /**
   * Get transactions with filters, search, sorting, and pagination
   */
  getTransactions: async (filters: TransactionFilters): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.customer_regions?.length) params.append('customer_regions', filters.customer_regions.join(','));
    if (filters.genders?.length) params.append('genders', filters.genders.join(','));
    if (filters.age_min !== undefined) params.append('age_min', filters.age_min.toString());
    if (filters.age_max !== undefined) params.append('age_max', filters.age_max.toString());
    if (filters.product_categories?.length) params.append('product_categories', filters.product_categories.join(','));
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.payment_methods?.length) params.append('payment_methods', filters.payment_methods.join(','));
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());
    
    const response = await apiClient.get<PaginatedResponse>(`/sales/transactions?${params.toString()}`);
    return response.data;
  },

  /**
   * Get available filter options
   */
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await apiClient.get<FilterOptions>('/sales/filter-options');
    return response.data;
  },
};

