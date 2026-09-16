import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Save } from "lucide-react";

const AddDeal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    customer: "",
    amount: "",
    stage: "New",
    expectedCloseDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ===============================
  // HANDLE CHANGE
  // ===============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // CREATE DEAL
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.customer || !formData.amount) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          customer: formData.customer,
          amount: Number(formData.amount),
          stage: formData.stage,
          expectedCloseDate: formData.expectedCloseDate || null,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add deal");
      }

      alert("Deal added successfully!");

      navigate("/deals");
    } catch (error) {
      console.error("Create deal error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}

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
              <h1 className="text-xl font-bold text-gray-900">Add Deal</h1>

              <p className="text-sm text-gray-500">Create a new deal</p>
            </div>
          </div>
        </div>
      </header>

      {/*  MAIN  */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* FORM HEADER */}

          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold">Deal Details</h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter deal information
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

          {/* FORM  */}

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* DEAL NAME */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deal Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter deal name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* CUSTOMER */}

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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* AMOUNT */}

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter deal amount"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* STAGE */}

              <div>
                <label className="block text-sm font-medium mb-2">Stage</label>

                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"
                >
                  <option value="New">New</option>

                  <option value="Negotiation">Negotiation</option>

                  <option value="Proposal">Proposal</option>

                  <option value="Won">Won</option>

                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* EXPECTED CLOSE DATE */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Close Date
                </label>

                <input
                  type="date"
                  name="expectedCloseDate"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* NOTES */}

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>

                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* BUTTONS  */}

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
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={18} />

                {loading ? "Saving..." : "Save Deal"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddDeal;
