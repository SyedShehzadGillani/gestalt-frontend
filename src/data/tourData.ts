export interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  note?: string;
  badge?: string;
  isLast?: boolean;
  ctaText?: string;
}

export interface Tour {
  id: string;
  name: string;
  triggerOn?: string;
  steps: TourStep[];
}

export const tours: Record<string, Tour> = {
  agencyOnboarding: {
    id: 'agency-onboarding',
    name: 'Agency Platform Tour',
    triggerOn: 'first-visit-agency',
    steps: [
      {
        target: '[data-tour="sidebar-logo"]',
        title: 'Welcome to GESTALT',
        description: "This is your command center for transforming client brands and driving exit valuations. Let me show you around.",
        placement: 'right'
      },
      {
        target: '[data-tour="context-switcher"]',
        title: 'Your Agency Hub',
        description: "You're currently at the Agency level. This card shows your agency info. When you click into a client, this switches to show that client's context.",
        placement: 'right'
      },
      {
        target: '[data-tour="nav-command"]',
        title: 'Command Center',
        description: 'Your daily starting point. See all client health at a glance, AI alerts that need attention, and pending sign-offs — all in one view.',
        placement: 'right'
      },
      {
        target: '[data-tour="nav-clients"]',
        title: 'Client Management',
        description: 'View, search, and manage all your clients. Invite new clients, track their brand health, and quickly access any client dashboard.',
        placement: 'right'
      },
      {
        target: '[data-tour="nav-billing"]',
        title: 'Billing & Invoices',
        description: 'Create invoices, track payments, and manage your agency revenue. See outstanding balances and payment history at a glance.',
        placement: 'right'
      },
      {
        target: '[data-tour="base-section"]',
        title: 'B.A.S.E. Assessments',
        description: "The heart of GESTALT. These tools are activated when viewing a specific client. You'll run assessments, track scores, and measure strategy here.",
        placement: 'right',
        note: 'Items appear dimmed until you select a client.'
      },
      {
        target: '[data-tour="nav-framework"]',
        title: '21-Point Framework',
        description: 'The free assessment that diagnoses brand health in 3 minutes. Use it for lead generation or as a quick diagnostic for new clients.',
        placement: 'right'
      },
      {
        target: '[data-tour="nav-focus"]',
        title: '100-Point FOCUS Audit',
        description: 'The deep dive. When clients are ready to invest in transformation, this comprehensive audit uncovers every opportunity.',
        placement: 'right',
        badge: 'PRO'
      },
      {
        target: '[data-tour="hive-section"]',
        title: 'H.I.V.E. Performance',
        description: 'Human capital metrics. Track employee alignment, organizational health, and culture scores. A healthy team builds healthy brands.',
        placement: 'right'
      },
      {
        target: '[data-tour="nav-messaging"]',
        title: 'S.U.M. — AI Assistant',
        description: 'Your AI strategist. Ask questions about any client, get recommendations, draft messages, and surface insights you might have missed.',
        placement: 'right'
      },
      {
        target: '[data-tour="stats-row"]',
        title: 'Key Metrics',
        description: 'These cards show your most important numbers: active clients, revenue, pending sign-offs, and AI alerts. Red numbers need attention.',
        placement: 'bottom'
      },
      {
        target: '[data-tour="ai-insights-panel"]',
        title: 'AI-Powered Insights',
        description: 'GESTALT INTELLIGENCE continuously analyzes your clients and surfaces what matters most. Alerts, opportunities, and risks — all prioritized for you.',
        placement: 'left',
        isLast: true,
        ctaText: 'Start Exploring'
      }
    ]
  },
  clientOnboarding: {
    id: 'client-onboarding',
    name: 'Client Platform Tour',
    triggerOn: 'first-visit-client',
    steps: [
      {
        target: '[data-tour="sidebar-logo"]',
        title: 'Welcome to Your Brand Hub',
        description: 'This is your command center for understanding and improving your brand. Everything you need is right here.',
        placement: 'right'
      },
      {
        target: '[data-tour="context-switcher"]',
        title: 'Your Company',
        description: "This shows your company context. All the data, assessments, and insights on this platform belong to you — you own it completely.",
        placement: 'right'
      },
      {
        target: '[data-tour="brand-spectrum"]',
        title: 'Your Brand Health Score',
        description: 'This is your B.A.S.E. score — a comprehensive measure of brand health. The higher the score, the closer you are to being "Exit Ready."',
        placement: 'bottom'
      },
      {
        target: '[data-tour="category-scores"]',
        title: 'Four Pillars of Brand Health',
        description: 'Your score breaks down into four categories: Perception (how the market sees you), Clarity (how well you communicate), Identity (visual consistency), and Culture (internal alignment).',
        placement: 'bottom'
      },
      {
        target: '[data-tour="nav-framework"]',
        title: 'Assessments',
        description: 'Take assessments to measure your brand health. The 21-Point Framework gives you a quick diagnostic. The 100-Point FOCUS goes deep.',
        placement: 'right'
      },
      {
        target: '[data-tour="projects-section"]',
        title: 'Active Projects',
        description: "Your agency manages projects here. You'll see progress, upcoming milestones, and items that need your approval.",
        placement: 'left'
      },
      {
        target: '[data-tour="signoff-banner"]',
        title: 'Your Approvals Matter',
        description: 'When you see items "Awaiting Sign-off," that\'s your agency asking for your approval. Review and approve to keep projects moving.',
        placement: 'top'
      },
      {
        target: '[data-tour="nav-messaging"]',
        title: 'Direct Communication',
        description: 'Message your agency team or ask GESTALT INTELLIGENCE questions about your brand. Get instant insights without waiting for a meeting.',
        placement: 'right'
      },
      {
        target: '[data-tour="ai-analysis"]',
        title: 'AI-Powered Analysis',
        description: "GESTALT INTELLIGENCE analyzes your assessments and provides strategic recommendations. It's like having a brand consultant available 24/7.",
        placement: 'left'
      },
      {
        target: '[data-tour="nav-hive"]',
        title: 'Your Team Health',
        description: "H.I.V.E. tracks your organizational health. Happy, aligned employees build stronger brands. Monitor your team's engagement here.",
        placement: 'right',
        isLast: true,
        ctaText: 'Explore Your Dashboard'
      }
    ]
  },
  assessmentIntro: {
    id: 'assessment-intro',
    name: 'Assessment Guide',
    triggerOn: 'first-assessment',
    steps: [
      {
        target: '[data-tour="question-card"]',
        title: 'Answer Honestly',
        description: "Each question measures a specific aspect of your brand. Answer based on reality, not aspiration — that's how we find the real opportunities.",
        placement: 'bottom'
      },
      {
        target: '[data-tour="data-citations"]',
        title: 'Data-Backed Questions',
        description: 'Every question is backed by research. The green shows what happens when brands get this right. The red shows the cost of getting it wrong.',
        placement: 'top'
      },
      {
        target: '[data-tour="progress-bar"]',
        title: 'Four Categories',
        description: "You'll answer questions across four categories: Perception, Clarity, Identity, and Culture. Each builds a complete picture of brand health.",
        placement: 'bottom',
        isLast: true,
        ctaText: 'Begin Assessment'
      }
    ]
  },
  resultsIntro: {
    id: 'results-intro',
    name: 'Understanding Your Results',
    triggerOn: 'first-results',
    steps: [
      {
        target: '[data-tour="main-score"]',
        title: 'Your Overall Score',
        description: "This number represents your brand's current health. Higher is better — 91+ means \"Exit Ready,\" while below 40 signals urgent attention needed.",
        placement: 'bottom'
      },
      {
        target: '[data-tour="results-spectrum"]',
        title: 'Where You Stand',
        description: 'This spectrum shows your position. The goal is to move right toward "Exit Ready." Each color zone has different implications for your business.',
        placement: 'bottom'
      },
      {
        target: '[data-tour="blindspots-section"]',
        title: 'Your Blindspots',
        description: "These are the gaps holding you back. Each blindspot includes why it matters, what it's costing you, and exactly how to fix it.",
        placement: 'top'
      },
      {
        target: '[data-tour="gestalt-solution"]',
        title: 'GESTALT Solutions',
        description: "For each blindspot, we provide a specific solution with timeline, priority, and expected impact. These aren't generic tips — they're your roadmap.",
        placement: 'top',
        isLast: true,
        ctaText: 'Review Your Blindspots'
      }
    ]
  },
  projectsIntro: {
    id: 'projects-intro',
    name: 'Managing Projects',
    triggerOn: 'first-project-view',
    steps: [
      {
        target: '[data-tour="milestone-timeline"]',
        title: 'Milestone Timeline',
        description: 'Projects are broken into milestones. Each milestone has tasks, a due date, and may require your sign-off before the team can proceed.',
        placement: 'left'
      },
      {
        target: '[data-tour="signoff-milestone"]',
        title: 'Sign-off Required',
        description: 'When you see this gold border, your approval is needed. Review the work, then click Approve or Request Changes.',
        placement: 'left'
      },
      {
        target: '[data-tour="project-progress"]',
        title: 'Track Progress',
        description: 'The progress bar shows overall completion. Stay engaged — projects move faster when sign-offs happen quickly.',
        placement: 'bottom',
        isLast: true,
        ctaText: 'Got It'
      }
    ]
  },
  chatIntro: {
    id: 'chat-intro',
    name: 'Meet GESTALT INTELLIGENCE',
    triggerOn: 'first-chat-view',
    steps: [
      {
        target: '[data-tour="chat-input"]',
        title: 'Ask Anything',
        description: 'Type a question about your brand, your score, your projects — anything. GESTALT INTELLIGENCE has access to all your data and can provide instant insights.',
        placement: 'top'
      },
      {
        target: '[data-tour="suggested-prompts"]',
        title: 'Quick Prompts',
        description: "Not sure what to ask? Click any of these suggested prompts to get started. They're tailored to what's most relevant right now.",
        placement: 'top'
      },
      {
        target: '[data-tour="context-badge"]',
        title: 'Context Aware',
        description: 'See this badge? It shows which client you\'re discussing. GESTALT INTELLIGENCE knows the context and tailors responses accordingly.',
        placement: 'bottom',
        isLast: true,
        ctaText: 'Start Chatting'
      }
    ]
  }
};
