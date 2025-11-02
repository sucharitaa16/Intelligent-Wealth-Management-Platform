// src/Components/Dashboard/MyWallet.jsx
import React from "react";

function MyWallet({ 
  walletOpen, 
  setWalletOpen, 
  walletBalances, 
  accountConfig, 
  userData 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div 
        className="flex justify-between items-center cursor-pointer mb-4"
        onClick={() => setWalletOpen(!walletOpen)}
      >
        <h3 className="text-xl font-bold text-gray-900">MY WALLET</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Total: ${userData?.overallBalance?.toFixed(2) || "0.00"}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${walletOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {walletOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {Object.entries(walletBalances).map(([account, balance]) => (
            <div 
              key={account} 
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${accountConfig[account].color}`}>
                  {accountConfig[account].icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{account}</h4>
                  <p className="text-xs text-gray-500">{accountConfig[account].description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${balance.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Available Balance</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWallet;