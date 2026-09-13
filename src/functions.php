<?php
if (!defined('ABSPATH')) exit;

function wedding_theme_scripts() {
    // Swiper Slider CSS & JS
    wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', [], '11.0');
    wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', [], '11.0', true);

    // Stili del Tema
    wp_enqueue_style('wedding-main-css', get_template_directory_uri() . '/assets/css/main.css', ['swiper-css'], '1.0');

    // Script del Tema
    wp_enqueue_script('wedding-app-js', get_template_directory_uri() . '/assets/js/app.js', ['swiper-js'], '1.0', true);

    // Passa l'endpoint AJAX a JavaScript
    wp_localize_script('wedding-app-js', 'wedding_ajax', [
        'ajax_url' => admin_url('admin-ajax.php')
    ]);
}
add_action('wp_enqueue_scripts', 'wedding_theme_scripts');
