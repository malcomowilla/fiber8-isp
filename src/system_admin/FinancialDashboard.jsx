// components/FinancialDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Building,
  Server,
  Wifi,
  BarChart3,
  FileText,
  Calculator,
  Home,
  Settings,
  Bell,
  User,
  LogOut,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  PieChart,
  Activity,
  Shield
} from 'lucide-react';
import TransactionForm from './TransactionForm';
import LedgerView from './LedgerView';
import BalanceSheet from './BalanceSheet';
import IncomeStatement from './IncomeStatement';



export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState('record');
  const [company, setCompany] = useState('saas');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: 'Admin User',
    role: 'Finance Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Finance'
  });

  // Mock data - in real app, fetch from backend
  const [financialData, setFinancialData] = useState({
    saas: {
      mrr: 500000,
      arr: 6000000,
      activeISPs: 45,
      churnRate: 2.5,
      softwareRevenue: 450000,
      serviceRevenue: 50000,
      expenses: 300000,
      profit: 200000,
      growth: 15,
      outstandingInvoices: 125000
    },
    isp: {
      voucherRevenue: 800000,
      pppoeRevenue: 400000,
      activeUsers: 1200,
      bandwidthCost: 300000,
      towerRent: 100000,
      softwareExpense: 50000,
      profit: 350000,
      growth: 25,
      outstandingInvoices: 85000
    }
  });

  const handleTransactionSubmit = (transaction) => {
    console.log('Transaction submitted:', transaction);
    // In real app, send to backend API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
      
      // Update local state with new transaction
      if (transaction.company === 'saas') {
        if (transaction.type === 'revenue') {
          setFinancialData(prev => ({
            ...prev,
            saas: {
              ...prev.saas,
              softwareRevenue: prev.saas.softwareRevenue + transaction.amount,
              profit: prev.saas.profit + transaction.amount
            }
          }));
        } else if (transaction.type === 'expense') {
          setFinancialData(prev => ({
            ...prev,
            saas: {
              ...prev.saas,
              expenses: prev.saas.expenses + transaction.amount,
              profit: prev.saas.profit - transaction.amount
            }
          }));
        }
      } else if (transaction.company === 'isp') {
        if (transaction.type === 'revenue') {
          setFinancialData(prev => ({
            ...prev,
            isp: {
              ...prev.isp,
              voucherRevenue: prev.isp.voucherRevenue + transaction.amount,
              profit: prev.isp.profit + transaction.amount
            }
          }));
        } else if (transaction.type === 'expense') {
          setFinancialData(prev => ({
            ...prev,
            isp: {
              ...prev.isp,
              expenses: prev.isp.expenses + transaction.amount,
              profit: prev.isp.profit - transaction.amount
            }
          }));
        }
      }
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
      console.log('Data refreshed');
    }, 1500);
  };

  const handleExport = () => {
    const data = {
      company,
      activeTab,
      financialData: financialData[company] || financialData,
      timestamp: new Date().toISOString()
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${company}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCompanyStats = () => {
    switch(company) {
      case 'saas':
        return {
          totalRevenue: financialData.saas.softwareRevenue + financialData.saas.serviceRevenue,
          activeCustomers: financialData.saas.activeISPs,
          profit: financialData.saas.profit,
          arr: financialData.saas.arr,
          growth: financialData.saas.growth,
          outstanding: financialData.saas.outstandingInvoices
        };
      case 'isp':
        return {
          totalRevenue: financialData.isp.voucherRevenue + financialData.isp.pppoeRevenue,
          activeCustomers: financialData.isp.activeUsers,
          profit: financialData.isp.profit,
          arr: financialData.isp.voucherRevenue * 12,
          growth: financialData.isp.growth,
          outstanding: financialData.isp.outstandingInvoices
        };
      case 'consolidated':
        return {
          totalRevenue: financialData.saas.softwareRevenue + financialData.saas.serviceRevenue + 
                      financialData.isp.voucherRevenue + financialData.isp.pppoeRevenue,
          activeCustomers: `${financialData.saas.activeISPs} ISPs, ${financialData.isp.activeUsers} users`,
          profit: financialData.saas.profit + financialData.isp.profit,
          arr: financialData.saas.arr + (financialData.isp.voucherRevenue * 12),
          growth: Math.round((financialData.saas.growth + financialData.isp.growth) / 2),
          outstanding: financialData.saas.outstandingInvoices + financialData.isp.outstandingInvoices
        };
      default:
        return {};
    }
  };

  const companyStats = getCompanyStats();

  const getCompanyColor = (companyType) => {
    switch(companyType) {
      case 'saas': return 'blue';
      case 'isp': return 'green';
      case 'consolidated': return 'purple';
      default: return 'gray';
    }
  };

  const getCompanyIcon = (companyType) => {
    switch(companyType) {
      case 'saas': return <Server className="h-5 w-5" />;
      case 'isp': return <Wifi className="h-5 w-5" />;
      case 'consolidated': return <Building className="h-5 w-5" />;
      default: return null;
    }
  };

  const getCompanyName = (companyType) => {
    switch(companyType) {
      case 'saas': return 'SaaS Software Company';
      case 'isp': return 'ISP Operations Company';
      case 'consolidated': return 'Consolidated Group';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Financial Management System
                </h1>
                <p className="text-sm text-gray-600">Track your SaaS and ISP finances</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Last Updated */}
              <div className="hidden md:block text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-2 rounded-lg ${isLoading ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                title="Refresh Data"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleExport}
                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                title="Export Report"
              >
                <Download className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-200"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Company Selector */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {['saas', 'isp', 'consolidated'].map((comp) => (
              <button
                key={comp}
                onClick={() => setCompany(comp)}
                className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${
                  company === comp
                    ? comp === 'saas'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : comp === 'isp'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {getCompanyIcon(comp)}
                <span>{getCompanyName(comp)}</span>
                {company === comp && (
                  <Shield className="h-4 w-4 ml-1" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-2">
                  Ksh {companyStats.totalRevenue?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    +{companyStats.growth || 0}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold mt-2">
                  {typeof companyStats.activeCustomers === 'number'
                    ? companyStats.activeCustomers.toLocaleString()
                    : companyStats.activeCustomers}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-gray-500">
                    {company === 'saas' ? 'ISP Clients' : 
                     company === 'isp' ? 'End Users' : 
                     'Total Customers'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Profit Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Profit</p>
                <p className="text-2xl font-bold mt-2 text-green-600">
                  Ksh {companyStats.profit?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-500">
                    {companyStats.profit > 0 ? 'Profit' : 'Loss'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* ARR Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Annual Run Rate</p>
                <p className="text-2xl font-bold mt-2">
                  Ksh {companyStats.arr?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-2">
                  <BarChart3 className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-gray-500">Projected Revenue</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Outstanding Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Outstanding</p>
                <p className="text-2xl font-bold mt-2">
                  Ksh {companyStats.outstanding?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-2">
                  <CreditCard className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-500">Unpaid Invoices</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CreditCard className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow">
          <nav className="flex flex-wrap md:flex-nowrap">
            {[
              { id: 'record', label: 'Record Transaction', icon: FileText },
              { id: 'ledger', label: 'General Ledger', icon: CreditCard },
              { id: 'balance', label: 'Balance Sheet', icon: BarChart3 },
              { id: 'income', label: 'Income Statement', icon: TrendingUp },
              { id: 'cashflow', label: 'Cash Flow', icon: DollarSign },
              { id: 'reports', label: 'Reports', icon: PieChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-2 text-center font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">Loading Financial Data</h3>
            <p className="text-gray-600 mt-2">Please wait while we fetch the latest information...</p>
          </div>
        ) : (
          <>
            {activeTab === 'record' && (
              <TransactionForm 
                company={company} 
                onSubmit={handleTransactionSubmit} 
              />
            )}
            
            {activeTab === 'ledger' && (
              <LedgerView company={company} />
            )}
            
            {activeTab === 'balance' && (
              <BalanceSheet company={company} />
            )}
            
            {activeTab === 'income' && (
              // <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              //   <PieChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              //   <h3 className="text-2xl font-bold text-gray-800 mb-2">Income Statement</h3>
              //   <p className="text-gray-600 mb-6">Coming Soon - Under Development</p>
              //   <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              //     This feature is currently being developed
              //   </div>
              // </div>
              <IncomeStatement company={company} />
            )}
            
            {activeTab === 'cashflow' && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <DollarSign className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Cash Flow Statement</h3>
                <p className="text-gray-600 mb-6">Coming Soon - Under Development</p>
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                  This feature is currently being developed
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <BarChart3 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Financial Reports</h3>
                <p className="text-gray-600 mb-6">Coming Soon - Under Development</p>
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
                  This feature is currently being developed
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Financial Management System. All rights reserved.</p>
              <p className="mt-1">Data as of {lastUpdated.toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900">Help Center</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">Documentation</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</button>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  getCompanyColor(company) === 'blue' ? 'bg-blue-500' :
                  getCompanyColor(company) === 'green' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}></div>
                <span className="text-sm font-medium">
                  Viewing: {getCompanyName(company)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}