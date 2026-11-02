import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3a2318] text-[#f3e7c9] pt-20 pb-12 px-6 sm:px-12 lg:px-16 border-t border-[#f3e7c9]/10">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm mb-20">
          <div>
            <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#e0b25c] mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#how" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#practice" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Live Mock Practice
                </a>
              </li>
              <li>
                <a href="#roles" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Supported Roles
                </a>
              </li>
              <li>
                <a href="#start" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Interactive Evaluation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#e0b25c] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#learn" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  The Rehearse Notebook
                </a>
              </li>
              <li>
                <a href="#learn" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  STAR Framework Guides
                </a>
              </li>
              <li>
                <a href="#learn" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  System Design Calibration
                </a>
              </li>
              <li>
                <a href="#learn" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Engineering Benchmarks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#e0b25c] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  About Rehearse
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f3e7c9]/80 hover:text-white transition-colors">
                  Security Architecture
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#e0b25c] mb-4">
              Contact &amp; Support
            </h4>
            <p className="text-xs text-[#f3e7c9]/70 mb-3 leading-relaxed">
              Have questions or need enterprise mock round calibrations for your team?
            </p>
            <a
              href="mailto:hello@rehearse.app"
              className="inline-block text-sm text-[#e0b25c] hover:underline font-mono"
            >
              hello@rehearse.app
            </a>
          </div>
        </div>

        {/* Huge Typographic Wordmark */}
        <div className="border-t border-[#f3e7c9]/10 pt-10 select-none overflow-hidden text-center">
          <div
            className="font-serif text-[clamp(64px,18vw,240px)] leading-[0.8] tracking-tight text-[#f3e7c9]/90 hover:text-white transition-colors"
            aria-hidden="true"
          >
            Rehearse
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#f3e7c9]/10 text-xs text-[#f3e7c9]/50">
          <p>© 2026 Rehearse Labs, Inc. All rights reserved.</p>
          <p>Hand-crafted for candidates who value clear, calm speech.</p>
        </div>
      </div>
    </footer>
  );
};

