<?php
/**
 * My account template.
 */
defined( 'ABSPATH' ) || exit;
?>
<main class="max-w-7xl mx-auto w-full px-4 lg:px-6 py-10 space-y-6">
    <?php do_action( 'woocommerce_before_my_account' ); ?>

    <?php get_template_part( 'template-parts/account/header' ); ?>

    <div class="mt-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
        <div class="lg:col-span-3 lg:col-start-1">
            <?php get_template_part( 'template-parts/account/sidebar' ); ?>
        </div>

        <div class="lg:col-span-9 min-w-0">
            <div class="rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-lg shadow-[0_16px_60px_rgba(0,0,0,0.55)] p-6 md:p-8 space-y-8">
                <?php do_action( 'woocommerce_account_content' ); ?>
            </div>
        </div>
    </div>

    <?php do_action( 'woocommerce_after_my_account' ); ?>
</main>
