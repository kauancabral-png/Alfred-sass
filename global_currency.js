const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Inject state declarations if missing
    if (!content.includes('userCurrency')) {
        content = content.replace(/useState\(\s?\[\s?\]\s?\)/, 'useState<any[]>([])'); // Ensure generics
        content = content.replace(/export default function .+\(\) \{/, (match) => {
            return `${match}
  const [userCurrency, setUserCurrency] = React.useState('$');
  const [userLocale, setUserLocale] = React.useState('es-MX');

  React.useEffect(() => {
    setUserCurrency(localStorage.getItem('userCurrency') || '$');
    setUserLocale(localStorage.getItem('userLocale') || 'es-MX');
  }, []);`;
        });
        
        // Ensure React is imported
        if (!content.includes("import React")) {
            content = "import React, { useState, useEffect } from 'react';\n" + content;
        }
    }

    // 2. Wrap locale in variable
    content = content.replace(/toLocaleString\('es-MX'/g, "toLocaleString(userLocale");
    content = content.replace(/toLocaleString\("es-MX"/g, "toLocaleString(userLocale");
    content = content.replace(/toLocaleDateString\(\)/g, "toLocaleDateString(userLocale)");
    
    // 3. Fix hardcoded currency symbol
    content = content.replace(/\$ \{/g, "{userCurrency} {");
    content = content.replace(/\$ /g, "{userCurrency} ");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Processed: ' + filePath);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory() && file !== 'node_modules' && file !== 'dist') {
            traverse(full);
        } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
            processFile(full);
        }
    }
}

traverse('./frontend/src/pages');
