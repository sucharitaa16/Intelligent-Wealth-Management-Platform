// Frontpg.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Frontpg() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // const onNavigateToDashboard = () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/dashboard");
  //   } else {
  //     navigate("/signup");
  //   }
  // };

const onNavigateToDashboard = () => {
  try {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/signup");
  } catch (error) {
    console.error("Navigation error:", error);
    navigate("/signup"); // Fallback
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-700 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent tracking-tight">
              FinSmart Pro
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Features', 'Dashboard', 'Analytics', 'Solutions'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-700 hover:text-blue-600 font-medium transition-colors text-sm uppercase tracking-wide">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <button
                className="text-slate-700 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
                onClick={() => navigate("/signup")}
              >
                Sign In
              </button>
              <button
                onClick={onNavigateToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Professional Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">Enterprise-Grade Financial Intelligence</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Intelligent Wealth
              <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                Management Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Advanced financial analytics and AI-driven insights to optimize your financial strategy and accelerate wealth growth
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={onNavigateToDashboard}
                className="bg-white text-slate-900 hover:bg-slate-100 text-lg font-semibold py-4 px-10 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Start Free Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="border border-white/30 text-white hover:bg-white/10 text-lg font-semibold py-4 px-10 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>View Platform Demo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { value: "50K+", label: "Enterprise Clients" },
                { value: "₹2.5Cr+", label: "Assets Managed" },
                { value: "99.9%", label: "Platform Uptime" },
                { value: "4.8/5", label: "Customer Rating" }
              ].map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-slate-400 text-sm font-medium">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="features">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Enterprise Financial Solutions
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive suite of tools designed for sophisticated financial management and strategic planning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "Advanced Analytics",
              description: "Real-time financial analytics with predictive modeling and trend analysis for informed decision-making",
              color: "from-blue-600 to-blue-700"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "AI-Powered Insights",
              description: "Machine learning algorithms provide personalized financial strategies and risk assessment",
              color: "from-emerald-600 to-emerald-700"
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Portfolio Management",
              description: "Comprehensive wealth management tools with automated rebalancing and performance tracking",
              color: "from-slate-600 to-slate-700"
            }
          ].map((feature, index) => (
            <div key={index} className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-md`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-white rounded-2xl shadow-lg border border-slate-200 -mt-10 relative z-10" id="dashboard">
        <div className="text-center mb-12">
          <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Financial Dashboard</h4>
          <p className="text-slate-600">Comprehensive overview of your financial ecosystem</p>
        </div>

        {/* Professional Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 rounded-xl p-1 flex space-x-1">
            {['overview', 'portfolio', 'analytics', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all text-sm ${
                  activeTab === tab 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Dashboard Content */}
        <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Key Metrics */}
              <div className="lg:col-span-2 space-y-6">
                <h5 className="text-lg font-semibold text-slate-900">Financial Overview</h5>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Assets', value: '₹12.4L', change: '+5.2%', positive: true },
                    { label: 'Liquid Cash', value: '₹2.1L', change: '+2.1%', positive: true },
                    { label: 'Investments', value: '₹8.7L', change: '+7.8%', positive: true },
                    { label: 'Liabilities', value: '₹1.2L', change: '-1.3%', positive: false }
                  ].map((metric, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                      <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                      <div className="flex items-baseline justify-between">
                        <div className="text-lg font-bold text-slate-900">{metric.value}</div>
                        <div className={`text-sm font-medium ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {metric.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Spending Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                  <h6 className="font-semibold text-slate-900 mb-4">Monthly Expenditure</h6>
                  <div className="space-y-3">
                    {[
                      { category: 'Operations', amount: '₹45,200', percentage: 45, color: 'bg-blue-600' },
                      { category: 'Technology', amount: '₹28,700', percentage: 28, color: 'bg-emerald-600' },
                      { category: 'Marketing', amount: '₹15,800', percentage: 15, color: 'bg-purple-600' },
                      { category: 'Administration', amount: '₹10,300', percentage: 10, color: 'bg-slate-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium text-slate-700">{item.category}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-bold text-slate-900">{item.amount}</span>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* AI Insights Panel */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                  <h5 className="text-lg font-semibold mb-4">AI Recommendations</h5>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm font-medium mb-1">Portfolio Optimization</p>
                      <p className="text-xs text-blue-100">Increase equity allocation by 8% for better returns</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm font-medium mb-1">Cost Efficiency</p>
                      <p className="text-xs text-blue-100">Reduce operational costs by ₹12,400 monthly</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
                  <h6 className="font-semibold text-slate-900 mb-4">Performance Score</h6>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">87%</div>
                    <div className="text-sm text-slate-600">Financial Health Index</div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Professional Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Transaction</span>
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Generate Report</span>
          </button>
          <button className="bg-slate-700 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI Analysis</span>
          </button>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <h5 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
              Ready to Transform Your Financial Strategy?
            </h5>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Join leading enterprises that trust our platform for their financial management and strategic planning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={onNavigateToDashboard}
                className="bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold py-4 px-12 rounded-lg shadow-2xl hover:scale-105 transition-transform"
              >
                Schedule Demo
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 text-lg font-semibold py-4 px-12 rounded-lg transition-all">
                Contact Sales
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-6">Enterprise-grade security • 24/7 dedicated support • Custom integration</p>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-slate-700 rounded-lg"></div>
                <span className="text-xl font-bold">FinSmart Pro</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Advanced financial intelligence platform for modern enterprises and sophisticated investors.
              </p>
              <div className="flex space-x-3">
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <div key={social} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">{social}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {[
              {
                title: 'Platform',
                links: ['Features', 'Security', 'Pricing', 'API']
              },
              {
                title: 'Solutions',
                links: ['Enterprise', 'Financial Advisors', 'Institutions', 'Developers']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Contact', 'Compliance']
              }
            ].map((section, index) => (
              <div key={index}>
                <h6 className="font-semibold mb-4 text-slate-200 text-sm uppercase tracking-wide">{section.title}</h6>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 FinSmart Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Frontpg;
