
// src/Components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Income from "./IncomeCard.jsx";
import Expense from "./ExpenseCard.jsx";
import Profit from "./ProfitCard.jsx";
import MyWallet from "./MyWallet.jsx";
import RecentTransactions from "./RecentTransactions.jsx";


function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletBalances, setWalletBalances] = useState({
    CARD: 0,
    CASH: 0,
    SAVINGS: 0,
  });
  const [walletOpen, setWalletOpen] = useState(false);


  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("income");
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    type: "income",
    account: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }


    const fetchCategories = async () => {
      try {
        const incRes = await axios.get("http://localhost:4000/api/categories/income", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncomeCategories(incRes.data.categories || []);


        const expRes = await axios.get("http://localhost:4000/api/categories/expense", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenseCategories(expRes.data.categories || []);
      } catch (e) {
        console.error("Error fetching categories", e);
      }
    };


    const fetchData = async () => {
      try {
        const [userRes, trxRes] = await Promise.all([
          axios.get("http://localhost:4000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/api/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUserData(userRes.data);
        setWalletBalances({
          CARD: userRes.data.cardBalance || 0,
          CASH: userRes.data.cashBalance || 0,
          SAVINGS: userRes.data.savingsBalance || 0,
        });
        const trxData = trxRes.data.transactions || trxRes.data || [];
        setTransactions(trxData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };


    fetchCategories();
    fetchData();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


  const handleAddTransaction = (type) => {
    setModalType(type);
    setNewTransaction({
      description: "",
      amount: "",
      category: "",
      type: type,
      account: "",
    });
    setShowAddModal(true);
  };


  const submitTransaction = async () => {
    if (!newTransaction.account) {
      alert("Please select an account");
      return;
    }
    if (!newTransaction.category) {
      alert("Please select a category");
      return;
    }


    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token);
    console.log("📤 Sending data:", newTransaction);


    try {
      const transactionData = {
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        type: modalType, // "income" or "expense"
        category: newTransaction.category,
        account: newTransaction.account,
      };


      console.log("🎯 Final data to send:", transactionData);


      const response = await axios.post(
        "http://localhost:4000/api/income",
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      console.log("✅ Success:", response.data);


      setTransactions((prev) => [response.data.transaction, ...prev]);
      setShowAddModal(false);


      const amt = parseFloat(newTransaction.amount);
      const acc = newTransaction.account;
      setWalletBalances((prev) => ({
        ...prev,
        [acc]: modalType === "income" ? prev[acc] + amt : prev[acc] - amt,
      }));


      if (userData) {
        setUserData((prev) => ({
          ...prev,
          overallBalance:
            modalType === "income"
              ? prev.overallBalance + amt
              : prev.overallBalance - amt,
        }));
      }


      setNewTransaction({
        description: "",
        amount: "",
        category: "",
        type: "income",
        account: "",
      });
    } catch (e) {
      console.error("❌ Error:", e.response?.data);
      console.error("❌ Error details:", e);
      alert(
        "Failed to add transaction: " + (e.response?.data?.message || e.message)
      );
    }
  };


  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const profit = income - expenses;


  const categorySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const cat = t.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {});


  const accountConfig = {
    CARD: {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
      description: "Debit & Credit Cards",
    },
    CASH: {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "bg-green-100 text-green-600",
      description: "Physical Cash & Hand Money",
    },
    SAVINGS: {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
      description: "Bank Savings & Deposits",
    },
  };


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading your financial dashboard...
          </p>
        </div>
      </div>
    );


  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Add {modalType === "income" ? "Income" : "Expense"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {modalType === "income"
                    ? incomeCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    : expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account
                </label>
                <select
                  value={newTransaction.account}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, account: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Account</option>
                  <option value="CARD">Card</option>
                  <option value="CASH">Cash</option>
                  <option value="SAVINGS">Savings</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitTransaction}
                disabled={
                  !newTransaction.description ||
                  !newTransaction.amount ||
                  !newTransaction.category ||
                  !newTransaction.account
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add {modalType === "income" ? "Income" : "Expense"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinSmart Pro
                </h1>
              </div>
              <nav className="ml-8 flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "transactions"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "analytics"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{userData?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userData?.name || "User"}!
            </h1>
            <p className="text-blue-100 opacity-90">
              Here's your financial overview for{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Current Balance</p>
            <p className="text-3xl font-bold text-white">
              ${userData?.overallBalance?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>


        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Income income={income} onAddIncome={() => handleAddTransaction("income")} />
          <Expense
            expenses={expenses}
            onAddExpense={() => handleAddTransaction("expense")}
          />
          <Profit profit={profit} />
        </div>


        {/* My Wallet Section */}
        <MyWallet
          walletOpen={walletOpen}
          setWalletOpen={setWalletOpen}
          walletBalances={walletBalances}
          accountConfig={accountConfig}
          userData={userData}
        />


        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />
      </main>
    </div>
  );
}


export default Dashboard;

