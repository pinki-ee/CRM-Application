import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Handshake,
  Activity,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Home,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    customers: 0,
    leads: 0,
    deals: 0,
    recentActivity: [],
    dealStages: [],
  });

  const token = localStorage.getItem("token");

  // FETCH DASHBOARD DATA

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/dashboard", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      setDashboard({
        customers:
          data.customers ??
          data.totalCustomers ??
          data.stats?.customers ??
          data.stats?.totalCustomers ??
          0,

        leads:
          data.leads ??
          data.totalLeads ??
          data.stats?.leads ??
          data.stats?.totalLeads ??
          0,

        deals:
          data.deals ??
          data.totalDeals ??
          data.stats?.deals ??
          data.stats?.totalDeals ??
          0,

        recentActivity:
          data.recentActivity ?? data.activities ?? data.recentActivities ?? [],

        dealStages: data.dealStages ?? data.pipeline ?? data.pipelineData ?? [],
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // FETCH CUSTOMER COUNT

  const fetchCustomerCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customers");
      }

      const count = data.customers?.length || 0;

     setCustomerCount(count);

      setDashboard((prev) => ({
        ...prev,
        customers: count,
      }));
    } catch (error) {
      console.error("Customer count error:", error);
    }
  };

  // LOAD DASHBOARD

  useEffect(() => {
    fetchDashboard();
    fetchCustomerCount();
  }, []);

  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // CRM  CHART OVERVIEW DATA

  const overviewData = [
    {
      name: "Customers",
      value: dashboard.customers,
    },
    {
      name: "Leads",
      value: dashboard.leads,
    },
    {
      name: "Deals",
      value: dashboard.deals,
    },
  ];
  // PIPELINE DATA

  const pipelineData =
    dashboard.dealStages.length > 0
      ? dashboard.dealStages.map((item) => ({
          name: item.name || item.stage || item.status || "Unknown",

          value: Number(item.value || item.count || 0),
        }))
      : [];
  // PIPELINE COLORS

  const stageColors = {
    New: "#3B82F6",
    Prospecting: "#6366F1",
    Proposal: "#F59E0B",
    Negotiation: "#8B5CF6",
    Closing: "#06B6D4",
    Won: "#22C55E",
    Lost: "#EF4444",
  };

  const fallbackColors = [
    "#3B82F6",
    "#8B5CF6",
    "#F59E0B",
    "#22C55E",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
    "#14B8A6",
  ];
  // NAVIGATION HELPER

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* MOBILE HEADER */}

      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            C
          </div>

          <span className="font-bold text-lg">CRM</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-64
          bg-white
          border-r
          border-gray-200
          z-50
          transform
          transition-transform
          duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* LOGO */}

          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                C
              </div>

              <div>
                <h1 className="font-bold text-xl">CRM</h1>

                <p className="text-xs text-gray-500">Customer Management</p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* DASHBOARD */}

            <button
              onClick={() => goTo("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
            >
              <LayoutDashboard size={19} />

              <span>Dashboard</span>
            </button>

            {/* CUSTOMERS */}

            <button
              onClick={() => goTo("/customers")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-3">
                <Users size={19} />

                <span>Customers</span>
              </div>

              <ArrowRight size={16} />
            </button>

            {/* LEADS */}

            <button
              onClick={() => goTo("/leads")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-3">
                <UserPlus size={19} />

                <span>Leads</span>
              </div>

              <ArrowRight size={16} />
            </button>

            {/* DEALS */}

            <button
              onClick={() => goTo("/deals")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-3">
                <Handshake size={19} />

                <span>Deals</span>
              </div>

              <ArrowRight size={16} />
            </button>
          </nav>

          {/* BOTTOM SIDEBAR*/}

          <div className="p-4 border-t border-gray-100 space-y-2">
            {/* PROFILE */}

            <button
              onClick={() => goTo("/profile")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <User size={19} />

              <span>Profile</span>
            </button>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={19} />

              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN*/}

      <main className="lg:ml-64 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
          {/* HEADER + HOME BUTTOM */}

          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>

              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Manage your customers, leads and deals.
              </p>
            </div>

            {/* HOME BUTTON */}

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
              title="Go to Home"
            >
              <Home size={18} />

              <span className="hidden sm:inline">Home</span>
            </button>
          </div>

          {/* MAIN CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* CUSTOMER */}

            <button
              onClick={() => navigate("/customers")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:border-blue-200 transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Users size={22} />
                </div>

                <ArrowRight size={18} className="text-gray-400" />
              </div>

              <p className="text-sm text-gray-500 mt-5">Total Customers</p>

              <h3 className="text-3xl font-bold mt-1">
                {loading ? "..." : dashboard.customers}
              </h3>

              <p className="text-sm text-blue-600 mt-2">View customers</p>
            </button>

            {/* LEADS */}

            <button
              onClick={() => navigate("/leads")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:border-green-200 transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                  <UserPlus size={22} />
                </div>

                <ArrowRight size={18} className="text-gray-400" />
              </div>

              <p className="text-sm text-gray-500 mt-5">Total Leads</p>

              <h3 className="text-3xl font-bold mt-1">
                {loading ? "..." : dashboard.leads}
              </h3>

              <p className="text-sm text-green-600 mt-2">View leads</p>
            </button>

            {/* DEALS */}

            <button
              onClick={() => navigate("/deals")}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:border-purple-200 transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                  <Handshake size={22} />
                </div>

                <ArrowRight size={18} className="text-gray-400" />
              </div>

              <p className="text-sm text-gray-500 mt-5">Total Deals</p>

              <h3 className="text-3xl font-bold mt-1">
                {loading ? "..." : dashboard.deals}
              </h3>

              <p className="text-sm text-purple-600 mt-2">View deals</p>
            </button>
          </div>

          {/* CHARTS */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            {/* CRM OVERVIEW */}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="mb-5">
                <h3 className="text-lg font-semibold">CRM Overview</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Customers, leads and deals
                </p>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={overviewData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar dataKey="value" name="Total" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DEALS PIPELINE */}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="mb-5">
                <h3 className="text-lg font-semibold">Deals Pipeline</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Current deal stages
                </p>
              </div>

              <div className="w-full h-72">
                {pipelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="68%"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={true}
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              stageColors[entry.name] ||
                              fallbackColors[index % fallbackColors.length]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [value, `${name} deals`]}
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm text-gray-600">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm">
                    No deal pipeline data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*RECENT ACTIVITY */}

          <div className="bg-white border border-gray-200 rounded-xl mt-6 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Activity size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Recent Activity</h3>

                  <p className="text-sm text-gray-500">
                    Your latest CRM activities
                  </p>
                </div>
              </div>
            </div>

            {dashboard.recentActivity.length > 0 ? (
              <div>
                {dashboard.recentActivity.map((activity, index) => (
                  <div
                    key={activity._id || activity.id || index}
                    className="px-5 py-4 border-b border-gray-100 last:border-b-0 flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Activity size={17} className="text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.message ||
                          activity.description ||
                          activity.action ||
                          "CRM activity"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 px-5 text-center">
                <Activity size={28} className="mx-auto text-gray-300" />

                <p className="mt-3 text-sm text-gray-400">
                  No recent activity yet
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
