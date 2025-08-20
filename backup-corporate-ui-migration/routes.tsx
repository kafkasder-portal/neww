import { lazy, startTransition, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AICommandCenter from './components/AICommandCenter'
import { AppSidebar } from './components/AppSidebar'
import ChatContainer from './components/Chat/ChatContainer'
import CommandPalette from './components/CommandPalette'
import {
  withAidSuspense,
  withDashboardSuspense,
  withDefinitionsSuspense,
  withDonationsSuspense,
  withFundSuspense,
  withInternalMessagesSuspense,
  withMeetingsSuspense,
  withMessagesSuspense,
  withScholarshipSuspense,
  withSystemSuspense,
  withTasksSuspense
} from './components/loading/ModuleSuspenseWrapper'
import { MainContent } from './components/MainContent'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SidebarProvider } from './components/ui/sidebar'
import { useAICommandCenter } from './hooks/useAICommandCenter'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useAuthStore } from './store/auth'

// Login page (no protection needed)
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Dashboard
const DashboardIndex = lazy(() => import('./pages/dashboard/Index'))

// Donations
const DonationsList = lazy(() => import('./pages/donations/List'))
const DonationVault = lazy(() => import('./pages/donations/DonationVault'))
const Institutions = lazy(() => import('./pages/donations/Institutions'))
const CashDonations = lazy(() => import('./pages/donations/CashDonations'))
const BankDonations = lazy(() => import('./pages/donations/BankDonations'))
const CreditCardDonations = lazy(() => import('./pages/donations/CreditCardDonations'))
const OnlineDonations = lazy(() => import('./pages/donations/OnlineDonations'))
const DonationNumbers = lazy(() => import('./pages/donations/DonationNumbers'))
const FundingDefinitions = lazy(() => import('./pages/donations/FundingDefinitions'))
const SacrificePeriods = lazy(() => import('./pages/donations/SacrificePeriods'))
const SacrificeShares = lazy(() => import('./pages/donations/SacrificeShares'))
const RamadanPeriods = lazy(() => import('./pages/donations/RamadanPeriods'))
const PiggyBankTracking = lazy(() => import('./pages/donations/PiggyBankTracking'))
const BulkProvisioning = lazy(() => import('./pages/donations/BulkProvisioning'))
const RecurringDonations = lazy(() => import('./pages/donations/RecurringDonations'))

// Payment pages
const PaymentSuccessPage = lazy(() => import('./pages/donations/PaymentSuccessPage'))
const PaymentCancelPage = lazy(() => import('./pages/donations/PaymentCancelPage'))

// Financial Management
const FinancialManagement = lazy(() => import('./pages/finance/FinancialManagement'))

// Donor CRM
const DonorCRM = lazy(() => import('./pages/donors/DonorCRM'))

// New CRM Components
const CRMManagement = lazy(() => import('./pages/crm/CRMManagement'))
const DonorProfiles = lazy(() => import('./pages/crm/DonorProfilesWrapper'))
const CommunicationHistory = lazy(() => import('./pages/crm/CommunicationHistoryWrapper'))
const CampaignManagement = lazy(() => import('./pages/crm/CampaignManagementWrapper'))
const CRMAnalytics = lazy(() => import('./pages/crm/CRMAnalyticsWrapper'))

// Volunteer Management
const VolunteerManagement = lazy(() => import('./pages/volunteers/VolunteerManagement'))

// Inventory Management
const InventoryManagement = lazy(() => import('./pages/inventory/InventoryManagement'))
const StockAlerts = lazy(() => import('./pages/inventory/StockAlerts'))
const StockMovements = lazy(() => import('./pages/inventory/StockMovements'))
const SupplierManagement = lazy(() => import('./pages/inventory/SupplierManagement'))

