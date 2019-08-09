<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//Shortcode for a p5.js based map [p5map]

function cl_ear_p5_map(){
  $map_dir = "P5WorldMap.js";
  $project_class_dir = "Project.js";
  $p5_dir = "p5/p5.min.js";
  $js_dir = "/wp-content/plugins/cleaner-earth-customisations/js/";
  wp_register_script('cl_ear_project_map', $js_dir.$map_dir);
  wp_register_script('cl_ear_project_map_project', $js_dir.$project_class_dir);
  wp_register_script('cl_ear_p5', $js_dir.$p5_dir);
  wp_enqueue_script('cl_ear_project_map_project');
  wp_enqueue_script('cl_ear_p5');
  wp_enqueue_script('cl_ear_project_map');

  $html = '<div id="cl_ear_project_map"></div><!--<div style="height: 100vh;" id="project_map_spacer"></div>-->';
  return $html;
}

//Shortcode for a leaflet.js based map [projectmap]

function cl_ear_project_map(){
  $prefix = 'cl_ear_';
  //Containers
  echo '<div id="map" style="height: 600px;"></div>';
  echo '<div id"map-info-container"></div>';
  //leaflet directiories
  $leaflet_map_dir = '/wp-content/plugins/cleaner-earth-customisations/cl_ear_leaflet_map/';
  $leaflet_map_css = $leaflet_map_dir . 'css' . '/';
  $leaflet_map_data = $leaflet_map_dir . 'data' . '/';
  $leaflet_map_images = $leaflet_map_dir . 'images' . '/';
  $leaflet_map_js = $leaflet_map_dir . 'js' . '/';
  $leaflet_map_legend = $leaflet_map_dir . 'legend' . '/';
  $leaflet_map_markers = $leaflet_map_dir . 'markers' . '/';
  $leaflet_map_webfonts = $leaflet_map_dir . 'webfonts' . '/';

  //Register stylesheets
  $leaflet_stylesheets = [
    'leaflet',
    'qgis2web',
    'fontawesome-all.min',
    'MarkerCluster',
    'MarkerCluster.Default'
  ];

  foreach ($leaflet_stylesheets as $stylesheet) {
    $stylesheet = $stylesheet;
    wp_register_style( $prefix . $stylesheet, $leaflet_map_css . $stylesheet . '.css');
    wp_enqueue_style($prefix . $stylesheet);
  }

  //Load datasets
  $leaflet_datasets = [
    'perspectiveprojects_0',
    'ongoingprojects_1',
    'previousprojects_2',
    'plannedprojects_3',
    'World_Countries_5',
    'CleanerEarthProjects_6'
  ];

  foreach ($leaflet_datasets as $dataset) {
    wp_register_script($prefix . $dataset, $leaflet_map_data . $dataset . '.js');
    wp_enqueue_script($prefix . $dataset);
  }

  //Register scripts
  $leaflet_scripts = [
    'qgis2web_expressions',
    'leaflet-src',
    //'leaflet.rotatedMarker',
    /*'leaflet.pattern',*/
    'leaflet-hash',
    //'Autolinker.min',
    'rbush.min',
    'labelgun.min',
    'labels',
    //'leaflet.markercluster',
    'cl_ear_popup',
    'cl_ear_leaflet_map'
  ];

  foreach ($leaflet_scripts as $script) {
    $deps = array();
    //$deps = ($script != 'leaflet' ? array( $prefix . 'leaflet' ) : array());
    wp_register_script($prefix . $script, $leaflet_map_js . $script . '.js', $deps);
    wp_enqueue_script($prefix . $script);
  }

}

//add shortcodes
add_shortcode('projectmap', 'cl_ear_project_map');
add_shortcode('p5map', 'cl_ear_p5_map');


?>
