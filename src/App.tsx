/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { SingleArticleView } from './components/SingleArticleView';
import { AuthorView } from './components/AuthorView';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { DashboardView } from './components/admin/DashboardView';
import { PostsListView } from './components/admin/PostsListView';
import { PostEditorView } from './components/admin/PostEditorView';
import { CategoriesAdminView } from './components/admin/CategoriesAdminView';
import { AuthorsAdminView } from './components/admin/AuthorsAdminView';
import { MediaAdminView } from './components/admin/MediaAdminView';
import { SeoAdminView } from './components/admin/SeoAdminView';
import { SettingsAdminView } from './components/admin/SettingsAdminView';
import { CpanelExportView } from './components/admin/CpanelExportView';

const MainRouter: React.FC = () => {
  const { route, isAdminLoggedIn } = useBlog();

  // Admin routing
  if (route.type === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <div className="min-h-screen bg-[#f7f7f7] flex flex-col justify-between">
          <Header />
          <main className="flex-1 flex items-center justify-center p-4">
            <AdminLoginModal />
          </main>
          <Footer />
        </div>
      );
    }

    let adminContent = <DashboardView />;
    switch (route.subview) {
      case 'dashboard':
        adminContent = <DashboardView />;
        break;
      case 'posts':
        adminContent = <PostsListView />;
        break;
      case 'post-edit':
        adminContent = <PostEditorView editId={route.editId} />;
        break;
      case 'categories':
        adminContent = <CategoriesAdminView />;
        break;
      case 'authors':
        adminContent = <AuthorsAdminView />;
        break;
      case 'media':
        adminContent = <MediaAdminView />;
        break;
      case 'seo':
        adminContent = <SeoAdminView />;
        break;
      case 'settings':
        adminContent = <SettingsAdminView />;
        break;
      case 'cpanel-export':
        adminContent = <CpanelExportView />;
        break;
    }

    return (
      <AdminLayout activeSub={route.subview}>
        {adminContent}
      </AdminLayout>
    );
  }

  // Public portal views
  let publicView = <HomeView />;
  switch (route.type) {
    case 'home':
      publicView = <HomeView />;
      break;
    case 'category':
      publicView = <CategoryView slug={route.slug} page={route.page} />;
      break;
    case 'single':
      publicView = <SingleArticleView categorySlug={route.categorySlug} postSlug={route.postSlug} />;
      break;
    case 'author':
      publicView = <AuthorView slug={route.slug} />;
      break;
    default:
      publicView = <HomeView />;
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col justify-between selection:bg-[#2d5a27] selection:text-white">
      <Header />
      <main className="flex-1">
        {publicView}
      </main>
      <Footer />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <BlogProvider>
      <MainRouter />
    </BlogProvider>
  );
}
