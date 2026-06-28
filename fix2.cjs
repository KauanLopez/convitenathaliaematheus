const fs = require('fs');

function applySupabaseAny(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Replace import { supabase } from '...' with import { supabase as _supabase } from '...'; const supabase = _supabase as any;
  content = content.replace(
    /import \{\s*supabase\s*\} from '([^']+supabase)'(;?)/,
    "import { supabase as _supabase } from '$1'$2\nconst supabase = _supabase as any;"
  );
  fs.writeFileSync(file, content, 'utf8');
}

applySupabaseAny('src/services/GuestService.ts');
applySupabaseAny('src/services/GiftService.ts');
applySupabaseAny('src/pages/admin/Guests.tsx');
applySupabaseAny('src/pages/admin/Dashboard.tsx');
