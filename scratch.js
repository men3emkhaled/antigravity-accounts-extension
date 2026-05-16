const fs = require('fs');
const path = './src/features/skills/skill.service.ts';
let code = fs.readFileSync(path, 'utf8');

const categoryMap = {
  'Localization': 'AI & Personality',
  'Word Documents': 'Document & Data',
  'PDF Processing': 'Document & Data',
  'PDF Reading Only': 'Document & Data',
  'PowerPoint': 'Document & Data',
  'Excel / Spreadsheets': 'Document & Data',
  'UI / Web': 'UI & Web',
  'Security': 'Security & Ops',
  'Architecture': 'Architecture & Backend',
  'DevOps': 'Security & Ops',
  'Performance': 'Performance & QA',
  'Refactoring': 'Performance & QA',
  'Prompt Engineering': 'AI & Personality',
  'Databases': 'Performance & QA',
  'System Design': 'Architecture & Backend',
  'Rust': 'Architecture & Backend',
  'Go': 'Architecture & Backend',
  'Mobile': 'UI & Web',
  'Data Science': 'Document & Data',
  'Testing': 'Performance & QA',
  'Vue': 'UI & Web'
};

for (const [oldCat, newCat] of Object.entries(categoryMap)) {
  const regex = new RegExp(`category: '${oldCat}'`, 'g');
  code = code.replace(regex, `category: '${newCat}'`);
}

fs.writeFileSync(path, code);
console.log('Categories updated successfully.');
