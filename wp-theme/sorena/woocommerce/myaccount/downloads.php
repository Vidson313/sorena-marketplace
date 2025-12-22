<?php
/**
 * My Account downloads.
 */
defined( 'ABSPATH' ) || exit;

$user_id   = get_current_user_id();
$downloads = ( $user_id && function_exists( 'wc_get_customer_available_downloads' ) )
    ? wc_get_customer_available_downloads( $user_id )
    : array();
$has_downloads = (bool) $downloads;

do_action( 'woocommerce_before_account_downloads', $has_downloads );
?>

<?php if ( $has_downloads ) : ?>
    <div class="hidden lg:block">
        <div class="glass-surface rounded-3xl p-6">
            <table class="w-full text-sm">
                <thead>
                    <tr class="text-muted-foreground">
                        <?php foreach ( wc_get_account_downloads_columns() as $column_id => $column_name ) : ?>
                            <th class="text-right font-medium pb-3"><?php echo esc_html( $column_name ); ?></th>
                        <?php endforeach; ?>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/40">
                    <?php foreach ( $downloads as $download ) : ?>
                        <tr>
                            <?php foreach ( wc_get_account_downloads_columns() as $column_id => $column_name ) : ?>
                                <td class="py-4 text-right">
                                    <?php if ( has_action( 'woocommerce_account_downloads_column_' . $column_id ) ) : ?>
                                        <?php do_action( 'woocommerce_account_downloads_column_' . $column_id, $download ); ?>
                                    <?php elseif ( 'download-file' === $column_id ) : ?>
                                        <a href="<?php echo esc_url( $download['download_url'] ); ?>" class="font-semibold hover:text-primary">
                                            <?php echo esc_html( $download['download_name'] ); ?>
                                        </a>
                                    <?php elseif ( 'download-remaining' === $column_id ) : ?>
                                        <?php echo esc_html( $download['downloads_remaining'] ); ?>
                                    <?php elseif ( 'download-expires' === $column_id ) : ?>
                                        <?php if ( ! empty( $download['access_expires'] ) ) : ?>
                                            <time datetime="<?php echo esc_attr( date( 'c', $download['access_expires'] ) ); ?>">
                                                <?php echo esc_html( date_i18n( get_option( 'date_format' ), $download['access_expires'] ) ); ?>
                                            </time>
                                        <?php else : ?>
                                            <?php esc_html_e( 'Never', 'woocommerce' ); ?>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <?php echo esc_html( $download[ $column_id ] ); ?>
                                    <?php endif; ?>
                                </td>
                            <?php endforeach; ?>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="grid gap-4 lg:hidden">
        <?php foreach ( $downloads as $download ) : ?>
            <div class="glass-surface rounded-2xl p-5 space-y-4">
                <div>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'فایل', 'sorena' ); ?></p>
                    <a href="<?php echo esc_url( $download['download_url'] ); ?>" class="font-semibold hover:text-primary">
                        <?php echo esc_html( $download['download_name'] ); ?>
                    </a>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-muted-foreground"><?php echo esc_html__( 'دفعات باقی‌مانده', 'sorena' ); ?></p>
                        <p><?php echo esc_html( $download['downloads_remaining'] ); ?></p>
                    </div>
                    <div>
                        <p class="text-muted-foreground"><?php echo esc_html__( 'انقضا', 'sorena' ); ?></p>
                        <p>
                            <?php if ( ! empty( $download['access_expires'] ) ) : ?>
                                <?php echo esc_html( date_i18n( get_option( 'date_format' ), $download['access_expires'] ) ); ?>
                            <?php else : ?>
                                <?php esc_html_e( 'Never', 'woocommerce' ); ?>
                            <?php endif; ?>
                        </p>
                    </div>
                </div>
                <a href="<?php echo esc_url( $download['download_url'] ); ?>" class="inline-flex items-center rounded-full px-4 py-2 bg-primary text-white text-sm">
                    <?php echo esc_html__( 'دانلود', 'sorena' ); ?>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
<?php else : ?>
    <?php
    get_template_part(
        'template-parts/account/empty-state',
        null,
        array(
            'icon'        => 'download',
            'title'       => esc_html__( 'دانلودی در دسترس نیست', 'sorena' ),
            'description' => esc_html__( 'پس از خرید محصولات دیجیتال، فایل‌ها در این بخش نمایش داده می‌شوند.', 'sorena' ),
            'action_url'  => wc_get_page_permalink( 'shop' ),
            'action_label'=> esc_html__( 'مشاهده محصولات', 'sorena' ),
        )
    );
    ?>
<?php endif; ?>

<?php do_action( 'woocommerce_after_account_downloads', $has_downloads ); ?>
