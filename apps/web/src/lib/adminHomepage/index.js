import { isLaravelAdminCatalog } from '@/lib/adminCatalog/config.js';
import { laravelAdminHomepage } from '@/lib/adminHomepage/laravelAdminHomepage.js';

export const adminHomepage = isLaravelAdminCatalog() ? laravelAdminHomepage : null;

export function isHomepageCmsAvailable() {
  return Boolean(adminHomepage);
}
