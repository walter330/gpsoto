import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Author, Category, MediaItem, Post, SiteSettings, ViewRoute } from '../types';
import { INITIAL_AUTHORS, INITIAL_CATEGORIES, INITIAL_POSTS, INITIAL_SETTINGS } from '../data/initialData';

interface BlogContextType {
  posts: Post[];
  categories: Category[];
  authors: Author[];
  media: MediaItem[];
  settings: SiteSettings;
  route: ViewRoute;
  setRoute: (r: ViewRoute) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  
  // Post Actions
  savePost: (post: Omit<Post, 'id' | 'views'> & { id?: number }) => number;
  deletePost: (id: number) => void;
  toggleHero: (id: number) => void;
  toggleFeatured: (id: number) => void;
  incrementViews: (id: number) => void;

  // Category Actions
  saveCategory: (category: Omit<Category, 'id'> & { id?: number }) => void;
  deleteCategory: (id: number) => void;

  // Author Actions
  saveAuthor: (author: Omit<Author, 'id'> & { id?: number }) => void;
  deleteAuthor: (id: number) => void;

  // Media Actions
  addMedia: (item: Omit<MediaItem, 'id' | 'created_at'>) => void;
  deleteMedia: (id: number) => void;

  // Settings
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('gpsoto_posts_v2');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('gpsoto_categories_v2');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [authors, setAuthors] = useState<Author[]>(() => {
    const saved = localStorage.getItem('gpsoto_authors_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUTHORS;
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('gpsoto_media_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('gpsoto_settings_v2');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [route, setRoute] = useState<ViewRoute>({ type: 'home' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('gpsoto_admin_auth') === 'true';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gpsoto_posts_v2', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('gpsoto_categories_v2', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gpsoto_authors_v2', JSON.stringify(authors));
  }, [authors]);

  useEffect(() => {
    localStorage.setItem('gpsoto_media_v2', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('gpsoto_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  const loginAdmin = (user: string, pass: string) => {
    if ((user === 'admin' && pass === 'admin123') || (user === 'editor' && pass === 'editor123')) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('gpsoto_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('pulso_admin_auth');
    setRoute({ type: 'home' });
  };

  const savePost = (postData: Omit<Post, 'id' | 'views'> & { id?: number }) => {
    if (postData.is_hero) {
      // Demote existing hero
      setPosts(prev => prev.map(p => ({ ...p, is_hero: false })));
    }

    if (postData.id && postData.id > 0) {
      setPosts(prev =>
        prev.map(p => (p.id === postData.id ? { ...p, ...postData, updated_at: new Date().toISOString() } : p))
      );
      return postData.id;
    } else {
      const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
      const newPost: Post = {
        ...postData,
        id: newId,
        views: 1,
        published_at: postData.published_at || new Date().toISOString()
      };
      setPosts(prev => [newPost, ...prev]);
      return newId;
    }
  };

  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const toggleHero = (id: number) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, is_hero: !p.is_hero } : { ...p, is_hero: false }))
    );
  };

  const toggleFeatured = (id: number) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, is_featured: !p.is_featured } : p))
    );
  };

  const incrementViews = (id: number) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, views: p.views + 1 } : p))
    );
  };

  const saveCategory = (catData: Omit<Category, 'id'> & { id?: number }) => {
    if (catData.id && catData.id > 0) {
      setCategories(prev => prev.map(c => (c.id === catData.id ? { ...c, ...catData } : c)));
    } else {
      const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      setCategories(prev => [...prev, { ...catData, id: newId }]);
    }
  };

  const deleteCategory = (id: number) => {
    if (categories.length <= 1) {
      alert('Debe existir al menos una categoría en el portal.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const saveAuthor = (authData: Omit<Author, 'id'> & { id?: number }) => {
    if (authData.id && authData.id > 0) {
      setAuthors(prev => prev.map(a => (a.id === authData.id ? { ...a, ...authData } : a)));
    } else {
      const newId = authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1;
      setAuthors(prev => [...prev, { ...authData, id: newId }]);
    }
  };

  const deleteAuthor = (id: number) => {
    if (authors.length <= 1) {
      alert('Debe existir al menos un autor en el sistema.');
      return;
    }
    setAuthors(prev => prev.filter(a => a.id !== id));
  };

  const addMedia = (item: Omit<MediaItem, 'id' | 'created_at'>) => {
    const newId = media.length > 0 ? Math.max(...media.map(m => m.id)) + 1 : 1;
    setMedia(prev => [{ ...item, id: newId, created_at: new Date().toISOString() }, ...prev]);
  };

  const deleteMedia = (id: number) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    if (confirm('¿Restaurar los datos de ejemplo iniciales?')) {
      setPosts(INITIAL_POSTS);
      setCategories(INITIAL_CATEGORIES);
      setAuthors(INITIAL_AUTHORS);
      setSettings(INITIAL_SETTINGS);
      localStorage.clear();
      alert('Datos restablecidos a la configuración inicial.');
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        authors,
        media,
        settings,
        route,
        setRoute,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        savePost,
        deletePost,
        toggleHero,
        toggleFeatured,
        incrementViews,
        saveCategory,
        deleteCategory,
        saveAuthor,
        deleteAuthor,
        addMedia,
        deleteMedia,
        updateSettings,
        resetToDefaults,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
