import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/useAuth";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { TourProvider } from "@/contexts/TourContext";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { RoleSidebar, RoleProvider } from "@/components/layout/RoleSidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ProtectedHQRoute } from "@/components/hq/ProtectedHQRoute";
import { PlatformFooter } from "@/components/layout/PlatformFooter";
import { GIProvider, useGI } from "@/hooks/useGI";
import { GIBubble } from "@/components/gi/GIBubble";
import { GIWindow } from "@/components/gi/GIWindow";

// Agency Pages
import AgencyDashboard from "@/pages/agency/AgencyDashboard";
import AgencyClients from "@/pages/agency/AgencyClients";
import AgencyBilling from "@/pages/agency/AgencyBilling";
import AgencyAnalytics from "@/pages/agency/AgencyAnalytics";

// Client Pages
import ClientOverview from "@/pages/client/ClientOverview";
import ClientFramework from "@/pages/client/ClientFramework";
import ClientFocus from "@/pages/client/ClientFocus";
import ClientFormula from "@/pages/client/ClientFormula";
import ClientFinancials from "@/pages/client/ClientFinancials";
import AgencyFinancials from "@/pages/agency/AgencyFinancials";
import ClientHive from "@/pages/client/ClientHive";
import HiveAddLocation from "@/pages/client/performance/AddLocation";
import HiveAddEmployee from "@/pages/client/performance/AddEmployee";
import HiveNodes from "@/pages/client/performance/Nodes";
import HivePositionBuilder from "@/pages/client/performance/PositionBuilder";
import ClientMessaging from "@/pages/client/ClientMessaging";
import ClientJournal from "@/pages/client/ClientJournal";
import ClientStoryEngine from "@/pages/client/ClientStoryEngine";
import ClientPolls from "@/pages/client/ClientPolls";
import ClientVault from "@/pages/client/ClientVault";
import ClientTimeline from "@/pages/client/ClientTimeline";
import ClientProjects from "@/pages/client/ClientProjects";
import ClientProjectDetail from "@/pages/client/ClientProjectDetail";
import ClientAnalytics from "@/pages/client/ClientAnalytics";
import ClientProfile from "@/pages/client/ClientProfile";
import CreateAccount from "@/pages/auth/CreateAccount";
import Funnel from "@/pages/auth/Funnel";
import Login from "@/pages/auth/Login";
import { ComingSoonPlaceholder } from "@/pages/placeholders/ComingSoonPlaceholder";
import ClientCreative from "@/pages/client/ClientCreative";
import ClientStatus from "@/pages/client/ClientStatus";
import CommandCenterPage from "@/pages/platform/CommandCenterPage";

