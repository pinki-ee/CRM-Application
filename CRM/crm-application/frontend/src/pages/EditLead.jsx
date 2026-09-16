import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Save } from "lucide-react";

const EditLead = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    source: "Website",
    status: "New",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  // Get existing lead
  useEffect(() => {
    const getLead = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Lead not found");
        }

        const lead = data.lead || data.data || data;

        setFormData({
          name: lead.name || "",
          email: lead.email || "",
          company: lead.company || "",
          source: lead.source || "Website",
          status: lead.status || "New",
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
        navigate("/leads");
      } finally {
        setLoading(false);
      }
    };

    getLead();
  }, [id, navigate, token]);

  // Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update lead");
      }

      alert("Lead updated successfully!");

      navigate("/leads");
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
        <p className="text-gray-500">Loading lead...</p>
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
              onClick={() => navigate("/leads")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Lead</h1>

              <p className="text-sm text-gray-500">Update lead information</p>
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
              <h2 className="text-lg font-semibold">Lead Details</h2>

              <p className="text-sm text-gray-500 mt-1">
                Edit lead information
              </p>
            </div>

            <button
              onClick={() => navigate("/leads")}
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
                <label className="block text-sm font-medium mb-2">Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter lead name"
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
                  placeholder="Enter email"
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
                  placeholder="Enter company"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium mb-2">Source</label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
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
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/leads")}
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

                {updating ? "Updating..." : "Update Lead"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditLead;
