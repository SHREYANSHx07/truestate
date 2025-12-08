/**
 * Pagination Component - Handles page navigation
 */
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious}
        className="pagination-btn"
      >
        Previous
      </button>
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={!hasNext}
        className="pagination-btn"
      >
        Next
      </button>
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding: 20px;
        }
        .pagination-btn {
          padding: 10px 20px;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }
        .pagination-btn:hover:not(:disabled) {
          background: #357abd;
        }
        .pagination-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Pagination;

