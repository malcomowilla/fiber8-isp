

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Statistic Card Component
const StatCard = ({ title, value, icon, color }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const animate = setTimeout(() => {
      setAnimatedValue(value);
    }, 500); // Delay animation for a smoother effect
    return () => clearTimeout(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-lg ${color} text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{animatedValue}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
const DashboardStatistics = () => {
  const stats = [
    {
      title: "Active Vouchers",
      value: 120,
      icon: "🎫",
      color: "bg-purple-500",
    },
    {
      title: "Online Users",
      value: 456,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Payments Today",
      value: 2300,
      icon: "💳",
      color: "bg-green-500",
    },
    {
      title: "Payments This Month",
      value: 45000,
      icon: "💰",
      color: "bg-orange-500",
    },
    {
      title: "Data Consumed",
      value: 1200,
      icon: "📊",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-sm bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl  text-white 
      font-thin
      mb-8">Hotspot Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStatistics;   