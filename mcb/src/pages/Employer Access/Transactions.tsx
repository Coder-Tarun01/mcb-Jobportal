import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EmployerLayout from '../../components/employer/EmployerLayout';
import './Transactions.css';

interface Transaction {
  orderId: string;
  type: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'pending' | 'successful' | 'failed';
}

type SortField = 'orderId' | 'type' | 'amount' | 'date' | 'paymentMethod' | 'status';
type SortDirection = 'asc' | 'desc';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
      return;
    }
  }, [user, navigate, isEmployer]);

  const transactions = useMemo<Transaction[]>(() => [
    {
      orderId: '#123',
      type: 'Social Media Expert',
      amount: 99.00,
      date: 'Dec 15, 2024',
      paymentMethod: 'PayPal',
      status: 'pending'
    },
    {
      orderId: '#456',
      type: 'Web Designer',
      amount: 199.00,
      date: 'Nov 10, 2024',
      paymentMethod: 'Bank Transfer',
      status: 'pending'
    },
    {
      orderId: '#789',
      type: 'Finance Accountant',
      amount: 299.00,
      date: 'Oct 5, 2024',
      paymentMethod: 'PayPal',
      status: 'pending'
    },
    {
      orderId: '#101',
      type: 'Social Media Expert',
      amount: 399.00,
      date: 'Dec 15, 2024',
      paymentMethod: 'Bank Transfer',
      status: 'successful'
    },
    {
      orderId: '#202',
      type: 'UI/UX Designer',
      amount: 249.00,
      date: 'Nov 28, 2024',
      paymentMethod: 'Credit Card',
      status: 'successful'
    },
    {
      orderId: '#303',
      type: 'Backend Developer',
      amount: 449.00,
      date: 'Nov 15, 2024',
      paymentMethod: 'PayPal',
      status: 'failed'
    },
    {
      orderId: '#404',
      type: 'Digital Marketer',
      amount: 179.00,
      date: 'Oct 22, 2024',
      paymentMethod: 'Bank Transfer',
      status: 'successful'
    },
    {
      orderId: '#505',
      type: 'Data Analyst',
      amount: 329.00,
      date: 'Oct 8, 2024',
      paymentMethod: 'Credit Card',
      status: 'pending'
    },
    {
      orderId: '#606',
      type: 'Product Manager',
      amount: 599.00,
      date: 'Sep 30, 2024',
      paymentMethod: 'PayPal',
      status: 'successful'
    },
    {
      orderId: '#707',
      type: 'Content Writer',
      amount: 149.00,
      date: 'Sep 18, 2024',
      paymentMethod: 'Bank Transfer',
      status: 'failed'
    },
    {
      orderId: '#808',
      type: 'Mobile Developer',
      amount: 399.00,
      date: 'Sep 5, 2024',
      paymentMethod: 'Credit Card',
      status: 'successful'
    },
    {
      orderId: '#909',
      type: 'DevOps Engineer',
      amount: 499.00,
      date: 'Aug 25, 2024',
      paymentMethod: 'PayPal',
      status: 'pending'
    }
  ], []);

  // Get unique values for filter dropdowns
  const paymentMethods = [...new Set(transactions.map(t => t.paymentMethod))];
  const statuses = [...new Set(transactions.map(t => t.status))];

  // Filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesStatus && matchesPaymentMethod;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      if (sortField === 'amount') {
        aValue = a.amount;
        bValue = b.amount;
      } else if (sortField === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchTerm, statusFilter, paymentMethodFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportTransactions = () => {
    // Simulate export functionality
    console.log('Exporting transactions...');
    // In a real app, this would generate CSV/PDF
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="emp-trans-sort-icon" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="emp-trans-sort-icon emp-trans-active" /> : 
      <ArrowDown className="emp-trans-sort-icon emp-trans-active" />;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'emp-trans-status-pending';
      case 'successful': return 'emp-trans-status-successful';
      case 'failed': return 'emp-trans-status-failed';
      default: return '';
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <EmployerLayout>
      <div className="emp-trans-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="emp-trans-container"
        >
        <div className="emp-trans-header">
          <button onClick={() => navigate('/employer/dashboard')} className="emp-trans-back-btn">
            <ArrowLeft className="emp-trans-btn-icon" />
            <span>Back to Dashboard</span>
          </button>
          <div className="emp-trans-header-content">
            <h1 className="emp-trans-title">Transaction History</h1>
          </div>
        </div>

        <div className="emp-trans-content">
          {/* Search and Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="emp-trans-filters-section"
          >
            <div className="emp-trans-search-and-export">
              <div className="emp-trans-search-container">
                <Search className="emp-trans-search-icon" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Type, or Status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="emp-trans-search-input"
                />
              </div>
              <button onClick={handleExportTransactions} className="emp-trans-export-btn">
                <Download className="emp-trans-btn-icon" />
                <span>Export</span>
              </button>
            </div>

            <div className="emp-trans-filter-controls">
              <div className="emp-trans-filter-group">
                <label className="emp-trans-filter-label">Status</label>
                <div className="emp-trans-filter-select-container">
                  <Filter className="emp-trans-filter-icon" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="emp-trans-filter-select"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="emp-trans-filter-group">
                <label className="emp-trans-filter-label">Payment Method</label>
                <div className="emp-trans-filter-select-container">
                  <Filter className="emp-trans-filter-icon" />
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="emp-trans-filter-select"
                  >
                    <option value="all">All Methods</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Transaction Table Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="emp-trans-table-section"
          >
            <div className="emp-trans-table-container">
              <div className="emp-trans-table">
                <div className="emp-trans-table-header">
                  <div 
                    className="emp-trans-header-cell emp-trans-sortable"
                    onClick={() => handleSort('orderId')}
                  >
                    <span>Order ID</span>
                    {getSortIcon('orderId')}
                  </div>
                  <div 
                    className="emp-trans-header-cell emp-trans-sortable"
                    onClick={() => handleSort('type')}
                  >
                    <span>Type</span>
                    {getSortIcon('type')}
                  </div>
                  <div 
                    className="emp-trans-header-cell emp-trans-sortable emp-trans-amount-cell"
                    onClick={() => handleSort('amount')}
                  >
                    <span>Amount</span>
                    {getSortIcon('amount')}
                  </div>
                  <div 
                    className="emp-trans-header-cell emp-trans-sortable"
                    onClick={() => handleSort('date')}
                  >
                    <span>Date</span>
                    {getSortIcon('date')}
                  </div>
                  <div 
                    className="emp-trans-header-cell emp-trans-sortable"
                    onClick={() => handleSort('paymentMethod')}
                  >
                    <span>Payment Method</span>
                    {getSortIcon('paymentMethod')}
                  </div>
                  <div 
                    className="emp-trans-header-cell emp-trans-sortable"
                    onClick={() => handleSort('status')}
                  >
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </div>

                <div className="emp-trans-table-body">
                  {paginatedTransactions.map((transaction, index) => (
                    <div 
                      key={transaction.orderId} 
                      className={`emp-trans-row ${index % 2 === 1 ? 'emp-trans-alternate' : ''}`}
                    >
                      <div className="emp-trans-table-cell emp-trans-order-id-cell">
                        <span className="emp-trans-order-id">{transaction.orderId}</span>
                      </div>
                      <div className="emp-trans-table-cell">
                        <span className="emp-trans-transaction-type">{transaction.type}</span>
                      </div>
                      <div className="emp-trans-table-cell emp-trans-amount-cell">
                        <span className="emp-trans-amount">{formatAmount(transaction.amount)}</span>
                      </div>
                      <div className="emp-trans-table-cell">
                        <span className="emp-trans-date">{transaction.date}</span>
                      </div>
                      <div className="emp-trans-table-cell">
                        <span className="emp-trans-payment-method">{transaction.paymentMethod}</span>
                      </div>
                      <div className="emp-trans-table-cell">
                        <span className={`emp-trans-status-badge ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredAndSortedTransactions.length === 0 && (
                <div className="emp-trans-empty-state">
                  <Search className="emp-trans-empty-icon" />
                  <h3>No transactions found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="emp-trans-pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="emp-trans-pagination-btn"
                >
                  <ChevronLeft className="emp-trans-pagination-icon" />
                  <span>Prev</span>
                </button>

                <div className="emp-trans-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`emp-trans-pagination-number ${currentPage === page ? 'emp-trans-active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="emp-trans-pagination-btn"
                >
                  <span>Next</span>
                  <ChevronRight className="emp-trans-pagination-icon" />
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="emp-trans-results-summary">
              <p>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} transactions
              </p>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </EmployerLayout>
  );
};

export default Transactions;
