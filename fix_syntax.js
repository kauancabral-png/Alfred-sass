const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix missing quotes for es-MX
    content = content.replace(/toLocaleString\(es-MX/g, "toLocaleString('es-MX'");
    
    // Fix missing quotes for localStorage.getItem('userLocale') || 'es-MX'
    // Actually, it seems some files have this literally as unquoted if it came from my previous turn's errors.
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed syntax in: ' + filePath);
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
console.log("Syntax fix ready.");