// Messages
const MessagesIndex = lazy(() => import('./pages/messages/Index'))
const BulkSend = lazy(() => import('./pages/messages/BulkSend'))
const Groups = lazy(() => import('./pages/messages/Groups'))
const Templates = lazy(() => import('./pages/messages/Templates'))
const SmsDeliveries = lazy(() => import('./pages/messages/SmsDeliveries'))
const EmailDeliveries = lazy(() => import('./pages/messages/EmailDeliveries'))
const Analytics = lazy(() => import('./pages/messages/Analytics'))
const MessageModuleInfo = lazy(() => import('./pages/messages/ModuleInfo'))

// Scholarship
const ScholarshipIndex = lazy(() => import('./pages/scholarship/Index'))
const OrphansStudents = lazy(() => import('./pages/scholarship/OrphansStudents'))
const ScholarshipReports = lazy(() => import('./pages/scholarship/Reports'))
const VisualManagement = lazy(() => import('./pages/scholarship/VisualManagement'))
const ScholarshipDefinitions = lazy(() => import('./pages/scholarship/Definitions'))
const TrackingCategories = lazy(() => import('./pages/scholarship/TrackingCategories'))
const OrphanForm = lazy(() => import('./pages/scholarship/OrphanForm'))
const OrphanLetters = lazy(() => import('./pages/scholarship/OrphanLetters'))
const ScholarshipCampaigns = lazy(() => import('./pages/scholarship/Campaigns'))
const Schools = lazy(() => import('./pages/scholarship/Schools'))
const FormDefinitions = lazy(() => import('./pages/scholarship/FormDefinitions'))
const PriceDefinitions = lazy(() => import('./pages/scholarship/PriceDefinitions'))
const AddressLabels = lazy(() => import('./pages/scholarship/AddressLabels'))
const ScholarshipDataControl = lazy(() => import('./pages/scholarship/DataControl'))
const ScholarshipModuleInfo = lazy(() => import('./pages/scholarship/ModuleInfo'))

// Aid
const AidIndex = lazy(() => import('./pages/aid/Index'))
const Beneficiaries = lazy(() => import('./pages/aid/Beneficiaries'))
const BeneficiariesDetail = lazy(() => import('./pages/aid/BeneficiariesDetail'))
const Reports = lazy(() => import('./pages/aid/Reports'))
const Applications = lazy(() => import('./pages/aid/Applications'))
const CashVault = lazy(() => import('./pages/aid/CashVault'))
const BankOrders = lazy(() => import('./pages/aid/BankOrders'))
const CashOperations = lazy(() => import('./pages/aid/CashOperations'))
const InKindOperations = lazy(() => import('./pages/aid/InKindOperations'))
const ServiceTracking = lazy(() => import('./pages/aid/ServiceTracking'))
const HospitalReferrals = lazy(() => import('./pages/aid/HospitalReferrals'))
const Parameters = lazy(() => import('./pages/aid/Parameters'))
const DataControl = lazy(() => import('./pages/aid/DataControl'))
const ModuleInfo = lazy(() => import('./pages/aid/ModuleInfo'))

// Fund
const FundMovements = lazy(() => import('./pages/fund/FundMovements'))
const CompleteReport = lazy(() => import('./pages/fund/CompleteReport'))
const FundRegions = lazy(() => import('./pages/fund/FundRegions'))
const WorkAreas = lazy(() => import('./pages/fund/WorkAreas'))
const FundDefinitions = lazy(() => import('./pages/fund/FundDefinitions'))
const ActivityDefinitions = lazy(() => import('./pages/fund/ActivityDefinitions'))
const SourcesExpenses = lazy(() => import('./pages/fund/SourcesExpenses'))
const AidCategories = lazy(() => import('./pages/fund/AidCategories'))

// System
const WarningMessages = lazy(() => import('./pages/system/WarningMessages'))
const StructuralControls = lazy(() => import('./pages/system/StructuralControls'))
const LocalIPs = lazy(() => import('./pages/system/LocalIPs'))
const IPBlocking = lazy(() => import('./pages/system/IPBlocking'))
const UserManagement = lazy(() => import('./pages/system/UserManagement'))

// Meetings
const MeetingsIndex = lazy(() => import('./pages/meetings/Index'))

// Internal Messages
const InternalMessagesIndex = lazy(() => import('./pages/internal-messages/Index'))

