<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    
/**
 * Modern Responsive Blog Theme - State Store & Data Layer
 * Handles localStorage persistence, mock seed data, posts, comments, auth, and analytics.
 */

const STORAGE_KEYS = {
  USER: 'blog_theme_current_user',
  USERS_LIST: 'blog_theme_users_list',
  BOOKMARKS: 'blog_theme_bookmarks',
  SETTINGS: 'blog_theme_settings',
  ANALYTICS: 'blog_theme_analytics'
};

const DEFAULT_SETTINGS = {
  theme: 'light', // 'light' | 'dark' | 'system'
  accent: 'indigo', // 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber'
  font: 'sans',     // 'sans' | 'serif' | 'mono'
  density: 'normal' // 'compact' | 'normal' | 'spacious'
};

const ACCENT_COLORS = {
  indigo: { primary: '79, 70, 229', hover: '67, 56, 202', light: '238, 242, 255', hex: '#4F46E5' },
  emerald: { primary: '16, 185, 129', hover: '5, 150, 105', light: '236, 253, 245', hex: '#10B981' },
  violet: { primary: '139, 92, 246', hover: '124, 58, 237', light: '245, 243, 255', hex: '#8B5CF6' },
  rose: { primary: '244, 63, 94', hover: '225, 29, 72', light: '255, 241, 242', hex: '#F43F5E' },
  amber: { primary: '245, 158, 11', hover: '217, 119, 6', light: '254, 243, 199', hex: '#F59E0B' }
};

const getTokenName = "<?= ApiTokenDetails::tokenName(); ?>";

// Global Server & API Configuration
window.BLOG_CONFIG = window.BLOG_CONFIG || {
  BASE_URL: "<?= ApiTokenDetails::backEndBaseUrl(); ?>",
  siteHostAddress: "<?= ltSiteHostAddress() ?>",
  LW_TOKEN: localStorage.getItem(`${getTokenName}`)
};

// Default seed categories (derived from server response format)
const INITIAL_CATEGORIES = [];

// Dynamic category mapping dictionaries (auto-updated from server categories)
let CATEGORY_MAP = {};
let CATEGORY_NAME_TO_ID = {};

function updateCategoryDictionaries(categoriesList) {
  if (!Array.isArray(categoriesList)) return;
  CATEGORY_MAP = {};
  CATEGORY_NAME_TO_ID = {};
  categoriesList.forEach(cat => {
    const id = cat.ltId;
    const name = cat.categoryName;
    if (id !== undefined && name) {
      CATEGORY_MAP[id] = name;
      CATEGORY_NAME_TO_ID[name.toLowerCase()] = id;
    }
  });
}

// Pre-seed dictionaries with default categories
updateCategoryDictionaries(INITIAL_CATEGORIES);

function getCategoryName(category) {
  if (!category && category !== 0) return 'General';
  if (CATEGORY_MAP[category]) return CATEGORY_MAP[category];
  if (typeof category === 'string' && isNaN(Number(category))) return category;
 
  return `Category ${category}`;
}

function getCategoryId(categoryName) {
  if (!categoryName || categoryName === 'All') return '';
  const lower = categoryName.toString().toLowerCase();
  if (CATEGORY_NAME_TO_ID[lower]) return CATEGORY_NAME_TO_ID[lower];
  if (!isNaN(Number(categoryName))) return categoryName;
  return categoryName;
}

// Post Image Detection: select first image from media if available, otherwise fallback
function getPostCoverImage(post, siteHostAddress = (window.BLOG_CONFIG?.siteHostAddress || '')) {
  let categoryName = getCategoryName(post.category || post.categoryId);

  let coverImageUrl = `https://picsum.photos/seed/${encodeURIComponent(categoryName)}/1200/1400`;
  
  if (post.media && Array.isArray(post.media) && post.media.length > 0) {
    const firstImage = post.media.find(m => m.mimeType && m.mimeType.startsWith('image/'));
    if (firstImage && firstImage.storagePath) {
      const cleanHost = siteHostAddress ? siteHostAddress.replace(/\/+$/, '') : '';
      const cleanPath = firstImage.storagePath.replace(/^\/+/, '');
      coverImageUrl = cleanHost ? `${cleanHost}/${cleanPath}` : `/${cleanPath}`;
    }
  } else if (post.coverImage) {
    coverImageUrl = post.coverImage;
  }
  return coverImageUrl;
}

