/**
 * FilterPanel Component - Multi-select filters
 */
import React, { useState, useEffect } from 'react';
import { FilterOptions } from '@/services/api';

interface FilterPanelProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  customer_regions: string[];
  genders: string[];
  age_min?: number;
  age_max?: number;
  product_categories: string[];
  tags: string[];
  payment_methods: string[];
  date_from?: string;
  date_to?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filterOptions, onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    customer_regions: [],
    genders: [],
    product_categories: [],
    tags: [],
    payment_methods: [],
  });

  const handleMultiSelect = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      const newFilters = { ...prev, [key]: newArray };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleAgeRange = (min?: number, max?: number) => {
    setFilters(prev => {
      const newFilters = { ...prev, age_min: min, age_max: max };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleDateRange = (from?: string, to?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, date_from: from, date_to: to };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      customer_regions: [],
      genders: [],
      product_categories: [],
      tags: [],
      payment_methods: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="clear-btn">Clear All</button>
      </div>

      {/* Customer Region */}
      <div className="filter-section">
        <label>Customer Region</label>
        <div className="checkbox-group">
          {filterOptions.regions.map(region => (
            <label key={region} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.customer_regions.includes(region)}
                onChange={() => handleMultiSelect('customer_regions', region)}
              />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="filter-section">
        <label>Gender</label>
        <div className="checkbox-group">
          {filterOptions.genders.map(gender => (
            <label key={gender} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.genders.includes(gender)}
                onChange={() => handleMultiSelect('genders', gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div className="filter-section">
        <label>Age Range</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            min={filterOptions.age_range.min}
            max={filterOptions.age_range.max}
            value={filters.age_min || ''}
            onChange={(e) => handleAgeRange(
              e.target.value ? parseInt(e.target.value) : undefined,
              filters.age_max
            )}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            min={filterOptions.age_range.min}
            max={filterOptions.age_range.max}
            value={filters.age_max || ''}
            onChange={(e) => handleAgeRange(
              filters.age_min,
              e.target.value ? parseInt(e.target.value) : undefined
            )}
          />
        </div>
      </div>

      {/* Product Category */}
      <div className="filter-section">
        <label>Product Category</label>
        <div className="checkbox-group">
          {filterOptions.categories.map(category => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.product_categories.includes(category)}
                onChange={() => handleMultiSelect('product_categories', category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="filter-section">
        <label>Tags</label>
        <div className="checkbox-group">
          {filterOptions.tags.slice(0, 20).map(tag => (
            <label key={tag} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => handleMultiSelect('tags', tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="filter-section">
        <label>Payment Method</label>
        <div className="checkbox-group">
          {filterOptions.payment_methods.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.payment_methods.includes(method)}
                onChange={() => handleMultiSelect('payment_methods', method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="filter-section">
        <label>Date Range</label>
        <div className="date-inputs">
          <input
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => handleDateRange(e.target.value || undefined, filters.date_to)}
          />
          <span>to</span>
          <input
            type="date"
            value={filters.date_to || ''}
            onChange={(e) => handleDateRange(filters.date_from, e.target.value || undefined)}
          />
        </div>
      </div>

      <style jsx>{`
        .filter-panel {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          max-height: 600px;
          overflow-y: auto;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .filter-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .clear-btn {
          padding: 6px 12px;
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .clear-btn:hover {
          background: #ff5252;
        }
        .filter-section {
          margin-bottom: 20px;
        }
        .filter-section label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
          cursor: pointer;
        }
        .checkbox-label input {
          cursor: pointer;
        }
        .range-inputs, .date-inputs {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .range-inputs input, .date-inputs input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;

