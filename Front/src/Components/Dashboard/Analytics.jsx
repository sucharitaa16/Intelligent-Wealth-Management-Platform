// src/Components/Dashboard/Analytics.jsx
import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics({ transactions }) {
  // State for filters
  const [timePeriod, setTimePeriod] = useState("all");
  const [transactionType, setTransactionType] = useState("all");

  // Filter transactions by time period
  const filteredByTime = useMemo(() => {
    if (timePeriod === "all") return transactions;
    const now = new Date();
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      if (timePeriod === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return date >= startOfWeek;
      }
      if (timePeriod === "monthly") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return date >= startOfMonth;
      }
      if (timePeriod === "yearly") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return date >= startOfYear;
      }
      return true;
    });
  }, [transactions, timePeriod]);

  // Filter by transaction type (income/expense)
  const filteredTransactions = useMemo(() => {
    if (transactionType === "all") return filteredByTime;
    return filteredByTime.filter((t) => t.type === transactionType);
  }, [filteredByTime, transactionType]);

  // Calculate total income, expenses and profit
  const income = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const expenses = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const profit = income - expenses;

  // Category spending for Bar chart
  const categorySpending = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const cat = t.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
      }, {});
  }, [filteredTransactions]);

  const topCategories = useMemo(() => {
    return Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, [categorySpending]);

  // Monthly trends for Line chart (last 6 months)
  const monthlyTrends = useMemo(() => {
    const monthlyData = filteredTransactions.reduce((acc, t) => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      if (!acc[monthYear]) acc[monthYear] = { income: 0, expenses: 0 };
      if (t.type === "income") acc[monthYear].income += t.amount;
      else acc[monthYear].expenses += t.amount;
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6);
  }, [filteredTransactions]);

  // Account distribution for Pie chart
  const accountDistribution = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      const account = t.account || "Other";
      acc[account] = (acc[account] || 0) + t.amount;
      return acc;
    }, {});
  }, [filteredTransactions]);

  // Bar chart config
  const barChartData = {
    labels: topCategories.map(([category]) => category),
    datasets: [
      {
        label: "Expense Amount ($)",
        data: topCategories.map(([, amount]) => amount),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(249, 115, 22)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Top Expense Categories", font: { size: 16, weight: "bold" } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `$${value}` },
      },
    },
  };

  // Line chart config
  const lineChartData = {
    labels: monthlyTrends.map((t) => t.month),
    datasets: [
      {
        label: "Income",
        data: monthlyTrends.map((t) => t.income),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: monthlyTrends.map((t) => t.expenses),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Net Profit",
        data: monthlyTrends.map((t) => t.net),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        borderDash: [5, 5],
      },
    ],
  };
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Financial Trends", font: { size: 16, weight: "bold" } },
    },
    scales: {
      y: {
        ticks: { callback: (value) => `$${value}` },
      },
    },
  };

  // Pie chart config
  const pieChartData = {
    labels: Object.keys(accountDistribution),
    datasets: [
      {
        data: Object.values(accountDistribution),
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(139, 92, 246)",
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Account Distribution", font: { size: 16, weight: "bold" } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? Math.round((value / total) * 100) : 0;
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Buttons */}
        <div className="flex justify-between pb-6">
          <div className="flex gap-3">
            {["all", "weekly", "monthly", "yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-full font-medium ${
                  timePeriod === period ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                onClick={() => setTransactionType(type)}
                className={`px-4 py-2 rounded-full font-medium ${
                  transactionType === type ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-green-50"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard title="Total Income" value={income} color="green" subtext="Filtered Income" />
          <SummaryCard title="Total Expenses" value={expenses} color="red" subtext="Filtered Expenses" />
          <SummaryCard title="Net Profit" value={profit} color={profit >= 0 ? "blue" : "orange"} subtext={profit >= 0 ? "Positive balance" : "Negative balance"} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Top Expense Categories</h2>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Monthly Financial Trends</h2>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Account Distribution</h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color, subtext }) {
  const colorMap = {
    green: ["from-green-50", "to-emerald-50", "border-green-100", "text-green-600", "text-green-800", "bg-green-100"],
    red: ["from-red-50", "to-pink-50", "border-red-100", "text-red-600", "text-red-800", "bg-red-100"],
    blue: ["from-blue-50", "to-cyan-50", "border-blue-100", "text-blue-600", "text-blue-800", "bg-blue-100"],
    orange: ["from-orange-50", "to-amber-50", "border-orange-100", "text-orange-600", "text-orange-800", "bg-orange-100"],
  };

  const [from, to, border, text, boldText, bg] = colorMap[color] || colorMap.green;

  return (
    <div className={`bg-gradient-to-br ${from} ${to} border ${border} rounded-2xl p-6`}>
      <p className={`${text} text-sm font-semibold uppercase tracking-wide`}>{title}</p>
      <p className={`${boldText} font-bold text-2xl mt-2`}>${value.toFixed(2)}</p>
      <p className={`${text} text-sm mt-1`}>{subtext}</p>
    </div>
  );
}

export default Analytics;