// HQ Pages
import HQLogin from "@/pages/hq/HQLogin";
import HQDashboard from "@/pages/hq/HQDashboard";
import HQAgencies from "@/pages/hq/HQAgencies";
import HQClients from "@/pages/hq/HQClients";
import HQRevenue from "@/pages/hq/HQRevenue";
import HQAIHelp from "@/pages/hq/HQAIHelp";
import HQFeatures from "@/pages/hq/HQFeatures";
import HQConfiguration from "@/pages/hq/HQConfiguration";
import HQTeam from "@/pages/hq/HQTeam";
import HQAnnouncements from "@/pages/hq/HQAnnouncements";
import HQTickets from "@/pages/hq/HQTickets";
import HQCoupons from "@/pages/hq/HQCoupons";
import HQUsage from "@/pages/hq/HQUsage";
import HQAlerts from "@/pages/hq/HQAlerts";
import HQPermissions from "@/pages/hq/HQPermissions";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <TopNav />
      <RoleSidebar />
      <main
        style={{
          marginLeft: 240,
          marginTop: 52,
          marginBottom: 36,
          overflowY: "auto",
          padding: 20,
          flex: 1,
          backgroundColor: "var(--content-bg)",
        }}
      >
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/client/1" replace />} />
          <Route path="/platform" element={<CommandCenterPage />} />
          
          {/* Agency Routes */}
          <Route path="/agency" element={<Navigate to="/agency/dashboard" replace />} />
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/clients" element={<AgencyClients />} />
          <Route path="/agency/analytics" element={<AgencyAnalytics />} />
          <Route path="/agency/billing" element={<AgencyBilling />} />
          
          {/* Client Routes */}
          <Route path="/client/status" element={<Navigate to="/client/1/status" replace />} />
          <Route path="/client/:id/status" element={<ClientStatus />} />
          <Route path="/client/:id" element={<ClientOverview />} />
          <Route path="/client/:id/overview" element={<ClientOverview />} />
          <Route path="/client/:id/framework" element={<ClientFramework />} />
          <Route path="/client/:id/focus" element={<ClientFocus />} />
          <Route path="/client/:id/formula" element={<ClientFormula />} />
          <Route path="/client/:id/hive" element={<ClientHive />} />
          <Route path="/client/:id/hive/add-location" element={<HiveAddLocation />} />
          <Route path="/client/:id/hive/add-employee" element={<HiveAddEmployee />} />
          <Route path="/client/:id/hive/nodes" element={<HiveNodes />} />
          <Route path="/client/:id/hive/position-builder" element={<HivePositionBuilder />} />
          <Route path="/client/:id/messaging" element={<ClientMessaging />} />
          <Route path="/client/:id/vault" element={<ClientVault />} />
          <Route path="/client/:id/timeline" element={<ClientTimeline />} />
          <Route path="/client/:id/personal-timeline" element={<ComingSoonPlaceholder title="Personal Timeline" subtitle="Your Journey" />} />
          <Route path="/client/:id/projects" element={<ClientProjects />} />
          <Route path="/client/:id/projects/:projectId" element={<ClientProjectDetail />} />
          <Route path="/client/:id/analytics" element={<ClientAnalytics />} />
          <Route path="/client/:id/onboarding" element={<ComingSoonPlaceholder title="Onboarding" subtitle="Day 14 of 42" />} />
          <Route path="/client/:id/financials" element={<ClientFinancials />} />
          <Route path="/client/:id/research" element={<ComingSoonPlaceholder title="Research" subtitle="Knowledge Engine" />} />
          <Route path="/client/:id/alerts" element={<ComingSoonPlaceholder title="Alerts" subtitle="AI Intelligence" />} />
          <Route path="/client/:id/journal" element={<ClientJournal />} />
          <Route path="/client/:id/calendar" element={<ComingSoonPlaceholder title="Calendar" subtitle="Deadlines + Events" />} />
          <Route path="/client/:id/story-engine" element={<ClientStoryEngine />} />
          <Route path="/client/:id/vendors" element={<ComingSoonPlaceholder title="Vendors" subtitle="Access" />} />
          <Route path="/client/:id/polls" element={<ClientPolls />} />
          <Route path="/client/:id/creative" element={<ClientCreative />} />
          <Route path="/client/:id/my-tasks" element={<ComingSoonPlaceholder title="My Tasks" subtitle="Assigned From Projects" />} />
          <Route path="/client/:id/mgmt-clients" element={<ComingSoonPlaceholder title="Clients" subtitle="My Client Accounts" />} />
          <Route path="/client/:id/mgmt-revenue" element={<ComingSoonPlaceholder title="Revenue" subtitle="Agency Billing + ARR" />} />
          <Route path="/client/:id/mgmt-usage" element={<ComingSoonPlaceholder title="Usage" subtitle="Platform Activity" />} />
          <Route path="/client/:id/mgmt-invoicing" element={<ComingSoonPlaceholder title="Invoicing" subtitle="Billing + Billable Hours" />} />
          <Route path="/client/:id/mgmt-permissions" element={<ComingSoonPlaceholder title="Permissions" subtitle="Client Access Controls" />} />
          <Route path="/client/:id/mgmt-announcements" element={<ComingSoonPlaceholder title="Announcements" subtitle="Platform-Wide Broadcasts" />} />
          <Route path="/client/:id/profile" element={<ClientProfile />} />
          <Route path="/client/:id/my-score" element={<ComingSoonPlaceholder title="My Score" subtitle="H.I.V.E. Dashboard" />} />
          <Route path="/client/:id/my-trajectory" element={<ComingSoonPlaceholder title="My Trajectory" subtitle="Score Over Time" />} />
          
          {/* Agency extras */}
          <Route path="/agency/alerts" element={<ComingSoonPlaceholder title="Alerts" subtitle="Client + Platform Alerts" />} />
          <Route path="/agency/onboarding" element={<ComingSoonPlaceholder title="Onboarding" subtitle="Day 14 of 42" />} />
          <Route path="/agency/framework" element={<ComingSoonPlaceholder title="Framework" subtitle="21-Point Assessment" />} />
          <Route path="/agency/financials" element={<AgencyFinancials />} />
          <Route path="/agency/focus" element={<ComingSoonPlaceholder title="Focus" subtitle="Company Deep Dive" />} />
          <Route path="/agency/formula" element={<ComingSoonPlaceholder title="Formula" subtitle="Interaction Strategy" />} />
          <Route path="/agency/hive" element={<ComingSoonPlaceholder title="Performance" subtitle="Human Capital Performance System" />} />
          <Route path="/agency/messaging" element={<ClientMessaging />} />
          <Route path="/agency/journal" element={<ClientJournal />} />
          <Route path="/agency/calendar" element={<ComingSoonPlaceholder title="Calendar" subtitle="Deadlines + Events" />} />
          <Route path="/agency/projects" element={<ComingSoonPlaceholder title="Projects" subtitle="Active Initiatives" />} />
          <Route path="/agency/timeline" element={<ComingSoonPlaceholder title="Timeline" subtitle="Brand History" />} />
          <Route path="/agency/story-engine" element={<ClientStoryEngine />} />
          <Route path="/agency/vault" element={<ComingSoonPlaceholder title="Vault" subtitle="Brand Assets" />} />
          <Route path="/agency/vendors" element={<ComingSoonPlaceholder title="Vendors" subtitle="Access" />} />
          <Route path="/agency/polls" element={<ClientPolls />} />
          <Route path="/agency/creative" element={<ComingSoonPlaceholder title="Creative" subtitle="Campaign Intelligence" />} />
          <Route path="/agency/research" element={<ComingSoonPlaceholder title="Research" subtitle="Knowledge Engine" />} />
          <Route path="/agency/mgmt-usage" element={<ComingSoonPlaceholder title="Usage" subtitle="Client Platform Activity" />} />
          <Route path="/agency/mgmt-invoicing" element={<ComingSoonPlaceholder title="Invoicing" subtitle="Billing + Billable Hours" />} />
          <Route path="/agency/mgmt-permissions" element={<ComingSoonPlaceholder title="Permissions" subtitle="Client Access Controls" />} />
          <Route path="/agency/mgmt-announcements" element={<ComingSoonPlaceholder title="Announcements" subtitle="Platform-Wide Broadcasts" />} />
          <Route path="/agency/my-tasks" element={<ComingSoonPlaceholder title="My Tasks" subtitle="Assigned From Projects" />} />

          {/* HQ routes (inline, no separate layout needed since sidebar handles it) */}
          <Route path="/hq" element={<Navigate to="/hq/dashboard" replace />} />
          <Route path="/hq/dashboard" element={<HQDashboard />} />
          <Route path="/hq/alerts" element={<HQAlerts />} />
          <Route path="/hq/agencies" element={<HQAgencies />} />
          <Route path="/hq/clients" element={<HQClients />} />
          <Route path="/hq/revenue" element={<HQRevenue />} />
          <Route path="/hq/usage" element={<HQUsage />} />
          <Route path="/hq/coupons" element={<HQCoupons />} />
          <Route path="/hq/permissions" element={<HQPermissions />} />
          <Route path="/hq/announcements" element={<HQAnnouncements />} />
          <Route path="/hq/tickets" element={<HQTickets />} />
          <Route path="/hq/ai-help" element={<HQAIHelp />} />
          <Route path="/hq/features" element={<HQFeatures />} />
          <Route path="/hq/settings" element={<HQConfiguration />} />
          <Route path="/hq/configuration" element={<HQConfiguration />} />
          <Route path="/hq/team" element={<HQTeam />} />
          <Route path="/hq/login" element={<HQLogin />} />
          <Route path="/hq/base-overview" element={<ComingSoonPlaceholder title="Overview" subtitle="Company Dashboard" />} />
          <Route path="/hq/onboarding" element={<ComingSoonPlaceholder title="Onboarding" subtitle="Day 14 of 42" />} />
          <Route path="/hq/base-framework" element={<ComingSoonPlaceholder title="Framework" subtitle="21-Point Assessment" />} />
          <Route path="/hq/base-focus" element={<ComingSoonPlaceholder title="Focus" subtitle="Company Deep Dive" />} />
          <Route path="/hq/base-formula" element={<ComingSoonPlaceholder title="Formula" subtitle="Interaction Strategy" />} />
          <Route path="/hq/hive-performance" element={<ComingSoonPlaceholder title="Performance" subtitle="Human Capital Performance System" />} />
          <Route path="/hq/sum-messaging" element={<ClientMessaging />} />
          <Route path="/hq/sum-vault" element={<ComingSoonPlaceholder title="Vault" subtitle="Brand Assets" />} />
          <Route path="/hq/vendors" element={<ComingSoonPlaceholder title="Vendors" subtitle="Access" />} />
          <Route path="/hq/sum-timeline" element={<ComingSoonPlaceholder title="Timeline" subtitle="Brand History" />} />
          <Route path="/hq/sum-projects" element={<ComingSoonPlaceholder title="Projects" subtitle="Active Initiatives" />} />
          <Route path="/hq/journal" element={<ClientJournal />} />
          <Route path="/hq/story-engine" element={<ClientStoryEngine />} />
          <Route path="/hq/polls" element={<ClientPolls />} />
          <Route path="/hq/creative" element={<ComingSoonPlaceholder title="Creative" subtitle="Campaign Intelligence" />} />
          <Route path="/hq/research" element={<ComingSoonPlaceholder title="Research" subtitle="Knowledge Engine" />} />
          <Route path="/hq/analytics" element={<ComingSoonPlaceholder title="Analytics" subtitle="Data + Trends" />} />
          <Route path="/hq/my-tasks" element={<ComingSoonPlaceholder title="My Tasks" subtitle="Assigned From Projects" />} />
          <Route path="/hq/pricing" element={<ComingSoonPlaceholder title="Pricing" subtitle="Plan Overrides" />} />
          <Route path="/hq/referrals" element={<ComingSoonPlaceholder title="Referrals" subtitle="Partner Payouts" />} />
          <Route path="/hq/refunds" element={<ComingSoonPlaceholder title="Refunds" subtitle="Refund Management" />} />
          <Route path="/hq/content" element={<ComingSoonPlaceholder title="Content" subtitle="Tutorials and Help" />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <PlatformFooter />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RoleProvider>
              <NavigationProvider>
                <TourProvider>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/framework-audit" element={<Funnel />} />
                    <Route path="/*" element={<AppLayout />} />
                  </Routes>
                  <TourOverlay />
                </TourProvider>
              </NavigationProvider>
            </RoleProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
