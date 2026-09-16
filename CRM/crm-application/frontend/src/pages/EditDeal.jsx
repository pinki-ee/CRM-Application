import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Save } from "lucide-react";

const EditDeal = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    dealName: "",
    customer: "",
    amount: "",
    stage: "Prospecting",
    status: "Open",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  // Get existing deal
  useEffect(() => {
    const getDeal = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/deals/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Deal not found");
        }

        const deal = data.deal || data.data || data;

        setFormData({
          dealName: deal.dealName || deal.name || "",
          customer: deal.customer || "",
          amount: deal.amount || "",
          stage: deal.stage || "Prospecting",
          status: deal.status || "Open",
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
        navigate("/deals");
      } finally {
        setLoading(false);
      }
    };

    getDeal();
  }, [id, navigate, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update deal
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dealName || !formData.customer || !formData.amount) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(`http://localhost:5000/api/deals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update deal");
      }

      alert("Deal updated successfully!");

      navigate("/deals");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading deal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/deals")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Deal</h1>

              <p className="text-sm text-gray-500">Update deal information</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Heading */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold">Deal Details</h2>

              <p className="text-sm text-gray-500 mt-1">
                Edit deal information
              </p>
            </div>

            <button
              onClick={() => navigate("/deals")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Deal Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deal Name
                </label>

                <input
                  type="text"
                  name="dealName"
                  value={formData.dealName}
                  onChange={handleChange}
                  placeholder="Enter deal name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer
                </label>

                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter deal amount"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium mb-2">Stage</label>

                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"
                >
                  <option value="Prospecting">Prospecting</option>

                  <option value="Proposal">Proposal</option>

                  <option value="Negotiation">Negotiation</option>

                  <option value="Closing">Closing</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"
                >
                  <option value="Open">Open</option>

                  <option value="Won">Won</option>

                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/deals")}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={18} />

                {updating ? "Updating..." : "Update Deal"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditDeal;
