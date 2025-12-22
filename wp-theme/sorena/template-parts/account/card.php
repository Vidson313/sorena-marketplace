<?php
/**
 * Account stat card.
 */
defined( 'ABSPATH' ) || exit;

$args = wp_parse_args(
    $args,
    array(
        'icon'       => 'sparkles',
        'label'      => '',
        'value'      => '',
        'hint'       => '',
        'action_url' => '',
        'action_label' => '',
    )
);
?>
<div class="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-slate-900/60 backdrop-blur-lg shadow-[0_16px_60px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:from-white/16 hover:via-white/10 hover:to-slate-900/50">
    <span class="pointer-events-none absolute inset-y-3 right-2 w-1 rounded-full bg-gradient-to-b from-primary/55 to-primary/15 opacity-70"></span>
    <div class="relative flex items-start gap-4 p-5">
        <div class="relative w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            <span class="absolute inset-0 bg-primary/20 blur-md opacity-60"></span>
            <span class="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 text-primary">
                <?php echo sorena_icon( $args['icon'], 'w-5 h-5' ); ?>
            </span>
        </div>
        <div class="flex-1 space-y-2">
            <?php if ( $args['label'] ) : ?>
                <p class="text-sm font-semibold text-white/90"><?php echo esc_html( $args['label'] ); ?></p>
            <?php endif; ?>
            <?php if ( $args['value'] !== '' ) : ?>
                <p class="text-2xl font-bold tracking-tight text-white"><?php echo esc_html( $args['value'] ); ?></p>
            <?php endif; ?>
            <?php if ( $args['hint'] ) : ?>
                <p class="text-xs text-white/55 leading-5"><?php echo esc_html( $args['hint'] ); ?></p>
            <?php endif; ?>
        </div>
        <?php if ( $args['action_url'] && $args['action_label'] ) : ?>
            <a href="<?php echo esc_url( $args['action_url'] ); ?>" class="text-xs font-medium text-primary/90 hover:text-primary-foreground transition-colors">
                <?php echo esc_html( $args['action_label'] ); ?>
            </a>
        <?php endif; ?>
    </div>
</div>
