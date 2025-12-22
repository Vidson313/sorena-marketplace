# My Account UI Overrides (Dev Note)

Goal: Replace WooCommerce default My Account UI with a bespoke dark/glass dashboard while preserving all endpoints and hooks.

Why overrides:
- WooCommerce default templates are too generic for the theme's 2025 dark/glass visual language.
- We need full control over layout (sidebar + content panel) and RTL-friendly spacing.

Templates overridden:
- wp-theme/sorena/woocommerce/myaccount/my-account.php
- wp-theme/sorena/woocommerce/myaccount/navigation.php
- wp-theme/sorena/woocommerce/myaccount/dashboard.php
- wp-theme/sorena/woocommerce/myaccount/orders.php
- wp-theme/sorena/woocommerce/myaccount/downloads.php
- wp-theme/sorena/woocommerce/myaccount/my-address.php
- wp-theme/sorena/woocommerce/myaccount/form-edit-account.php
- wp-theme/sorena/woocommerce/myaccount/form-edit-address.php
- wp-theme/sorena/woocommerce/myaccount/payment-methods.php

Template parts added:
- wp-theme/sorena/template-parts/account/header.php
- wp-theme/sorena/template-parts/account/sidebar.php
- wp-theme/sorena/template-parts/account/empty-state.php
- wp-theme/sorena/template-parts/account/card.php

Behavior notes:
- All WooCommerce hooks remain (navigation/content/actions).
- Notices are re-skinned via `woocommerce_notice_classes` in `wp-theme/sorena/inc/woocommerce.php`.
- Styling uses Tailwind utility classes already in the build pipeline; no inline CSS required.
