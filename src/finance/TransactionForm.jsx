// components/TransactionForm.jsx
import React, { useState } from 'react';
import { Save, Server, Wifi, Building, CheckCircle  } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';




export default function TransactionForm({ company, onSubmit }) {
  const [transactionType, setTransactionType] = useState('revenue');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(company);
  const [isIntercompany, setIsIntercompany] = useState(false);
  const [counterparty, setCounterparty] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);




  console.log('counterparty=>',counterparty)
  // Account categories for each company type
  const saasAccounts = {
    revenue: [
      'Software Subscriptions (External)',
      'Software Subscriptions (Internal)',
      'Implementation Fees',
      'Support Contracts',
      'Custom Development'
    ],
    expense: [
      'Server Hosting (AWS/Azure)',
      'Developer Salaries',
      'Technical Support Staff',
      'Marketing & Advertising',
      'Office Rent & Utilities',
      'Software Licenses (Dev Tools)',
      'Payment Gateway Fees',
      'Domain & SSL Certificates'
    ],
    asset: [
      'Cash & Bank Accounts',
      'Accounts Receivable',
      'Intercompany Receivable',
      'Office Equipment',
      'Computers & Servers',
      'Furniture & Fixtures'
    ],
    liability: [
      'Accounts Payable',
      'Deferred Revenue',
      'Intercompany Payable',
      'Tax Payable',
      'Loans Payable'
    ]
  };

  const ispAccounts = {
    revenue: [
      'Hotspot Voucher Sales',
      'PPPoE Subscription Revenue',
      'Dedicated Internet Revenue',
      'Installation & Setup Fees',
      'Equipment Sales',
      'Maintenance Contracts'
    ],
    expense: [
      'Bandwidth/Transit Costs',
      'Tower/Fiber Lease/Rent',
      'Software License Fee (to SaaS)',
      'Network Staff Salaries',
      'Electricity & Generator Fuel',
      'Network Equipment Maintenance',
      'Marketing & Customer Acquisition',
      'Regulatory & License Fees'
    ],
    asset: [
      'Cash & Bank Accounts',
      'Voucher Inventory',
      'Network Equipment (Routers/Switches)',
      'Fiber Optic Cables',
      'Towers & Masts',
      'Office Buildings',
      'Vehicles for Installations'
    ],
    liability: [
      'Accounts Payable',
      'Intercompany Payable',
      'Bank Loans',
      'Equipment Financing',
      'Tax Payable',
      'Customer Deposits'
    ]
  };

  const getAccounts = () => {
    if (selectedCompany === 'saas') return saasAccounts;
    if (selectedCompany === 'isp') return ispAccounts;
    return { ...saasAccounts, ...ispAccounts }; // Consolidated shows all
  };

  const getCompanyIcon = (companyType) => {
    switch (companyType) {
    //   case 'saas': return <Server className="h-5 w-5" />;
      case 'isp': return <Wifi className="h-5 w-5" />;
      case 'consolidated': return <Building className="h-5 w-5" />;
      default: return null;
    }
  };

  const getCompanyName = (companyType) => {
    switch (companyType) {
    //   case 'saas': return 'SaaS Software Company';
      case 'isp': return 'ISP Operations Company';
      case 'consolidated': return 'Group Consolidated';
      default: return '';
    }
  };



   const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!category) {
      toast.error('Please select an account category');
      return;
    }

    setIsSubmitting(true);

    // Prepare data for Rails controller
    const transactionData = {
      company_financial_record: {
        company: selectedCompany,
        transaction_type: transactionType,
        description,
        amount: parseFloat(amount),
        category,
        is_intercompany: isIntercompany,
        counterparty: isIntercompany ? counterparty : null,
        date,
      }
    };

    try {
      // Show loading toast
      const loadingToast = toast.loading('Saving transaction...', {
        duration: 5000,
      });

      // Get the subdomain from the current URL
      const subdomain = window.location.hostname.split('.')[0];
      
      const response = await fetch('/api/company_financial_records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify(transactionData),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const result = await response.json();
        
        // Success toast with custom icon
        toast.success(
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">Transaction Saved!</p>
              <p className="text-sm text-gray-600">
                ${parseFloat(amount).toLocaleString()} {transactionType} recorded
              </p>
            </div>
          </div>,
          {
            duration: 4000,
            position: 'top-right',
            style: {
              minWidth: '300px',
            }
          }
        );

        // Call parent onSubmit callback
        if (onSubmit) {
          const frontendTransaction = {
            id: result.id || Date.now(),
            date,
            company: selectedCompany,
            transactionType,
            description,
            amount: parseFloat(amount),
            category,
            isIntercompany,
            counterparty: isIntercompany ? counterparty : null,
            createdAt: new Date().toISOString()
          };
          onSubmit(frontendTransaction);
        }
        
        // Reset form
        setDescription('');
        setAmount('');
        setCategory('');
        setIsIntercompany(false);
        setCounterparty('');
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save transaction');
        
      }
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      
      // Error toast with details
      toast.error(
        <div>
          <p className="font-medium">Transaction Failed</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuickButtons = () => {
    const quickRecords = {
      saas: [
        {
          label: 'Software Subscription',
          type: 'revenue',
          category: 'Software Subscriptions (External)',
          description: 'Monthly software subscription payment from ISP client',
          color: 'green'
        },
        {
          label: 'Hosting Expense',
          type: 'expense',
          category: 'Server Hosting (AWS/Azure)',
          description: 'Cloud hosting and infrastructure costs',
          color: 'red'
        },
        {
          label: 'Developer Salary',
          type: 'expense',
          category: 'Developer Salaries',
          description: 'Monthly salary payment to development team',
          color: 'red'
        },
        {
          label: 'Office Rent',
          type: 'expense',
          category: 'Office Rent & Utilities',
          description: 'Monthly office rent and utility bills',
          color: 'red'
        },
        {
          label: 'Intercompany Payment Received',
          type: 'revenue',
          category: 'Software Subscriptions (Internal)',
          description: 'Internal software license payment from ISP company',
          color: 'yellow',
          intercompany: true,
          counterparty: 'isp'
        }
      ],
      isp: [
        {
          label: 'Voucher Sale',
          type: 'revenue',
          category: 'Hotspot Voucher Sales',
          description: 'Daily hotspot voucher sales to end customers',
          color: 'green'
        },
        {
          label: 'PPPoE Subscription',
          type: 'revenue',
          category: 'PPPoE Subscription Revenue',
          description: 'Monthly PPPoE subscription from business client',
          color: 'green'
        },

        {
            label: 'Electricity Cost',
            type: 'expense',
            category: 'Electricity Cost',
            description: 'Monthly electricity cost',
            color: 'red'
        },
        {
          label: 'Bandwidth Cost',
          type: 'expense',
          category: 'Bandwidth/Transit Costs',
          description: 'Monthly internet bandwidth/transit payment',
          color: 'red'
        },
        {
          label: 'Tower Rent',
          type: 'expense',
          category: 'Tower/Fiber Lease/Rent',
          description: 'Monthly tower or fiber lease payment',
          color: 'red'
        },
        {
          label: 'Software License Payment',
          type: 'expense',
          category: 'Software License Fee (to SaaS)',
          description: 'Monthly software license payment to SaaS company',
          color: 'yellow',
          intercompany: true,
          counterparty: 'saas'
        }
      ]
    };

    return (quickRecords[selectedCompany] || []).map((record, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleQuickRecord(
          record.type,
          record.category,
          record.description,
          {
            intercompany: record.intercompany,
            counterparty: record.counterparty
          }
        )}
        className={`p-4 border rounded-lg hover:opacity-90 transition-all text-left ${
          record.color === 'green' 
            ? 'bg-green-50 border-green-200 hover:bg-green-100' 
            : record.color === 'red'
            ? 'bg-red-50 border-red-200 hover:bg-red-100'
            : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
        }`}
      >
        <p className={`font-medium ${
          record.color === 'green' 
            ? 'text-green-700' 
            : record.color === 'red'
            ? 'text-red-700'
            : 'text-yellow-700'
        }`}>
          {record.label}
        </p>
        <p className={`text-sm mt-1 ${
          record.color === 'green' 
            ? 'text-green-600' 
            : record.color === 'red'
            ? 'text-red-600'
            : 'text-yellow-600'
        }`}>
          {record.description}
        </p>
      </button>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Financial Transaction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <div className="flex space-x-2">
                {/* ['saas', 'isp', 'consolidated'] */}
              {['isp', ].map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => {
                    setSelectedCompany(comp);
                    setCategory('');
                    setIsIntercompany(false);
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                    selectedCompany === comp
                      ? comp === 'saas'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : comp === 'isp'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCompanyIcon(comp)}
                  <span>{getCompanyName(comp)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'revenue', label: 'Revenue', color: 'green' },
                { type: 'expense', label: 'Expense', color: 'red' },
                { type: 'asset', label: 'Asset', color: 'blue' },
                { type: 'liability', label: 'Liability', color: 'yellow' }
              ].map(({ type, label, color }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransactionType(type)}
                  className={`py-3 px-4 rounded-lg text-center font-medium transition-all ${
                    transactionType === type
                      ? color === 'green'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : color === 'red'
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : color === 'blue'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (KSH) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">Ksh</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Account Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Account</option>
              {getAccounts()[transactionType]?.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the transaction in detail..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Intercompany Transaction */}
        {(selectedCompany === 'isp') && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isIntercompany}
                  onChange={(e) => setIsIntercompany(e.target.checked)}
                  className="h-5 w-5 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <span className="font-medium text-yellow-800">
                  Intercompany Transaction
                </span>
              </label>
              
              {isIntercompany && (
                <div className="text-sm text-yellow-700">
                  {selectedCompany === 'saas' 
                    ? 'From: ISP Company → To: SaaS Company'
                    : 'From: SaaS Company → To: ISP Company'}
                </div>
              )}
            </div>
            
            {isIntercompany && (
              <div className="mt-4 p-4 bg-white border border-yellow-300 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-700 mb-2">
                      Transaction Direction
                    </label>
                    <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">
                        {selectedCompany === 'saas' ? 'ISP Company' : 'SaaS Company'}
                      </span>
                      <span className="text-yellow-600">→</span>
                      <span className="font-medium">
                        {selectedCompany === 'saas' ? 'SaaS Company' : 'ISP Company'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-yellow-700 mb-2">
                      Purpose
                    </label>
                    <select
                      value={counterparty}
                      onChange={(e) => setCounterparty(e.target.value)}
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="">Select Purpose</option>
                      {selectedCompany === 'isp' ? (
                        <>
                          <option value="isp">Software License Payment (ISP → SaaS)</option>
                          <option value="isp">Intercompany Loan (ISP → SaaS)</option>
                          <option value="isp">Shared Expense Allocation</option>
                        </>
                      ) : (
                        <>
                          <option value="saas">Software License Payment (SaaS → ISP)</option>
                          <option value="saas">Intercompany Loan (SaaS → ISP)</option>
                          <option value="saas">Shared Expense Allocation</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <p className="text-sm text-yellow-600 mt-3">
                  This transaction will be recorded in both companies' books automatically.
                  The counterparty will see it as the opposite type (revenue ↔ expense, asset ↔ liability).
                </p>
              </div>
            )}
          </div>
        )}

        {/* Attachments (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Documents (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">Drag & drop receipts or invoices here, or</p>
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Supports PDF, JPG, PNG (Max 10MB each)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setDescription('');
              setAmount('');
              setCategory('');
              setIsIntercompany(false);
              setCounterparty('');
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 transition-all shadow-md"
          >
            <Save className="h-5 w-5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </form>

      {/* Quick Record Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">Quick Record Templates</h3>
          <span className="text-sm text-gray-500">
            Click to auto-fill common transactions
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderQuickButtons()}
        </div>

        {/* Common Transactions Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Revenue Transactions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-600">Expense Transactions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-gray-600">Intercompany Transactions</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Transaction Preview</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Company:</strong> {getCompanyName(selectedCompany)}</p>
          <p><strong>Type:</strong> <span className="capitalize">{transactionType}</span></p>
          <p><strong>Category:</strong> {category || 'Not selected'}</p>
          <p><strong>Amount:</strong> {amount ? `Ksh ${parseFloat(amount).toLocaleString()}` : 'Not entered'}</p>
          {isIntercompany && (
            <p className="text-yellow-700">
              <strong>Intercompany:</strong> {counterparty ? 'Yes - ' + (counterparty === 'saas' ? 'SaaS Company' : 'ISP Company') : 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}