import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Logged-in user data
  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("User data error:", error);
    user = {};
  }

  // Get username
  const username = user.name || user.username || user.fullName || "User";

  // Get email
  const email = user.email || "No email available";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">Profile</h1>

              <p className="text-sm text-gray-500">Your account information</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/*  PROFILE TOP */}

          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}

              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <User size={42} />
              </div>

              {/* User name */}

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{username}</h2>

                <p className="text-gray-500 mt-1">CRM User</p>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFORMATION  */}

          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Account Information
            </h3>

            <div className="space-y-4">
              {/* Username */}

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Username</p>

                  <p className="text-sm sm:text-base font-medium text-gray-900 wrap-break-words">
                    {username}
                  </p>
                </div>
              </div>

              {/* Email */}

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>

                  <p className="text-sm sm:text-base font-medium text-gray-900 break-all">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* LOGOUT */}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
