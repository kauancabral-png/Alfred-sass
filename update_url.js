const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if(content.includes('fincontrol-saas-production.up.railway.app')) {
    content = content.replace(/fincontrol-saas-production\.up\.railway\.app/g, 'alfred-backend-8t7n.onrender.com');
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log(`Updated ${count} files.`);
