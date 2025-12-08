/**
 * SortingDropdown Component - Handles sorting options
 */
import React from 'react';

export type SortOption = 
  | 'date_desc' 
  | 'date_asc' 
  | 'quantity_desc' 
  | 'quantity_asc' 
  | 'customer_name_asc' 
  | 'customer_name_desc';

interface SortingDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ value, onChange }) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date_desc', label: 'Date (Newest First)' },
    { value: 'date_asc', label: 'Date (Oldest First)' },
    { value: 'quantity_desc', label: 'Quantity (High to Low)' },
    { value: 'quantity_asc', label: 'Quantity (Low to High)' },
    { value: 'customer_name_asc', label: 'Customer Name (A-Z)' },
    { value: 'customer_name_desc', label: 'Customer Name (Z-A)' },
  ];

  return (
    <div className="sorting-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="sort-select"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <style jsx>{`
        .sorting-dropdown {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .sorting-dropdown label {
          font-weight: 600;
          font-size: 14px;
        }
        .sort-select {
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.3s;
        }
        .sort-select:focus {
          border-color: #4a90e2;
        }
      `}</style>
    </div>
  );
};

export default SortingDropdown;