window.getCategoryName = getCategoryName;
window.getCategoryId = getCategoryId;
window.getPostCoverImage = getPostCoverImage;

const INITIAL_USER = {
  id: 'usr-1',
  name: 'Alex Morgan',
  username: 'alexm',
  email: 'alex.morgan@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Staff Frontend Architect & Design Systems Lead. Writing about the future of web interfaces, typography, browser performance, and developer experience.',
  location: 'San Francisco, CA',
  website: 'https://alexmorgan.dev',
  twitter: '@alexmorgan',
  role: 'Admin',
  notifications: {
    newComments: true,
    weeklyDigest: true,
    postLikes: false,
    securityAlerts: true
  },
  privacy: {
    publicProfile: true,
    showEmail: false,
    activityStatus: true
  }
};

const INITIAL_USERS = [
  { id: 1, name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'Admin', status: 'Active', postsCount: 14, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', joined: 'Jan 2025' },
  { id: 2, name: 'Elena Rostova', email: 'elena.rostova@example.com', role: 'Editor', status: 'Active', postsCount: 8, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80', joined: 'Mar 2025' },
  { id: 3, name: 'Dr. Julian Thorne', email: 'julian.thorne@example.com', role: 'Author', status: 'Active', postsCount: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80', joined: 'May 2025' },
  { id: 4, name: 'Maya Lin', email: 'maya.lin@example.com', role: 'Author', status: 'Active', postsCount: 3, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', joined: 'Jun 2025' },
  { id: 5, name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Subscriber', status: 'Active', postsCount: 0, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', joined: 'Jul 2025' },
  { id: 6, name: 'Marcus Vance', email: 'marcus.v@example.com', role: 'Subscriber', status: 'Inactive', postsCount: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', joined: 'Aug 2025' }
];

const INITIAL_ANALYTICS = {
  totalViews: '128,450',
  uniqueVisitors: '48,920',
  totalComments: '1,280',
  avgReadTime: '4m 32s',
  viewsChange: '+18.4%',
  visitorsChange: '+12.1%',
  commentsChange: '+24.5%',
  readTimeChange: '+5.2%',
  monthlyStats: [
    { label: 'Aug 1', views: 2400 },
    { label: 'Aug 5', views: 3100 },
    { label: 'Aug 10', views: 2900 },
    { label: 'Aug 15', views: 4200 },
    { label: 'Aug 20', views: 3800 },
    { label: 'Aug 25', views: 5600 },
    { label: 'Aug 30', views: 6100 },
    { label: 'Sep 5', views: 7400 }
  ],
  trafficSources: [
    { source: 'Organic Search (Google, DuckDuckGo)', percentage: 48, count: '61,650' },
    { source: 'Direct Navigation & Bookmarks', percentage: 26, count: '33,400' },
    { source: 'Social Media (Twitter/X, LinkedIn)', percentage: 16, count: '20,550' },
    { source: 'Referrals & Newsletters', percentage: 10, count: '12,850' }
  ]
};

// Central Store Object
window.BlogStore = {
  // Initialization
  init() {
    // updateCategoryDictionaries(this.getCategories());

    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS_LIST)) {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([17, 1]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
    }
    this.applyThemeSettings();
  },


  async fetchCategoriesFromServer() {
    const config = window.BLOG_CONFIG || {};
    const baseUrl = (config.BASE_URL || '').replace(/\/+$/, '');

    const endpointUrl = `${baseUrl}/blogs/filter/categories?status=isActive`;
    try {
      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const json = await response.json();
      const categories = json.responseData || json.data || [];
      if (Array.isArray(categories) && categories.length > 0) {
        updateCategoryDictionaries(categories);
      }
      return {
        responseResult: json.responseResult || "success",
        responseCode: json.responseCode || 201,
        responseCategory: json.responseCategory || 200,
        responseData: categories
      };
    } catch (err) {
      console.warn(`[BlogStore] Failed to fetch categories from ${endpointUrl}:`, err);
      const fallbackCats = this.getCategories();
      updateCategoryDictionaries(fallbackCats);
      return {
        responseResult: "fallback",
        responseCode: 200,
        error: err.message,
        responseData: fallbackCats
      };
    }
  },

  // Author Resolution
  getAuthorById(authorId) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_LIST) || '[]');
    const found = users.find(u => u.id == authorId);
    if (found) {
      return {
        id: found.id,
        name: found.name,
        avatar: found.avatar,
        title: found.role === 'Admin' ? 'Staff Frontend Architect' : `${found.role} & Contributor`
      };
    }
    const defaultAuthors = {
      1: { name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', title: 'Staff Frontend Architect' },
      2: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', title: 'Principal Systems Engineer' },
      3: { name: 'Dr. Julian Thorne', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80', title: 'Research Lead & Systems Architect' },
      4: { name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', title: 'Art Director & Editorial Designer' }
    };
    return defaultAuthors[authorId] || {
      id: authorId,
      name: `Author #${authorId}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      title: 'Contributing Writer'
    };
  },

  // Normalize server response post properties into consistent client schema
  normalizePost(rawPost) {
    if (!rawPost) return null;
    const id = rawPost.ltId !== undefined ? rawPost.ltId : rawPost.id;
    const categoryName = getCategoryName(rawPost.category);
    const coverImage = getPostCoverImage(rawPost);

    // Format reading time (handles number like 10 or formatted string like '10 min read')
    let readTime = rawPost.readTime;
    let readingMinutes = 5;
    if (typeof rawPost.readingTime === 'number') {
      readingMinutes = rawPost.readingTime;
      readTime = `${readingMinutes} min read`;
    } else if (typeof rawPost.readingTime === 'string') {
      readTime = rawPost.readingTime.includes('min') ? rawPost.readingTime : `${rawPost.readingTime} min read`;
      readingMinutes = parseInt(rawPost.readingTime, 10) || 5;
    } else if (rawPost.readTime) {
      readTime = rawPost.readTime;
      readingMinutes = parseInt(rawPost.readTime, 10) || 5;
    } else {
      readTime = '5 min read';
    }

    // Format date nicely (handles '2026-07-22 14:15:00' -> 'Jul 22, 2026')
    let publishedAt = rawPost.publishedAt || rawPost.date || 'Recently';
    if (rawPost.date && (!rawPost.publishedAt || rawPost.date.includes(':'))) {
      try {
        const parts = rawPost.date.split(' ')[0].split('-');
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          if (!isNaN(d.getTime())) {
            publishedAt = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
        }
      } catch (e) {}
    }

    // Author resolution

    const isFeatured = (rawPost.isFeatured === 1 || rawPost.isFeatured === '1') ? 1 : 0;

    return {
      ...rawPost,
      id: id,
      ltId: id,
      title: rawPost.title || 'Untitled Post',
      slug: rawPost.slug || `post-${id}`,
      excerpt: rawPost.excerpt || '',
      content: rawPost.content || `<p>${rawPost.excerpt || 'No content provided.'}</p>`,
      readingTime: readingMinutes,
      readTime: readTime,
      category: categoryName,
      rawCategory: rawPost.category,
      date: rawPost.date || rawPost.publishedAt,
      publishedAt: publishedAt,
      likes: Number(rawPost.likes || 0),
      views: Number(rawPost.views || 0),
      author: rawPost.author,
      isFeatured: isFeatured,
      media: Array.isArray(rawPost.media) ? rawPost.media : [],
      coverImage: coverImage,
      tags: rawPost.tags || [categoryName],
      status: rawPost.status || 'published',
      comments: Array.isArray(rawPost.comments) ? rawPost.comments : []
    };
  },

  // Get single post by id or ltId
  getPostById(id) {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    const found = posts.find(p => p.id == id || p.ltId == id);
    return found ? this.normalizePost(found) : null;
  },

  // Get the featured post (only one will have isFeatured === 1)
  getFeaturedPost() {
    const posts = this.getPosts({ status: 'published' });
    return posts.find(p => p.isFeatured === 1) || null;
  },

  // Posts listing with filters
  getPosts(filter = {}) {
       let posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    posts = posts.map(p => this.normalizePost(p));
    
    // Status filter (by default show published unless specified, e.g. in Admin)
    if (filter.status && filter.status !== 'all') {
      posts = posts.filter(p => p.status === filter.status);
    } else if (!filter.includeDrafts) {
      posts = posts.filter(p => p.status === 'published');
    }

    // Category filter (handles category name or category ID)
    if (filter.category && filter.category !== 'All') {
      const catLower = filter.category.toString().toLowerCase();
      posts = posts.filter(p => 
        p.category.toLowerCase() === catLower ||
        String(p.rawCategory) === String(filter.category)
      );
    }

    // Featured filter
    if (filter.onlyFeatured) {
      posts = posts.filter(p => p.isFeatured === 1);
    }
    if (filter.excludeFeatured) {
      posts = posts.filter(p => p.isFeatured !== 1);
    }

    // Search query
    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Author filter
    if (filter.author) {
      posts = posts.filter(p => 
        (p.author && p.author.name.toLowerCase() === filter.author.toLowerCase()) ||
        String(p.author_id) === String(filter.author)
      );
    }

    // Sorting
    if (filter.sort === 'popular') {
      posts.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filter.sort === 'comments') {
      posts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else {
      // Newest first by default
      posts.sort((a, b) => new Date(b.date || b.publishedAt) - new Date(a.date || a.publishedAt));
    }

    return posts;
  },

  async fetchPostsFromServer(state = {}) {
    const config = window.BLOG_CONFIG || {};
    const baseUrl = (config.BASE_URL || '').replace(/\/+$/, '');
    const page = state.page || 1;
    const limit = state.limit || 6;
    const q = state.q || state.search || '';
    const category = state.category && state.category !== 'All' ? getCategoryId(state.category) : '';
    const sort = state.sort || 'newest';

    // Call server endpoint
    const endpointUrl = `${baseUrl}/blogs/filter/posts?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&sort=${encodeURIComponent(sort)}`;

    try {
        const response = await fetch(endpointUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
        });
      
        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }
      const json = await response.json();
      
      // Parse posts array
      const rawList = json.responseData?.data || json.data || [];
      const normalizedData = rawList.map(p => this.normalizePost(p));
      // Resolve featured post: check if returned separately or extract from list
      let featuredPost = normalizedData.find(p => p.isFeatured === 1) || null;
      
      const pagination = json.responseData?.pagination;

      return {
        responseResult: json.responseResult || "success",
        responseCode: json.responseCode || 200,
        responseCategory: json.responseCategory || 200,
        responseData: {
          data: normalizedData,
          featured: featuredPost,
          pagination: pagination
        }
      };
    } catch (err) {
      console.warn(`[BlogStore] Fetch error from ${endpointUrl}:`, err);
      // Fallback to local store
    }
  },
  
  toggleLike(postId) {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    const post = posts.find(p => p.id == postId);
    if (!post) return 0;
    const likedKey = `liked_${postId}`;
    const isLiked = localStorage.getItem(likedKey) === 'true';
    if (isLiked) {
      post.likes = Math.max(0, post.likes - 1);
      localStorage.removeItem(likedKey);
    } else {
      post.likes = (post.likes || 0) + 1;
      localStorage.setItem(likedKey, 'true');
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return { likes: post.likes, isLiked: !isLiked };
  },

  isLiked(postId) {
    return localStorage.getItem(`liked_${postId}`) === 'true';
  },

  toggleBookmark(postId) {
    let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    const numId = Number(postId);
    const index = bookmarks.indexOf(numId);
    let isBookmarked = false;
    if (index > -1) {
      bookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      bookmarks.push(numId);
      isBookmarked = true;
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return isBookmarked;
  },

  isBookmarked(postId) {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    return bookmarks.includes(Number(postId));
  },

  getBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    return posts.filter(p => bookmarks.includes(Number(p.id)));
  },

  // Comments & Nested Replies
  addComment(postId, parentCommentId = null, contentText) {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    const post = posts.find(p => p.id == postId);
    if (!post) return null;

    const user = this.getCurrentUser();
    const newComment = {
      id: 'c_' + Date.now(),
      author: {
        name: user.name,
        avatar: user.avatar
      },
      content: contentText,
      createdAt: 'Just now',
      upvotes: 0,
      replies: []
    };

    if (!parentCommentId) {
      post.comments = post.comments || [];
      post.comments.unshift(newComment);
    } else {
      const addToThread = (comments) => {
        for (let c of comments) {
          if (c.id === parentCommentId) {
            c.replies = c.replies || [];
            c.replies.push(newComment);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (addToThread(c.replies)) return true;
          }
        }
        return false;
      };
      addToThread(post.comments || []);
    }

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newComment;
  },

  upvoteComment(postId, commentId) {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    const post = posts.find(p => p.id == postId);
    if (!post) return 0;

    let targetVotes = 0;
    const findAndVote = (comments) => {
      for (let c of comments) {
        if (c.id === commentId) {
          c.upvotes = (c.upvotes || 0) + 1;
          targetVotes = c.upvotes;
          return true;
        }
        if (c.replies && c.replies.length > 0) {
          if (findAndVote(c.replies)) return true;
        }
      }
      return false;
    };
    findAndVote(post.comments || []);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return targetVotes;
  },

  // Current User & Profile
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || JSON.stringify(INITIAL_USER));
  },

  updateUser(userData) {
    const current = this.getCurrentUser();
    const updated = { ...current, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  // Users List (Admin)
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_LIST) || JSON.stringify(INITIAL_USERS));
  },

  updateUserRole(userId, newRole) {
    const users = this.getUsers();
    const target = users.find(u => u.id == userId);
    if (target) {
      target.role = newRole;
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    }
  },

  toggleUserStatus(userId) {
    const users = this.getUsers();
    const target = users.find(u => u.id == userId);
    if (target) {
      target.status = target.status === 'Active' ? 'Inactive' : 'Active';
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      return target.status;
    }
  },

  // Analytics
  getAnalytics() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || JSON.stringify(INITIAL_ANALYTICS));
  },

//   // Theme Settings
  getThemeSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS));
  },

//   saveThemeSettings(settings) {
//     const current = this.getThemeSettings();
//     const updated = { ...current, ...settings };
//     localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
//     this.applyThemeSettings();
//     return updated;
//   },

  applyThemeSettings() {
    const settings = this.getThemeSettings();
    
    // Apply Dark/Light mode
    const root = document.documentElement;
    if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply Accent Color
    const accent = ACCENT_COLORS[settings.accent] || ACCENT_COLORS.indigo;
    root.style.setProperty('--color-primary', accent.primary);
    root.style.setProperty('--color-primary-hover', accent.hover);
    root.style.setProperty('--color-primary-light', accent.light);

    // Apply Typography
    if (settings.font === 'serif') {
      document.body.style.fontFamily = "var(--font-serif)";
    } else if (settings.font === 'mono') {
      document.body.style.fontFamily = "var(--font-mono)";
    } else {
      document.body.style.fontFamily = "var(--font-sans)";
    }
  },

//   // Toast UI notification helper
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
    toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-xl ${bg} text-sm font-medium z-50`;
    
    const icon = type === 'success' 
      ? '<i class="fa-solid fa-circle-check"></i>' 
      : type === 'error' 
        ? '<i class="fa-solid fa-circle-exclamation"></i>' 
        : '<i class="fa-solid fa-info-circle"></i>';

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${message}</span>
      <button class="ml-auto opacity-75 hover:opacity-100 p-1" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(1rem)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }
};

// Initialize Store immediately
BlogStore.init();


function setupSearchModal() {
    const searchModal = document.getElementById('search-modal');
    const searchTriggers = document.querySelectorAll('.search-trigger');
    const searchClose = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('search-modal-input');
    const searchResults = document.getElementById('search-modal-results');

    if (!searchModal) return;

    // --- Modal Controls ---
    const openSearch = () => {
        searchModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
            searchInput.value = ''; // Reset input on open
            renderInitialState();   // Clear previous results
        }
    };

    const closeSearch = () => {
        searchModal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // --- Event Listeners ---
    searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
    });

    // Keyboard Shortcuts (Ctrl/Cmd + K to toggle, Escape to close)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchModal.classList.contains('hidden') ? openSearch() : closeSearch();
        }
        if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
            closeSearch();
        }
    });

    // --- Search Logic & Debounce ---
    if (searchInput && searchResults) {
        let debounceTimer = null;

        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            clearTimeout(debounceTimer);

            if (!value) {
                renderInitialState();
                return;
            }

            renderLoadingState();

            debounceTimer = setTimeout(async () => {
                const baseUrl = window.BLOG_CONFIG?.BASE_URL || '';
                const endpointUrl = `${baseUrl}/blogs/filter/posts?limit=5&q=${encodeURIComponent(value)}`;

                try {
                    const response = await fetch(endpointUrl, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    
                    const json = await response.json();
                    const posts = json.responseData?.data || [];
                    
                    renderResults(posts, value);
                } catch (err) {
                    console.error(`[Search API Error]:`, err);
                    renderErrorState();
                }
            }, 300);
        });
    }

    // --- UI Rendering Helpers ---
    
    function renderInitialState() {
        if (!searchResults) return;
        searchResults.innerHTML = `
            <div class="py-8 text-center text-slate-400 dark:text-slate-500">
                <i class="fa-solid fa-magnifying-glass text-2xl mb-2 opacity-50"></i>
                <p class="text-sm">Type to start searching...</p>
            </div>
        `;
    }

    function renderLoadingState() {
        if (!searchResults) return;
        searchResults.innerHTML = `
            <div class="py-12 flex justify-center items-center">
                <div class="w-6 h-6 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin"></div>
            </div>
        `;
    }

    function renderErrorState() {
        if (!searchResults) return;
        searchResults.innerHTML = `
            <div class="py-12 text-center text-red-500/80">
                <i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                <p class="text-sm">Something went wrong. Please try again.</p>
            </div>
        `;
    }

    function renderResults(posts, query) {
        if (!searchResults) return;

        if (!posts || posts.length === 0) {
            searchResults.innerHTML = `
                <div class="py-12 text-center text-slate-400 dark:text-slate-500">
                    <i class="fa-solid fa-file-circle-question text-3xl mb-2 text-slate-300 dark:text-slate-600"></i>
                    <p class="text-sm">No articles found matching "<span class="text-slate-600 dark:text-slate-300 font-medium">${query}</span>"</p>
                </div>
            `;
            return;
        }

        // Helper fallback just in case getPostCoverImage isn't defined globally
        // const getCoverFallback = (img) => typeof getPostCoverImage === 'function' ? getPostCoverImage(img) : img;

        searchResults.innerHTML = posts.map(post => `
            <a href="${window.BLOG_CONFIG?.siteHostAddress}/ThemeBrainDump/post?slug=${post.slug}" class="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                <img 
                    src="${getPostCoverImage(post)}" 
                    alt="${domParser(post.title)}" 
                    onerror="this.onerror=null;this.src='https://picsum.photos/seed/${encodeURIComponent(getCategoryName(post.category))}/200/200';" 
                    class="w-16 h-14 object-cover rounded-lg flex-shrink-0" 
                />
                <div class="flex-1 min-w-0">
                    <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">${getCategoryName(post.category)}</span>
                    <h4 class="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">${domParser(post.title)}</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">${domParser(post.excerpt) || ''}</p>
                </div>
                <div class="text-[10px] font-medium text-slate-400 whitespace-nowrap self-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    ${post.readingTime || '5'} min
                </div>
            </a>
        `).join('');
    }
}

function domParser(content){
    return new DOMParser().parseFromString(content, "text/html").body.textContent;
}
    
</script>