// Tasks
const TasksIndex = lazy(() => import('./pages/tasks/Index'))

// Definitions
const DefinitionsIndex = lazy(() => import('./pages/Definitions'))
const UnitRoles = lazy(() => import('./pages/definitions/UnitRoles'))
const Units = lazy(() => import('./pages/definitions/Units'))
const UserAccounts = lazy(() => import('./pages/definitions/UserAccounts'))
const PermissionGroupsClean = lazy(() => import('./pages/definitions/PermissionGroupsClean'))
const Buildings = lazy(() => import('./pages/definitions/Buildings'))
const InternalLines = lazy(() => import('./pages/definitions/InternalLines'))
const ProcessFlows = lazy(() => import('./pages/definitions/ProcessFlows'))
const PassportFormats = lazy(() => import('./pages/definitions/PassportFormats'))
const CountriesCities = lazy(() => import('./pages/definitions/CountriesCities'))
const InstitutionTypes = lazy(() => import('./pages/definitions/InstitutionTypes'))
const InstitutionStatus = lazy(() => import('./pages/definitions/InstitutionStatus'))
const DonationMethods = lazy(() => import('./pages/definitions/DonationMethods'))
const DeliveryTypes = lazy(() => import('./pages/definitions/DeliveryTypes'))
const MeetingRequests = lazy(() => import('./pages/definitions/MeetingRequests'))
const GSMCodes = lazy(() => import('./pages/definitions/GSMCodes'))
const InterfaceLanguages = lazy(() => import('./pages/definitions/InterfaceLanguages'))
const Translations = lazy(() => import('./pages/definitions/Translations'))
const GeneralSettings = lazy(() => import('./pages/definitions/GeneralSettings'))
const DefinitionsModuleInfo = lazy(() => import('./pages/definitions/ModuleInfo'))

// Test pages
const SupabaseTest = lazy(() => import('./components/SupabaseTest'))
const RelatedRecords = lazy(() => import('./pages/demo/RelatedRecords'))
const ErrorHandlingTest = lazy(() => import('./pages/test/ErrorHandlingTest'))
const CorporateUITest = lazy(() => import('./pages/test/CorporateUITest'))

