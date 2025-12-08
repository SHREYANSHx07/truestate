/**
 * SearchBar Component - Handles search input
 */
import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search by customer name or phone number..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <style jsx>{`
        .search-bar {
          width: 100%;
          margin-bottom: 20px;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.3s;
        }
        .search-input:focus {
          border-color: #4a90e2;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;

