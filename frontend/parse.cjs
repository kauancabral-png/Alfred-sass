const fs = require('fs');
let h = fs.readFileSync('C:\\\\Users\\\\Kun\\\\.gemini\\\\antigravity\\\\brain\\\\8f561579-4f18-4b7a-8069-66af24f9f61b\\\\.system_generated\\\\steps\\\\2088\\\\content.md', 'utf8');
h = h.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
h = h.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
h = h.replace(/<[^>]+>/g, ' ');
h = h.replace(/\s+/g, ' ');
console.log(h);