// Protected Layout Component - sidebar ile korumalı sayfalar
function ProtectedAppLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCmdOpen, setIsCmdOpen] = useState(false)
  const { user } = useAuthStore()

  const {
    isOpen: isAIOpen,
    openCommandCenter,
    closeCommandCenter,
    actionContext,
    userId
  } = useAICommandCenter()

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      // Search is handled in HeaderActions
    },
    onCloseModal: () => {
      if (isAIOpen) closeCommandCenter()
      if (isCmdOpen) setIsCmdOpen(false)
    }
  })

  useEffect(() => {
    const open = () => {
      startTransition(() => {
        setIsCmdOpen(true)
      })
    }
    window.addEventListener('open-command-palette', open as any)
    return () => window.removeEventListener('open-command-palette', open as any)
  }, [])

  const toggleChat = () => {
    startTransition(() => {
      setIsChatOpen(!isChatOpen)
    })
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <MainContent>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={withDashboardSuspense(DashboardIndex)} />

          {/* Donations routes */}
          <Route path="/donations" element={withDonationsSuspense(DonationsList)} />
          <Route path="/donations/vault" element={withDonationsSuspense(DonationVault)} />
          <Route path="/donations/institutions" element={withDonationsSuspense(Institutions)} />
          <Route path="/donations/cash" element={withDonationsSuspense(CashDonations)} />
          <Route path="/donations/bank" element={withDonationsSuspense(BankDonations)} />
          <Route path="/donations/credit-card" element={withDonationsSuspense(CreditCardDonations)} />
          <Route path="/donations/online" element={withDonationsSuspense(OnlineDonations)} />
          <Route path="/donations/numbers" element={withDonationsSuspense(DonationNumbers)} />
          <Route path="/donations/funding-definitions" element={withDonationsSuspense(FundingDefinitions)} />
          <Route path="/donations/sacrifice-periods" element={withDonationsSuspense(SacrificePeriods)} />
          <Route path="/donations/sacrifice-shares" element={withDonationsSuspense(SacrificeShares)} />
          <Route path="/donations/ramadan-periods" element={withDonationsSuspense(RamadanPeriods)} />
          <Route path="/donations/piggy-bank" element={withDonationsSuspense(PiggyBankTracking)} />
          <Route path="/donations/piggy-bank-tracking" element={withDonationsSuspense(PiggyBankTracking)} />
          <Route path="/donations/bulk-provisioning" element={withDonationsSuspense(BulkProvisioning)} />
          <Route path="/donations/recurring" element={withDonationsSuspense(RecurringDonations)} />

          {/* Payment callback routes */}
          <Route path="/donations/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/donations/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/donations/callback" element={<PaymentSuccessPage />} />

          {/* Financial Management routes */}
          <Route path="/finance" element={<FinancialManagement />} />
          <Route path="/finance/accounts" element={<FinancialManagement />} />
          <Route path="/finance/journal" element={<FinancialManagement />} />
          <Route path="/finance/reports" element={<FinancialManagement />} />
          <Route path="/finance/budget" element={<FinancialManagement />} />
          <Route path="/finance/grants" element={<FinancialManagement />} />
          <Route path="/finance/reconciliation" element={<FinancialManagement />} />
          <Route path="/finance/tax" element={<FinancialManagement />} />

          {/* Donor CRM routes */}
          <Route path="/donors" element={<DonorCRM />} />
          <Route path="/donors/list" element={<DonorCRM />} />
          <Route path="/donors/segments" element={<DonorCRM />} />
          <Route path="/donors/campaigns" element={<DonorCRM />} />
          <Route path="/donors/tasks" element={<DonorCRM />} />
          <Route path="/donors/analytics" element={<DonorCRM />} />
          <Route path="/donors/communications" element={<DonorCRM />} />

          {/* New CRM Management routes */}
          <Route path="/crm" element={<CRMManagement />} />
          <Route path="/crm/dashboard" element={<CRMManagement />} />
          <Route path="/crm/profiles" element={<DonorProfiles />} />
          <Route path="/crm/communications" element={<CommunicationHistory />} />
          <Route path="/crm/campaigns" element={<CampaignManagement />} />
          <Route path="/crm/analytics" element={<CRMAnalytics />} />

          {/* Volunteer Management routes */}
          <Route path="/volunteers" element={<VolunteerManagement />} />
          <Route path="/volunteers/list" element={<VolunteerManagement />} />
          <Route path="/volunteers/applications" element={<VolunteerManagement />} />
          <Route path="/volunteers/shifts" element={<VolunteerManagement />} />
          <Route path="/volunteers/training" element={<VolunteerManagement />} />
          <Route path="/volunteers/events" element={<VolunteerManagement />} />
          <Route path="/volunteers/performance" element={<VolunteerManagement />} />

          {/* Inventory Management routes */}
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/inventory/dashboard" element={<InventoryManagement />} />
          <Route path="/inventory/items" element={<InventoryManagement />} />
          <Route path="/inventory/categories" element={<InventoryManagement />} />
          <Route path="/inventory/locations" element={<InventoryManagement />} />
          <Route path="/inventory/alerts" element={<StockAlerts />} />
          <Route path="/inventory/movements" element={<StockMovements />} />
          <Route path="/inventory/suppliers" element={<SupplierManagement />} />
          <Route path="/inventory/reports" element={<InventoryManagement />} />

          {/* Messages routes */}
          <Route path="/messages" element={withMessagesSuspense(MessagesIndex)} />
          <Route path="/messages/bulk-send" element={withMessagesSuspense(BulkSend)} />
          <Route path="/messages/groups" element={withMessagesSuspense(Groups)} />
          <Route path="/messages/templates" element={withMessagesSuspense(Templates)} />
          <Route path="/messages/sms-deliveries" element={withMessagesSuspense(SmsDeliveries)} />
          <Route path="/messages/email-deliveries" element={withMessagesSuspense(EmailDeliveries)} />
          <Route path="/messages/analytics" element={withMessagesSuspense(Analytics)} />
          <Route path="/messages/module-info" element={withMessagesSuspense(MessageModuleInfo)} />

          {/* Scholarship routes */}
          <Route path="/scholarship" element={withScholarshipSuspense(ScholarshipIndex)} />
          <Route path="/scholarship/orphans-students" element={withScholarshipSuspense(OrphansStudents)} />
          <Route path="/scholarship/reports" element={withScholarshipSuspense(ScholarshipReports)} />
          <Route path="/scholarship/visual-management" element={withScholarshipSuspense(VisualManagement)} />
          <Route path="/scholarship/definitions" element={withScholarshipSuspense(ScholarshipDefinitions)} />
          <Route path="/scholarship/tracking-categories" element={withScholarshipSuspense(TrackingCategories)} />
          <Route path="/scholarship/orphan-form" element={withScholarshipSuspense(OrphanForm)} />
          <Route path="/scholarship/orphan-letters" element={withScholarshipSuspense(OrphanLetters)} />
          <Route path="/scholarship/campaigns" element={withScholarshipSuspense(ScholarshipCampaigns)} />
          <Route path="/scholarship/schools" element={withScholarshipSuspense(Schools)} />
          <Route path="/scholarship/form-definitions" element={withScholarshipSuspense(FormDefinitions)} />
          <Route path="/scholarship/price-definitions" element={withScholarshipSuspense(PriceDefinitions)} />
          <Route path="/scholarship/address-labels" element={withScholarshipSuspense(AddressLabels)} />
          <Route path="/scholarship/data-control" element={withScholarshipSuspense(ScholarshipDataControl)} />
          <Route path="/scholarship/module-info" element={withScholarshipSuspense(ScholarshipModuleInfo)} />

          {/* Aid routes */}
          <Route path="/aid" element={withAidSuspense(AidIndex)} />
          <Route path="/aid/beneficiaries" element={withAidSuspense(Beneficiaries)} />
          <Route path="/aid/beneficiaries/:id" element={withAidSuspense(BeneficiariesDetail)} />
          <Route path="/aid/reports" element={withAidSuspense(Reports)} />
          <Route path="/aid/applications" element={withAidSuspense(Applications)} />
          <Route path="/aid/cash-vault" element={withAidSuspense(CashVault)} />
          <Route path="/aid/bank-orders" element={withAidSuspense(BankOrders)} />
          <Route path="/aid/cash-operations" element={withAidSuspense(CashOperations)} />
          <Route path="/aid/in-kind-operations" element={withAidSuspense(InKindOperations)} />
          <Route path="/aid/service-tracking" element={withAidSuspense(ServiceTracking)} />
          <Route path="/aid/hospital-referrals" element={withAidSuspense(HospitalReferrals)} />
          <Route path="/aid/parameters" element={withAidSuspense(Parameters)} />
          <Route path="/aid/data-control" element={withAidSuspense(DataControl)} />
          <Route path="/aid/module-info" element={withAidSuspense(ModuleInfo)} />

          {/* Fund routes */}
          <Route path="/fund/movements" element={withFundSuspense(FundMovements)} />
          <Route path="/fund/complete-report" element={withFundSuspense(CompleteReport)} />
          <Route path="/fund/regions" element={withFundSuspense(FundRegions)} />
          <Route path="/fund/work-areas" element={withFundSuspense(WorkAreas)} />
          <Route path="/fund/definitions" element={withFundSuspense(FundDefinitions)} />
          <Route path="/fund/activity-definitions" element={withFundSuspense(ActivityDefinitions)} />
          <Route path="/fund/sources-expenses" element={withFundSuspense(SourcesExpenses)} />
          <Route path="/fund/aid-categories" element={withFundSuspense(AidCategories)} />

          {/* System routes */}
          <Route path="/system/warning-messages" element={withSystemSuspense(WarningMessages)} />
          <Route path="/system/structural-controls" element={withSystemSuspense(StructuralControls)} />
          <Route path="/system/local-ips" element={withSystemSuspense(LocalIPs)} />
          <Route path="/system/ip-blocking" element={withSystemSuspense(IPBlocking)} />
          <Route path="/system/user-management" element={withSystemSuspense(UserManagement)} />

          {/* Definitions routes */}
          <Route path="/definitions" element={withDefinitionsSuspense(DefinitionsIndex)} />
          <Route path="/definitions/unit-roles" element={withDefinitionsSuspense(UnitRoles)} />
          <Route path="/definitions/units" element={withDefinitionsSuspense(Units)} />
          <Route path="/definitions/user-accounts" element={withDefinitionsSuspense(UserAccounts)} />
          <Route path="/definitions/permission-groups" element={withDefinitionsSuspense(PermissionGroupsClean)} />
          <Route path="/definitions/buildings" element={withDefinitionsSuspense(Buildings)} />
          <Route path="/definitions/internal-lines" element={withDefinitionsSuspense(InternalLines)} />
          <Route path="/definitions/process-flows" element={withDefinitionsSuspense(ProcessFlows)} />
          <Route path="/definitions/passport-formats" element={withDefinitionsSuspense(PassportFormats)} />
          <Route path="/definitions/countries-cities" element={withDefinitionsSuspense(CountriesCities)} />
          <Route path="/definitions/institution-types" element={withDefinitionsSuspense(InstitutionTypes)} />
          <Route path="/definitions/institution-status" element={withDefinitionsSuspense(InstitutionStatus)} />
          <Route path="/definitions/donation-methods" element={withDefinitionsSuspense(DonationMethods)} />
          <Route path="/definitions/delivery-types" element={withDefinitionsSuspense(DeliveryTypes)} />
          <Route path="/definitions/meeting-requests" element={withDefinitionsSuspense(MeetingRequests)} />
          <Route path="/definitions/gsm-codes" element={withDefinitionsSuspense(GSMCodes)} />
          <Route path="/definitions/interface-languages" element={withDefinitionsSuspense(InterfaceLanguages)} />
          <Route path="/definitions/translations" element={withDefinitionsSuspense(Translations)} />
          <Route path="/definitions/general-settings" element={withDefinitionsSuspense(GeneralSettings)} />
          <Route path="/definitions/module-info" element={withDefinitionsSuspense(DefinitionsModuleInfo)} />

          {/* Meetings */}
          <Route path="/meetings" element={withMeetingsSuspense(MeetingsIndex, 'dashboard')} />

          {/* Internal Messages */}
          <Route path="/internal-messages" element={withInternalMessagesSuspense(InternalMessagesIndex, 'dashboard')} />

          {/* Tasks */}
          <Route path="/tasks" element={withTasksSuspense(TasksIndex, 'dashboard')} />

          {/* Test routes */}
          <Route path="/supabase-test" element={withSystemSuspense(SupabaseTest)} />
          <Route path="/demo/related-records" element={withSystemSuspense(RelatedRecords)} />
          <Route path="/test/error-handling" element={withSystemSuspense(ErrorHandlingTest)} />
          <Route path="/test/corporate-ui" element={withSystemSuspense(CorporateUITest)} />
        </Routes>
      </MainContent>

      {/* Chat System - sadece authenticated kullanıcılar için */}
      {user && (
        <ChatContainer
          currentUserId={user.id}
          isOpen={isChatOpen}
          onToggle={toggleChat}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        toggleChat={toggleChat}
        onOpenAICenter={openCommandCenter}
      />

      {/* AI Command Center */}
      <AICommandCenter
        isOpen={isAIOpen}
        onClose={closeCommandCenter}
        context={actionContext}
        userId={userId}
      />
    </SidebarProvider>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Login route - No sidebar/layout */}
      <Route path="/login" element={<Login />} />

      {/* Not Found - No sidebar/layout */}
      <Route path="/404" element={<NotFound />} />

      {/* All protected routes with sidebar layout */}
      <Route path="/*" element={
        <ProtectedRoute>
          <ProtectedAppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRoutes
