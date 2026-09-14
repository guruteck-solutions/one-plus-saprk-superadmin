import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/superadmin/Login";
import ForgotPassword from "./pages/superadmin/ForgotPassword";
import OTPVerification from "./pages/superadmin/OTPVerification";
import ResetPassword from "./pages/superadmin/ResetPassword";

import Dashboard from "./pages/superadmin/Dashboard";
import UserManagement from "./pages/superadmin/UserManagement";
import AddUser from "./pages/superadmin/AddUser";
import ProductManagement from "./pages/superadmin/ProductManagement";
import PriceManagement from "./pages/superadmin/PriceManagement";
import DailyCashReport from "./pages/superadmin/DailyCashReport";
import OrderManagement from "./pages/superadmin/OrderManagement";
import LeadManagement from "./pages/superadmin/LeadManagement";
import QRManagement from "./pages/superadmin/QRManagement";
import RewardDashboard from "./pages/superadmin/RewardDashboard";
import SchemeManagement from "./pages/superadmin/SchemeManagement";
import FinanceDashboard from "./pages/superadmin/FinanceDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Reports from "./pages/superadmin/Reports";
import SystemSettings from "./pages/superadmin/SystemSettings";
import ManufacturingBatchManagement from "./pages/superadmin/ManufacturingBatchManagement";
import InventoryManagement from "./pages/superadmin/InventoryManagement";
import DispatchManagement from "./pages/superadmin/DispatchOverview";
import InboundMaterialManagement from "./pages/superadmin/InboundMaterialOverview";
import EmployeeHRManagement from "./pages/superadmin/EmployeeHRManagement";
import CommissionManagement from "./pages/superadmin/CommissionManagement";
import NotificationManagement from "./pages/superadmin/NotificationManagement";
import DocumentManagement from "./pages/superadmin/DocumentManagement";
import BirthdayManagement from "./pages/superadmin/BirthdayManagement";
import FeedbackManagement from "./pages/superadmin/VoiceOfPainter";
import LoyaltyTierManagement from "./pages/superadmin/LoyaltyTierManagement";
import FollowUpManagement from "./pages/superadmin/FollowUpManagement";
import SalesVisitPlanning from "./pages/superadmin/SalesVisitPlanning";
import BankPaymentSheet from "./pages/superadmin/BankPaymentSheet";
import ApprovalWorkflow from "./pages/superadmin/ApprovalWorkflow";
import Directory from "./pages/superadmin/Directory";
import SocialMediaActivities from "./pages/superadmin/SocialMediaActivities";
import HelpSupport from "./pages/superadmin/HelpSupport";


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH PAGES */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
        <Route path="/users/add" element={<DashboardLayout><AddUser /></DashboardLayout>} />
        <Route path="/users/edit/:id" element={<DashboardLayout><AddUser /></DashboardLayout>} />
        <Route path="/products" element={<DashboardLayout><ProductManagement /></DashboardLayout>} />
        <Route path="/prices" element={<DashboardLayout><PriceManagement /></DashboardLayout>} />
        <Route path="/daily-cash-report" element={<DashboardLayout><DailyCashReport /></DashboardLayout>} />
        <Route path="/order-management" element={<DashboardLayout><OrderManagement /></DashboardLayout>} />
        <Route path="/leads" element={<DashboardLayout><LeadManagement /></DashboardLayout>} />
        <Route path="/qr-management" element={<DashboardLayout><QRManagement /></DashboardLayout>} />
        <Route path="/reward-dashboard" element={<DashboardLayout><RewardDashboard /></DashboardLayout>} />
        <Route path="/scheme-management" element={<DashboardLayout><SchemeManagement /></DashboardLayout>} />
        <Route path="/finance-dashboard" element={<DashboardLayout><FinanceDashboard /></DashboardLayout>} />
        <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
        <Route path="/system-settings" element={<DashboardLayout><SystemSettings /></DashboardLayout>} />
        <Route path="/manufacturing-batch-management" element={<DashboardLayout><ManufacturingBatchManagement /></DashboardLayout>} />
        <Route path="/inventory-management" element={<DashboardLayout><InventoryManagement /></DashboardLayout>} />
        <Route path="/dispatch-management" element={<DashboardLayout><DispatchManagement /></DashboardLayout>} />
        <Route path="/inbound-material-management" element={<DashboardLayout><InboundMaterialManagement /></DashboardLayout>} />
        <Route path="/employee-hr-management" element={<DashboardLayout><EmployeeHRManagement /></DashboardLayout>} />
        <Route path="/commission-management" element={<DashboardLayout><CommissionManagement /></DashboardLayout>} />
        <Route path="/notification-management" element={<DashboardLayout><NotificationManagement /></DashboardLayout>} />
        <Route path="/document-management" element={<DashboardLayout><DocumentManagement /></DashboardLayout>} />
        <Route path="/birthday-management" element={<DashboardLayout><BirthdayManagement /></DashboardLayout>} />
        <Route path="/feedback-management" element={<DashboardLayout><FeedbackManagement /></DashboardLayout>} />
        <Route path="/loyalty-tier-management" element={<DashboardLayout><LoyaltyTierManagement /></DashboardLayout>} />
        <Route path="/follow-up-management" element={<DashboardLayout><FollowUpManagement /></DashboardLayout>} />
        <Route path="/sales-visit-planning" element={<DashboardLayout><SalesVisitPlanning /></DashboardLayout>} />
        <Route path="/bank-payment-sheet" element={<DashboardLayout><BankPaymentSheet /></DashboardLayout>} />
        <Route path="/approval-workflow" element={<DashboardLayout><ApprovalWorkflow /></DashboardLayout>} />
        <Route path="/directory" element={<DashboardLayout><Directory /></DashboardLayout>} />
        <Route path="/social-media-activities" element={<DashboardLayout><SocialMediaActivities /></DashboardLayout>} />
        <Route path="/help-support" element={<DashboardLayout><HelpSupport /></DashboardLayout>} /></Routes>

    </BrowserRouter>
  );
};

export default App;