<script>
    
/**
 * Modern Responsive Blog Theme - Navigation & Global UI Controller
 * Manages mobile drawer, dark/light mode toggle, search modal, user menu, and keyboard shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure store is ready and theme is applied
  if (window.BlogStore) {
    window.BlogStore.applyThemeSettings();
  }

  setupThemeToggle();
  setupMobileMenu();
  setupSearchModal();
  setupUserMenu();
  highlightActiveNav();
  loadBlogMenu();
});


async function loadBlogMenu() {
  const container = document.getElementById('blog-category-menu-container');
  if (!container) return;

  try {
    const response = await fetch(`${window.BLOG_CONFIG?.BASE_URL || ''}/blogs/menu/categories`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const res = await response.json();
    
    // Support LtResponse structure or raw response
    const menuData = res.responseData || res;

    if (!menuData || !menuData.children) return;

    container.innerHTML = renderMenuDropdown(menuData);
  } catch (error) {
    console.error('Failed to load menu:', error);
  }
}

function renderMenuDropdown(menu) {
  const categories = menu.children || [];

  return `
    <div class="relative inline-block text-left nav-menu-root">
      
      <!-- Top Level Trigger Button -->
      <button 
        type="button" 
        onclick="toggleMobileMenu(this)"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-primary transition-colors focus:outline-none cursor-pointer"
      >
        <span>${menu.title}</span>
        <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200 menu-caret"></i>
      </button>

      <!-- Level 2: Categories Menu -->
      <div 
        id="nav-dropdown-panel"
        class="level-2-menu invisible opacity-0 md:opacity-0 md:invisible absolute right-0 md:left-0 md:right-auto mt-1 w-[85vw] max-w-xs md:w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-[999] transition-all duration-150 max-h-[80vh] overflow-y-auto md:overflow-visible"
      >
        ${categories.map(category => {
          const posts = category.children || [];
          const hasPosts = Array.isArray(posts) && posts.length > 0;

          return `
            <div class="category-item relative border-b border-slate-100/60 dark:border-slate-800/60 md:border-b-0 last:border-b-0">
              
              <!-- Category Header / Accordion Trigger -->
              <div class="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                <a href="#" class="flex-grow px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary truncate">
                  ${category.title}
                </a>
                
                ${hasPosts ? `
                  <!-- Mobile Accordion Toggle Arrow -->
                  <button 
                    type="button" 
                    onclick="toggleSubAccordion(event, this)" 
                    class="md:hidden px-3 py-2.5 text-slate-400 hover:text-primary focus:outline-none"
                  >
                    <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200 sub-caret"></i>
                  </button>
                  <!-- Desktop Hover Arrow Indicator -->
                  <span class="hidden md:inline-block pr-3 text-slate-400">
                    <i class="fa-solid fa-chevron-right text-[9px]"></i>
                  </span>
                ` : ''}
              </div>

              <!-- Level 3: Posts Sub-Menu -->
              ${hasPosts ? `
                <!-- Mobile: Collapsible Accordion | Desktop: Absolute Popout -->
                <div class="level-3-menu hidden md:invisible md:opacity-0 md:absolute md:left-full md:-top-1.5 md:ml-1 md:w-72 md:rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 md:bg-white md:dark:bg-slate-900 md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-2xl py-1 md:py-2 z-[1000] md:transition-opacity md:duration-100">
                  
                  <div class="hidden md:block px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ${category.title} Posts (${posts.length})
                  </div>
                  
                  <div class="max-h-60 md:max-h-72 overflow-y-auto pl-4 md:pl-0 pr-2">
                    ${posts.map(post => `
                      <a 
                        href="${window.BLOG_CONFIG?.siteHostAddress}/ThemeBrainDump/post?slug=${slugify(post.title)}" 
                        class="block px-3 py-1.5 md:py-2 text-[11px] md:text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-primary rounded-lg transition-colors truncate"
                        title="${post.title}"
                      >
                        <i class="fa-regular fa-file-lines mr-1.5 opacity-60 text-[9px]"></i>
                        ${post.title}
                      </a>
                    `).join('')}
                  </div>

                </div>
              ` : ''}

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}


function slugify(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/'/g, "")              // Remove apostrophes
        .replace(/&/g, "and")           // Optional: replace &
        .replace(/[^a-z0-9\s-]/g, "")   // Remove other special characters
        .replace(/\s+/g, "-")           // Replace spaces with hyphens
        .replace(/-+/g, "-")            // Remove duplicate hyphens
        .replace(/^-|-$/g, "");         // Trim leading/trailing hyphens
} 

// Toggle Main Menu Panel on Mobile Tap
function toggleMobileMenu(btn) {
  const panel = document.getElementById('nav-dropdown-panel');
  const caret = btn.querySelector('.menu-caret');
  
  if (!panel) return;

  const isOpen = panel.classList.contains('mobile-open');
  if (isOpen) {
    panel.classList.remove('mobile-open', 'visible', 'opacity-100');
    panel.classList.add('invisible', 'opacity-0');
    if (caret) caret.style.transform = 'rotate(0deg)';
  } else {
    panel.classList.add('mobile-open', 'visible', 'opacity-100');
    panel.classList.remove('invisible', 'opacity-0');
    if (caret) caret.style.transform = 'rotate(180deg)';
  }
}

// Toggle Sub-Categories on Mobile Tap
function toggleSubAccordion(e, btn) {
  e.preventDefault();
  e.stopPropagation();

  const item = btn.closest('.category-item');
  const subMenu = item.querySelector('.level-3-menu');
  const caret = btn.querySelector('.sub-caret');

  if (!subMenu) return;

  const isHidden = subMenu.classList.contains('hidden');

  // Close sibling accordions for clean UX
  const parentMenu = item.closest('.level-2-menu');
  parentMenu.querySelectorAll('.level-3-menu').forEach(menu => {
    menu.classList.add('hidden');
  });
  parentMenu.querySelectorAll('.sub-caret').forEach(c => {
    c.style.transform = 'rotate(0deg)';
  });

  if (isHidden) {
    subMenu.classList.remove('hidden');
    caret.style.transform = 'rotate(180deg)';
  }
}

// Close Dropdown When Tapping Outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-menu-root')) {
    const panel = document.getElementById('nav-dropdown-panel');
    const caret = document.querySelector('.nav-menu-root .menu-caret');
    if (panel) {
      panel.classList.remove('mobile-open', 'visible', 'opacity-100');
      panel.classList.add('invisible', 'opacity-0');
    }
    if (caret) caret.style.transform = 'rotate(0deg)';
  }
});

// Setup Dark / Light Mode Toggle
function setupThemeToggle() {
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const updateIcons = () => {
    const isDark = document.documentElement.classList.contains('dark');
    themeBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    });
  };

  updateIcons();

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = window.BlogStore.getThemeSettings();
      const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      window.BlogStore.saveThemeSettings({ theme: newTheme });
      updateIcons();
      window.BlogStore.showToast(`Switched to ${newTheme} mode`, 'info');
    });
  });
}

// Setup Mobile Responsive Drawer
function setupMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileClose = document.getElementById('mobile-drawer-close');

  if (!mobileToggle || !mobileDrawer) return;

  const openDrawer = () => {
    mobileDrawer.classList.remove('translate-x-full');
    if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.add('translate-x-full');
    if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);
}



// User Menu Dropdown Toggle
function setupUserMenu() {
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userMenuDropdown = document.getElementById('user-menu-dropdown');

  if (!userMenuBtn || !userMenuDropdown) return;

  userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenuDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!userMenuDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
      userMenuDropdown.classList.add('hidden');
    }
  });

  // Update current user details in header
  const currentUser = window.BlogStore.getCurrentUser();
  const avatarImgs = document.querySelectorAll('.current-user-avatar');
  avatarImgs.forEach(img => {
    img.src = currentUser.avatar;
    img.alt = currentUser.name;
  });

  const nameLabels = document.querySelectorAll('.current-user-name');
  nameLabels.forEach(el => el.textContent = currentUser.name);

  const emailLabels = document.querySelectorAll('.current-user-email');
  emailLabels.forEach(el => el.textContent = currentUser.email);
}

// Highlight Current Active Nav Link
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('text-primary', 'font-semibold');
      link.classList.remove('text-slate-600', 'dark:text-slate-300');
    }
  });
}


    
</script>