import React, { useState, useMemo } from "react";

function Transactions({ transactions }) {
  const [timePeriod, setTimePeriod] = useState("all");
  const [transactionType, setTransactionType] = useState("all");

  // Filtering logic
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (timePeriod !== "all") {
      const now = new Date();
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        switch (timePeriod) {
          case "weekly":
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            return transactionDate >= startOfWeek;
          case "monthly":
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return transactionDate >= startOfMonth;
          case "yearly":
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return transactionDate >= startOfYear;
          default:
            return true;
        }
      });
    }
    if (transactionType !== "all") {
      filtered = filtered.filter(transaction => transaction.type === transactionType);
    }
    return filtered;
  }, [transactions, timePeriod, transactionType]);

  // Totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + (typeof t.amount === "number" ? t.amount : parseFloat(t.amount || 0)), 0);
    const expenses = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + (typeof t.amount === "number" ? t.amount : parseFloat(t.amount || 0)), 0);
    const net = income - expenses;
    return { income, expenses, net };
  }, [filteredTransactions]);

  // Helpers
  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatAmount = (amount, type) => {
    const formatted = typeof amount === "number" ? amount.toFixed(2) : parseFloat(amount || 0).toFixed(2);
    return type === "income" ? `+$${formatted}` : `-$${formatted}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section - Without image, simple headline and description */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Financial Transactions Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Visualize and review all your income and expense transactions, filter by time period or type, and get a clear summary of your finances.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg p-6 shadow bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">Income</span>
            <span className="font-extrabold text-2xl text-green-800">${totals.income.toFixed(2)}</span>
          </div>
        </div>
        <div className="rounded-lg p-6 shadow bg-red-50 border border-red-200">
          <div className="flex items-center justify-between">
            <span className="text-red-700 font-semibold text-sm uppercase tracking-wide">Expenses</span>
            <span className="font-extrabold text-2xl text-red-800">${totals.expenses.toFixed(2)}</span>
          </div>
        </div>
        <div className={`rounded-lg p-6 shadow border ${
          totals.net >= 0 
            ? "bg-cyan-50 border-cyan-200" 
            : "bg-orange-50 border-orange-200"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-sm uppercase tracking-wide ${
              totals.net >= 0 ? "text-cyan-700" : "text-orange-700"
            }`}>Net Balance</span>
            <span className={`font-extrabold text-2xl ${
              totals.net >= 0 ? "text-cyan-900" : "text-orange-900"
            }`}>${totals.net.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-between mb-6">
        <div className="flex gap-3 justify-center flex-wrap">
          {["all", "weekly", "monthly", "yearly"].map(period => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                timePeriod === period 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {["all", "income", "expense"].map(type => (
            <button
              key={type}
              onClick={() => setTransactionType(type)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                transactionType === type 
                  ? "bg-green-600 text-white shadow-lg" 
                  : "bg-gray-100 text-gray-700 hover:bg-green-50"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div>
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-gray-400 italic font-medium">
            No transactions found.
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map((transaction, idx) => (
              <li key={transaction._id || idx} className="bg-white rounded-lg shadow p-5 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{transaction.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{transaction.category} • {formatDate(transaction.date)}</div>
                </div>
                <div className={`font-bold text-lg ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Transactions;
