import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Save } from "lucide-react";

const AddCustomer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Input handle
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add customer");
      }

      alert("Customer added successfully!");

      navigate("/customers");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/customers")}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold">Add Customer</h1>

              <p className="text-sm text-gray-500">Add a new customer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl">
          {/* Form heading */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold">Customer Details</h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter customer information
              </p>
            </div>

            <button
              onClick={() => navigate("/customers")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter customer email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Active">Active</option>

                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={18} />

                {loading ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCustomer;
