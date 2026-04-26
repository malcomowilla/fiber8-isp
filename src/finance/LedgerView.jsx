// components/LedgerView.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Receipt,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function LedgerView({ company }) {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Mock ledger data - in real app, fetch from backend
  const ledgerEntries = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'revenue',
      account: 'Software Subscriptions (External)',
      description: 'Monthly subscription - CityNet ISP',
      reference: 'INV-001',
      debit: 0,
      credit: 50000,
      company: 'saas',
      status: 'posted',
      attachments: 2
    },
    {
      id: 2,
      date: '2024-01-15',
      type: 'expense',
      account: 'Server Hosting',
      description: 'AWS hosting charges for January',
      reference: 'EXP-001',
      debit: 15000,
      credit: 0,
      company: 'saas',
      status: 'posted',
      attachments: 1
    },
    {
      id: 3,
      date: '2024-01-14',
      type: 'revenue',
      account: 'Hotspot Voucher Sales',
      description: 'Daily voucher sales summary',
      reference: 'VOU-001',
      debit: 0,
      credit: 25000,
      company: 'isp',
      status: 'posted',
      attachments: 0
    },
    {
      id: 4,
      date: '2024-01-14',
      type: 'expense',
      account: 'Bandwidth Costs',
      description: 'Monthly bandwidth payment to upstream provider',
      reference: 'EXP-002',
      debit: 12000,
      credit: 0,
      company: 'isp',
      status: 'pending',
      attachments: 1
    },
    {
      id: 5,
      date: '2024-01-13',
      type: 'revenue',
      account: 'Software Subscriptions (Internal)',
      description: 'Intercompany software license payment',
      reference: 'INT-001',
      debit: 0,
      credit: 10000,
      company: 'saas',
      status: 'posted',
      attachments: 0
    },
    {
      id: 6,
      date: '2024-01-13',
      type: 'expense',
      account: 'Software License Fee',
      description: 'Intercompany software license payment to SaaS company',
      reference: 'INT-001',
      debit: 10000,
      credit: 0,
      company: 'isp',
      status: 'posted',
      attachments: 1
    },
    {
      id: 7,
      date: '2024-01-12',
      type: 'asset',
      account: 'Office Equipment',
      description: 'Purchase of new office computers',
      reference: 'AST-001',
      debit: 80000,
      credit: 0,
      company: 'saas',
      status: 'posted',
      attachments: 3
    },
    {
      id: 8,
      date: '2024-01-12',
      type: 'liability',
      account: 'Accounts Payable',
      description: 'Payment due to equipment supplier',
      reference: 'LIA-001',
      debit: 0,
      credit: 80000,
      company: 'saas',
      status: 'pending',
      attachments: 2
    },
    {
      id: 9,
      date: '2024-01-11',
      type: 'revenue',
      account: 'Installation Fees',
      description: 'Customer installation for business client',
      reference: 'INV-002',
      debit: 0,
      credit: 15000,
      company: 'isp',
      status: 'posted',
      attachments: 1
    },
    {
      id: 10,
      date: '2024-01-10',
      type: 'expense',
      account: 'Marketing',
      description: 'Facebook advertising campaign',
      reference: 'EXP-003',
      debit: 25000,
      credit: 0,
      company: 'saas',
      status: 'posted',
      attachments: 1
    }
  ];

  // Filter entries based on selected company
  const filteredEntries = ledgerEntries.filter(entry => {
    if (company !== 'consolidated' && entry.company !== company) return false;
    if (typeFilter !== 'all' && typeFilter !== 'intercompany') {
      if (typeFilter !== entry.type) return false;
    }
    if (typeFilter === 'intercompany') {
      if (!entry.description.toLowerCase().includes('intercompany')) return false;
    }
    if (search && !entry.description.toLowerCase().includes(search.toLowerCase()) && 
        !entry.account.toLowerCase().includes(search.toLowerCase()) &&
        !entry.reference.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = Math.max(a.debit, a.credit);
        bValue = Math.max(b.debit, b.credit);
        break;
      case 'account':
        aValue = a.account.toLowerCase();
        bValue = b.account.toLowerCase();
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalDebits = filteredEntries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = filteredEntries.reduce((sum, entry) => sum + entry.credit, 0);
  const netBalance = totalCredits - totalDebits;

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEntries(sortedEntries.map(entry => entry.id));
    } else {
      setSelectedEntries([]);
    }
  };

  const handleSelectEntry = (id) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const handleExport = () => {
    const dataToExport = selectedEntries.length > 0 
      ? sortedEntries.filter(entry => selectedEntries.includes(entry.id))
      : sortedEntries;
    
    // In real app, this would call an API or generate CSV
    console.log('Exporting data:', dataToExport);
    alert(`Preparing export of ${dataToExport.length} transactions...`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompanyColor = (companyType) => {
    switch(companyType) {
      case 'saas': return 'bg-blue-100 text-blue-800';
      case 'isp': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'revenue': return 'bg-green-50 text-green-700';
      case 'expense': return 'bg-red-50 text-red-700';
      case 'asset': return 'bg-blue-50 text-blue-700';
      case 'liability': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">General Ledger</h2>
            <p className="text-gray-600">
              Showing {sortedEntries.length} of {ledgerEntries.length} transactions
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search description, account, or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 md:w-80"
              />
            </div>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastQuarter">Last Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                typeFilter === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>All Transactions</span>
            </button>
            <button
              onClick={() => setTypeFilter('revenue')}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                typeFilter === 'revenue'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="h-3 w-3" />
              <span>Revenue</span>
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                typeFilter === 'expense'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown className="h-3 w-3" />
              <span>Expenses</span>
            </button>
            <button
              onClick={() => setTypeFilter('asset')}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                typeFilter === 'asset'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>Assets</span>
            </button>
            <button
              onClick={() => setTypeFilter('liability')}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                typeFilter === 'liability'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Receipt className="h-3 w-3" />
              <span>Liabilities</span>
            </button>
            <button
              onClick={() => setTypeFilter('intercompany')}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                typeFilter === 'intercompany'
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>Intercompany</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                viewMode === 'table'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                viewMode === 'card'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-gray-200">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Debits</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">
                Ksh {totalDebits.toLocaleString()}
              </p>
            </div>
            <div className="text-blue-400">
              <TrendingDown className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Credits</p>
              <p className="text-2xl font-bold text-green-800 mt-2">
                Ksh {totalCredits.toLocaleString()}
              </p>
            </div>
            <div className="text-green-400">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl border ${
          netBalance >= 0 
            ? 'bg-green-50 border-green-100' 
            : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                netBalance >= 0 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                Net Balance
              </p>
              <p className={`text-2xl font-bold mt-2 ${
                netBalance >= 0 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                Ksh {netBalance.toLocaleString()}
              </p>
            </div>
            {netBalance >= 0 ? (
              <div className="text-green-400">
                <ChevronUp className="h-8 w-8" />
              </div>
            ) : (
              <div className="text-red-400">
                <ChevronDown className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Transactions</p>
              <p className="text-2xl font-bold text-purple-800 mt-2">
                {sortedEntries.length}
              </p>
            </div>
            <div className="text-purple-400">
              <FileText className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={selectedEntries.length === sortedEntries.length && sortedEntries.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortBy === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    {sortBy === 'type' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('account')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Account</span>
                    {sortBy === 'account' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Debit (KSH)</span>
                    {sortBy === 'amount' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit (KSH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEntries.map((entry, index) => {
                const runningBalance = sortedEntries
                  .slice(0, index + 1)
                  .reduce((sum, e) => sum + e.credit - e.debit, 0);
                
                return (
                  <tr 
                    key={entry.id} 
                    className={`hover:bg-gray-50 ${selectedEntries.includes(entry.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.id)}
                        onChange={() => handleSelectEntry(entry.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCompanyColor(entry.company)}`}>
                        {entry.company === 'saas' ? 'SaaS' : 'ISP'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.account}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={entry.description}>
                        {entry.description}
                      </div>
                      {entry.attachments > 0 && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <FileText className="h-3 w-3 mr-1" />
                          {entry.attachments} attachment{entry.attachments !== 1 ? 's' : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{entry.reference}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entry.debit > 0 && (
                        <span className="text-red-600 font-medium">
                          {entry.debit.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entry.credit > 0 && (
                        <span className="text-green-600 font-medium">
                          {entry.credit.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View */
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEntries.map((entry) => (
            <div 
              key={entry.id} 
              className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                selectedEntries.includes(entry.id) ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCompanyColor(entry.company)}`}>
                      {entry.company === 'saas' ? 'SaaS' : 'ISP'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(entry.type)}`}>
                      {entry.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">{entry.account}</h4>
                  <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEntries.includes(entry.id)}
                  onChange={() => handleSelectEntry(entry.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reference</p>
                  <p className="text-sm font-medium font-mono">{entry.reference}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="space-y-1">
                  {entry.debit > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Debit</p>
                      <p className="text-lg font-bold text-red-600">
                        Ksh {entry.debit.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {entry.credit > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Credit</p>
                      <p className="text-lg font-bold text-green-600">
                        Ksh {entry.credit.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {entry.attachments > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <FileText className="h-3 w-3 mr-1" />
                    {entry.attachments} attachment{entry.attachments !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer with batch actions */}
      {selectedEntries.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-700">
                {selectedEntries.length} transaction{selectedEntries.length !== 1 ? 's' : ''} selected
              </span>
              <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                Bulk Edit
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                Change Status
              </button>
              <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Delete Selected
              </button>
            </div>
            <button 
              onClick={() => setSelectedEntries([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedEntries.length === 0 && (
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {search 
              ? `No transactions match "${search}". Try adjusting your search or filters.`
              : 'No transactions recorded for the selected period or filters.'}
          </p>
          <button 
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
              setDateRange('thisMonth');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}