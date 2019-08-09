<?php
/**
* Plugin Name: cleaner.earth Customisations
*Description: A few customisations and fixes for cleaner.earth
*Version: 0.0.1
*Author: The Cleaner Earth Team
*Author URI: robinkehr.de
 */


defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


include 'inc/maps.php';
include 'inc/cleaner_forums.php';
include 'inc/page_templater.php';


/*----------------------------------------------------------------------
----------FIXING A COMPATIBILITY ISSUE WITH THIMPRESS THEMES
----------------------------------------------------------------------*/
function disable_user_register_mepr() {
  remove_action('user_register', 'thim_register_extra_fields', 1000);
}
add_filter('mepr-validate-signup', 'disable_user_register_mepr');

/*----------------------------------------------------------------------
----------SETUP ADMINPAGE IN WP BACKEND
----------------------------------------------------------------------*/
function cl_ear_setup_admin_page() {
  add_menu_page('Cleaner.Earth Customisation Options', 'Cleaner.Earth', 'manage_options', 'cleaner-earth-customisations', 'cl_ear_create_admin_page', '
dashicons-admin-site' ,110);
}
add_action('admin_menu', 'cl_ear_setup_admin_page');

function cl_ear_create_admin_page(){
  echo "<h1>Cleaner.Earth Customisation Options</h1>";
}


/*----------------------------------------------------------------------
----------ENQUEUE GLOBAL STYLESHEETS & SCRIPTS
----------------------------------------------------------------------*/
function cl_ear_enqueue_styles(){
  wp_enqueue_style('cl_ear_style', plugin_dir_url( __FILE__ ) . 'css/cl_ear_style.css');

}
add_action('wp_print_styles', 'cl_ear_enqueue_styles');

function cl_ear_enqueue_scripts(){
  wp_register_script('cl_ear_script', plugin_dir_url( __FILE__ ) . 'js/cl_ear_script.js', '', '', true);
  wp_register_script('cl_ear_forum_filters', plugin_dir_url( __FILE__ ) . 'js/forumFilters.js');
  wp_enqueue_script('cl_ear_script');
}
add_action('wp_print_scripts', 'cl_ear_enqueue_scripts',-10);

function cl_load_dashicons(){
    wp_enqueue_style('dashicons');
}
add_action('wp_enqueue_scripts', 'cl_load_dashicons');
