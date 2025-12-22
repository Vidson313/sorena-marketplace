<?php
$categories = get_terms( array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => false,
) );

$product_types = array(
    ''         => 'همه محصولات',
    'simple'   => 'محصول ساده',
    'variable' => 'محصول متغیر',
    'grouped'  => 'محصول گروهی',
    'external' => 'محصول خارجی',
);
?>
<section class="py-16 bg-background">
    <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-8 items-start">
            <div class="space-y-6">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                    <?php echo sorena_icon( 'sparkles', 'w-4 h-4' ); ?>
                    <?php echo esc_html__( 'جستجوی هوشمند سورنا', 'sorena' ); ?>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold leading-tight"><?php echo esc_html__( 'پیدا کردن پروژه مناسب، ساده و سریع', 'sorena' ); ?></h2>
                <p class="text-muted-foreground"><?php echo esc_html__( 'با فیلترهای حرفه‌ای و نتایج لحظه‌ای، بهترین پروژه‌ها را بر اساس نیازتان انتخاب کنید.', 'sorena' ); ?></p>
                <div class="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-muted/50">
                        <?php echo sorena_icon( 'shield', 'w-4 h-4 text-green-500' ); ?>
                        <?php echo esc_html__( 'پرداخت امن', 'sorena' ); ?>
                    </span>
                    <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-muted/50">
                        <?php echo sorena_icon( 'download', 'w-4 h-4 text-blue-500' ); ?>
                        <?php echo esc_html__( 'دانلود فوری', 'sorena' ); ?>
                    </span>
                    <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-muted/50">
                        <?php echo sorena_icon( 'zap', 'w-4 h-4 text-yellow-500' ); ?>
                        <?php echo esc_html__( 'نتایج لحظه‌ای', 'sorena' ); ?>
                    </span>
                </div>
            </div>

            <div class="glass-surface rounded-3xl p-6 md:p-8 border border-border/60" data-product-search data-search-endpoint="<?php echo esc_url( rest_url( 'sorena/v1/search' ) ); ?>">
                <div class="grid gap-4">
                    <div>
                        <label class="text-xs text-muted-foreground"><?php echo esc_html__( 'جستجو', 'sorena' ); ?></label>
                        <div class="relative">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                <?php echo sorena_icon( 'search' ); ?>
                            </span>
                            <input
                                type="text"
                                data-search-input
                                placeholder="<?php echo esc_attr__( 'نام پروژه یا تکنولوژی...', 'sorena' ); ?>"
                                class="w-full h-12 pr-10 pl-4 rounded-2xl bg-muted/40 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="text-xs text-muted-foreground"><?php echo esc_html__( 'دسته‌بندی', 'sorena' ); ?></label>
                        <select data-search-category class="w-full h-12 rounded-2xl bg-muted/40 border border-border/50 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option value=""><?php echo esc_html__( 'همه دسته‌بندی‌ها', 'sorena' ); ?></option>
                            <?php foreach ( $categories as $category ) : ?>
                                <option value="<?php echo esc_attr( $category->slug ); ?>"><?php echo esc_html( $category->name ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs text-muted-foreground"><?php echo esc_html__( 'حداقل قیمت', 'sorena' ); ?></label>
                            <input
                                type="number"
                                data-search-min
                                placeholder="<?php echo esc_attr__( '۰', 'sorena' ); ?>"
                                class="w-full h-12 rounded-2xl bg-muted/40 border border-border/50 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label class="text-xs text-muted-foreground"><?php echo esc_html__( 'حداکثر قیمت', 'sorena' ); ?></label>
                            <input
                                type="number"
                                data-search-max
                                placeholder="<?php echo esc_attr__( '۱,۰۰۰,۰۰۰', 'sorena' ); ?>"
                                class="w-full h-12 rounded-2xl bg-muted/40 border border-border/50 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>

                <div class="mt-6">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'نتایج پیشنهادی', 'sorena' ); ?></p>
                        <span class="text-xs text-muted-foreground" data-search-status><?php echo esc_html__( 'در حال آماده‌سازی نتایج...', 'sorena' ); ?></span>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4" data-search-results></div>
                </div>
            </div>
        </div>
    </div>
</section>
