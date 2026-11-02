import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/images/rehearse');

// Map specific panel IDs to meaningful semantic files
const assignments = [
  // 1. How It Works Section
  { from: 'panel_1_r1_c1.webp', to: 'practice/candidate-preparation.webp', category: 'practice', desc: 'Candidate preparing at workstation with notes and headset' },
  { from: 'panel_1_r1_c2.webp', to: 'interview/vintage-microphone-waves.webp', category: 'interview', desc: 'Vintage radio microphone with broadcast acoustic soundwaves' },
  { from: 'panel_1_r1_c3.webp', to: 'ai-interviewer/robot-interviewer-notes.webp', category: 'ai-interviewer', desc: 'Retro robot interviewer taking structured notes during session' },
  { from: 'panel_1_r2_c1.webp', to: 'interview/candidate-speaking-session.webp', category: 'interview', desc: 'Candidate speaking thoughtfully with gestures in interview room' },
  { from: 'panel_1_r2_c2.webp', to: 'ai-interviewer/adaptive-listening-robot.webp', category: 'ai-interviewer', desc: 'AI interviewer listening intently with audio frequency indicators' },
  { from: 'panel_1_r2_c3.webp', to: 'feedback/scored-evaluation-rubric.webp', category: 'feedback', desc: 'Detailed rubric scoring card with checklist and grades' },
  
  // 2. Practice / Mock Round Section
  { from: 'panel_1_r3_c1.webp', to: 'practice/interview-in-progress.webp', category: 'practice', desc: 'Full mid-century mock interview round in warm wood-panelled office' },
  { from: 'panel_1_r3_c2.webp', to: 'ai-interviewer/robot-evaluator-portrait.webp', category: 'ai-interviewer', desc: 'Portrait of patient retro robot interviewer in tailored suit' },
  { from: 'panel_1_r3_c3.webp', to: 'feedback/session-debrief-scorecard.webp', category: 'feedback', desc: 'Written debrief report with metrics and sentence critique' },

  // 3. Interview Roles Section
  { from: 'panel_2_r1_c1.webp', to: 'interview/roles-software-engineering.webp', category: 'interview', desc: 'Software engineering & systems architecture illustration' },
  { from: 'panel_2_r1_c2.webp', to: 'analytics/roles-data-analytics.webp', category: 'analytics', desc: 'Data analytics, metrics dashboard & quantitative case reasoning' },
  { from: 'panel_2_r1_c3.webp', to: 'interview/roles-executive-leadership.webp', category: 'interview', desc: 'Managerial & HR round negotiation with executive presence' },
  { from: 'panel_2_r2_c1.webp', to: 'learning/roles-internships-freshers.webp', category: 'learning', desc: 'Fresh graduate & internship career kickstart preparation' },

  // 4. Pillars / Evaluation Section
  { from: 'panel_3_r1_c1.webp', to: 'practice/technical-depth-challenge.webp', category: 'practice', desc: 'Technical problem deep-dive with algorithmic schematic' },
  { from: 'panel_3_r1_c2.webp', to: 'practice/behavioural-storytelling.webp', category: 'practice', desc: 'Candidate articulating structured STAR behavioural narrative' },
  { from: 'panel_3_r1_c3.webp', to: 'feedback/precision-feedback-debrief.webp', category: 'feedback', desc: 'Line-by-line sentence feedback and score improvement advice' },

  // 5. Feedback & Expectation Section
  { from: 'panel_4_r1_c1.webp', to: 'feedback/metric-verification.webp', category: 'feedback', desc: 'Diagnostic radar chart tracking latency and metric validation' },
  { from: 'panel_4_r2_c1.webp', to: 'ai-interviewer/pushback-probing-robot.webp', category: 'ai-interviewer', desc: 'Interviewer probing vague answers with follow-up questions' },
  { from: 'panel_5_r1_c1.webp', to: 'analytics/performance-benchmarks.webp', category: 'analytics', desc: 'Candidate progress trajectory across multiple rounds' },

  // 6. Learning / The Rehearse Notebook Guides
  { from: 'panel_6_r1_c1.webp', to: 'learning/guide-storytelling-project.webp', category: 'learning', desc: 'Turning a project into a two-minute story: notebook illustration' },
  { from: 'panel_6_r1_c2.webp', to: 'learning/guide-first-five-minutes.webp', category: 'learning', desc: 'The first five minutes of technical rounds: tactical playbook' },
  { from: 'panel_6_r1_c3.webp', to: 'learning/guide-confidence-repetition.webp', category: 'learning', desc: 'Why confidence is mostly repetition: study lamp and books' },

  // 7. Career Growth / Final CTA
  { from: 'panel_7_r1_c1.webp', to: 'success/mountain-career-summit.webp', category: 'success', desc: 'Climbing to the mountain peak: career goal achievement' },
  { from: 'panel_7_r2_c1.webp', to: 'success/rocket-interview-launch.webp', category: 'success', desc: 'Retro mid-century rocket launch celebrating interview readiness' },
  { from: 'panel_7_r3_c1.webp', to: 'success/job-offer-handshake.webp', category: 'success', desc: 'Successful job offer handshake and celebration' },
  { from: 'panel_5_r3_c3.webp', to: 'success/golden-achievement-trophy.webp', category: 'success', desc: 'Golden achievement trophy with laurel wreath' }
];

const decDir = path.join(baseDir, 'decorative');

for (const a of assignments) {
  const src = path.join(decDir, a.from);
  const dest = path.join(baseDir, a.to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${a.from} -> ${a.to}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
}

// Write the asset mapping documentation
let md = `# Rehearse Visual Asset Library & Section Mapping\n\n`;
md += `This document maps the extracted vintage editorial illustrations to the corresponding sections on the Rehearse landing page.\n\n`;
md += `| File Path | Category | Assigned Section | Purpose & Description |\n`;
md += `| :--- | :--- | :--- | :--- |\n`;

for (const a of assignments) {
  md += `| \`/images/rehearse/${a.to}\` | \`${a.category}\` | ${getSectionName(a.to)} | ${a.desc} |\n`;
}

function getSectionName(to) {
  if (to.includes('guide-')) return 'The Rehearse Notebook (Articles)';
  if (to.includes('roles-')) return 'Supported Roles Section';
  if (to.includes('technical-') || to.includes('behavioural-') || to.includes('precision-')) return 'Interview Pillars (How interviews go)';
  if (to.includes('microphone') || to.includes('candidate-preparation') || to.includes('adaptive-listening')) return 'Core Engine (How It Works)';
  if (to.includes('interview-in-progress') || to.includes('robot-evaluator')) return 'Your First Mock Round (Sage)';
  if (to.includes('pushback') || to.includes('metric-verification')) return 'What You Can Expect (Pushback Section)';
  if (to.includes('mountain') || to.includes('rocket') || to.includes('handshake') || to.includes('trophy')) return 'Career Growth & Early Access CTA';
  return 'General Editorial UI';
}

fs.writeFileSync(path.resolve('IMAGE_ASSET_MAPPING.md'), md);
console.log('Wrote IMAGE_ASSET_MAPPING.md successfully!');

