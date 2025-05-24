import React from 'react'
import { FaSms } from 'react-icons/fa';







const SmsBalance = ({smsBalance}) => {
  return (
    <div>
      
<div className="flex items-center gap-2 bg-white border
    dark:bg-gray-800 dark:border-gray-700
    border-t-blue-600 px-4 py-2 rounded-lg">
      <FaSms className="text-blue-600 dark:text-blue-300 text-xl animate-bounce" />
      <span className="text-blue-800 dark:text-blue-200 font-medium">
        SMS Balance: <span className="font-bold">{smsBalance}</span>
      </span>
    </div>
    </div>
  )
}

export default SmsBalance
