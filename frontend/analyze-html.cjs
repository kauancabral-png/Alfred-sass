const fs = require('fs');
const html = fs.readFileSync('C:\\\\Users\\\\Kun\\\\.gemini\\\\antigravity\\\\brain\\\\8f561579-4f18-4b7a-8069-66af24f9f61b\\\\.system_generated\\\\steps\\\\2088\\\\content.md', 'utf8');

const classMatches = html.match(/class="([^"]+)"/g) || [];
const allClasses = classMatches.map(c => c.replace('class="', '').replace('"', '')).join(' ').split(' ');

const classCounts = {};
allClasses.forEach(c => {
  if (c) classCounts[c] = (classCounts[c] || 0) + 1;
});

const sortedClasses = Object.entries(classCounts).sort((a, b) => b[1] - a[1]).slice(0, 50);
console.log("Top CSS classes used:");
console.log(sortedClasses);

const images = html.match(/<img[^>]+src="([^">]+)"/g) || [];
console.log("\nImages used:");
console.log(images.slice(0, 20));

// find sections
const sections = html.match(/<section[^>]*>([\s\S]*?)<\/section>/gi) || [];
console.log(`\nFound ${sections.length} sections.`);
