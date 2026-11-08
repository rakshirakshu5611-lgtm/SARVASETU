import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public / User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import Recommendations from "./pages/Recommendations";
import MyBookmarks from "./pages/MyBookmarks";
import OpportunityHub from "./pages/OpportunityHub";
import MyOpportunities from "./pages/MyOpportunities";
import GovernmentUpdates from "./pages/GovernmentUpdates";
import LatestGovUpdates from "./pages/LatestGovUpdates";
import GovUpdateDetails from "./pages/GovUpdateDetails";
import DocumentVault from "./pages/DocumentVault";
import BankServices from "./pages/BankServices";
import SavedSchemes from "./pages/SavedSchemes";
import Eligibility from "./pages/Eligibility";
import StartupSplash from "./components/StartupSplash";
import { ToastProvider } from "./components/ToastContext";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AddScheme from "./pages/AddScheme";
import ManageSchemes from "./pages/ManageSchemes";
import EditScheme from "./pages/EditScheme";
import AddNotification from "./pages/AddNotification";
import AddOpportunity from "./pages/AddOpportunity";
import AddGovUpdate from "./pages/AddGovUpdate";
import ManageGovUpdates from "./pages/ManageGovUpdates";
import EditGovUpdate from "./pages/EditGovUpdate";
import ManageUsers from "./pages/ManageUsers";
import BackNavigation from "./components/BackNavigation";

// Language
import { LanguageProvider } from "./i18n/LanguageContext";

// Route protection
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import AccountDeletionNotice from "./pages/AccountDeletionNotice";
import AccountDeletionNotice from "./pages/AccountDeletionNotice";

function App() {
  return (
    <ToastProvider>
    <LanguageProvider>
      <BrowserRouter>
      <StartupSplash>
         <BackNavigation />
        <Routes>

          {/* =========================================
              PUBLIC ROUTES
          ========================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =========================================
              PROTECTED USER ROUTES
          ========================================= */}

          <Route element={<ProtectedUserRoute />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/schemes"
              element={<Schemes />}
            />

            <Route
              path="/scheme/:id"
              element={<SchemeDetails />}
            />

            <Route
              path="/recommend"
              element={<Recommendations />}
            />

            <Route
              path="/my-bookmarks"
              element={<MyBookmarks />}
            />

            <Route
              path="/opportunities"
              element={<OpportunityHub />}
            />

            <Route
              path="/my-opportunities"
              element={<MyOpportunities />}
            />

            <Route
              path="/government-updates"
              element={<GovernmentUpdates />}
            />

            <Route
              path="/government-update/:id"
              element={<GovUpdateDetails />}
            />

            <Route
              path="/latest-government-updates"
              element={<LatestGovUpdates />}
            />

            <Route
              path="/documents"
              element={<DocumentVault />}
            />

            <Route
              path="/bank-services"
              element={<BankServices />}
            />

          </Route>

          <Route path="/saved-schemes" element={<SavedSchemes />} />
          <Route path="/eligibility" element={<Eligibility />} />



          {/* =========================================
              PROTECTED ADMIN ROUTES
          ========================================= */}

          <Route element={<ProtectedAdminRoute />}>

            {/* Admin Dashboard */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />


            {/* Scheme Management */}

            <Route
              path="/admin/add-scheme"
              element={<AddScheme />}
            />

            <Route
              path="/admin/manage-schemes"
              element={<ManageSchemes />}
            />

            <Route
              path="/admin/edit-scheme/:id"
              element={<EditScheme />}
            />


            {/* Notifications */}

            <Route
              path="/admin/add-notification"
              element={<AddNotification />}
            />


            {/* Opportunities */}

            <Route
              path="/admin/add-opportunity"
              element={<AddOpportunity />}
            />


            {/* Government Updates */}

            <Route
              path="/admin/add-update"
              element={<AddGovUpdate />}
            />

            <Route
              path="/admin/manage-updates"
              element={<ManageGovUpdates />}
            />

            <Route
              path="/admin/edit-update/:id"
              element={<EditGovUpdate />}
            />


            {/* Users */}

            <Route
              path="/admin/manage-users"
              element={<ManageUsers />}
            />

           {/* Public account-deletion notice — secure token required */}
<Route
  path="/account-deletion-notice/:token"
  element={<AccountDeletionNotice />}

/>
<Route
  path="/account-deletion-notices/:token"
  element={<AccountDeletionNotice />}
/>

          </Route>

        </Routes>
        </StartupSplash>
      </BrowserRouter>
    </LanguageProvider>
    </ToastProvider>
  );
}

export default App;