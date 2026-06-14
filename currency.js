const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove hardcoded R$ mapping it dynamically
    content = content.replace(/R\$\s?/g, '${localStorage.getItem("userCurrency") || "$"} ');

    // Replace pt-BR locale with dynamic logic defaulting to es-MX
    content = content.replace(/'pt-BR'/g, `localStorage.getItem('userLocale') || 'es-MX'`);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
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

traverse('./frontend/src');
console.log("Currency migration ready.");
