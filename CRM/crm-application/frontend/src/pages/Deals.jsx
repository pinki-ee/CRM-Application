import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Briefcase } from "lucide-react";

const Deals = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // FETCH DEALS
  const fetchDeals = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/deals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load deals");
      }

      setDeals(data.deals || data.data || []);
    } catch (error) {
      console.error("Fetch deals error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // DELETE DEAL
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deal?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/deals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete deal");
      }

      alert("Deal deleted successfully!");

      fetchDeals();
    } catch (error) {
      console.error("Delete deal error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER*/}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                <Briefcase size={19} />
              </div>

              <h1 className="text-xl font-bold text-gray-900">Deals</h1>
            </div>

            {/* Add Deal */}
            <button
              onClick={() => navigate("/deals/add")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              <span>Add Deal</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN  */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* DESKTOP TABLE  */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Deal Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Stage
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      Loading deals...
                    </td>
                  </tr>
                ) : deals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400">
                      No deals found.
                    </td>
                  </tr>
                ) : (
                  deals.map((deal) => {
                    const id = deal._id || deal.id;

                    return (
                      <tr
                        key={id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {/* DEAL NAME */}
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {deal.title || deal.dealName || deal.name || "-"}
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {typeof deal.customer === "string"
                            ? deal.customer
                            : deal.customer?.name || "-"}
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          ₹{deal.amount ?? 0}
                        </td>

                        {/* STAGE */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {deal.stage || "-"}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {/* EDIT */}
                            <button
                              onClick={() => navigate(`/deals/edit/${id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit Deal"
                            >
                              <Edit size={17} />
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => handleDelete(id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Delete Deal"
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

          {/* MOBILE */}
          <div className="md:hidden">
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading deals...
              </div>
            ) : deals.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No deals found.
              </div>
            ) : (
              deals.map((deal) => {
                const id = deal._id || deal.id;

                const customerName =
                  typeof deal.customer === "string"
                    ? deal.customer
                    : deal.customer?.name || "-";

                return (
                  <div key={id} className="p-5 border-b border-gray-100">
                    <div className="flex justify-between gap-3">
                      <div>
                        {/* DEAL NAME */}
                        <h3 className="font-semibold text-gray-800">
                          {deal.title || deal.dealName || deal.name || "-"}
                        </h3>

                        {/* CUSTOMER */}
                        <p className="text-sm text-gray-600 mt-2">
                          Customer: {customerName}
                        </p>

                        {/* AMOUNT */}
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          Amount: ₹{deal.amount ?? 0}
                        </p>

                        {/* STAGE */}
                        <p className="text-sm text-gray-500 mt-1">
                          Stage: {deal.stage || "-"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/deals/edit/${id}`)}
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

export default Deals;
