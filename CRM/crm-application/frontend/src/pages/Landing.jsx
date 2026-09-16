import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // CHECK LOGGED-IN USER
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User data error:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // GET FIRST LETTER OF USER NAME

  const getFirstLetter = () => {
    if (!user) return "U";

    const name =
      user.name || user.username || user.fullName || user.email || "User";

    return name.charAt(0).toUpperCase();
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowProfileMenu(false);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR*/}

      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          {/* LOGO  */}

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              C
            </div>

            <div>
              <h1 className="font-bold text-xl">CRM</h1>

              <p className="text-[10px] text-gray-500">
                Customer Relationship Management
              </p>
            </div>
          </div>

          {/* NAVBAR RIGHT */}

          <div className="relative">
            {/* LOGGED OUT  */}

            {!user && (
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 sm:px-5 bg-blue-600 text-white rounded-lg text-sm sm:text-base hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* LOGGED IN  */}

            {user && (
              <div className="relative">
                {/* Profile Icon */}

                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg hover:bg-blue-700 transition"
                  title={user.name || user.username || "Profile"}
                >
                  {getFirstLetter()}
                </button>

                {/* PROFILE DROPDOWN  */}

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    {/* User Info */}

                    <div className="px-4 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                          {getFirstLetter()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {user.name || user.username || "User"}
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {user.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile */}

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      View Profile
                    </button>

                    {/* Dashboard */}

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/dashboard");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Dashboard
                    </button>

                    {/* Logout */}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO  */}

      <section className="min-h-[75vh] flex items-center">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6">
              Simple CRM for Modern Businesses
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Manage Your Customers
              <span className="text-blue-600"> Smarter</span>
            </h2>

            <p className="mt-6 text-gray-600 text-base sm:text-lg leading-7 max-w-2xl mx-auto">
              Keep your customers, leads, deals and business information
              organized in one simple and easy-to-use CRM platform.
            </p>

            {/* Main Button */}

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <button
                  onClick={() => navigate("/signup")}
                  className="px-7 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-7 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/*  FEATURES  */}

      <section id="about" className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold">
              Everything You Need in One Place
            </h3>

            <p className="mt-3 text-gray-600">
              Make your daily customer management easier and more organized.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Customer Management */}

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold">
                C
              </div>

              <h4 className="mt-4 text-lg font-semibold">
                Customer Management
              </h4>

              <p className="mt-2 text-gray-600 text-sm leading-6">
                Store and manage customer information easily from one place.
              </p>
            </div>

            {/* Lead Tracking */}

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold">
                L
              </div>

              <h4 className="mt-4 text-lg font-semibold">Lead Tracking</h4>

              <p className="mt-2 text-gray-600 text-sm leading-6">
                Keep track of leads and follow their progress easily.
              </p>
            </div>

            {/* Tasks */}

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold">
                D
              </div>

              <h4 className="mt-4 text-lg font-semibold">Deals & Activities</h4>

              <p className="mt-2 text-gray-600 text-sm leading-6">
                Organize your deals and daily business activities efficiently.
              </p>
            </div>
          </div>

          {/* BOTTOM CTA  */}

          <div className="text-center mt-12">
            {!user ? (
              <>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Ready to get started?
                </h3>

                <button
                  onClick={() => navigate("/signup")}
                  className="mt-5 px-7 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Your Account
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-bold">Welcome back!</h3>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-5 px-7 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Open Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/*  FOOTER */}

      <footer className="border-t border-gray-200 py-6">
        <p className="text-center text-sm text-gray-500">
          © 2026 CRM. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
