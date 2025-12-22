Mega Menu + Live Search

Overview
- Mega menu renders from WooCommerce product categories in the header.
- Live search uses a REST endpoint and renders results instantly on the landing page.

Mega Menu
- Location: `wp-theme/sorena/template-parts/components/navbar.php`
- Data source: product categories (`product_cat`) + optional thumbnails (category image).
- Behavior: hover on desktop, simple category list inside mobile menu.

How to edit categories/thumbnails
1) WP Admin > Products > Categories
2) Add/edit categories and upload the category image.
3) The mega menu pulls top-level categories + up to 5 children each.

Live Product Search
- UI: `wp-theme/sorena/template-parts/sections/product-search.php`
- JS: `wp-theme/sorena/assets/js/theme.js`
- REST: `wp-theme/sorena/inc/rest.php` (`/wp-json/sorena/v1/search`)

Filters supported
- Search term (q)
- Category slug
- Product type (simple/variable/grouped/external)
- Min/max price

Customization
- Adjust labels/placeholders in `wp-theme/sorena/template-parts/sections/product-search.php`
- Change results limit in `wp-theme/sorena/assets/js/theme.js` (search `limit` param)
- Change REST caching time in `wp-theme/sorena/inc/rest.php` (`MINUTE_IN_SECONDS`)

Admin walkthrough
1) Menus: Appearance > Menus (Primary, Footer Support, Footer Company).
2) Categories: Products > Categories (name, slug, thumbnail).
3) Logo: Appearance > Customize > Site Identity.

Performance notes
- REST responses are cached for 60 seconds.
- Images are lazy-loaded in search results.

