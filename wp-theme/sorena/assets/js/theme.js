(function () {
  const root = document.documentElement;
  const storedTheme = window.localStorage.getItem('sorena-theme');
  if (storedTheme) {
    root.classList.toggle('dark', storedTheme === 'dark');
  }

  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      window.localStorage.setItem('sorena-theme', isDark ? 'dark' : 'light');
    });
  });

  document.querySelectorAll('.mobile-menu-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = button.closest('nav');
      if (!nav) return;
      const menu = nav.querySelector('.mobile-menu');
      if (menu) {
        menu.classList.toggle('hidden');
        const expanded = !menu.classList.contains('hidden');
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    });
  });

  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const triggers = tabs.querySelectorAll('.tab-trigger');
    const contents = tabs.querySelectorAll('.tab-content');

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const target = trigger.getAttribute('data-tab');
        triggers.forEach((item) => item.classList.remove('active'));
        contents.forEach((item) => item.classList.remove('active'));
        trigger.classList.add('active');
        const content = tabs.querySelector(`[data-tab-content="${target}"]`);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  });

  document.querySelectorAll('.favorite-toggle').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const productId = button.getAttribute('data-product-id');
      if (!productId || !window.sorenaData) {
        return;
      }

      const body = new URLSearchParams();
      body.set('action', 'sorena_toggle_favorite');
      body.set('nonce', window.sorenaData.nonce);
      body.set('product_id', productId);

      try {
        const response = await fetch(window.sorenaData.ajaxUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });
        const result = await response.json();
        if (result.success) {
          const isFavorite = result.data.isFavorite;
          button.setAttribute('data-is-favorite', isFavorite ? '1' : '0');
          button.classList.toggle('bg-red-500/80', isFavorite);
          button.classList.toggle('bg-white/20', !isFavorite);
        } else if (result.data && result.data.message) {
          alert(result.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  document.querySelectorAll('[data-product-search]').forEach((section) => {
    const endpoint = section.getAttribute('data-search-endpoint');
    const input = section.querySelector('[data-search-input]');
    const category = section.querySelector('[data-search-category]');
    const minPrice = section.querySelector('[data-search-min]');
    const maxPrice = section.querySelector('[data-search-max]');
    const results = section.querySelector('[data-search-results]');
    const status = section.querySelector('[data-search-status]');

    if (!endpoint || !input || !results) {
      return;
    }

    let timeout = null;

    const renderResults = (items) => {
      if (!items.length) {
        results.innerHTML = '';
        status.textContent = 'نتیجه‌ای پیدا نشد.';
        return;
      }
      status.textContent = `${items.length} نتیجه نمایش داده شد`;
      results.innerHTML = items
        .map((item) => {
          const image = item.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80';
          return `
            <a href="${item.permalink}" class="glass-surface rounded-2xl p-4 border border-border/40 hover:border-primary/40 transition-colors">
              <div class="aspect-video rounded-xl overflow-hidden mb-3">
                <img src="${image}" alt="${item.name}" class="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 class="text-sm font-semibold mb-1 line-clamp-1">${item.name}</h3>
              <div class="text-xs text-muted-foreground">${item.price_html || ''}</div>
            </a>
          `;
        })
        .join('');
    };

    const fetchResults = async () => {
      const query = input.value.trim();
      if (!query && !category.value && !minPrice.value && !maxPrice.value) {
        results.innerHTML = '';
        status.textContent = 'در حال آماده‌سازی نتایج...';
        return;
      }

      status.textContent = 'در حال جستجو...';
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category.value) params.set('category', category.value);
      if (minPrice.value) params.set('min_price', minPrice.value);
      if (maxPrice.value) params.set('max_price', maxPrice.value);
      params.set('limit', '8');

      try {
        const response = await fetch(`${endpoint}?${params.toString()}`);
        const data = await response.json();
        renderResults(data.results || []);
      } catch (error) {
        console.error(error);
        status.textContent = 'خطا در دریافت نتایج.';
      }
    };

    const scheduleSearch = () => {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(fetchResults, 250);
    };

    [input, category, minPrice, maxPrice].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', scheduleSearch);
      el.addEventListener('change', scheduleSearch);
    });
  });
})();
