import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Save } from "lucide-react";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch customer data
  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/customers/${id}`,
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
          throw new Error(data.message || "Customer not found");
        }

        const customer = data.customer || data.data || data;

        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          company: customer.company || "",
          status: customer.status || "Active",
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
        navigate("/customers");
      } finally {
        setLoading(false);
      }
    };

    getCustomer();
  }, [id, navigate, token]);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `http://localhost:5000/api/customers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update customer");
      }

      alert("Customer updated successfully!");

      navigate("/customers");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading customer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Back */}
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Customer</h1>

              <p className="text-sm text-gray-500">
                Update customer information
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Form Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Edit the customer details below
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter customer email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Active">Active</option>

                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
              {/* Cancel */}
              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              {/* Update */}
              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
              >
                <Save size={18} />

                {updating ? "Updating..." : "Update Customer"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditCustomer;
