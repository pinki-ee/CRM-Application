import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, ArrowLeft } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-5"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Logo + Heading */}
        <div className="text-center mb-7">
          <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
            C
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Create Account
          </h1>

          <p className="text-sm text-gray-500 mt-2">Create your CRM account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Account Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Account Type
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Normal User */}
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`p-4 rounded-xl border text-left transition ${
                  formData.role === "user"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Normal User</p>

                    <p className="text-xs text-gray-500 mt-1">
                      Manage CRM work
                    </p>
                  </div>
                </div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`p-4 rounded-xl border text-left transition ${
                  formData.role === "admin"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Shield size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">Admin</p>

                    <p className="text-xs text-gray-500 mt-1">
                      Manage CRM users
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Selected Role */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5 text-sm">
            <span className="text-gray-500">Selected account:</span>

            <span className="font-semibold text-blue-600 ml-1">
              {formData.role === "admin" ? "Admin" : "Normal User"}
            </span>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="ml-1 text-blue-600 font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
