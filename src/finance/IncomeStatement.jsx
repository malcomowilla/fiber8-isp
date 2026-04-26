// components/IncomeStatement.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart,
  ChevronRight,
  ChevronDown,
  Calculator,
  Percent,
  TrendingUp as UpTrend,
  TrendingDown as DownTrend,
  LineChart,
  Target,
  Crown,
  Award,
  Zap
} from 'lucide-react';

export default function IncomeStatement({ company }) {
  const [expandedRevenue, setExpandedRevenue] = useState(true);
  const [expandedExpenses, setExpandedExpenses] = useState(true);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [viewMode, setViewMode] = useState('detailed');

  // Mock income statement data
  const incomeData = {
    saas: {
      revenue: [
        { 
          name: 'Software Subscriptions', 
          amount: 450000, 
          growth: 15,
          category: 'recurring',
          color: 'green',
          description: 'Monthly subscription fees from ISP clients'
        },
        { 
          name: 'Implementation Fees', 
          amount: 30000, 
          growth: 5,
          category: 'one-time',
          color: 'blue',
          description: 'One-time setup and installation charges'
        },
        { 
          name: 'Support Contracts', 
          amount: 20000, 
          growth: 8,
          category: 'recurring',
          color: 'teal',
          description: 'Premium support and maintenance contracts'
        },
        { 
          name: 'Custom Development', 
          amount: 50000, 
          growth: 25,
          category: 'project',
          color: 'purple',
          description: 'Custom software development projects'
        }
      ],
      expenses: [
        { 
          name: 'Hosting & Server Costs', 
          amount: 50000, 
          growth: 10,
          category: 'infrastructure',
          color: 'red',
          description: 'Cloud hosting, servers, and infrastructure'
        },
        { 
          name: 'Developer Salaries', 
          amount: 150000, 
          growth: 20,
          category: 'personnel',
          color: 'orange',
          description: 'Software development team salaries'
        },
        { 
          name: 'Marketing & Sales', 
          amount: 40000, 
          growth: -5,
          category: 'marketing',
          color: 'pink',
          description: 'Advertising, promotions, and sales costs'
        },
        { 
          name: 'Office & Administration', 
          amount: 60000, 
          growth: 0,
          category: 'operations',
          color: 'gray',
          description: 'Rent, utilities, office supplies, admin costs'
        },
        { 
          name: 'Software Licenses', 
          amount: 20000, 
          growth: 3,
          category: 'tools',
          color: 'indigo',
          description: 'Third-party software and tools licenses'
        },
        { 
          name: 'Professional Services', 
          amount: 15000, 
          growth: 12,
          category: 'services',
          color: 'yellow',
          description: 'Legal, accounting, and consulting fees'
        }
      ]
    },
    isp: {
      revenue: [
        { 
          name: 'Hotspot Voucher Sales', 
          amount: 400000, 
          growth: 25,
          category: 'recurring',
          color: 'green',
          description: 'Daily hotspot voucher sales to end users'
        },
        { 
          name: 'PPPoE Subscriptions', 
          amount: 200000, 
          growth: 30,
          category: 'recurring',
          color: 'green',
          description: 'Monthly PPPoE internet subscriptions'
        },
        { 
          name: 'Installation & Setup Fees', 
          amount: 50000, 
          growth: 15,
          category: 'one-time',
          color: 'blue',
          description: 'One-time installation and setup charges'
        },
        { 
          name: 'Equipment Sales', 
          amount: 150000, 
          growth: 10,
          category: 'hardware',
          color: 'cyan',
          description: 'Router, modem, and equipment sales'
        },
        { 
          name: 'Maintenance Contracts', 
          amount: 25000, 
          growth: 8,
          category: 'recurring',
          color: 'teal',
          description: 'Equipment maintenance and support contracts'
        },
        { 
          name: 'Dedicated Internet', 
          amount: 75000, 
          growth: 35,
          category: 'enterprise',
          color: 'purple',
          description: 'Dedicated internet lines for businesses'
        }
      ],
      expenses: [
        { 
          name: 'Bandwidth & Transit Costs', 
          amount: 250000, 
          growth: 20,
          category: 'infrastructure',
          color: 'red',
          description: 'Internet bandwidth and transit costs'
        },
        { 
          name: 'Tower & Fiber Lease', 
          amount: 80000, 
          growth: 5,
          category: 'infrastructure',
          color: 'red',
          description: 'Tower space and fiber lease rentals'
        },
        { 
          name: 'Software License Fee', 
          amount: 50000, 
          growth: 0,
          category: 'software',
          color: 'indigo',
          description: 'Monthly software license to SaaS company'
        },
        { 
          name: 'Network Staff Salaries', 
          amount: 120000, 
          growth: 15,
          category: 'personnel',
          color: 'orange',
          description: 'Network engineers and technical staff'
        },
        { 
          name: 'Electricity & Generator Fuel', 
          amount: 45000, 
          growth: 12,
          category: 'operations',
          color: 'yellow',
          description: 'Power costs for network equipment'
        },
        { 
          name: 'Equipment Maintenance', 
          amount: 30000, 
          growth: 8,
          category: 'maintenance',
          color: 'amber',
          description: 'Network equipment repairs and maintenance'
        },
        { 
          name: 'Marketing & Customer Acquisition', 
          amount: 35000, 
          growth: 10,
          category: 'marketing',
          color: 'pink',
          description: 'Advertising and customer acquisition costs'
        },
        { 
          name: 'Regulatory & License Fees', 
          amount: 15000, 
          growth: 0,
          category: 'compliance',
          color: 'gray',
          description: 'Government licenses and regulatory fees'
        }
      ]
    }
  };

  const getData = () => {
    if (company === 'consolidated') {
      // Combine and eliminate intercompany transactions
      const saasData = incomeData.saas;
      const ispData = incomeData.isp;
      
      // Remove internal software license from expenses
      const revenue = [
        ...saasData.revenue.filter(r => r.name !== 'Software Subscriptions (Internal)'),
        ...ispData.revenue
      ];
      
      const expenses = [
        ...saasData.expenses,
        ...ispData.expenses.filter(e => e.name !== 'Software License Fee')
      ];
      
      return { revenue, expenses };
    }
    
    return incomeData[company];
  };

  const data = getData();
  
  // Calculate totals
  const totalRevenue = data.revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
  
  // Calculate metrics
  const grossMargin = totalRevenue > 0 ? ((totalRevenue - data.expenses.find(e => e.name.includes('Hosting') || e.name.includes('Bandwidth'))?.amount || 0) / totalRevenue) * 100 : 0;
  const operatingMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
  const ebitda = netIncome + 50000; // Simplified calculation
  
  // Get company name
  const getCompanyName = () => {
    switch(company) {
      case 'saas': return 'SaaS Software Company';
      case 'isp': return 'ISP Operations Company';
      case 'consolidated': return 'Consolidated Group';
      default: return '';
    }
  };

  // Get color class
  const getColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      teal: 'bg-teal-100 text-teal-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800',
      pink: 'bg-pink-100 text-pink-800',
      gray: 'bg-gray-100 text-gray-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      amber: 'bg-amber-100 text-amber-800',
      cyan: 'bg-cyan-100 text-cyan-800'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  // Render revenue items
  const renderRevenueItems = () => (
    <div className="space-y-3">
      {data.revenue.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white border border-green-100 rounded-xl hover:bg-green-50 transition-colors">
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className={`mt-1 w-3 h-3 rounded-full ${
                item.category === 'recurring' ? 'bg-green-500' :
                item.category === 'one-time' ? 'bg-blue-500' :
                item.category === 'project' ? 'bg-purple-500' :
                'bg-gray-500'
              }`}></div>
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(item.color)}`}>
                    {item.category}
                  </span>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.growth >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.growth >= 0 ? <UpTrend className="h-3 w-3 mr-1" /> : <DownTrend className="h-3 w-3 mr-1" />}
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-green-700">
              Ksh {item.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {((item.amount / totalRevenue) * 100).toFixed(1)}% of revenue
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {timePeriod === 'monthly' ? 'Monthly' : 'Year-to-Date'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render expense items
  const renderExpenseItems = () => (
    <div className="space-y-3">
      {data.expenses.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className={`mt-1 w-3 h-3 rounded-full ${
                item.category === 'personnel' ? 'bg-orange-500' :
                item.category === 'infrastructure' ? 'bg-red-500' :
                item.category === 'marketing' ? 'bg-pink-500' :
                'bg-gray-500'
              }`}></div>
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(item.color)}`}>
                    {item.category}
                  </span>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.growth <= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.growth >= 0 ? <UpTrend className="h-3 w-3 mr-1" /> : <DownTrend className="h-3 w-3 mr-1" />}
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-red-700">
              Ksh {item.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {((item.amount / totalExpenses) * 100).toFixed(1)}% of expenses
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {timePeriod === 'monthly' ? 'Monthly' : 'Year-to-Date'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
            <LineChart className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Income Statement</h2>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">
                {getCompanyName()} • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {timePeriod === 'monthly' ? 'Monthly View' : 'YTD View'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimePeriod('monthly')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                timePeriod === 'monthly' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimePeriod('quarterly')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                timePeriod === 'quarterly' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimePeriod('yearly')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                timePeriod === 'yearly' ? 'bg-white shadow' : 'text-gray-600'
              }`}
            >
              Yearly
            </button>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <DollarSign className={`h-5 w-5 ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Ksh {netIncome.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Net Income • {margin.toFixed(1)}% Margin
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Revenue</p>
              <p className="text-2xl font-bold text-green-800 mt-2">
                Ksh {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-green-400">
              <UpTrend className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Total Expenses</p>
              <p className="text-2xl font-bold text-red-800 mt-2">
                Ksh {totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="text-red-400">
              <DownTrend className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Gross Margin</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">
                {grossMargin.toFixed(1)}%
              </p>
            </div>
            <div className="text-blue-400">
              <Percent className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">EBITDA</p>
              <p className="text-2xl font-bold text-purple-800 mt-2">
                Ksh {ebitda.toLocaleString()}
              </p>
            </div>
            <div className="text-purple-400">
              <Calculator className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setExpandedRevenue(!expandedRevenue)}
              className="hover:bg-green-100 p-1 rounded"
            >
              {expandedRevenue ? (
                <ChevronDown className="h-5 w-5 text-green-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-green-600" />
              )}
            </button>
            <h3 className="text-xl font-bold text-green-800 flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              REVENUE
            </h3>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                {data.revenue.length} Sources
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                +{data.revenue.filter(r => r.growth > 0).length} Growing
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-900">
              Ksh {totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-green-700">
              {data.revenue.reduce((sum, item) => sum + (item.growth > 0 ? 1 : 0), 0)} of {data.revenue.length} sources growing
            </p>
          </div>
        </div>
        
        {expandedRevenue && renderRevenueItems()}
      </div>

      {/* Expenses Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setExpandedExpenses(!expandedExpenses)}
              className="hover:bg-red-100 p-1 rounded"
            >
              {expandedExpenses ? (
                <ChevronDown className="h-5 w-5 text-red-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-red-600" />
              )}
            </button>
            <h3 className="text-xl font-bold text-red-800 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              EXPENSES
            </h3>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                {data.expenses.length} Categories
              </span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                {data.expenses.filter(e => e.growth <= 0).length} Controlled
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-900">
              Ksh {totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-red-700">
              {data.expenses.filter(e => e.growth <= 0).length} of {data.expenses.length} categories controlled
            </p>
          </div>
        </div>
        
        {expandedExpenses && renderExpenseItems()}
      </div>

      {/* Income Summary */}
      <div className={`p-6 rounded-xl border ${
        netIncome >= 0 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold flex items-center">
              {netIncome >= 0 ? (
                <>
                  <Award className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700">PROFITABLE OPERATION</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">OPERATING AT LOSS</span>
                </>
              )}
            </h3>
            <p className="text-gray-600 mt-1">
              {netIncome >= 0 
                ? 'Company is generating positive returns' 
                : 'Expenses exceed revenue - review cost structure'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border text-center">
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-lg font-bold text-green-700">Ksh {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <p className="text-xs text-gray-500">Expenses</p>
              <p className="text-lg font-bold text-red-700">Ksh {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <p className="text-xs text-gray-500">Net Income</p>
              <p className={`text-lg font-bold ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {netIncome >= 0 ? '+' : ''}Ksh {Math.abs(netIncome).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <p className="text-xs text-gray-500">Margin</p>
              <p className={`text-lg font-bold ${margin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Dashboard */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Financial Health Dashboard
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h4 className="font-medium text-gray-700 mb-3">Revenue Composition</h4>
            <div className="space-y-2">
              {data.revenue.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{((item.amount / totalRevenue) * 100).toFixed(1)}%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${(item.amount / totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h4 className="font-medium text-gray-700 mb-3">Expense Breakdown</h4>
            <div className="space-y-2">
              {data.expenses.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{((item.amount / totalExpenses) * 100).toFixed(1)}%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ width: `${(item.amount / totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h4 className="font-medium text-gray-700 mb-3">Key Ratios</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Operating Margin</span>
                  <span className="font-medium text-blue-600">{operatingMargin.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(operatingMargin * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Profit Growth</span>
                  <span className="font-medium text-green-600">+{margin.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${Math.min(margin * 3, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Expense Control</span>
                  <span className="font-medium text-red-600">
                    {data.expenses.filter(e => e.growth <= 0).length}/{data.expenses.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${(data.expenses.filter(e => e.growth <= 0).length / data.expenses.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}