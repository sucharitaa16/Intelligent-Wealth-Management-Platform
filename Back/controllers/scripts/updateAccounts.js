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
    
    console.log('👤 Full user response:', userRes.data);
    
    setUserData(userRes.data);
    
    // ✅ Handle both response formats
    const walletData = {
      Card: userRes.data.cardBalance !== undefined ? userRes.data.cardBalance : 0,
      Cash: userRes.data.cashBalance !== undefined ? userRes.data.cashBalance : 0,
      Savings: userRes.data.savingsBalance !== undefined ? userRes.data.savingsBalance : 0,
    };
    
    console.log('🏦 Final wallet balances:', walletData);
    setWalletBalances(walletData);
    
    const trxData = trxRes.data.transactions || trxRes.data || [];
    setTransactions(trxData);
    
  } catch (err) {
    console.error('❌ Fetch error:', err);
    setError(err.response?.data?.message || "Failed to fetch data");
  } finally {
    setLoading(false);
  }
};