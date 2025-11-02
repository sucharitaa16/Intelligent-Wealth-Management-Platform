// src/Components/Dashboard/RecentTransactions.jsx
import React from "react";

function RecentTransactions({ transactions }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
        <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
      </div>
      {!transactions || transactions.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600">No transactions found.</p>
          <p className="text-sm text-gray-500 mt-2">Start by adding your first transaction!</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-auto max-h-96">
          {transactions.slice(0, 5).map((trx) => (
            <div
              key={trx._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    trx.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      trx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {trx.type === "income" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{trx.description || "-"}</p>
                  <p className="text-sm text-gray-500">
                    {trx.category} • {new Date(trx.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 italic">Account: {trx.account || "Not specified"}</p>
                </div>
              </div>
              <div
                className={`text-right font-semibold ${
                  trx.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trx.type === "income" ? "+" : "-"}${trx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;