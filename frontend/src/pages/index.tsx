/**
 * Main Page - Sales Management Dashboard
 */
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import SearchBar from '@/components/SearchBar';
import FilterPanel, { FilterState } from '@/components/FilterPanel';
import TransactionTable from '@/components/TransactionTable';
import SortingDropdown, { SortOption } from '@/components/SortingDropdown';
import Pagination from '@/components/Pagination';
import { salesAPI, TransactionFilters, FilterOptions } from '@/services/api';

const Home: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    customer_regions: [],
    genders: [],
    product_categories: [],
    tags: [],
    payment_methods: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await salesAPI.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    loadFilterOptions();
  }, []);

  // Load transactions when filters/search/sort/page changes
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters: TransactionFilters = {
        search: searchTerm || undefined,
        customer_regions: filters.customer_regions.length > 0 ? filters.customer_regions : undefined,
        genders: filters.genders.length > 0 ? filters.genders : undefined,
        age_min: filters.age_min,
        age_max: filters.age_max,
        product_categories: filters.product_categories.length > 0 ? filters.product_categories : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        payment_methods: filters.payment_methods.length > 0 ? filters.payment_methods : undefined,
        date_from: filters.date_from,
        date_to: filters.date_to,
        sort_by: sortBy,
        page: currentPage,
        page_size: 10,
      };

      const response = await salesAPI.getTransactions(apiFilters);
      setTransactions(response.transactions);
      setPagination({
        total_count: response.total_count,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_previous: response.has_previous,
      });
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, sortBy, currentPage]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Reset to page 1 when filters/search/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>TruEstate - Sales Management System</title>
        <meta name="description" content="Retail Sales Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container">
        <header className="header">
          <h1>Retail Sales Management System</h1>
          <p className="subtitle">Manage and analyze sales transactions</p>
        </header>

        <div className="main-content">
          <div className="left-panel">
            {filterOptions && (
              <FilterPanel
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>

          <div className="right-panel">
            <div className="controls">
              <SearchBar onSearch={handleSearch} />
              <SortingDropdown value={sortBy} onChange={handleSortChange} />
            </div>

            <div className="results-info">
              <p>Showing {transactions.length} of {pagination.total_count} transactions</p>
            </div>

            <TransactionTable transactions={transactions} loading={loading} />

            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                hasNext={pagination.has_next}
                hasPrevious={pagination.has_previous}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 32px;
          color: #333;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #666;
          font-size: 16px;
        }
        .main-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
        }
        .left-panel {
          position: sticky;
          top: 20px;
          height: fit-content;
        }
        .right-panel {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .controls {
          margin-bottom: 20px;
        }
        .results-info {
          margin-bottom: 16px;
          color: #666;
          font-size: 14px;
        }
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          .left-panel {
            position: static;
          }
        }
      `}</style>
    </>
  );
};

export default Home;

