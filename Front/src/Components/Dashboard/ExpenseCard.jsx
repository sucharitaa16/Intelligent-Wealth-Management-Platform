// components/ExpenseCard.jsx
import React from "react";

function ExpenseCard({ expenses, onAddExpense }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium">Expenses</h3>
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">${expenses.toFixed(2)}</p>
      <button
        onClick={onAddExpense}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors"
      >
        Add Expense
      </button>
    </div>
  );
}

export default ExpenseCard;