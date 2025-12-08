/**
 * TransactionTable Component - Displays transactions in a table
 */
import React from 'react';
import { Transaction } from '@/services/api';

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <p>Loading transactions...</p>
        <style jsx>{`
          .loading {
            text-align: center;
            padding: 40px;
          }
        `}</style>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="no-results">
        <p>No transactions found matching your criteria.</p>
        <style jsx>{`
          .no-results {
            text-align: center;
            padding: 40px;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Final Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.customer_name}</td>
              <td>{transaction.phone_number}</td>
              <td>{transaction.customer_region}</td>
              <td>{transaction.product_name}</td>
              <td>{transaction.product_category}</td>
              <td>{transaction.quantity}</td>
              <td>₹{transaction.total_amount.toLocaleString()}</td>
              <td>₹{transaction.final_amount.toLocaleString()}</td>
              <td>{transaction.payment_method}</td>
              <td>
                <span className={`status status-${transaction.order_status.toLowerCase()}`}>
                  {transaction.order_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .transaction-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
          position: sticky;
          top: 0;
        }
        .transaction-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
        }
        .transaction-table tbody tr:hover {
          background: #f8f9fa;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-completed {
          background: #d4edda;
          color: #155724;
        }
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        .status-returned, .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default TransactionTable;

