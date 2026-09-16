import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Users = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // FETCH USERS

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return valid JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || data.data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      alert(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUsers();
  }, []);

  // DELETE USER

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${name || "this user"}?`,
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const contentType = response.headers.get("content-type");

      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove user");
      }

      alert("User removed successfully!");

      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      alert(error.message || "Failed to remove user");
    }
  };

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

  // EDIT USER

  const handleEdit = (id) => {
    if (!id) {
      alert("User ID not found");
      return;
    }

    navigate(`/admin/users/edit/${id}`);
  };

  // GET STATUS

  const getStatus = (user) => {
    if (typeof user.status === "string") {
      return user.status;
    }

    if (user.isActive === false) {
      return "Inactive";
    }

    return "Active";
  };

  // GET USER INITIAL

  const getInitial = (user) => {
    const name = user.name || user.username || "User";

    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* MOBILE HEADER */}

      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            C
          </div>

          <div>
            <p className="font-bold text-lg leading-none">CRM</p>

            <p className="text-[10px] text-gray-500 mt-1">Admin Panel</p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            >
              <LayoutDashboard size={19} />

              <span>Dashboard</span>
            </button>

            {/* USERS */}

            <button
              onClick={() => goTo("/admin/users")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
            >
              <UsersIcon size={19} />

              <span>Users</span>
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Users</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage all registered CRM users.
                </p>
              </div>
            </div>

            {/* ADD USER */}

            <button
              onClick={() => navigate("/admin/users/add")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />

              <span>Add User</span>
            </button>
          </div>

          {/* TOTAL USERS */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <UsersIcon size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Users</p>

                <h3 className="text-2xl font-bold">
                  {loading ? "..." : users.length}
                </h3>
              </div>
            </div>
          </div>

          {/* USERS TABLE */}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                      Actions
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
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const id = user._id || user.id;

                      const status = getStatus(user);

                      return (
                        <tr
                          key={id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          {/* USER */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                                {getInitial(user)}
                              </div>

                              <p className="font-medium text-gray-800">
                                {user.name || user.username || "User"}
                              </p>
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
                                  status.toLowerCase() === "active"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }
                              `}
                            >
                              {status}
                            </span>
                          </td>

                          {/* JOINED */}

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "-"}
                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              {/* EDIT */}

                              <button
                                onClick={() => handleEdit(id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit User"
                              >
                                <Edit size={17} />
                              </button>

                              {/* DELETE */}

                              <button
                                onClick={() =>
                                  handleDelete(id, user.name || user.username)
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Remove User"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
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
              ) : users.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  No users found.
                </div>
              ) : (
                users.map((user) => {
                  const id = user._id || user.id;

                  const status = getStatus(user);

                  return (
                    <div
                      key={id}
                      className="p-5 border-b border-gray-100 last:border-b-0"
                    >
                      {/* USER */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                            {getInitial(user)}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {user.name || user.username || "User"}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1 break-all">
                              {user.email || "-"}
                            </p>
                          </div>
                        </div>

                        {/* STATUS */}

                        <span
                          className={`
                            shrink-0
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                              status.toLowerCase() === "active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }
                          `}
                        >
                          {status}
                        </span>
                      </div>

                      {/* JOINED */}

                      <p className="text-xs text-gray-400 mt-4">
                        Joined:{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </p>

                      {/* MOBILE ACTIONS */}

                      <div className="flex items-center gap-2 mt-4">
                        {/* EDIT */}

                        <button
                          onClick={() => handleEdit(id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit size={16} />
                          Edit User
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(id, user.name || user.username)
                          }
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
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

export default Users;
