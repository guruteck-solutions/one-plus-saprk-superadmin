import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/superadmin/Login";
import ForgotPassword from "./pages/superadmin/ForgotPassword";
import OTPVerification from "./pages/superadmin/OTPVerification";
import ResetPassword from "./pages/superadmin/ResetPassword";

// superadmin
import Dashboard from "./pages/superadmin/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
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

// painter
import PainterDashboard from "./pages/painter/PainterDashboard";
import PainterLayout from "./layouts/PainterLayout";
import PainterQuickScan from "./pages/painter/PainterQuickScan";
import PainterQuickShop from "./pages/painter/PainterQuickShop";
import PainterQuickRewards from "./pages/painter/PainterQuickRewards";
import PainterNotifications from "./pages/painter/PainterMonthlyRewardSummary.jsx";
import PainterNotificationCentre from "./pages/painter/PainterNotificationCentre";
import PainterBarcodeScanner from "./pages/painter/PainterBarcodeScanner";
import PainterManualCodeEntry from "./pages/painter/PainterManualCodeEntry";
import PainterScanResult from "./pages/painter/PainterScanResult";
import PainterInvalidQR from "./pages/painter/PainterInvalidQR";
import PainterDuplicateQR from "./pages/painter/PainterDuplicateQR";
import PainterScanHistory from "./pages/painter/PainterScanHistory";
import PainterProductVerification from "./pages/painter/PainterProductVerification";
import PainterRewardHistory from "./pages/painter/PainterRewardHistory";
import PainterWalletLedger from "./pages/painter/PainterWalletLedger";
import PainterRewardDashboard from "./pages/painter/PainterRewardDashboard";
import PainterRewardWallet from "./pages/painter/PainterRewardWallet";
import PainterRewardLedger from "./pages/painter/PainterRewardLedger";
import PainterRewardTransactionHistory from "./pages/painter/PainterRewardTransactionHistory";
import PainterRewardAnalytics from "./pages/painter/PainterRewardAnalytics";
import PainterSchemePerformance from "./pages/painter/PainterSchemePerformance";
import PainterRedemptionDashboard from "./pages/painter/PainterRedemptionDashboard.jsx";
import PainterRedeemRewards from "./pages/painter/PainterRedeemRewards";
import PainterRedemptionRequest from "./pages/painter/PainterRedemptionRequest";
import PainterRedemptionHistory from "./pages/painter/PainterRedemptionHistory";
import PainterRedemptionStatus from "./pages/painter/PainterRedemptionStatus";
import PainterLoyaltyDashboard from "./pages/painter/PainterLoyaltyDashboard";
import PainterTierProgress from "./pages/painter/PainterTierProgress";
import PainterTierBenefits from "./pages/painter/PainterTierBenefits";
import PainterSchemeListing from "./pages/painter/PainterSchemeListing";
import PainterSchemeDetails from "./pages/painter/PainterSchemeDetails";
import PainterSchemePdfPreview from "./pages/painter/PainterSchemePdfPreview";
import PainterOffersListing from "./pages/painter/PainterOffersListing";
import PainterOfferDetails from "./pages/painter/PainterOfferDetails";
import PainterNotificationListing from "./pages/painter/PainterNotificationListing";
import PainterNotificationDetails from "./pages/painter/PainterNotificationDetails";
import PainterReferralDashboard from "./pages/painter/PainterReferralDashboard";
import PainterShareReferral from "./pages/painter/PainterShareReferral";
import PainterReferralHistory from "./pages/painter/PainterReferralHistory";
import PainterReferralStatus from "./pages/painter/PainterReferralStatus";
import PainterDownloadCategoryListing from "./pages/painter/PainterDownloadCategoryListing";
import PainterDownloadProductListing from "./pages/painter/PainterDownloadProductListing";
import PainterDownloadProductDetails from "./pages/painter/PainterDownloadProductDetails";
import PainterDownloadProductImages from "./pages/painter/PainterDownloadProductImages";
import PainterDownloadDocumentPreview from "./pages/painter/PainterDownloadDocumentPreview";


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
        <Route path="/help-support" element={<DashboardLayout><HelpSupport /></DashboardLayout>} />

        {/* painter */}

        <Route path="/painter/dashboard" element={<PainterLayout><PainterDashboard /></PainterLayout>} />
        <Route path="/painter/quick-scan" element={<PainterLayout><PainterQuickScan /></PainterLayout>} />
        <Route path="/painter/quick-shop" element={<PainterLayout><PainterQuickShop /></PainterLayout>} />
        <Route path="/painter/quick-rewards" element={<PainterLayout><PainterQuickRewards /></PainterLayout>} />
        <Route path="/painter/monthly-reward-summary" element={<PainterLayout><PainterNotifications /></PainterLayout>} />
        <Route path="/painter/notifications" element={<PainterLayout><PainterNotificationCentre /></PainterLayout>} />
        <Route path="/painter/barcode-scanner" element={<PainterLayout><PainterBarcodeScanner /></PainterLayout>} />
        <Route path="/painter/manual-code-entry" element={<PainterLayout><PainterManualCodeEntry /></PainterLayout>} />
        <Route path="/painter/scan-result" element={<PainterLayout><PainterScanResult /></PainterLayout>} />
        <Route path="/painter/invalid-qr" element={<PainterLayout><PainterInvalidQR /></PainterLayout>} />
        <Route path="/painter/duplicate-qr" element={<PainterLayout><PainterDuplicateQR /></PainterLayout>} />
        <Route path="/painter/scan-history" element={<PainterLayout><PainterScanHistory /></PainterLayout>} />
        <Route path="/painter/product-verification" element={<PainterLayout><PainterProductVerification /></PainterLayout>} />
        <Route path="/painter/reward-history" element={<PainterLayout><PainterRewardHistory /></PainterLayout>} />
        <Route path="/painter/wallet-ledger" element={<PainterLayout><PainterWalletLedger /></PainterLayout>} />
        <Route path="/painter/reward-dashboard" element={<PainterLayout><PainterRewardDashboard /></PainterLayout>} />
        <Route path="/painter/reward-wallet" element={<PainterLayout><PainterRewardWallet /></PainterLayout>} />
        <Route path="/painter/reward-ledger" element={<PainterLayout><PainterRewardLedger /></PainterLayout>} />
        <Route path="/painter/reward-transaction-history" element={<PainterLayout><PainterRewardTransactionHistory /></PainterLayout>} />
        <Route path="/painter/reward-analytics" element={<PainterLayout><PainterRewardAnalytics /></PainterLayout>} />
        <Route path="/painter/scheme-performance" element={<PainterLayout><PainterSchemePerformance /></PainterLayout>} />
        <Route path="/painter/redemption-dashboard" element={<PainterLayout><PainterRedemptionDashboard /></PainterLayout>} />
        <Route path="/painter/redeem-rewards" element={<PainterLayout><PainterRedeemRewards /></PainterLayout>} />
        <Route path="/painter/redemption-request" element={<PainterLayout><PainterRedemptionRequest /></PainterLayout>} />
        <Route path="/painter/redemption-history" element={<PainterLayout><PainterRedemptionHistory /></PainterLayout>} />
        <Route path="/painter/redemption-status" element={<PainterLayout><PainterRedemptionStatus /></PainterLayout>} />
        <Route path="/painter/loyalty-dashboard" element={<PainterLayout><PainterLoyaltyDashboard /></PainterLayout>} />
        <Route path="/painter/tier-progress" element={<PainterLayout><PainterTierProgress /></PainterLayout>} />
        <Route path="/painter/tier-benefits" element={<PainterLayout><PainterTierBenefits /></PainterLayout>} />
        <Route path="/painter/scheme-listing" element={<PainterLayout><PainterSchemeListing /></PainterLayout>} />
        <Route path="/painter/scheme-details" element={<PainterLayout><PainterSchemeDetails /></PainterLayout>} />
        <Route path="/painter/scheme-details/:id" element={<PainterLayout><PainterSchemeDetails /></PainterLayout>} />
        <Route path="/painter/scheme-pdf-preview" element={<PainterLayout><PainterSchemePdfPreview /></PainterLayout>} />
        <Route path="/painter/scheme-pdf-preview/:id" element={<PainterLayout><PainterSchemePdfPreview /></PainterLayout>} />
        <Route path="/painter/offers-listing" element={<PainterLayout><PainterOffersListing /></PainterLayout>} />
        <Route path="/painter/offer-details" element={<PainterLayout><PainterOfferDetails /></PainterLayout>} />
        <Route path="/painter/offer-details/:id" element={<PainterLayout><PainterOfferDetails /></PainterLayout>} />
        <Route path="/painter/notification-listing" element={<PainterLayout><PainterNotificationListing /></PainterLayout>} />
        <Route path="/painter/notification-details" element={<PainterLayout><PainterNotificationDetails /></PainterLayout>} />
        <Route path="/painter/notification-details/:id" element={<PainterLayout><PainterNotificationDetails /></PainterLayout>} />
        <Route path="/painter/referral-dashboard" element={<PainterLayout><PainterReferralDashboard /></PainterLayout>} />
        <Route path="/painter/share-referral" element={<PainterLayout><PainterShareReferral /></PainterLayout>} />
        <Route path="/painter/referral-history" element={<PainterLayout><PainterReferralHistory /></PainterLayout>} />
        <Route path="/painter/referral-status" element={<PainterLayout><PainterReferralStatus /></PainterLayout>} />
        <Route path="/painter/download-category-listing" element={<PainterLayout><PainterDownloadCategoryListing /></PainterLayout>} />
        <Route path="/painter/download-product-listing" element={<PainterLayout><PainterDownloadProductListing /></PainterLayout>} />
        <Route path="/painter/download-product-details" element={<PainterLayout><PainterDownloadProductDetails /></PainterLayout>} />
        <Route path="/painter/download-product-details/:id" element={<PainterLayout><PainterDownloadProductDetails /></PainterLayout>} />
        <Route path="/painter/download-product-images" element={<PainterLayout><PainterDownloadProductImages /></PainterLayout>} />
        <Route path="/painter/download-document-preview" element={<PainterLayout><PainterDownloadDocumentPreview /></PainterLayout>} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;