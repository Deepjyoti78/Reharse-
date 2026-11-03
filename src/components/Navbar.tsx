import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown, LogOut, Award, History, BarChart3, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentView, setCurrentView, startInterviewFlow } = useInterview();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [userDropdownOpen]);

  const handleNavClick = (viewTarget?: 'landing' | 'history' | 'dashboard' | 'weak-areas') => {
    if (viewTarget) {
      setCurrentView(viewTarget);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 sm:px-10 lg:px-12 flex justify-between items-center ${
        scrolled || currentView !== 'landing'
          ? 'bg-[#28140d]/95 backdrop-blur-md shadow-lg py-3 text-[#f6ebd4]'
          : 'bg-transparent py-4 sm:py-5 text-[#f6ebd4]'
      }`}
    >
      {/* Brand Wordmark */}
      <button
        onClick={() => handleNavClick('landing')}
        className="font-serif text-2xl sm:text-[28px] tracking-normal text-[#f6ebd4] hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-none p-0"
      >
        Rehearse
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-7 text-[13.5px] font-sans font-normal">
        {currentView === 'landing' ? (
          <>
            <a
              href="#how"
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1"
            >
              How it works
            </a>
            <button
              onClick={() => startInterviewFlow()}
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1 cursor-pointer bg-transparent border-none"
            >
              Practice
            </button>
            <a
              href="#roles"
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1"
            >
              Roles
            </a>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1 cursor-pointer bg-transparent border-none"
            >
              Dashboard
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleNavClick('landing')}
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1 cursor-pointer bg-transparent border-none"
            >
              Home
            </button>
            <button
              onClick={() => startInterviewFlow()}
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1 cursor-pointer bg-transparent border-none"
            >
              Start Rehearsal
            </button>
            <button
              onClick={() => handleNavClick('history')}
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1 cursor-pointer bg-transparent border-none"
            >
              Session History
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="text-[#f6ebd4]/90 hover:text-white transition-colors relative py-1 cursor-pointer bg-transparent border-none"
            >
              Analytics
            </button>
          </>
        )}

        {/* User Auth Pill / Start Free Button */}
        {isAuthenticated && user ? (
          <div id="user-dropdown-container" className="relative ml-1">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#f8eed8] text-[#28140d] hover:bg-white hover:shadow-md transition-all text-xs font-medium cursor-pointer shadow-xs border border-[#3a2318]/15"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#3a2318]/20 shrink-0"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-[#b8542c] text-[#fdfaf3] flex items-center justify-center text-[11px] font-serif font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#faf4e8] text-[#2a170f] p-3 shadow-2xl border border-[#3a2318]/20 z-50 animate-modal-pop font-sans">
                <div className="px-3 py-2 border-b border-[#3a2318]/10 mb-1">
                  <div className="font-semibold text-xs text-[#2a170f] truncate">{user.name}</div>
                  <div className="text-[11px] text-[#3a2318]/60 truncate font-mono">{user.email}</div>
                </div>

                <div className="px-3 py-1.5 text-xs text-[#3a2318]/80 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#dfa84c]" />
                    <span>Readiness Score</span>
                  </span>
                  <span className="font-mono font-bold text-[#b8542c]">{user.readinessScore || 94}/100</span>
                </div>

                <div className="border-t border-[#3a2318]/10 my-1 pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      startInterviewFlow();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#2a170f] hover:bg-[#3a2318]/10 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#b4532a]" />
                    <span>Start Mock Interview</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('history');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#2a170f] hover:bg-[#3a2318]/10 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-[#5b8076]" />
                    <span>Interview History</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('dashboard');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#2a170f] hover:bg-[#3a2318]/10 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#dfa84c]" />
                    <span>Progress Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('weak-areas');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#2a170f] hover:bg-[#3a2318]/10 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Target className="w-3.5 h-3.5 text-[#b4532a]" />
                    <span>Weak Area Drills</span>
                  </button>
                </div>

                <div className="border-t border-[#3a2318]/10 my-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#9c3a1a] hover:bg-[#9c3a1a]/10 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="ml-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f8eed8] text-[#28140d] hover:bg-white hover:shadow-md transition-all duration-200 text-xs sm:text-[13px] font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b4532a]" />
            <span>Start free</span>
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center p-2 rounded-full border border-[#f6ebd4]/30 text-[#f6ebd4] hover:bg-[#f6ebd4]/10 transition-colors"
        aria-label="Toggle Navigation Menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 bg-[#28140d] border-b border-[#f6ebd4]/15 p-6 flex flex-col gap-3 text-base font-serif text-[#f6ebd4] md:hidden shadow-2xl animate-in slide-in-from-top duration-300">
          <button
            onClick={() => {
              setIsOpen(false);
              handleNavClick('landing');
            }}
            className="text-left hover:text-[#e0b25c] transition-colors py-1.5 bg-transparent border-none text-[#f6ebd4]"
          >
            Home Overview
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              startInterviewFlow();
            }}
            className="text-left hover:text-[#e0b25c] transition-colors py-1.5 bg-transparent border-none text-[#f6ebd4]"
          >
            Start Mock Interview
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              handleNavClick('history');
            }}
            className="text-left hover:text-[#e0b25c] transition-colors py-1.5 bg-transparent border-none text-[#f6ebd4]"
          >
            Session History
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              handleNavClick('dashboard');
            }}
            className="text-left hover:text-[#e0b25c] transition-colors py-1.5 bg-transparent border-none text-[#f6ebd4]"
          >
            Progress Dashboard
          </button>

          {isAuthenticated && user ? (
            <div className="mt-2 p-3.5 rounded-2xl bg-[#3a2015] border border-[#f6ebd4]/15 font-sans">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#f6ebd4]">{user.name}</span>
                <span className="text-xs font-mono text-[#dfa84c]">{user.readinessScore || 94}/100</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full text-center py-2 rounded-xl bg-[#9c3a1a]/30 hover:bg-[#9c3a1a]/50 text-[#f6ebd4] text-xs font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAuth();
              }}
              className="mt-2 text-center w-full py-3 rounded-full bg-[#f8eed8] text-[#28140d] font-sans font-semibold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#b4532a]" />
              <span>Start free mock interview</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
