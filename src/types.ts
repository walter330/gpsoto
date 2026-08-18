export interface Author {
  id: number;
  name: string;
  slug: string;
  role_title: string;
  avatar: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  seo_title?: string;
  meta_description?: string;
  color: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  author_id: number;
  excerpt: string;
  content: string;
  image: string;
  image_alt?: string;
  youtube_url?: string;
  has_video?: boolean;
  is_hero: boolean;
  is_featured: boolean;
  status: 'published' | 'draft';
  views: number;
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  robots: string;
  published_at: string;
  updated_at?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    focus_keywords?: string;
    canonical_url?: string;
    schema_type?: string;
    og_image?: string;
  };
}

export interface MediaItem {
  id: number;
  filename: string;
  filepath: string;
  filetype: string;
  filesize: number;
  alt_text?: string;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_url: string;
  posts_per_page: number;
  contact_email: string;
  twitter_handle: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  footer_about: string;
  google_analytics_id: string;
  enable_rss: boolean;
  enable_sitemaps: boolean;
}

export type ViewRoute = 
  | { type: 'home' }
  | { type: 'category'; slug: string; page?: number }
  | { type: 'single'; categorySlug: string; postSlug: string }
  | { type: 'author'; slug: string }
  | { type: 'search'; query: string }
  | { type: 'admin'; subview: 'dashboard' | 'posts' | 'post-edit' | 'categories' | 'authors' | 'media' | 'settings' | 'seo' | 'cpanel-export'; editId?: number }
  | { type: 'sitemap-preview' }
  | { type: 'rss-preview' };
