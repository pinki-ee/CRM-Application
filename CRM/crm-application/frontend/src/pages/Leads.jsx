import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, UserPlus } from "lucide-react";

const Leads = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load leads");
      }

      setLeads(data.leads || data.data || data || []);
    } catch (error) {
      console.error("Fetch leads error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete lead");
      }

      alert("Lead deleted successfully!");
      fetchLeads();
    } catch (error) {
      console.error("Delete lead error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <UserPlus size={19} />
              </div>

              <h1 className="text-xl font-bold text-gray-900">Leads</h1>
            </div>

            {/* Add Lead */}
            <button
              onClick={() => navigate("/leads/add")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Desktop */}
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
                    Source
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
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      Loading leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const id = lead._id || lead.id;

                    return (
                      <tr
                        key={id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {lead.name}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {lead.email}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {lead.company || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {lead.source || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              lead.status === "Lost"
                                ? "bg-red-50 text-red-600"
                                : lead.status === "Converted"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {lead.status || "New"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/leads/edit/${id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit Lead"
                            >
                              <Edit size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Delete Lead"
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

          {/* Mobile */}
          <div className="md:hidden">
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading leads...
              </div>
            ) : leads.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No leads found.
              </div>
            ) : (
              leads.map((lead) => {
                const id = lead._id || lead.id;

                return (
                  <div key={id} className="p-5 border-b border-gray-100">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {lead.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {lead.email}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                          {lead.company || "-"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Source: {lead.source || "-"}
                        </p>
                      </div>

                      <span className="h-fit px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
                        {lead.status || "New"}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/leads/edit/${id}`)}
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

export default Leads;
