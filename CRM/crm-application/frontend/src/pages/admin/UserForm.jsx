import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft, Save } from "lucide-react";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // FETCH USER FOR EDIT

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
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
        throw new Error(data.message || "Failed to load user");
      }

      const user = data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const url = isEditMode
        ? `http://localhost:5000/api/admin/users/${id}`
        : "http://localhost:5000/api/admin/users";

      const method = isEditMode ? "PUT" : "POST";

      const body = {
        name: formData.name,
        email: formData.email,
      };

      // Add password only when entered
      if (formData.password.trim() !== "") {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        isEditMode ? "User updated successfully" : "User added successfully",
      );

      navigate("/admin/users");
    } catch (error) {
      console.error("User save error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // UI

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Back to Users
          </button>
        </div>
      </div>

      {/* FORM AREA */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* TITLE */}

          <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <User size={24} />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEditMode ? "Edit User" : "Add User"}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  {isEditMode
                    ? "Update user information"
                    : "Create a new user account"}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
            {/* NAME */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEditMode ? "New Password" : "Password"}
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isEditMode
                      ? "Leave empty to keep current password"
                      : "Enter password"
                  }
                  required={!isEditMode}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {isEditMode && (
                <p className="text-xs text-gray-400 mt-2">
                  Leave this field empty if you don't want to change the
                  password.
                </p>
              )}
            </div>

            {/* BUTTONS */}

            <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />

                {loading
                  ? "Saving..."
                  : isEditMode
                    ? "Update User"
                    : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserForm;
