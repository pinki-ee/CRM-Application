import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Get customers from backend
  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/customers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customers");
      }

      setCustomers(data.customers || data.data || data || []);
    } catch (error) {
      console.error("Customer fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete customer");
      }

      // Refresh list after delete
      fetchCustomers();
    } catch (error) {
      console.error("Delete customer error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <Users size={20} />
                </div>

                <h1 className="text-xl font-bold text-gray-900">Customers</h1>
              </div>
            </div>

            {/* Add Customer */}
            <button
              onClick={() => navigate("/customers/add")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Customer</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Company
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => {
                    const id = customer._id || customer.id;

                    return (
                      <tr
                        key={id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {customer.name}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {customer.email}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {customer.company || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              customer.status === "Inactive"
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {customer.status || "Active"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {/* Edit */}
                            <button
                              onClick={() => navigate(`/customers/edit/${id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit Customer"
                            >
                              <Edit size={17} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Delete Customer"
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

          {/* Mobile Cards */}
          <div className="md:hidden">
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading customers...
              </div>
            ) : customers.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No customers found.
              </div>
            ) : (
              customers.map((customer) => {
                const id = customer._id || customer.id;

                return (
                  <div
                    key={id}
                    className="p-5 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {customer.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {customer.email}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                          {customer.company || "-"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs ${
                          customer.status === "Inactive"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {customer.status || "Active"}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/customers/edit/${id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-blue-200 text-blue-600 rounded-lg"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 rounded-lg"
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
      </main>
    </div>
  );
};

export default Customers;
