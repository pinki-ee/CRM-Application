import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  UserCheck,
  UserX,
  UserRound,
  ArrowRight,
  Power,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    users: [],
  });

  // TOKEN

  const token = localStorage.getItem("token");

  // FETCH ADMIN DASHBOARD

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load admin dashboard");
      }

      setDashboard({
        totalUsers:
          data.stats?.totalUsers ?? data.totalUsers ?? data.users?.length ?? 0,

        activeUsers: data.stats?.activeUsers ?? data.activeUsers ?? 0,

        inactiveUsers: data.stats?.inactiveUsers ?? data.inactiveUsers ?? 0,

        users: data.users || [],
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // LOAD DASHBOARD

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, []);

  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // SIDEBAR NAVIGATION

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // ACTIVE / INACTIVE TOGGLE

  const toggleUserStatus = async (user) => {
    const userId = user._id || user.id;

    if (!userId) {
      alert("User ID not found");
      return;
    }

    const currentStatus =
      typeof user.status === "string"
        ? user.status.toLowerCase()
        : user.isActive === false
          ? "inactive"
          : "active";

    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      setUpdatingUser(userId);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user status");
      }

      await fetchDashboard();
    } catch (error) {
      console.error("Update User Status Error:", error);

      alert(error.message || "Unable to update user status.");
    } finally {
      setUpdatingUser(null);
    }
  };

  // USER STATUS

  const getUserStatus = (user) => {
    if (typeof user.status === "string") {
      return user.status;
    }

    if (user.isActive === false) {
      return "Inactive";
    }

    return "Active";
  };

  // USER INITIALS

  const getInitials = (user) => {
    const name = user.name || user.username || "User";

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  // JOINED DATE

  const getJoinedDate = (user) => {
    if (!user.createdAt) {
      return "-";
    }

    return new Date(user.createdAt).toLocaleDateString();
  };

  // CHART DATA

  const userChartData = [
    {
      name: "Active",
      users: dashboard.activeUsers,
    },
    {
      name: "Inactive",
      users: dashboard.inactiveUsers,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* MOBILE HEADER */}

      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            C
          </div>

          <div>
            <p className="font-bold text-lg leading-none">CRM</p>

            <p className="text-[10px] text-gray-500 mt-1">Admin Panel</p>
          </div>
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
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                C
              </div>

              <div>
                <h1 className="font-bold text-xl">CRM</h1>

                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* DASHBOARD */}

            <button
              onClick={() => goTo("/admin/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
            >
              <LayoutDashboard size={19} />

              <span>Dashboard</span>
            </button>

            {/* USERS */}

            <button
              onClick={() => goTo("/admin/users")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <div className="flex items-center gap-3">
                <Users size={19} />

                <span>Users</span>
              </div>

              <ArrowRight size={16} />
            </button>
          </nav>

          {/* LOGOUT */}

          <div className="p-4 border-t border-gray-100">
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

      {/* MAIN */}

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* PAGE HEADER */}

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h2>

            <p className="mt-1 text-sm sm:text-base text-gray-500">
              Manage and monitor registered CRM users.
            </p>
          </div>

          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* TOTAL USERS */}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserRound size={22} />
              </div>

              <p className="text-sm text-gray-500 mt-5">Total Users</p>

              <h3 className="text-3xl font-bold mt-1">
                {loading ? "..." : dashboard.totalUsers}
              </h3>

              <p className="text-sm text-blue-600 mt-2">All registered users</p>
            </div>

            {/* ACTIVE USERS */}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <UserCheck size={22} />
              </div>

              <p className="text-sm text-gray-500 mt-5">Active Users</p>

              <h3 className="text-3xl font-bold mt-1">
                {loading ? "..." : dashboard.activeUsers}
              </h3>

              <p className="text-sm text-green-600 mt-2">Currently active</p>
            </div>

            {/* INACTIVE USERS */}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <UserX size={22} />
              </div>

              <p className="text-sm text-gray-500 mt-5">Inactive Users</p>

              <h3 className="text-3xl font-bold mt-1">
                {loading ? "..." : dashboard.inactiveUsers}
              </h3>

              <p className="text-sm text-red-600 mt-2">Currently inactive</p>
            </div>
          </div>

          {/* CHART */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">User Overview</h3>

              <p className="text-sm text-gray-500 mt-1">
                Active and inactive users
              </p>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="users" name="Users" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* USERS */}

          <div className="bg-white border border-gray-200 rounded-xl mt-6 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Users</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Registered CRM users
                </p>
              </div>

              <button
                onClick={() => goTo("/admin/users")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                View All Users
                <ArrowRight size={16} />
              </button>
            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Joined
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                      Status Control
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-500"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : dashboard.users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    dashboard.users.slice(0, 10).map((user) => {
                      const id = user._id || user.id;

                      const status = getUserStatus(user);

                      const isActive = status.toLowerCase() === "active";

                      return (
                        <tr
                          key={id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          {/* USER */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                {getInitials(user)}
                              </div>

                              <span className="font-medium text-gray-800">
                                {user.name || user.username || "User"}
                              </span>
                            </div>
                          </td>

                          {/* EMAIL */}

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.email || "-"}
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">
                            <span
                              className={`
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                ${
                                  isActive
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }
                              `}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* JOINED */}

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {getJoinedDate(user)}
                          </td>

                          {/* STATUS CONTROL */}

                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => toggleUserStatus(user)}
                              disabled={updatingUser === id}
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                ${
                                  isActive
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                }
                              `}
                            >
                              <Power size={15} />

                              {updatingUser === id
                                ? "Updating..."
                                : isActive
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE USERS */}

            <div className="md:hidden">
              {loading ? (
                <div className="py-12 text-center text-gray-500">
                  Loading users...
                </div>
              ) : dashboard.users.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  No users found.
                </div>
              ) : (
                dashboard.users.slice(0, 10).map((user) => {
                  const id = user._id || user.id;

                  const status = getUserStatus(user);

                  const isActive = status.toLowerCase() === "active";

                  return (
                    <div
                      key={id}
                      className="p-5 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                          {getInitials(user)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {user.name || user.username || "User"}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1 break-all">
                            {user.email || "-"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Joined: {getJoinedDate(user)}
                          </p>

                          <div className="flex items-center justify-between gap-3 mt-4">
                            <span
                              className={`
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                ${
                                  isActive
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }
                              `}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </span>

                            <button
                              onClick={() => toggleUserStatus(user)}
                              disabled={updatingUser === id}
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-lg
                                text-xs
                                font-medium
                                transition
                                disabled:opacity-50
                                ${
                                  isActive
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-50 text-green-600"
                                }
                              `}
                            >
                              <Power size={14} />

                              {updatingUser === id
                                ? "Updating..."
                                : isActive
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
