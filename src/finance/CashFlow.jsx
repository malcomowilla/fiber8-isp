// components/CashFlow.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  CreditCard,
  Building,
  Server,
  Wifi,
  Calculator,
  PieChart,
  BarChart,
  LineChart,
  ChevronRight,
  ChevronDown,
  Calendar,
  Filter,
  Download,
  Zap,
  Battery,
  RefreshCw,
  TrendingUp as UpIcon,
  TrendingDown as DownIcon
} from 'lucide-react';

export default function CashFlow({ company }) {
  const [expandedOperating, setExpandedOperating] = useState(true);
  const [expandedInvesting, setExpandedInvesting] = useState(true);
  const [expandedFinancing, setExpandedFinancing] = useState(true);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [viewMode, setViewMode] = useState('detailed');



  
  // Mock cash flow data
  const cashFlowData = {
    saas: {
      operating: [
        { 
          name: 'Software Subscription Revenue', 
          amount: 450000, 
          type: 'inflow',
          category: 'revenue',
          description: 'Monthly software license payments from ISPs',
          trend: 'up'
        },
        { 
          name: 'Implementation Fees', 
          amount: 30000, 
          type: 'inflow',
          category: 'service',
          description: 'One-time setup and installation fees',
          trend: 'stable'
        },
        { 
          name: 'Support Contract Payments', 
          amount: 20000, 
          type: 'inflow',
          category: 'service',
          description: 'Monthly support and maintenance fees',
          trend: 'up'
        },
        { 
          name: 'Developer Salaries', 
          amount: -150000, 
          type: 'outflow',
          category: 'personnel',
          description: 'Monthly salary payments to development team',
          trend: 'up'
        },
        { 
          name: 'Server Hosting Costs', 
          amount: -50000, 
          type: 'outflow',
          category: 'infrastructure',
          description: 'Cloud hosting and server expenses',
          trend: 'stable'
        },
        { 
          name: 'Marketing Expenses', 
          amount: -40000, 
          type: 'outflow',
          category: 'marketing',
          description: 'Advertising and promotional costs',
          trend: 'down'
        },
        { 
          name: 'Office Rent & Utilities', 
          amount: -60000, 
          type: 'outflow',
          category: 'operations',
          description: 'Office rent, electricity, internet',
          trend: 'stable'
        },
        { 
          name: 'Tax Payments', 
          amount: -30000, 
          type: 'outflow',
          category: 'tax',
          description: 'Monthly tax remittances',
          trend: 'stable'
        }
      ],
      investing: [
        { 
          name: 'Office Equipment Purchase', 
          amount: -80000, 
          type: 'outflow',
          category: 'equipment',
          description: 'New computers, furniture, office equipment',
          trend: 'one-time'
        },
        { 
          name: 'Software Development', 
          amount: -150000, 
          type: 'outflow',
          category: 'development',
          description: 'Capitalized software development costs',
          trend: 'ongoing'
        },
        { 
          name: 'Server Infrastructure', 
          amount: -120000, 
          type: 'outflow',
          category: 'infrastructure',
          description: 'New server hardware and infrastructure',
          trend: 'periodic'
        },
        { 
          name: 'Equipment Sale', 
          amount: 25000, 
          type: 'inflow',
          category: 'equipment',
          description: 'Sale of old office equipment',
          trend: 'one-time'
        }
      ],
      financing: [
        { 
          name: 'Owner Investment', 
          amount: 200000, 
          type: 'inflow',
          category: 'equity',
          description: 'Additional capital invested by owners',
          trend: 'one-time'
        },
        { 
          name: 'Loan Repayment', 
          amount: -50000, 
          type: 'outflow',
          category: 'debt',
          description: 'Monthly loan principal and interest payments',
          trend: 'regular'
        },
        { 
          name: 'Dividend Payments', 
          amount: -30000, 
          type: 'outflow',
          category: 'dividends',
          description: 'Quarterly dividend distribution to shareholders',
          trend: 'periodic'
        },
        { 
          name: 'New Loan Received', 
          amount: 150000, 
          type: 'inflow',
          category: 'debt',
          description: 'New business loan from bank',
          trend: 'one-time'
        }
      ]
    },
    isp: {
      operating: [
        { 
          name: 'Hotspot Voucher Sales', 
          amount: 400000, 
          type: 'inflow',
          category: 'revenue',
          description: 'Daily hotspot voucher sales to customers',
          trend: 'up'
        },
        { 
          name: 'PPPoE Subscriptions', 
          amount: 200000, 
          type: 'inflow',
          category: 'revenue',
          description: 'Monthly PPPoE internet subscription payments',
          trend: 'up'
        },
        { 
          name: 'Installation Fees', 
          amount: 50000, 
          type: 'inflow',
          category: 'service',
          description: 'One-time installation charges',
          trend: 'stable'
        },
        { 
          name: 'Equipment Sales', 
          amount: 150000, 
          type: 'inflow',
          category: 'revenue',
          description: 'Router, modem, and equipment sales',
          trend: 'up'
        },
        { 
          name: 'Bandwidth Costs', 
          amount: -250000, 
          type: 'outflow',
          category: 'infrastructure',
          description: 'Monthly bandwidth and transit payments',
          trend: 'up'
        },
        { 
          name: 'Network Staff Salaries', 
          amount: -120000, 
          type: 'outflow',
          category: 'personnel',
          description: 'Network engineers and technical staff salaries',
          trend: 'stable'
        },
        { 
          name: 'Tower & Fiber Lease', 
          amount: -80000, 
          type: 'outflow',
          category: 'infrastructure',
          description: 'Monthly tower space and fiber lease payments',
          trend: 'stable'
        },
        { 
          name: 'Software License Fee', 
          amount: -50000, 
          type: 'outflow',
          category: 'software',
          description: 'Monthly software license to SaaS company',
          trend: 'stable'
        },
        { 
          name: 'Electricity & Generator Fuel', 
          amount: -45000, 
          type: 'outflow',
          category: 'operations',
          description: 'Power costs for network equipment',
          trend: 'up'
        }
      ],
      investing: [
        { 
          name: 'Network Equipment Purchase', 
          amount: -500000, 
          type: 'outflow',
          category: 'equipment',
          description: 'New routers, switches, and network gear',
          trend: 'major'
        },
        { 
          name: 'Fiber Infrastructure', 
          amount: -350000, 
          type: 'outflow',
          category: 'infrastructure',
          description: 'Fiber optic cable installation and expansion',
          trend: 'ongoing'
        },
        { 
          name: 'Office Building', 
          amount: -1500000, 
          type: 'outflow',
          category: 'property',
          description: 'New office premises purchase',
          trend: 'one-time'
        },
        { 
          name: 'Vehicle Purchase', 
          amount: -500000, 
          type: 'outflow',
          category: 'equipment',
          description: 'Service and installation vehicles',
          trend: 'periodic'
        }
      ],
      financing: [
        { 
          name: 'Bank Loan Received', 
          amount: 2000000, 
          type: 'inflow',
          category: 'debt',
          description: 'Long-term bank loan for expansion',
          trend: 'one-time'
        },
        { 
          name: 'Loan Repayment', 
          amount: -150000, 
          type: 'outflow',
          category: 'debt',
          description: 'Monthly loan repayments',
          trend: 'regular'
        },
        { 
          name: 'Equipment Financing', 
          amount: 1000000, 
          type: 'inflow',
          category: 'debt',
          description: 'Financing for new network equipment',
          trend: 'periodic'
        },
        { 
          name: 'Shareholder Investment', 
          amount: 500000, 
          type: 'inflow',
          category: 'equity',
          description: 'Additional investment from shareholders',
          trend: 'one-time'
        }
      ]
    }
  };

  const getData = () => {
    if (company === 'consolidated') {
      // Combine and eliminate intercompany transactions
      const saasData = cashFlowData.saas;
      const ispData = cashFlowData.isp;
      
      // Remove intercompany software license payments
      const operating = [
        ...saasData.operating,
        ...ispData.operating.filter(item => item.name !== 'Software License Fee')
      ];
      
      const investing = [
        ...saasData.investing,
        ...ispData.investing
      ];
      
      const financing = [
        ...saasData.financing,
        ...ispData.financing
      ];
      
      return { operating, investing, financing };
    }
    
    return cashFlowData[company];
  };

  const data = getData();
  
  // Calculate totals
  const totalOperating = data.operating.reduce((sum, item) => sum + item.amount, 0);
const totalInvesting = data.investing.reduce((sum, item) => sum + item.amount, 0);
const totalFinancing = data.financing.reduce((sum, item) => sum + item.amount, 0);

// Calculate total expenses (absolute value of all negative operating items)
const totalExpenses = Math.abs(data.operating
  .filter(item => item.amount < 0)
  .reduce((sum, item) => sum + item.amount, 0));

const netCashFlow = totalOperating + totalInvesting + totalFinancing;

// Previous period cash balance (mock)
const previousCashBalance = 2000000;
const endingCashBalance = previousCashBalance + netCashFlow;
const freeCashFlow = totalOperating + totalInvesting;
  const getCompanyName = () => {
    switch(company) {
      case 'saas': return 'SaaS Software Company';
      case 'isp': return 'ISP Operations Company';
      case 'consolidated': return 'Consolidated Group';
      default: return '';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colorMap = {
      revenue: 'bg-green-100 text-green-800',
      service: 'bg-blue-100 text-blue-800',
      personnel: 'bg-orange-100 text-orange-800',
      infrastructure: 'bg-red-100 text-red-800',
      marketing: 'bg-pink-100 text-pink-800',
      operations: 'bg-gray-100 text-gray-800',
      tax: 'bg-yellow-100 text-yellow-800',
      equipment: 'bg-cyan-100 text-cyan-800',
      development: 'bg-purple-100 text-purple-800',
      equity: 'bg-indigo-100 text-indigo-800',
      debt: 'bg-amber-100 text-amber-800',
      dividends: 'bg-rose-100 text-rose-800',
      property: 'bg-teal-100 text-teal-800',
      software: 'bg-violet-100 text-violet-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <UpIcon className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <DownIcon className="h-4 w-4 text-red-500" />;
    return <RefreshCw className="h-4 w-4 text-blue-500" />;
  };

  // Render activity items
  const renderActivityItems = (items, section) => {
    const sectionColors = {
      operating: { bg: 'green', text: 'green' },
      investing: { bg: 'blue', text: 'blue' },
      financing: { bg: 'purple', text: 'purple' }
    };
    
    const colors = sectionColors[section];
    
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-${colors.bg}-50 transition-colors ${
              item.amount >= 0 ? 'border-green-100' : 'border-red-100'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${
                  item.amount >= 0 
                    ? `text-${colors.text}-500` 
                    : 'text-red-500'
                }`}>
                  {item.amount >= 0 ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center">
                      {getTrendIcon(item.trend)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className={`text-lg font-bold ${
                item.amount >= 0 ? `text-${colors.text}-700` : 'text-red-700'
              }`}>
                {item.amount >= 0 ? '+' : ''}Ksh {Math.abs(item.amount).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {section === 'operating' ? 'Operating' : 
                 section === 'investing' ? 'Investing' : 'Financing'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-200 rounded-lg">
            <LineChart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cash Flow Statement</h2>
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
              <DollarSign className={`h-5 w-5 ${netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Ksh {netCashFlow.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Net Cash Flow • {((netCashFlow / previousCashBalance) * 100).toFixed(1)}% Change
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Operating Cash</p>
              <p className={`text-2xl font-bold mt-2 ${totalOperating >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                Ksh {totalOperating.toLocaleString()}
              </p>
            </div>
            <div className={totalOperating >= 0 ? 'text-green-400' : 'text-red-400'}>
              {totalOperating >= 0 ? <UpIcon className="h-8 w-8" /> : <DownIcon className="h-8 w-8" />}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Investing Cash</p>
              <p className="text-2xl font-bold mt-2 text-blue-800">
                Ksh {totalInvesting.toLocaleString()}
              </p>
            </div>
            <div className="text-blue-400">
              <Building className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Financing Cash</p>
              <p className={`text-2xl font-bold mt-2 ${
                totalFinancing >= 0 ? 'text-purple-800' : 'text-red-800'
              }`}>
                Ksh {totalFinancing.toLocaleString()}
              </p>
            </div>
            <div className={totalFinancing >= 0 ? 'text-purple-400' : 'text-red-400'}>
              <CreditCard className="h-8 w-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-700">Ending Cash</p>
              <p className="text-2xl font-bold mt-2 text-cyan-800">
                Ksh {endingCashBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-cyan-400">
              <Battery className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Operating Activities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setExpandedOperating(!expandedOperating)}
              className="hover:bg-green-100 p-1 rounded"
            >
              {expandedOperating ? (
                <ChevronDown className="h-5 w-5 text-green-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-green-600" />
              )}
            </button>
            <h3 className="text-xl font-bold text-green-800 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              OPERATING ACTIVITIES
            </h3>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                {data.operating.length} Items
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                {data.operating.filter(i => i.amount >= 0).length} Inflows
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${
              totalOperating >= 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              Ksh {totalOperating.toLocaleString()}
            </p>
            <p className={`text-sm ${totalOperating >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {totalOperating >= 0 ? 'Positive' : 'Negative'} Operating Cash
            </p>
          </div>
        </div>
        
        {expandedOperating && renderActivityItems(data.operating, 'operating')}
      </div>

      {/* Investing Activities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setExpandedInvesting(!expandedInvesting)}
              className="hover:bg-blue-100 p-1 rounded"
            >
              {expandedInvesting ? (
                <ChevronDown className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-blue-600" />
              )}
            </button>
            <h3 className="text-xl font-bold text-blue-800 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              INVESTING ACTIVITIES
            </h3>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                {data.investing.length} Items
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {data.investing.filter(i => i.amount >= 0).length} Inflows
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">
              Ksh {totalInvesting.toLocaleString()}
            </p>
            <p className="text-sm text-blue-700">
              {company === 'isp' ? 'Infrastructure Heavy' : 'Moderate Investment'}
            </p>
          </div>
        </div>
        
        {expandedInvesting && renderActivityItems(data.investing, 'investing')}
      </div>

      {/* Financing Activities */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setExpandedFinancing(!expandedFinancing)}
              className="hover:bg-purple-100 p-1 rounded"
            >
              {expandedFinancing ? (
                <ChevronDown className="h-5 w-5 text-purple-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-purple-600" />
              )}
            </button>
            <h3 className="text-xl font-bold text-purple-800 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              FINANCING ACTIVITIES
            </h3>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                {data.financing.length} Items
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                {data.financing.filter(i => i.amount >= 0).length} Inflows
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${
              totalFinancing >= 0 ? 'text-purple-900' : 'text-red-900'
            }`}>
              Ksh {totalFinancing.toLocaleString()}
            </p>
            <p className={`text-sm ${totalFinancing >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
              {totalFinancing >= 0 ? 'Net Inflow' : 'Net Outflow'}
            </p>
          </div>
        </div>
        
        {expandedFinancing && renderActivityItems(data.financing, 'financing')}
      </div>

      {/* Cash Flow Summary */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Cash Flow Reconciliation
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-700">Beginning Cash Balance</span>
            </div>
            <span className="font-bold text-gray-800">Ksh {previousCashBalance.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-700">Operating Cash Flow</span>
            </div>
            <span className={`font-bold ${totalOperating >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {totalOperating >= 0 ? '+' : ''}Ksh {Math.abs(totalOperating).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Investing Cash Flow</span>
            </div>
            <span className="font-bold text-blue-700">
              {totalInvesting >= 0 ? '+' : ''}Ksh {Math.abs(totalInvesting).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-gray-700">Financing Cash Flow</span>
            </div>
            <span className={`font-bold ${totalFinancing >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
              {totalFinancing >= 0 ? '+' : ''}Ksh {Math.abs(totalFinancing).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-white rounded"></div>
              <span className="font-bold">Ending Cash Balance</span>
            </div>
            <span className="text-2xl font-bold">Ksh {endingCashBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Cash Flow Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border">
            <h4 className="font-medium text-gray-700 mb-3">Free Cash Flow</h4>
            <div className="text-center mb-4">
              <p className={`text-3xl font-bold ${freeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Ksh {freeCashFlow.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Operating + Investing Cash</p>
            </div>
            <div className="text-xs text-gray-500">
              {freeCashFlow >= 0 
                ? 'Positive FCF indicates ability to invest and pay dividends' 
                : 'Negative FCF may require external financing'}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border">
            <h4 className="font-medium text-gray-700 mb-3">Cash Conversion Cycle</h4>
            <div className="text-center mb-4">
              <p className={`text-3xl font-bold ${
                totalOperating >= totalExpenses ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {company === 'saas' ? '45' : '30'} Days
              </p>
              <p className="text-sm text-gray-600">Days to convert to cash</p>
            </div>
            <div className="text-xs text-gray-500">
              {company === 'saas' 
                ? 'SaaS has longer cycles due to subscription model' 
                : 'ISP has shorter cycles due to prepaid vouchers'}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border">
            <h4 className="font-medium text-gray-700 mb-3">Cash Burn Rate</h4>
            <div className="text-center mb-4">
              <p className={`text-3xl font-bold ${
                netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {netCashFlow >= 0 ? '+' : ''}Ksh {Math.abs(netCashFlow).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Monthly net change</p>
            </div>
            <div className="text-xs text-gray-500">
              {netCashFlow >= 0 
                ? 'Cash position improving monthly' 
                : `Cash depleting at Ksh ${Math.abs(netCashFlow).toLocaleString()}/month`}
            </div>
          </div>
        </div>
      </div>

      {/* Health Indicator */}
      <div className={`mt-8 p-4 rounded-xl border ${
        netCashFlow >= 0 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {netCashFlow >= 0 ? (
              <TrendingUp className="h-6 w-6 text-green-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
            <div>
              <h4 className="font-bold">
                {netCashFlow >= 0 ? 'Healthy Cash Position' : 'Cash Flow Warning'}
              </h4>
              <p className="text-sm">
                {netCashFlow >= 0 
                  ? 'Company is generating positive cash flow from operations' 
                  : 'Company is experiencing negative cash flow. Review operations.'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {company === 'saas' 
                ? 'SaaS companies typically have high initial cash burn' 
                : 'ISPs require significant infrastructure investment'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}