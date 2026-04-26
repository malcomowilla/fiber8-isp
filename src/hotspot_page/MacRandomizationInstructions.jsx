import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  X, 
  ChevronDown, 
  ChevronUp,
  Smartphone as IPhone,
  Smartphone as Android,
  Laptop as Windows,
  Laptop as Mac,
  CheckCircle,
  Info,
  Wifi,
  Shield,
  ArrowRight,
  HelpCircle,
  Monitor,
  Smartphone as DeviceMobile,
  Tablet as DeviceTablet
} from 'lucide-react';




const MacRandomizationInstructions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState('ios');
  const [isMobile, setIsMobile] = useState(false);





  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const instructions = {
    ios: {
      title: "iOS (iPhone/iPad)",
      steps: [
        "Open Settings app",
        "Tap on 'Wi-Fi'",
        "Tap the ⓘ icon next to the network name",
        "Turn OFF 'Private Wi-Fi Address'",
        "Reconnect to the network"
      ],
      icon: <IPhone className="w-6 h-6" />,
      devices: ["iPhone", "iPad"],
      color: "blue"
    },
    tecno_spark: {
      title: "Tecno Spark",
      steps: [
        "Tap and hold on your wifi hotspot name",
        "Click on 'Modify'",
        "Click on the downward facing arrow below your hotspot name",
        "Click on 'Privacy'",
        "Choose 'Use Device MAC' instead of 'Use random MAC'",
        "Click 'Save'",
        "Reconnect to the network"
      ],
      icon: <DeviceMobile className="w-6 h-6" />,
      devices: ["Tecno Spark"],
      color: "purple"
    },
    android: {
      title: "Android",
      steps: [
        "Go to Settings > Network & Internet",
        "Tap on Wi-Fi",
        "Tap the gear icon next to network",
        "Tap 'Advanced' or 'MAC address type'",
        "Select 'Device MAC' (not 'Randomized MAC')",
        "Save and reconnect"
      ],
      icon: <Android className="w-6 h-6" />,
      devices: ["Samsung", "Google Pixel", "OnePlus", "Xiaomi"],
      color: "green"
    },
    windows: {
      title: "Windows",
      steps: [
        "Click Wi-Fi icon in system tray",
        "Select 'Network & Internet settings'",
        "Click 'Wi-Fi' then 'Manage known networks'",
        "Click on this network > 'Properties'",
        "Turn OFF 'Random hardware addresses'",
        "Reconnect"
      ],
      icon: <Windows className="w-6 h-6" />,
      devices: ["Windows 10", "Windows 11"],
      color: "blue"
    },
    macos: {
      title: "macOS",
      steps: [
        "Click Wi-Fi icon in menu bar",
        "Select 'Network Preferences'",
        "Click 'Advanced'",
        "Select this network",
        "Uncheck 'Random MAC Address'",
        "Click OK and reconnect"
      ],
      icon: <Mac className="w-6 h-6" />,
      devices: ["MacBook", "iMac"],
      color: "gray"
    }
  };

  // Color mapping for badges
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-gray-100 text-gray-700"
  };


  
  return (
    <>
      {/* Trigger Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-center"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600
           hover:bg-blue-700 
                   text-white p-2 rounded-lg font-medium 
                   transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Wifi className="w-5 h-5" />
          <span>Automatic Reconnection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">
          Learn how to disable MAC randomization for automatic reconnection to this hotspot
        </p>
      </motion.div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl 
                     flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Enable Auto-Login
                  </h2>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Disable MAC randomization for automatic reconnection 
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
                {/* Left: Benefits Section */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Why disable MAC randomization?
                    </h3>
                    <ul className="space-y-3 text-sm">
                      {[
                        "Automatic reconnection when you return",
                        "No need to enter voucher/password again",
                        "Faster hotspot access",
                        "Better network recognition"
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-blue-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Note
                    </h3>
                    <p className="text-sm text-green-700 leading-relaxed">
                      Your connection remains secure. This only allows the hotspot to recognize your device's permanent MAC address instead of using a temporary random one for privacy purposes.
                    </p>
                  </div>

                  {/* Device Selection for Mobile */}
                  {isMobile && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Select Your Device
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(instructions).map(([os, data]) => (
                          <button
                            key={os}
                            onClick={() => setSelectedOS(os)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                              selectedOS === os
                                ? 'border-blue-500 bg-white shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {data.icon}
                            <span className="text-xs font-medium mt-2 text-center">
                              {data.title.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Instructions Section */}
                <div className="lg:col-span-2">
                  {/* OS Selection Tabs - Desktop */}
                  {!isMobile && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Object.entries(instructions).map(([os, data]) => (
                        <button
                          key={os}
                          onClick={() => setSelectedOS(os)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                            selectedOS === os
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                          }`}
                        >
                          {data.icon}
                          <span className="font-medium">{data.title}</span>
                          {data.devices && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${colorClasses[data.color]}`}>
                              {data.devices[0]}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected OS Instructions */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${colorClasses[instructions[selectedOS].color]}`}>
                          {instructions[selectedOS].icon}
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">
                            {instructions[selectedOS].title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {instructions[selectedOS].devices?.map((device, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {device}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="self-start sm:self-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        Step by step guide
                      </span>
                    </div>

                    {/* Instructions Steps */}
                    <div className="space-y-3 md:space-y-4">
                      {instructions[selectedOS].steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full 
                                       ${selectedOS === 'ios' ? 'bg-blue-100 text-blue-700' :
                                         selectedOS === 'android' ? 'bg-green-100 text-green-700' :
                                         selectedOS === 'tecno_spark' ? 'bg-purple-100 text-purple-700' :
                                         'bg-gray-100 text-gray-700'} font-bold`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 leading-relaxed">{step}</p>
                            {index === instructions[selectedOS].steps.length - 1 && (
                              <p className="mt-2 text-sm text-green-600 font-medium">
                                ✓ You're all set! Reconnect to the network
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Visual Guide Placeholder */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 
                                  rounded-xl border border-blue-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-blue-800">Need visual help?</h4>
                          <p className="text-sm text-blue-600 mt-1">
                            Watch our step-by-step video tutorial for {instructions[selectedOS].title}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white 
                                           rounded-lg hover:bg-blue-700 transition-colors 
                                           text-sm font-medium">
                            Watch Tutorial
                          </button>
                          <button className="px-4 py-2 border border-blue-600 text-blue-600 
                                           rounded-lg hover:bg-blue-50 transition-colors
                                           text-sm font-medium">
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Tips */}
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h4 className="font-medium text-yellow-800 flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4" />
                        Pro Tip
                      </h4>
                      <p className="text-sm text-yellow-700">
                        After changing these settings, you may need to <strong>forget the network</strong> and reconnect for the changes to take effect.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="border-t p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <DeviceMobile className="w-4 h-4" />
                  <DeviceTablet className="w-4 h-4" />
                  <Monitor className="w-4 h-4" />
                </div>
                <span>Works on all devices and operating systems</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg 
                           transition-colors flex-1 sm:flex-none"
                >
                  I'll do it later
                </button>
                <button
                  onClick={() => {
                    // Optional: Track that user viewed instructions
                    setIsOpen(false);
                    // Optional: Show success message
                    alert("Great! Follow the steps above to enable auto-login.");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white rounded-lg hover:from-blue-700 hover:to-blue-800 
                           transition-all shadow-sm hover:shadow flex-1 sm:flex-none"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// Mobile-optimized simple version
const SimpleMacInstructions = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('ios');

  const quickGuides = {
    ios: "Settings > Wi-Fi > ⓘ > Private Wi-Fi Address > OFF",
    android: "Settings > Network > Wi-Fi > Gear Icon > Advanced > Device MAC",
    windows: "Wi-Fi Icon > Network Settings > Manage Networks > Properties > Random Addresses OFF",
    macos: "Wi-Fi Icon > Network Preferences > Advanced > Random MAC > Uncheck"
  };

  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <Wifi className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-medium text-blue-800 block">
              Enable Auto-Reconnect
            </span>
            <span className="text-xs text-blue-600">
              One-time setup for automatic hotspot access
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </button>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-4 overflow-hidden"
        >
          {/* Device Selection */}
          <div className="bg-white rounded-lg p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your device:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['ios', 'android', 'windows', 'macos'].map((device) => (
                <button
                  key={device}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-2 rounded-lg border transition-all ${
                    selectedDevice === device
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {device === 'ios' && <IPhone className="w-5 h-5 mx-auto" />}
                  {device === 'android' && <Android className="w-5 h-5 mx-auto" />}
                  {device === 'windows' && <Windows className="w-5 h-5 mx-auto" />}
                  {device === 'macos' && <Mac className="w-5 h-5 mx-auto" />}
                  <span className="text-xs mt-1 block capitalize">
                    {device === 'ios' ? 'iPhone' : device}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Guide */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-green-500 mt-0.5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">
                  Quick Instructions:
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {quickGuides[selectedDevice]}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://support.google.com/android/answer/9075847?hl=en&ref_topic=7331506`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg 
                       hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Info className="w-4 h-4" />
              Detailed Guide
            </a>
            
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white 
                       rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              I've Done It
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Hotspot Auto-Login Notice
const HotspotAutoLoginNotice = () => {
  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Shield className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-800">
            Enable Auto-Login for Future Visits
          </h4>
          <p className="text-sm text-yellow-700 mt-1 leading-relaxed">
            To automatically reconnect next time, disable "MAC randomization" 
            or "Private Wi-Fi Address" in your device's Wi-Fi settings. This is a one-time setup.
          </p>
        </div>
        <button className="mt-2 sm:mt-0 px-4 py-2 bg-yellow-600 text-white 
                         rounded-lg hover:bg-yellow-700 transition-colors 
                         font-medium text-sm whitespace-nowrap">
          Show Instructions
        </button>
      </div>
    </div>
  );
};

// Export all versions
export { MacRandomizationInstructions, SimpleMacInstructions, HotspotAutoLoginNotice };