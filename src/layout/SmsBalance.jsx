import React from 'react'
import { FaSms } from 'react-icons/fa';






import { LuBotMessageSquare } from "react-icons/lu";

const SmsBalance = ({smsBalance}) => {
  return (
    <div>
      
<div className="flex items-center gap-2 bg-white border
    dark:bg-gray-800 dark:border-gray-700
    border-t-blue-600 max-w-md px-4 py-2 rounded-lg">
      <LuBotMessageSquare className="text-blue-600 dark:text-blue-300 text-xl animate-bounce" />
      <span className="text-blue-800 dark:text-blue-200 font-medium">
        SMS Balance: <span className="font-bold">{smsBalance}</span>
      </span>
    </div>
    </div>
  )
}

export default SmsBalance
