const fs = require('fs');

function replaceInFile(file, regex, replacer) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replacer);
  fs.writeFileSync(file, content, 'utf8');
}

replaceInFile('src/services/GuestService.ts', /\.from\('([^']+)'\)/g, ".from('$1' as any)");
replaceInFile('src/services/GiftService.ts', /\.from\('([^']+)'\)/g, ".from('$1' as any)");
replaceInFile('src/pages/admin/Guests.tsx', /\.from\('([^']+)'\)/g, ".from('$1' as any)");

replaceInFile('src/pages/Home.tsx', /,\s*ease:\s*(\[[^\]]+\]|'[^']+'|"[^"]+")/g, "");
replaceInFile('src/components/ui/Section.tsx', /,\s*ease:\s*(\[[^\]]+\]|'[^']+'|"[^"]+")/g, "");
replaceInFile('src/components/Envelope.tsx', /,\s*ease:\s*(\[[^\]]+\]|'[^']+'|"[^"]+")/g, "");
