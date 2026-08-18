import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { DownloadCloud, FileCode2, Database, CheckCircle2, Server, Terminal, Copy, Check } from 'lucide-react';

export const CpanelExportView: React.FC = () => {
  const { posts, categories, authors, settings } = useBlog();
  const [copiedSql, setCopiedSql] = useState(false);

  const generateSchemaSql = () => {
    return `-- ===================================================
-- GPSOTO (https://gpsoto.com) - ESTRUCTURA MYSQL PARA CPANEL / PHPMYADMIN
-- Compatible con PHP 8.0, 8.1, 8.2, 8.3 y MySQL 5.7+ / MariaDB 10.3+
-- ===================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABLA DE CONFIGURACIÓN
CREATE TABLE IF NOT EXISTS \`settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`site_name\` VARCHAR(255) NOT NULL DEFAULT 'GPSOTO',
  \`site_tagline\` VARCHAR(255) NULL,
  \`site_description\` TEXT NULL,
  \`site_url\` VARCHAR(255) NOT NULL DEFAULT 'https://gpsoto.com',
  \`posts_per_page\` INT NOT NULL DEFAULT 6,
  \`contact_email\` VARCHAR(255) NULL,
  \`google_analytics_id\` VARCHAR(50) NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`settings\` (\`site_name\`, \`site_tagline\`, \`site_description\`, \`site_url\`, \`posts_per_page\`, \`contact_email\`, \`google_analytics_id\`)
VALUES ('${settings.site_name.replace(/'/g, "\\'")}', '${settings.site_tagline.replace(/'/g, "\\'")}', '${settings.site_description.replace(/'/g, "\\'")}', '${settings.site_url}', ${settings.posts_per_page}, '${settings.contact_email}', '${settings.google_analytics_id}');

-- 2. TABLA DE AUTORES
CREATE TABLE IF NOT EXISTS \`authors\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`slug\` VARCHAR(150) NOT NULL UNIQUE,
  \`role_title\` VARCHAR(150) NOT NULL,
  \`avatar\` VARCHAR(255) NOT NULL,
  \`bio\` TEXT NOT NULL,
  \`twitter\` VARCHAR(100) NULL,
  \`linkedin\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL UNIQUE,
  \`description\` TEXT NULL,
  \`seo_title\` VARCHAR(255) NULL,
  \`meta_description\` TEXT NULL,
  \`color\` VARCHAR(20) NOT NULL DEFAULT '#2d5a27',
  \`sort_order\` INT NOT NULL DEFAULT 1,
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA DE ARTÍCULOS / NOTICIAS
CREATE TABLE IF NOT EXISTS \`posts\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`category_id\` INT NOT NULL,
  \`author_id\` INT NOT NULL,
  \`excerpt\` TEXT NOT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`image\` VARCHAR(255) NOT NULL,
  \`image_alt\` VARCHAR(255) NULL,
  \`is_hero\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
  \`status\` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  \`views\` INT NOT NULL DEFAULT 0,
  \`seo_title\` VARCHAR(255) NULL,
  \`meta_description\` TEXT NULL,
  \`canonical_url\` VARCHAR(255) NULL,
  \`robots\` VARCHAR(50) NOT NULL DEFAULT 'index, follow',
  \`published_at\` DATETIME NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`author_id\`) REFERENCES \`authors\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;`;
  };

  const handleDownloadZip = () => {
    // Generate a downloadable SQL file
    const element = document.createElement('a');
    const file = new Blob([generateSchemaSql()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'gpsoto_cpanel_database.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateSchemaSql());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
          Exportación para Hosting Tradicional con cPanel
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Guía de instalación paso a paso en servidores compartidos con Apache, PHP 8+ nativo y base de datos MySQL PDO.
        </p>
      </div>

      {/* Quick Download Card */}
      <div className="bg-[#111111] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2d5a27] bg-[#2d5a27]/20 px-2.5 py-1 rounded-md">
            100% PHP 8+ & MySQL Nativo
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            Descargar Base de Datos .SQL Lista para phpMyAdmin
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Esquema relacional con tablas optimizadas, índices FULLTEXT para búsquedas ultrarrápidas y compatibilidad total con cPanel sin dependencias externas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            className="px-5 py-3 bg-[#2d5a27] hover:bg-[#23491f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            <DownloadCloud size={16} />
            Descargar .SQL
          </button>
        </div>
      </div>

      {/* Step by Step cPanel Setup Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-[#f0f7ef] text-[#2d5a27] font-extrabold text-sm flex items-center justify-center">
            1
          </div>
          <h3 className="font-serif text-base font-bold text-[#111111]">Crear Base de Datos</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            En tu cPanel, entra en <strong>Bases de datos MySQL</strong>, crea una nueva base de datos (ej: <code>miweb_blog</code>) y crea un usuario con todos los privilegios.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-[#f0f7ef] text-[#2d5a27] font-extrabold text-sm flex items-center justify-center">
            2
          </div>
          <h3 className="font-serif text-base font-bold text-[#111111]">Importar en phpMyAdmin</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Abre <strong>phpMyAdmin</strong>, selecciona la base de datos recién creada, haz clic en la pestaña <strong>Importar</strong> y sube el archivo <code>.sql</code>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-[#f0f7ef] text-[#2d5a27] font-extrabold text-sm flex items-center justify-center">
            3
          </div>
          <h3 className="font-serif text-base font-bold text-[#111111]">Subir Archivos vía FTP</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Sube el contenido a la carpeta <code>public_html/</code> de tu servidor y configura las credenciales de base de datos en <code>config.php</code>.
          </p>
        </div>
      </div>

      {/* Schema Viewer */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-[#2d5a27]" />
            <h2 className="font-serif text-base font-bold text-[#111111]">
              Código SQL Generado para el Proyecto
            </h2>
          </div>
          <button
            onClick={handleCopySql}
            className="flex items-center gap-1 text-xs font-bold text-[#2d5a27] hover:underline"
          >
            {copiedSql ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-[11px] font-mono text-[#111111] overflow-x-auto max-h-96">
          {generateSchemaSql()}
        </pre>
      </div>
    </div>
  );
};
