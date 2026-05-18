/**
 * Locked /api/v1 paths — frontend must not invent alternate prefixes.
 * @see apps/web/governance/API-CONTRACT-LOCK.md
 */

export const PUBLIC_PATHS = {
  homepage: '/homepage',
  categories: '/categories',
  category: (id) => `/categories/${encodeURIComponent(id)}`,
  products: '/products',
  product: (id) => `/products/${encodeURIComponent(id)}`,
};

export const AUTH_PATHS = {
  login: '/auth/login',
  me: '/auth/me',
  logout: '/auth/logout',
};

export const ADMIN_PATHS = {
  mediaHealth: '/media/health',
  products: '/products',
  product: (id) => `/products/${encodeURIComponent(id)}`,
  productImage: (id) => `/products/${encodeURIComponent(id)}/image`,
  categories: '/categories',
  category: (id) => `/categories/${encodeURIComponent(id)}`,
  categoryImage: (id) => `/categories/${encodeURIComponent(id)}/image`,
  heroSlides: '/hero-slides',
  heroSlide: (id) => `/hero-slides/${encodeURIComponent(id)}`,
  heroSlideImage: (id) => `/hero-slides/${encodeURIComponent(id)}/image`,
  homepageBanners: '/homepage-banners',
  homepageBanner: (id) => `/homepage-banners/${encodeURIComponent(id)}`,
  homepageBannerImage: (id) => `/homepage-banners/${encodeURIComponent(id)}/image`,
};

/** Sanctum — site origin, not under /api/v1 */
export const SANCTUM_CSRF = '/sanctum/csrf-cookie';
