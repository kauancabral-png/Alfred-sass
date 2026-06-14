const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove the literal syntax error chunks introduced
    content = content.replace(/\$\{localStorage\.getItem\("userCurrency"\) \|\| "\$"\}/g, '$');
    content = content.replace(/\$\{localStorage\.getItem\(\'userCurrency\'\) \|\| \'\$\'\}/g, '$');
    
    // Some lines had `R$ {` converted inside JSX string like "R$ {"
    content = content.replace(/\$\{localStorage\.getItem\("userCurrency"\) \|\| "\$"\}\s/g, '$ ');

    content = content.replace(/localStorage\.getItem\('userLocale'\) \|\| 'es-MX'/g, "'es-MX'");
    content = content.replace(/localStorage\.getItem\("userLocale"\) \|\| "es-MX"/g, "'es-MX'");

    // Specifically for JSX templates where the JS was injected without { } 
    content = content.replace(/\{localStorage\.getItem\("userCurrency"\)\s\|\|\s"\$"\}/g, '$');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed: ' + filePath);
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
