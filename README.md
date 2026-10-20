# ThemeBrainDump

> **"Emptying the mind, one post at a time."**  
> A modern, high-performance, responsive publication and blogging theme engineered for **LifetechOCMS** and built specifically for the **[MdBlog](https://github.com/adedayoAdetunji/MdBlog.git)** module (v2.0.0).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![LifetechOCMS](https://img.shields.io/badge/LifetechOCMS-%3E%3D2.7.4-emerald.svg)
![Requires MdBlog](https://img.shields.io/badge/Requires-MdBlog%20v2.0.0-purple.svg)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

---

## 📖 Overview

**ThemeBrainDump** is an editorial-grade, accessible, and highly customizable theme designed for technical writers, software engineering publications, multi-author journals, and digital thinkers. 

Built to pair natively with **MdBlog v2.0.0**, ThemeBrainDump consumes MdBlog's 42 RESTful endpoints to deliver a full-featured blog experience — spanning dynamic multi-level navigation menus, rich article formatting, interactive threaded discussions, author profiles, full authentication flows, and a complete administrative management suite.

---

## ✨ Key Features

### 🌟 1. Public Reader Experience
- **Editorial Hero & Feed**: Highlight top featured stories with dynamic category filter pills, instant keyword search, and flexible Grid vs. List viewing modes.
- **Rich Article Reader (`/post`)**: Optimized typography (Inter, Merriweather, JetBrains Mono), estimated reading time, author attribution, cover image heuristics, social sharing, and related article recommendations.
- **Quill Content Rendering**: Native formatting support for code snippets, blockquotes, typography scales, ordered/unordered lists, and embedded media.
- **Threaded Discussions**: Nested parent-child comment threads, comment liking, real-time comment authoring, and direct community abuse reporting dialogs.
- **Reader Engagement**: In-article reaction tracking (likes, claps, bookmarks) with client-side persistence and API synchronization.

### 👤 2. User & Author Profiles
- **Author Identity Header**: Clean profile banner, avatar upload/change triggers, bio, role indicators, and external social media links (X, LinkedIn, Facebook).
- **Tabbed Profile Sections**: Quickly toggle between published articles, saved reading lists (bookmarks), and account preferences.

### 🔐 3. Authentication & Account Management
- **Unified Auth Interface (`/Auth`)**: Smooth tab-switching between **Sign In**, **Sign Up**, and **Password Recovery** modes.
- **Form Validation & Feedback**: Integrated with `SweetAlert2` for alerts, validation feedback, and automated token handling (`ApiTokenDetails`).

### 🛠️ 4. Comprehensive Admin Workspace
ThemeBrainDump includes dedicated administrative views wrapped in `AdminLayout.html` with responsive headers and sidebar navigation:
- **Admin Dashboard (`/AdminDashboard`)**: High-level metric cards for total views, published articles, pending comments, taxonomies, and visitor traffic summaries.
- **Article Manager (`/ManagePost`)**: Full post lifecycle controls (Draft, Scheduled, Published), search, category/status filters, and built-in Quill modal editor.
- **Category Manager (`/ManageCategory`)**: CRUD operations for hierarchical post categories, slug formatting, and navigation menu flags.
- **Tag Manager (`/ManageTags`)**: Create, inspect, edit, and organize tags with live post counts.
- **Comment Moderation (`/ManageComments`)**: Moderation queue to review, approve, mark as spam, or delete reader comments.
- **Report Moderation (`/ManageReports`)**: Dedicated interface to review user-flagged articles and comments.

### 🎨 5. Dynamic Theme Engine
- **Light / Dark Mode**: One-click theme toggling with smooth transitions and automatic local preference persistence.
- **Accent Color Switching**: Configurable palette options (Indigo, Emerald, Violet, Rose, Amber) powered by CSS custom properties.
- **Typography Switching**: Effortless switching between Sans, Serif, and Monospace font stacks.
- **Responsive Navigation**: Glassmorphic sticky header, multi-level dropdown category tree fetched live from `/blogs/menu/categories`, and mobile sliding drawer.

---

## 📋 System Requirements & Dependencies

ThemeBrainDump requires the following Lifetech ecosystem packages:

| Component | Minimum Version | Required By | Description |
| :--- | :--- | :--- | :--- |
| **LifetechOCMS** | `2.7.4` | System | Underlying CMS platform runtime |
| **MdBlog** | `2.0.0` | ThemeBrainDump | Core blogging backend module providing database models & 42 REST endpoints |
| **MdLt** | `1.3.0` | MdBlog | Lifetech core module dependency |
| **PHP** | `7.4+` / `8.x` | Server | Lifetech backend execution |
| **Tailwind CSS** | CDN / Included | Frontend | Modern utility-first styling |

---

## 📦 Package Specification (`package.json`)

```json
{
  "ltId": "178879985315477",
  "packageName": "ThemeBrainDump",
  "packageType": "theme",
  "version": "1.0.0",
  "dependsOn": [
    {
      "packageName": "MdBlog",
      "version": "2.0.0"
    }
  ],
  "isPublished": 0,
  "readme": "ThemeBrainDump - Modern Blog Theme for MdBlog",
  "languageUsed": "html, tailwind/css, javascript",
  "description": "Emptying the mind, one post at a time",
  "ltVersion": "2.7.4"
}
```

---

## 📁 Directory Structure

```
ThemeBrainDump/
├── README.md                      # Theme documentation & usage guide
├── package.json                   # Theme manifest and dependencies
├── LICENSE                        # MIT License
├── index.php                      # Root theme redirector
├── Assets/                        # Static assets (CSS, JS, Admin helpers)
│   ├── Admin/
│   │   └── Script.js              # Admin workspace scripts & data binding
│   ├── css/
│   │   └── Style.css              # Custom styles, accent tokens, and scrollbars
│   └── js/
│       ├── Nav.js                 # Header navigation, mobile menu & theme toggle
│       └── Store.js               # State management, data layer & MdBlog API integration
├── Components/                    # Modular theme UI components
│   ├── Admin/
│   │   ├── AdminHeader.html       # Topbar for administrative pages
│   │   └── AdminSidebar.html      # Sidebar navigation for admin workspace
│   ├── ContentLoadBody.html       # Dynamic content container component
│   ├── Footer.html                # Site footer with newsletter & social links
│   ├── Main-header.html           # Sticky glassmorphism header & dynamic category nav
│   └── Top-header.html            # Top announcement & utility banner
├── Layouts/                       # Page layout wrappers
│   └── Auth/
│       ├── AdminLayout.html       # Layout wrapper for admin dashboard & management views
│       └── AuthLayout.html        # Clean layout wrapper for authentication screens
├── Views/                         # Template views rendered by LifetechOCMS
│   ├── About.html                 # Editorial manifesto and publication mission
│   ├── Contact-us.html            # Contact inquiry form
│   ├── Post-details.html          # Full article view, reactions & comment threads
│   ├── Posts.html                 # Main blog feed, featured post & category pills
│   ├── UserProfile.html           # User & author public profile page
│   ├── Admin/                     # Administrative management templates
│   │   ├── AdminDashboard.html    # Analytics overview & quick stats
│   │   ├── ManageCategory.html    # Category CRUD table
│   │   ├── ManageComments.html    # Comment moderation queue
│   │   ├── ManagePost.html        # Post CRUD table & editor modal
│   │   ├── ManageReports.html     # User report moderation queue
│   │   └── ManageTags.html        # Tag CRUD table
│   └── Auth/
│       └── Auth.html              # Sign In, Sign Up, and Password Reset view
├── Export/                        # Lifetech schema exports & menu definitions
│   ├── content.json               # Exported content schemas
│   ├── menu.json                  # Navigation menu preset definitions
│   ├── page.json                  # Registered page route specifications
│   ├── pageContent.json           # Template content linkages
│   └── table.json                 # Table schema definitions
└── ddm/                           # Lifetech Data Definition Models (.lifetech)
```

---

## 🗺️ Registered Pages & Route Mappings

All pages in ThemeBrainDump are pre-configured in `Export/page.json` and automatically registered in LifetechOCMS upon import:

| Page Template | Route Path | Layout | Description |
| :--- | :--- | :--- | :--- |
| `Posts.html` | `/ThemeBrainDump/Posts` | *Default* | Main blog index, hero article, search, and category pills |
| `Post-details.html` | `/ThemeBrainDump/post` | *Default* | Single article reader, reaction controls, and comments |
| `About.html` | `/ThemeBrainDump/About` | `Default` | Publication history, editorial values, and contributor stats |
| `Contact-us.html` | `/ThemeBrainDump/Contact-us` | *Default* | Interactive contact and inquiry submission form |
| `UserProfile.html` | `/ThemeBrainDump/UserProfile` | *Default* | Author portfolio, bio, bookmarked posts, and social links |
| `Auth.html` | `/ThemeBrainDump/Auth` | `AuthLayout.html` | Tabbed Sign In, Sign Up, and Password Recovery page |
| `AdminDashboard.html` | `/ThemeBrainDump/AdminDashboard` | `AdminLayout.html` | High-level metrics, view counters, and management shortcuts |
| `ManagePost.html` | `/ThemeBrainDump/ManagePost` | `AdminLayout.html` | Article creation, drafting, scheduling, editing, and deletion |
| `ManageCategory.html` | `/ThemeBrainDump/ManageCategory` | `AdminLayout.html` | Taxonomy management for blog categories |
| `ManageTags.html` | `/ThemeBrainDump/ManageTags` | `AdminLayout.html` | Taxonomy management for blog tags |
| `ManageComments.html` | `/ThemeBrainDump/ManageComments` | `AdminLayout.html` | Comment moderation queue and spam management |
| `ManageReports.html` | `/ThemeBrainDump/ManageReports` | `AdminLayout.html` | Content flag & violation report moderation |

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
Ensure **MdBlog v2.0.0** is installed and activated in your LifetechOCMS instance:
```bash
# In your LifetechOCMS modules directory
git clone https://github.com/adedayoAdetunji/MdBlog.git
```
Activate **MdBlog** from the **Module Management** console to run database migrations for:
- `tb_blog_post`
- `tb_blog_category`
- `tb_blog_tag`
- `tb_blog_comment`
- `tb_blog_comment_like`
- `tb_blog_report`
- `tb_blog_setting`
- `tb_blog_user`

### 2. Install ThemeBrainDump
1. Clone or place the `ThemeBrainDump` directory into your LifetechOCMS `themes/` directory:
   ```bash
   cd path/to/lifetech-ocms/themes
   git clone https://github.com/adedayoAdetunji/ThemeBrainDump.git
   ```

2. Open the **LifetechOCMS Administration Console**.

3. Navigate to **Theme Management** → **Themes**.

4. Locate **ThemeBrainDump** in the theme library and click **Activate** / **Set as Active Theme**.

5. The system will automatically import all view routes from `Export/page.json` and publish theme assets.

---

## 🔌 MdBlog API Integration

ThemeBrainDump communicates asynchronously with the **MdBlog** service layer through `Assets/js/Store.js` and `Assets/js/Nav.js`. Key endpoint integrations include:

| Action / Feature | MdBlog Controller & Route | Method |
| :--- | :--- | :--- |
| **Fetch Navigation Menu** | `TbBlogCategoryController` (`/blogs/menu/categories`) | `GET` |
| **Fetch Blog Posts** | `TbBlogPostController` (`/blogs/posts`) | `GET` |
| **Get Single Post by Slug/ID** | `TbBlogPostController` (`/blogs/posts/{id}`) | `GET` |
| **Post Reactions (Clap / Like)** | `TbBlogPostController` (`/blogs/posts/{id}/reactions`) | `POST` |
| **Fetch Threaded Comments** | `TbBlogCommentController` (`/blogs/comments/post/{postId}`) | `GET` |
| **Submit New Comment / Reply** | `TbBlogCommentController` (`/blogs/comments`) | `POST` |
| **Submit Abuse Report** | `TbBlogReportController` (`/blogs/reports`) | `POST` |
| **User Sign In / Sign Up** | `TbBlogUserController` (`/blogs/auth/login`, `/blogs/auth/register`) | `POST` |
| **Admin Post CRUD** | `TbBlogPostController` (`/blogs/posts`, `/blogs/posts/{id}`) | `POST` / `PUT` / `DELETE` |
| **Admin Category CRUD** | `TbBlogCategoryController` (`/blogs/categories`) | `POST` / `PUT` / `DELETE` |
| **Admin Tag CRUD** | `TbBlogTagController` (`/blogs/tags`) | `POST` / `PUT` / `DELETE` |
| **Admin Comment Moderation** | `TbBlogCommentController` (`/blogs/comments/{id}/status`) | `PATCH` / `PUT` |

All responses conform to Lifetech's standard response envelope (`status`, `responseCode`, `responseMessage`, `responseData`).

---

## 🛠️ Customization & Styling

### Accent Colors
ThemeBrainDump uses dynamic CSS variables for theme accents in `Assets/css/Style.css`:
```css
:root {
  --color-primary: 79, 70, 229;       /* Indigo: #4F46E5 */
  --color-primary-hover: 67, 56, 202; /* #4338CA */
  --color-primary-light: 238, 242, 255;/* #EEF2FF */
}
```
Available presets can be switched directly via `window.BlogStore.setAccent('emerald' | 'violet' | 'rose' | 'amber' | 'indigo')`.

### Typography
Font families default to modern system and web fonts:
- **Sans**: `Inter`, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Serif**: `Merriweather`, Georgia, Cambria, serif
- **Mono**: `JetBrains Mono`, Menlo, Monaco, Consolas, monospace

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for full details.

---

## 👥 Authors & Maintainers

- **Adedayo Adetunji** ([@adedayoAdetunji](https://github.com/adedayoAdetunji))
- **LifetechOCMS Team**
