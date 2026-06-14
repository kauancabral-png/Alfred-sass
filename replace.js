const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  const list = fs.readdirSync(dir);
  list.forEach(f => {
     const pf = path.join(dir, f);
     if (fs.statSync(pf).isDirectory()) walk(pf, cb);
     else cb(pf);
  });
}

walk('frontend/src', f => {
   if (!f.endsWith('.tsx')) return;
   let content = fs.readFileSync(f, 'utf8');
   if (content.includes('alert(')) {
       content = `import toast from 'react-hot-toast';\n` + content;
       content = content.replace(/alert\(/g, 'toast(');
       fs.writeFileSync(f, content);
       console.log('Modified', f);
   }
});
