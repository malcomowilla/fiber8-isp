import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCopy, FaShieldAlt, FaNetworkWired, FaServer } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PreventDDoS = () => {
  const [rules, setRules] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data - replace with your actual API call
  const fetchRules = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with your actual fetch to Rails backend
      const mockRules = `
/ip firewall address-list
add list=ddos-attackers
add list=ddos-targets

/ip firewall filter
add action=return chain=detect-ddos dst-limit=32,32,src-and-dst-addresses/10s
add action=add-dst-to-address-list address-list=ddos-targets address-list-timeout=10m chain=detect-ddos
add action=add-src-to-address-list address-list=ddos-attackers address-list-timeout=10m chain=detect-ddos

/ip firewall raw
add action=drop chain=prerouting dst-address-list=ddos-targets src-address-list=ddos-attackers

/ip firewall filter
add chain=forward connection-state=new action=jump jump-target=detect-ddos
add chain=detect-ddos dst-limit=32,32,src-and-dst-addresses/10s action=return
add action=add-dst-to-address-list address-list=ddos-targets address-list-timeout=10m chain=detect-ddos
add action=add-src-to-address-list address-list=ddos-attackers address-list-timeout=10m chain=detect-ddos

/ip settings
set tcp-syncookies=yes

/ip firewall filter 
add action=return chain=detect-ddos dst-limit=32,32,src-and-dst-addresses/10s protocol=tcp tcp-flags=syn,ack
add chain=input action=drop protocol=tcp src-address=!10.2.0.1 dst-port=21,22,23 log=yes log-prefix="drop, ssh,telnet" 
      `;
      setRules(mockRules.trim());
      setTimeout(() => setIsLoading(false), 800); // Simulate network delay
    } catch (error) {
      toast.error('Failed to load DDoS rules');
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rules);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-3xl text-green-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                MikroTik DDoS Prevention Rules
              </h2>
            </div>
            <button
              onClick={fetchRules}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg
               transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <FaNetworkWired />
                  <span>Generate Rules</span>
                </>
              )}
            </button>
          </div>

          {rules && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <FaCopy className="text-green-600 dark:text-green-400" />
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 font-mono text-sm">
                  {rules.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-gray-500 select-none mr-4">{i + 1}</span>
                      <code>{line}</code>
                    </div>
                  ))}
                </pre>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <FaServer className="mr-2" />
                <p>These rules will help protect your MikroTik router from DDoS attacks</p>
              </div>
            </motion.div>
          )}

          {!rules && !isLoading && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-indigo-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FaShieldAlt className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                No Rules Generated Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Click the "Generate Rules" button to get DDoS prevention rules for your MikroTik router
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PreventDDoS;