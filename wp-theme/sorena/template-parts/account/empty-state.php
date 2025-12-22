<?php
/**
 * Account empty state.
 */
defined( 'ABSPATH' ) || exit;

$args = wp_parse_args(
    $args,
    array(
        'icon'         => 'sparkles',
        'title'        => '',
        'description'  => '',
        'action_url'   => '',
        'action_label' => '',
    )
);
?>
<div class="glass-surface rounded-3xl p-8 text-center">
    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
        <?php echo sorena_icon( $args['icon'], 'w-7 h-7 text-primary' ); ?>
    </div>
    <?php if ( $args['title'] ) : ?>
        <h3 class="text-lg font-semibold mb-2"><?php echo esc_html( $args['title'] ); ?></h3>
    <?php endif; ?>
    <?php if ( $args['description'] ) : ?>
        <p class="text-sm text-muted-foreground mb-6"><?php echo esc_html( $args['description'] ); ?></p>
    <?php endif; ?>
    <?php if ( $args['action_url'] && $args['action_label'] ) : ?>
        <a href="<?php echo esc_url( $args['action_url'] ); ?>" class="inline-flex items-center rounded-full px-6 py-2 bg-primary text-white text-sm">
            <?php echo esc_html( $args['action_label'] ); ?>
        </a>
    <?php endif; ?>
</div>
