import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { MockRoundShowcase } from './components/MockRoundShowcase';
import { InterviewPillars } from './components/InterviewPillars';
import { RolesSection } from './components/RolesSection';
import { ExpectationSection } from './components/ExpectationSection';
import { NotebookSection } from './components/NotebookSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { MockInterviewModal } from './components/MockInterviewModal';
import { AuthModal } from './components/AuthModal';

import { InterviewProvider, useInterview } from './context/InterviewContext';
import { InterviewFlow } from './components/interview/InterviewFlow';
import { InterviewHistoryView } from './components/dashboard/InterviewHistoryView';
import { ProgressDashboardView } from './components/dashboard/ProgressDashboardView';
import { WeakAreasPracticeView } from './components/dashboard/WeakAreasPracticeView';

const AppContent: React.FC = () => {
  const { currentView, startInterviewFlow } = useInterview();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenDemoWithRole = (role: string) => {
    // Launch the complete mock interview flow directly for that role
    startInterviewFlow(role);
  };

  const handleOpenDemo = () => {
    // Launch complete mock interview flow
    startInterviewFlow();
  };

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#f3e7c9] text-[#2a1a12] selection:bg-[#b4532a] selection:text-[#f3e7c9]">
      {/* Subtle organic noise overlay for vintage editorial atmosphere */}
      <div className="grain-overlay" />

      {/* Navigation - hidden completely in interview flow */}
      {currentView !== 'interview-flow' && (
        <Navbar onOpenDemo={handleOpenDemo} onOpenAuth={handleOpenAuth} />
      )}

      {/* Dynamic View Controller with Smooth Page Switch Transitions */}
      <div key={currentView} className="animate-fade-in-up">
        {currentView === 'interview-flow' ? (
          <div className="py-4 sm:py-8">
            <InterviewFlow />
          </div>
        ) : currentView === 'history' ? (
          <div className="pt-20 sm:pt-24">
            <InterviewHistoryView />
          </div>
        ) : currentView === 'dashboard' ? (
          <div className="pt-20 sm:pt-24">
            <ProgressDashboardView />
          </div>
        ) : currentView === 'weak-areas' ? (
          <div className="pt-20 sm:pt-24">
            <WeakAreasPracticeView />
          </div>
        ) : (
          /* Main Landing Page */
          <main id="top" className="animate-fade-in-up">
            {/* 1. Hero Section using uploaded painting as stage / background */}
            <Hero onOpenDemo={handleOpenDemo} />

            {/* 2. Practice built for the interview, not the quiz */}
            <HowItWorks />

            {/* 3. Sage Section: Your first mock round */}
            <MockRoundShowcase onOpenDemo={handleOpenDemo} />

            {/* 4. Designed around how interviews actually go */}
            <InterviewPillars />

            {/* 5. Sand Section: One interviewer, every kind of role */}
            <RolesSection onSelectRole={handleOpenDemoWithRole} />

            {/* 6. Big Rust Section: What you can expect */}
            <ExpectationSection />

            {/* 7. The Rehearse notebook */}
            <NotebookSection />

            {/* 8. Gold CTA: Walk into your next interview already warmed up */}
            <CtaSection onOpenDemo={handleOpenDemo} />

            {/* Footer with huge typographic Rehearse */}
            <Footer />
          </main>
        )}
      </div>

      {/* Live Interactive Mock Interview Studio Modal (Quick Sandbox fallback) */}
      <MockInterviewModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        initialRole="Software engineering"
      />

      {/* Authentication (Login / Sign Up) Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  );
};

export default App;
