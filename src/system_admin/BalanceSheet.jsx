// components/BalanceSheet.jsx
import React, { useState } from 'react';
import { 
  Building, 
  Server, 
  Wifi, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  CreditCard,
  PieChart,
  BarChart3,
  Calculator,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Percent
} from 'lucide-react';

export default function BalanceSheet({ company }) {
  const [expandedAssets, setExpandedAssets] = useState(true);
  const [expandedLiabilities, setExpandedLiabilities] = useState(true);
  const [expandedEquity, setExpandedEquity] = useState(true);

  // Mock balance sheet data with more detail
  const balanceSheetData = {
    saas: {
      currentAssets: [
        { name: 'Cash & Bank Accounts', amount: 1500000, description: 'Operating cash and bank balances' },
        { name: 'Accounts Receivable', amount: 500000, description: 'Amounts due from ISP clients' },
        { name: 'Intercompany Receivable (from ISP)', amount: 300000, description: 'Internal balance from ISP company' },
        { name: 'Prepaid Expenses', amount: 100000, description: 'Advance payments for services' },
        { name: 'Other Current Assets', amount: 50000, description: 'Miscellaneous current assets' }
      ],
      fixedAssets: [
        { name: 'Office Equipment', amount: 200000, description: 'Computers, furniture, office equipment' },
        { name: 'Software Development', amount: 400000, description: 'Capitalized software development costs' },
        { name: 'Accumulated Depreciation', amount: -80000, description: 'Depreciation on fixed assets' }
      ],
      currentLiabilities: [
        { name: 'Accounts Payable', amount: 300000, description: 'Amounts due to suppliers' },
        { name: 'Accrued Expenses', amount: 150000, description: 'Accrued salaries and benefits' },
        { name: 'Deferred Revenue', amount: 400000, description: 'Unearned subscription revenue' },
        { name: 'Tax Payable', amount: 100000, description: 'Current tax liability' }
      ],
      longTermLiabilities: [
        { name: 'Intercompany Payable', amount: 0, description: 'Internal balance to ISP company' },
        { name: 'Long-term Debt', amount: 0, description: 'Long-term loans and financing' }
      ],
      equity: [
        { name: 'Share Capital', amount: 1000000, description: 'Invested capital from owners' },
        { name: 'Retained Earnings', amount: 1800000, description: 'Cumulative profits reinvested' },
        { name: 'Current Year Earnings', amount: 400000, description: 'Current year net income' }
      ]
    },
    isp: {
      currentAssets: [
        { name: 'Cash & Bank Accounts', amount: 2000000, description: 'Operating cash and bank balances' },
        { name: 'Voucher Inventory', amount: 150000, description: 'Prepaid voucher inventory' },
        { name: 'Accounts Receivable', amount: 300000, description: 'Amounts due from customers' },
        { name: 'Prepaid Expenses', amount: 200000, description: 'Advance payments for services' }
      ],
      fixedAssets: [
        { name: 'Network Equipment', amount: 2500000, description: 'Routers, switches, servers' },
        { name: 'Fiber Infrastructure', amount: 3500000, description: 'Fiber optic cables and infrastructure' },
        { name: 'Office Buildings', amount: 1500000, description: 'Office premises and facilities' },
        { name: 'Vehicles', amount: 500000, description: 'Installation and service vehicles' },
        { name: 'Accumulated Depreciation', amount: -1200000, description: 'Depreciation on fixed assets' }
      ],
      currentLiabilities: [
        { name: 'Accounts Payable', amount: 400000, description: 'Amounts due to suppliers' },
        { name: 'Accrued Expenses', amount: 200000, description: 'Accrued salaries and benefits' },
        { name: 'Short-term Debt', amount: 500000, description: 'Short-term loans and credit' },
        { name: 'Tax Payable', amount: 150000, description: 'Current tax liability' }
      ],
      longTermLiabilities: [
        { name: 'Intercompany Payable (to SaaS)', amount: 300000, description: 'Internal balance to SaaS company' },
        { name: 'Long-term Loans', amount: 2000000, description: 'Long-term bank loans' },
        { name: 'Equipment Financing', amount: 1000000, description: 'Financing for network equipment' }
      ],
      equity: [
        { name: 'Share Capital', amount: 2000000, description: 'Invested capital from owners' },
        { name: 'Retained Earnings', amount: 5450000, description: 'Cumulative profits reinvested' },
        { name: 'Current Year Earnings', amount: 600000, description: 'Current year net income' }
      ]
    }
  };

  const getData = () => {
    if (company === 'consolidated') {
      // Merge and eliminate intercompany transactions
      const saasData = balanceSheetData.saas;
      const ispData = balanceSheetData.isp;
      
      // Remove intercompany balances (they net to zero in consolidation)
      const currentAssets = [
        ...saasData.currentAssets.filter(a => a.name !== 'Intercompany Receivable (from ISP)'),
        ...ispData.currentAssets
      ];
      
      const fixedAssets = [
        ...saasData.fixedAssets,
        ...ispData.fixedAssets
      ];
      
      const currentLiabilities = [
        ...saasData.currentLiabilities,
        ...ispData.currentLiabilities
      ];
      
      const longTermLiabilities = [
        ...saasData.longTermLiabilities.filter(l => l.name !== 'Intercompany Payable (to SaaS)'),
        ...ispData.longTermLiabilities.filter(l => l.name !== 'Intercompany Payable (to SaaS)')
      ];
      
      const equity = [
        { 
          name: 'Share Capital', 
          amount: saasData.equity[0].amount + ispData.equity[0].amount,
          description: 'Total invested capital'
        },
        { 
          name: 'Retained Earnings', 
          amount: saasData.equity[1].amount + ispData.equity[1].amount,
          description: 'Total cumulative profits'
        },
        { 
          name: 'Current Year Earnings', 
          amount: saasData.equity[2].amount + ispData.equity[2].amount,
          description: 'Total current year earnings'
        }
      ];
      
      return { currentAssets, fixedAssets, currentLiabilities, longTermLiabilities, equity };
    }
    
    return balanceSheetData[company];
  };

  const data = getData();
  
  // Calculate totals
  const totalCurrentAssets = data.currentAssets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalFixedAssets = data.fixedAssets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;
  
  const totalCurrentLiabilities = data.currentLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const totalLongTermLiabilities = data.longTermLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;
  
  const totalEquity = data.equity.reduce((sum, equityItem) => sum + equityItem.amount, 0);
  
  // Calculate balance check
  const balanceCheck = Math.abs(totalAssets - (totalLiabilities + totalEquity));
  
  // Financial ratios
  const currentRatio = totalCurrentAssets / totalCurrentLiabilities;
  const debtToEquity = totalLiabilities / totalEquity;
  const returnOnEquity = 0.245; // 24.5% - would be calculated from income data

  const getCompanyIcon = () => {
    switch(company) {
      case 'saas': return <Server className="h-6 w-6 text-blue-600" />;
      case 'isp': return <Wifi className="h-6 w-6 text-green-600" />;
      case 'consolidated': return <Building className="h-6 w-6 text-purple-600" />;
      default: return null;
    }
  };

  const getCompanyName = () => {
    switch(company) {
      case 'saas': return 'SaaS Software Company';
      case 'isp': return 'ISP Operations Company';
      case 'consolidated': return 'Consolidated Group';
      default: return '';
    }
  };

  const getStatusIcon = (isBalanced) => {
    return isBalanced ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    );
  };

  const renderAssetSection = (title, items, total, isCurrent = false) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => isCurrent ? setExpandedAssets(!expandedAssets) : null}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedAssets ? 'rotate-90' : ''}`} />
          </button>
          <h4 className="font-bold text-gray-700">{title}</h4>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-blue-800">
            Ksh {total.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            {isCurrent ? 'Liquid Assets' : 'Long-term Assets'}
          </p>
        </div>
      </div>
      
      {expandedAssets && (
        <div className="space-y-3 ml-6">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                item.amount < 0 ? 'bg-red-50 border border-red-100' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-8 rounded ${item.amount < 0 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-blue-700'}`}>
                  {item.amount < 0 ? '-' : ''}Ksh {Math.abs(item.amount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.abs((item.amount / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLiabilitySection = (title, items, total, isCurrent = false) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => isCurrent ? setExpandedLiabilities(!expandedLiabilities) : null}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedLiabilities ? 'rotate-90' : ''}`} />
          </button>
          <h4 className="font-bold text-gray-700">{title}</h4>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-red-800">
            Ksh {total.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            {isCurrent ? 'Short-term Obligations' : 'Long-term Debt'}
          </p>
        </div>
      </div>
      
      {expandedLiabilities && (
        <div className="space-y-3 ml-6">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-red-500 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-700">
                  Ksh {item.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {((item.amount / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEquitySection = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpandedEquity(!expandedEquity)}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedEquity ? 'rotate-90' : ''}`} />
          </button>
          <h4 className="font-bold text-gray-700">OWNER'S EQUITY</h4>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-800">
            Ksh {totalEquity.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            Net Worth
          </p>
        </div>
      </div>
      
      {expandedEquity && (
        <div className="space-y-3 ml-6">
          {data.equity.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-green-500 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-700">
                  Ksh {item.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {((item.amount / totalEquity) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getCompanyIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Balance Sheet</h2>
              <p className="text-gray-600">
                {getCompanyName()} • As of {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Assets</p>
              <p className="text-2xl font-bold text-blue-600">
                Ksh {totalAssets.toLocaleString()}
              </p>
            </div>
            <div className="text-gray-300">|</div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Liabilities</p>
              <p className="text-2xl font-bold text-red-600">
                Ksh {totalLiabilities.toLocaleString()}
              </p>
            </div>
            <div className="text-gray-300">|</div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Equity</p>
              <p className="text-2xl font-bold text-green-600">
                Ksh {totalEquity.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Sheet Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Assets */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-blue-800 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                ASSETS
              </h3>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-900">
                  Ksh {totalAssets.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">
                  Total Value
                </p>
              </div>
            </div>
            
            {/* Asset Breakdown */}
            <div className="mt-6">
              {renderAssetSection('Current Assets', data.currentAssets, totalCurrentAssets, true)}
              {renderAssetSection('Fixed Assets', data.fixedAssets, totalFixedAssets)}
              
              {/* Asset Composition Chart */}
              <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-700">Asset Composition</p>
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm">Current Assets</span>
                    </div>
                    <span className="text-sm font-medium">
                      {((totalCurrentAssets / totalAssets) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-700 rounded"></div>
                      <span className="text-sm">Fixed Assets</span>
                    </div>
                    <span className="text-sm font-medium">
                      {((totalFixedAssets / totalAssets) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
                    style={{ width: `${(totalCurrentAssets / totalAssets) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Liabilities & Equity */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-red-800 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                LIABILITIES
              </h3>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-900">
                  Ksh {totalLiabilities.toLocaleString()}
                </p>
                <p className="text-sm text-red-600">
                  Total Obligations
                </p>
              </div>
            </div>
            
            {/* Liability Breakdown */}
            <div className="mt-6">
              {renderLiabilitySection('Current Liabilities', data.currentLiabilities, totalCurrentLiabilities, true)}
              {renderLiabilitySection('Long-term Liabilities', data.longTermLiabilities, totalLongTermLiabilities)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-green-800 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                EQUITY
              </h3>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-900">
                  Ksh {totalEquity.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">
                  Owner's Capital
                </p>
              </div>
            </div>
            
            {/* Equity Breakdown */}
            <div className="mt-6">
              {renderEquitySection()}
            </div>
          </div>
        </div>
      </div>

      {/* Accounting Equation Check */}
      <div className={`mt-8 p-6 rounded-xl border ${
        balanceCheck < 0.01 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              {getStatusIcon(balanceCheck < 0.01)}
              <div>
                <h4 className="font-bold text-lg">
                  {balanceCheck < 0.01 ? '✓ Balance Sheet Balanced' : '✗ Balance Sheet Out of Balance'}
                </h4>
                <p className="text-sm opacity-75">
                  Accounting Equation: Assets = Liabilities + Equity
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-500">Assets</p>
                <p className="text-lg font-bold">Ksh {totalAssets.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <p className="text-lg font-bold">=</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm text-gray-500">Liabilities + Equity</div>
                <div className="text-lg font-bold">
                  Ksh {(totalLiabilities + totalEquity).toLocaleString()}
                </div>
              </div>
            </div>
            
            {balanceCheck >= 0.01 && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-700">
                    Imbalance detected: Ksh {balanceCheck.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Check for missing transactions or data entry errors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Ratios & Analysis */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Financial Health Indicators
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Current Ratio</p>
                <p className="text-2xl font-bold text-blue-800 mt-2">
                  {currentRatio.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600 mt-1">Current Assets / Current Liabilities</p>
              </div>
              <div>
                {currentRatio >= 1.5 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : currentRatio >= 1 ? (
                  <div className="text-yellow-500">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-blue-600">
                <span>Poor</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
              <div className="h-2 bg-blue-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min(currentRatio * 20, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Debt to Equity</p>
                <p className="text-2xl font-bold text-purple-800 mt-2">
                  {debtToEquity.toFixed(2)}
                </p>
                <p className="text-xs text-purple-600 mt-1">Total Liabilities / Total Equity</p>
              </div>
              <div>
                {debtToEquity <= 0.5 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : debtToEquity <= 1 ? (
                  <div className="text-yellow-500">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-purple-600 mb-1">
                {debtToEquity <= 0.5 ? 'Conservative' : 
                 debtToEquity <= 1 ? 'Moderate' : 'Aggressive'}
              </div>
              <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500"
                  style={{ width: `${Math.min(debtToEquity * 50, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Return on Equity</p>
                <p className="text-2xl font-bold text-green-800 mt-2">
                  {(returnOnEquity * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-green-600 mt-1">Net Income / Total Equity</p>
              </div>
              <div>
                {returnOnEquity >= 0.15 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : returnOnEquity >= 0.05 ? (
                  <div className="text-yellow-500">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-green-600">
                <span>Low</span>
                <span>Average</span>
                <span>High</span>
              </div>
              <div className="h-2 bg-green-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(returnOnEquity * 400, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Asset Growth</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  +12.5%
                </p>
                <p className="text-xs text-gray-600 mt-1">Quarter over Quarter</p>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-600">
                {company === 'saas' ? 'Software assets growing' : 
                 company === 'isp' ? 'Infrastructure expansion' : 
                 'Group growth strong'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Balance Sheet Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Liquidity Position</h4>
            <p className="text-sm text-gray-600">
              {currentRatio >= 2 
                ? 'Excellent liquidity. The company can comfortably cover short-term obligations.'
                : currentRatio >= 1.5
                ? 'Good liquidity position. Healthy working capital management.'
                : currentRatio >= 1
                ? 'Adequate liquidity. Meets minimum requirements for current obligations.'
                : 'Limited liquidity. May face challenges meeting short-term obligations.'
              }
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Capital Structure</h4>
            <p className="text-sm text-gray-600">
              {debtToEquity <= 0.5
                ? 'Conservative financing. Primarily equity-funded with minimal debt.'
                : debtToEquity <= 1
                ? 'Balanced capital structure. Moderate use of debt financing.'
                : 'Aggressive financing. High reliance on debt which increases financial risk.'
              }
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Asset Composition</h4>
            <p className="text-sm text-gray-600">
              {((totalFixedAssets / totalAssets) * 100) > 70
                ? 'Capital intensive business with significant fixed assets.'
                : ((totalFixedAssets / totalAssets) * 100) > 40
                ? 'Mixed asset base with both current and fixed assets.'
                : 'Asset-light business model with mostly current assets.'
              }
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">Intercompany Notes</h4>
            <p className="text-sm text-gray-600">
              {company === 'consolidated'
                ? 'Intercompany balances eliminated in consolidation. Group view shows net position.'
                : company === 'saas'
                ? 'Intercompany receivable from ISP company for software licenses.'
                : 'Intercompany payable to SaaS company for software licenses.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}