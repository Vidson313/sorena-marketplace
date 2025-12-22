<?php
get_header();
?>
<main class="container mx-auto px-4 py-16 text-center">
    <div class="glass-surface rounded-3xl p-12">
        <h1 class="text-4xl font-bold mb-4"><?php echo esc_html__( '۴۰۴', 'sorena' ); ?></h1>
        <p class="text-muted-foreground mb-6"><?php echo esc_html__( 'صفحه مورد نظر پیدا نشد.', 'sorena' ); ?></p>
        <a class="inline-flex items-center justify-center rounded-full px-6 py-3 bg-primary text-white" href="<?php echo esc_url( home_url( '/' ) ); ?>">
            <?php echo esc_html__( 'بازگشت به صفحه اصلی', 'sorena' ); ?>
        </a>
    </div>
</main>
<?php
get_footer();
