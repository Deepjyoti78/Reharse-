import React, { useState } from 'react';
import { Clock, ArrowRight, X } from 'lucide-react';

interface Article {
  title: string;
  tag: string;
  readTime: string;
  excerpt: string;
  img: string;
  alt: string;
  fullText: string[];
}

export const NotebookSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      title: "Turning a project into a two-minute story",
      tag: "Guide",
      readTime: "8 min read",
      excerpt: "Why 80% of candidates lose interviewers in the setup phase, and how to frontload the engineering tension and outcome.",
      img: "/images/rehearse/learning/guide-storytelling-project.webp",
      alt: "Open study notebook with technical diagram and fountain pen",
      fullText: [
        "The standard mistake when answering 'Tell me about a complex project' is chronicling your sprint chronology: 'First we set up Jira tickets, then we met with design, then we decided to use Next.js...'. By the time you mention the real problem, the interviewer's attention has drifted.",
        "Instead, invert the pyramid. Open with the stakes: 'We had 2.4 million daily active users hitting a checkout bottleneck where 4% of database writes timed out during flash sales.'",
        "Break your story into the 30-30-60 rule: 30 seconds establishing the technical bottleneck, 30 seconds explaining the two architectural alternatives you weighed, and 60 seconds on the implementation, triage, and quantifiable business outcome."
      ]
    },
    {
      title: "The first five minutes of any technical round",
      tag: "Playbook",
      readTime: "6 min read",
      excerpt: "The subtle signaling that happens before you write a single line of code or touch the virtual whiteboard.",
      img: "/images/rehearse/learning/guide-first-five-minutes.webp",
      alt: "Candidate reviewing technical blueprint and architectural checklist",
      fullText: [
        "Interviewers rarely reject a candidate because of a minor syntax typo; they reject candidates who start coding before verifying ambiguity.",
        "In the first five minutes, practice 'boundary negotiation'. Restate the problem in your own words, clarify edge cases (Null inputs? Scale constraints? Concurrency assumptions?), and establish realistic test inputs.",
        "Think out loud intentionally. A silent candidate forces the interviewer to guess; a candidate who verbalizes their trade-off landscape creates an ongoing technical collaboration."
      ]
    },
    {
      title: "Why confidence is mostly repetition",
      tag: "Essay",
      readTime: "5 min read",
      excerpt: "Nervousness in interviews isn't a personality flaw—it's unfamiliarity with hearing your own voice under interrogation.",
      img: "/images/rehearse/learning/guide-confidence-repetition.webp",
      alt: "Vintage study lamp illuminating reference volumes and audio headphones",
      fullText: [
        "Most engineers prepare for interviews through reading: reading LeetCode solutions, reading system design blogs, reading behavioral lists. Reading is passive pattern recognition.",
        "Interviewing is active verbal synthesis. You have to convert internal abstract architecture into concise, spoken English while your adrenaline is elevated.",
        "The difference between feeling flustered and delivering crisp answers isn't raw intellect—it's having articulated the explanation aloud four or five times beforehand."
      ]
    }
  ];

  return (
    <section id="learn" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#f3e7c9] text-[#2a1a12] border-b border-[#3a2318]/15">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-14">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#b4532a] bg-[#e4d5b8] px-3.5 py-1 rounded-full border border-[#b4532a]/20">
              Essays &amp; Field Notes
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#2a1a12] mt-3 tracking-tight">
              The Rehearse notebook
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#3a2318]/70 max-w-xs sm:text-right font-normal">
            Practical strategies written by former hiring managers and interview calibration leads.
          </p>
        </div>

        {/* 3 Articles Grid with Extracted Editorial Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <article
              key={idx}
              onClick={() => setSelectedArticle(art)}
              className="group cursor-pointer flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#f7eed9] border border-[#3a2318]/15 hover:border-[#b4532a]/40 hover:bg-[#eee1c4] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                {/* Visual Editorial Image Container */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-[#3a2318]/10 border border-[#3a2318]/15 shadow-inner">
                  <img
                    src={art.img}
                    alt={art.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#3a2318]/85 backdrop-blur-xs text-[#f3e7c9] text-[11px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {art.tag}
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#b4532a] font-semibold">
                    {art.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#2a1a12] mt-1.5 mb-2 group-hover:text-[#b4532a] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3a2318]/75 leading-relaxed line-clamp-2 font-normal">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#3a2318]/15 flex items-center justify-between text-xs text-[#3a2318]/65 px-1 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
                <span className="text-[#b4532a] font-medium font-sans flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#f3e7c9] text-[#2a1a12] max-w-2xl w-full rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#3a2318]/20 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#3a2318]/10 text-[#3a2318] transition-colors"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-[16/8] rounded-2xl overflow-hidden mb-6 border border-[#3a2318]/15 shadow-sm">
              <img
                src={selectedArticle.img}
                alt={selectedArticle.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <span className="text-xs font-mono uppercase tracking-wider text-[#b4532a] font-semibold">
              {selectedArticle.tag} • {selectedArticle.readTime}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#2a1a12] mt-2 mb-6 leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="space-y-4 text-base text-[#3a2318] leading-relaxed">
              {selectedArticle.fullText.map((paragraph, pi) => (
                <p key={pi}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#3a2318]/15 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-[#3a2318] text-[#f3e7c9] text-sm font-medium hover:bg-[#26150e] transition-colors"
              >
                Close guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
