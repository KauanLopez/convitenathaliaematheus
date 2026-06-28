const fs = require('fs');
let content = fs.readFileSync('src/types/database.types.ts', 'utf8');
content = content.replace(/Update: \{[^}]+\}\n\s+\}/g, match => match.slice(0, -1) + '  Relationships: any[]\n      }');
fs.writeFileSync('src/types/database.types.ts', content, 'utf8');
