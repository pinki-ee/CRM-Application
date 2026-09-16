import { BrowserRouter, Routes, Route } from "react-router-dom";

// Normal User Pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/LoginPage.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";

// Customer Pages
import Customers from "./pages/Customers.jsx";
import AddCustomer from "./pages/AddCustomer.jsx";
import EditCustomer from "./pages/EditCustomer.jsx";

// Lead Pages
import Leads from "./pages/Leads.jsx";
import AddLead from "./pages/AddLead.jsx";
import EditLead from "./pages/EditLead.jsx";

// Deal Pages
import Deals from "./pages/Deals.jsx";
import AddDeal from "./pages/AddDeal.jsx";
import EditDeal from "./pages/EditDeal.jsx";

//Admin Panal
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Users from "./pages/admin/Users.jsx";
import UserForm from "./pages/admin/UserForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* NORMAL USER */}

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/*  CUSTOMERS  */}

        {/* Customer List */}
        <Route path="/customers" element={<Customers />} />

        {/* Add Customer */}
        <Route path="/customers/add" element={<AddCustomer />} />

        {/* Edit Customer */}
        <Route path="/customers/edit/:id" element={<EditCustomer />} />

        {/*  LEADS  */}

        {/* Lead List */}
        <Route path="/leads" element={<Leads />} />

        {/* Add Lead */}
        <Route path="/leads/add" element={<AddLead />} />

        {/* Edit Lead */}
        <Route path="/leads/edit/:id" element={<EditLead />} />

        {/*  DEALS  */}

        {/* Deal List */}
        <Route path="/deals" element={<Deals />} />

        {/* Add Deal */}
        <Route path="/deals/add" element={<AddDeal />} />

        {/* Edit Deal */}
        <Route path="/deals/edit/:id" element={<EditDeal />} />



        {/* Admin Panel */}

        {/* Admin Dashboard */}
        
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>

        <Route path="/admin/users" element={<Users/>}/>

        <Route path="/admin/users/add" element={<UserForm/>}/>

        <Route path="/admin/users/edit/:id" element={<UserForm/>}/>

        <Route path="/admin/users/:id" element={<Users/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
