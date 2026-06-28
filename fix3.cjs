const fs = require('fs');

function replaceInFile(file, regex, replacer) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replacer);
  fs.writeFileSync(file, content, 'utf8');
}

replaceInFile('src/components/sections/RSVPSection.tsx', /\.filter\(m =>/g, ".filter((m: any) =>");
replaceInFile('src/components/sections/RSVPSection.tsx', /\.map\(m =>/g, ".map((m: any) =>");
replaceInFile('src/pages/admin/Guests.tsx', /\.map\(g =>/g, ".map((g: any) =>");
