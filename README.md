# PULSO EDITORIAL - CMS Editorial en PHP 8+ y MySQL

Portal de noticias y blog magazine moderno, 100% administrable, inspirado en la distribución editorial y experiencia de lectura de medios digitales de vanguardia (MyFitnessPal Blog). Desarrollado en PHP 8 nativo, MySQL con PDO, HTML5 semántico, CSS3 moderno y Vanilla JavaScript.

---

## 🚀 Requisitos del Servidor / Hosting cPanel

* **PHP 8.0 o superior** (PHP 8.1 / 8.2 / 8.3 recomendado).
* **MySQL 5.7+ / 8.0+** o **MariaDB 10.3+**.
* **Apache con módulo `mod_rewrite` activo** (estándar en cualquier cPanel).
* Extensiones PHP estándar: `pdo_mysql`, `mbstring`, `json`, `gd` (para procesamiento de imágenes), `session`.

---

## 📦 Guía de Instalación Rápida en cPanel (Paso a Paso)

### 1. Subir los archivos por FTP o Administrador de Archivos
* Accede a tu cPanel -> **Administrador de Archivos** (o usa FileZilla).
* Ve al directorio raíz de tu dominio (generalmente `public_html/` o la carpeta de tu subdominio).
* Sube y descomprime el archivo ZIP con todos los archivos del proyecto. Asegúrate de que el archivo `.htaccess` esté visible y presente.

### 2. Crear la Base de Datos MySQL
* En cPanel, ingresa a **Bases de datos MySQL®** o **Asistente de bases de datos MySQL®**.
* Crea una base de datos nueva (ej: `usuario_editorial`).
* Crea un usuario MySQL y genera una contraseña segura.
* Asigna el usuario a la base de datos con **TODOS LOS PRIVILEGIOS**.

### 3. Importar las Tablas y Datos Iniciales (`database.sql`)
* En cPanel, ingresa a **phpMyAdmin**.
* Selecciona la base de datos recién creada en la barra lateral izquierda.
* Haz clic en la pestaña superior **Importar**.
* Selecciona el archivo `database.sql` del proyecto y haz clic en **Importar / Continuar**.

### 4. Configurar las Credenciales (`config.php`)
* En el Administrador de Archivos, renombra el archivo `config.example.php` a `config.php` (o edita `config.php`).
* Ajusta los siguientes datos:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'usuario_editorial');     // Nombre de tu BD
define('DB_USER', 'usuario_dbuser');        // Tu usuario MySQL
define('DB_PASS', 'tu_password_segura');    // Tu contraseña MySQL
define('SITE_URL', 'https://tudominio.com'); // La URL de tu sitio web sin barra final
```

### 5. Permisos de Escritura para Subida de Imágenes
* Asegúrate de que la carpeta `uploads/` tenga permisos de escritura `755` o `775` para permitir la carga de imágenes destacadas desde el panel administrativo.

### 6. Acceder al Panel de Administración
* Visita: `https://tudominio.com/admin/`
* **Credenciales por defecto:**
  * **Usuario:** `admin`
  * **Contraseña:** `admin123`
* *(Importante: Cambia tu contraseña inmediatamente desde la sección de Configuración o Usuarios).*

---

## 🌟 Estructura de URLs Limpias y SEO

* **Portada / Home:** `https://tudominio.com/`
* **Página de Categoría:** `https://tudominio.com/actualidad/`
* **Paginación de Categoría:** `https://tudominio.com/actualidad/page/2/`
* **Página de Artículo / Noticia:** `https://tudominio.com/infraestructura/transformacion-energetica-redes-solares-hidrogeno-verde/`
* **Perfil de Autor:** `https://tudominio.com/autor/elena-rostova/`
* **Búsqueda:** `https://tudominio.com/buscar/?q=energia`
* **Sitemap General XML:** `https://tudominio.com/sitemap.xml`
* **Google News Sitemap:** `https://tudominio.com/news-sitemap.xml`
* **Feed RSS 2.0:** `https://tudominio.com/feed/`
* **Robots.txt:** `https://tudominio.com/robots.txt`

---

## 🛡️ Seguridad Implementada

* Conexión a Base de Datos con **PDO y Prepared Statements** (Protección 100% contra SQL Injection).
* Escape de salidas HTML con `htmlspecialchars()` con codificación UTF-8 (Protección XSS).
* Contraseñas encriptadas con el algoritmo seguro nativo `password_hash()` (Bcrypt).
* Tokens anti-CSRF en todos los formularios administrativos.
* Validación estricta de extensiones y tipos MIME en el módulo de carga de medios.
* Protección de archivos de configuración y scripts internos desde `.htaccess`.

---

## 🛠️ Estructura del Código

```text
/
├── .htaccess                 # Reglas mod_rewrite para URLs amigables y caché
├── config.php                # Configuración de base de datos y constantes
├── config.example.php        # Plantilla de configuración
├── database.sql              # Estructura SQL y datos iniciales
├── index.php                 # Front Controller / Enrutador principal
├── sitemap.php               # Generador dinámico de Sitemaps XML
├── news-sitemap.php          # Generador de Google News Sitemap XML
├── feed.php                  # Generador de RSS Feed 2.0 XML
├── robots.txt                # Directivas para rastreadores de búsqueda
├── includes/
│   ├── db.php                # Conexión Singleton PDO segura
│   ├── functions.php         # Funciones helper, SEO, routing, validaciones
│   ├── header.php            # Cabecera pública, menú dinámico, Schema.org
│   └── footer.php            # Pie de página y enlaces
├── templates/
│   ├── home.php              # Plantilla Portada Magazine (Hero, Slider, Bloques)
│   ├── category.php          # Plantilla Categoría con paginación
│   ├── single.php            # Plantilla Artículo con autor, share, breadcrumbs
│   ├── author.php            # Plantilla de Autor
│   └── search.php            # Plantilla de Búsqueda
├── admin/
│   ├── index.php             # Dashboard con estadísticas
│   ├── login.php             # Acceso seguro con CSRF y password_verify
│   ├── logout.php            # Cierre de sesión seguro
│   ├── posts.php             # Gestión y listado de noticias
│   ├── post-edit.php         # Creación y edición de noticias con SEO
│   ├── categories.php        # Administración de categorías
│   ├── authors.php           # Administración de autores
│   ├── media.php             # Biblioteca de medios y subidas
│   ├── settings.php          # Configuración general del portal
│   ├── seo.php               # Diagnóstico SEO y enlaces de sitemaps
│   └── includes/             # Cabecera y barra lateral del CMS
├── assets/
│   ├── css/style.css         # Estilos CSS modernos, limpios y responsivos
│   └── js/main.js            # JavaScript Vanilla (menú móvil, buscador, share)
└── uploads/                  # Directorio para imágenes subidas
```
