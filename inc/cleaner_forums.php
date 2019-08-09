<?php defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

include 'cleaner_forums_admin.php';


/*======================================================
========== CUSTOM "COMMUNITY" POST TYPE
======================================================*/
function cl_ear_forum_post_type(){
  $labels  = array(
    'name'          => 'Community',
    'singular_name' => 'Community Post',
    'add_new'       => 'New Community Post',
    'all_items'     => 'All Community Posts',
    'add_new_item'  => 'Leave a Community Post',
    'edit_item'     => 'Edit',
    'new_item'      => 'New Community Post',
    'view_item'     => 'View Community Post',
    'search_item'   => 'Search Community Post',
    'not_found'     => 'No Community Posts found',
    'not_found_in_trash' => 'No Community Posts found in trash',
    'parent_item_colon' => 'Parent Community Post'
  );
  $rewrite = array(
    'with_front'    => false,
    'slug'          => 'communitydefault'
  );


  $args = array(
    'labels'        => $labels,
    'rewrite'       => $rewrite,
    'public'        => true,
    'has_archive'   => true,
    'publicly_queryable' => true,
    'query_var'     => true,
    'rewrite'       => true,
    'capability_type' => 'post',
    'hierarchical'  => false,
    'show_in_nav_menus' => false,
    'supports'      => array(
                          'title',
                          'editor',
                          'excerpt',
                          'thumbnail',
                          'comments'),
    'taxonomies'    => array(
                        'category',
                        'post_tag',),
    'menu_position' => 10,
    'exclude_from_search' => true,
    'menu_icon' => 'dashicons-groups',

  );
  register_post_type('community', $args);

}
// add_action('init', 'flush_rewrite_rules')
add_action('init', 'cl_ear_forum_post_type');
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
register_activation_hook( __FILE__, 'cl_ear_flush_rewrites' );

function cl_ear_flush_rewrites() {
	cl_ear_forum_post_type();
	flush_rewrite_rules();
}

/*======================================================
========== OBSOLETE
======================================================*/

function custom_community_page( $template ) {
  echo $template;
	if ( ! $template ) {
		$template = dirname( __FILE__ ) . '/templates/community-single.php';
	}

	return $template;
}
add_filter( "single-community_template", "custom_community_page" );

/*======================================================
========== POST FORM
======================================================*/

//Adding the form
function cl_ear_user_post(){
  $category_labels = array(
    'climate' => 'Climate',
    'plastics' => 'Plastics',
    'takeaction' => 'Take Action!',
    'projects' => 'Projects'
  );
  echo  '<button type="button" class="btn btn-primary clear-add-post-modal-btn" data-toggle="modal" data-target="#addPostModal"> Write a Post </button>
        <div class="modal fade" id="addPostModal" tabindex="-1" role="dialog" aria-labelledby="addPostModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content">
            <form method="post" action="" class="clear-add-user-post">
              <select name="category">';
              foreach($category_labels as $post_category){
                echo '<option value="'. $post_category .'">'. $post_category .'</option>';
              }
              echo'</select>
              <textarea rows="4" placeholder="Your Post goes Here" class="clear-text" name="content"></textarea>
              <input type="submit" name="cl_ear_submit_post" value="post"></form></div></div></div>';
}
add_shortcode('cl_ear_add_user_post','cl_ear_user_post');


/*======================================================
========== CATEGORY FILTERS
======================================================*/


function cl_ear_community_filters(){
  wp_enqueue_script('cl_ear_forum_filters');
  $categories = array(
    'climate',
    'plastics',
    'takeaction',
    'projects'
  );
  $category_labels = array(
    'climate' => 'Climate',
    'plastics' => 'Plastics',
    'takeaction' => 'Take Action!',
    'projects' => 'Projects'
  );
  $category_icons = array(
    'climate' => 'dashicons-admin-site-alt',
    'plastics' => 'dashicons-products',
    'takeaction' => 'dashicons-groups',
    'projects' => 'dashicons-admin-multisite'
  );

  echo '<div class="community-filter-container">';
  foreach($categories as $post_category){
    echo '<div class="community-filter '.$post_category.' ft-'.$post_category.' bd-'.$post_category.'">
      <span class="dashicons '.  $category_icons[$post_category].'"></span>
      <h3>'.$category_labels[$post_category].'</h3>
    </div>';
  }
  echo '</div>';
}
add_shortcode('cl_ear_community_filters', 'cl_ear_community_filters');


//Posting the post

function cl_ear_submit_post(){
  $user_id = get_current_user_id();
  $category_id = get_cat_ID(strip_tags($_POST['category']));
  $post_content = sanitize_textarea_field($_POST['content']);
  $post_title = substr($post_content, 0, 197);
  if ($post_title != '' && strlen($post_title) > 196) {
    $post_title = $post_title . '...';
  }
  //echo $category_id;
  $my_post = array(
  'post_title'    => $post_title,
  'post_content'  => $post_content,
  'post_status'   => 'publish',
  'post_author'   => $user_id,
  'post_type'     => 'community',
  'post_category' => array( $category_id )
  );
  wp_insert_post($my_post);
}
add_action( 'wp_head' , 'cl_ear_submit_post' );


/*======================================================
========== POST PAGE
======================================================*/


function cl_ear_community_post_page(){
  echo '<div id="community-posts-container">';
  echo cl_ear_list_posts();
  echo '</div>';
}
add_shortcode('cl_ear_community_post_page', 'cl_ear_community_post_page');

function cl_ear_list_posts($categories = ''){

	// The Query
  $current_page = get_query_var('paged');
	$args = array(
		'post_type' => 'community',
	  'category_name' => $categories,
    'paged' => $current_page
	);
	$the_query = new WP_Query( $args );
	// The Loop
if ( $the_query->have_posts() /*&& current_user_can('administrator')*/) {


	//=============================================
	//========== USER POST PREVIEW
	//=============================================

		while ( $the_query->have_posts() ) {
			$the_query->the_post();
	    $category = strtolower(get_the_category()[0]->name);
	    $category = preg_replace("/[^a-z]+/", "", $category);
	    echo  '<button class="community-post '. $category . ' bd-' . $category . '" data-toggle="modal" data-target="#post' . get_the_ID() . 'Modal">';
	    echo    '<h2 class="community-post-author">' . get_the_author() . '</h2>';
			//echo    '<h2 class="community-post-title">' . get_the_title() . '</h2>';
	    $post_content = explode("\n" , get_the_title());
	    foreach ($post_content as $paragraph) {
	      echo    '<p class="community-post-paragraph">' . $paragraph . '</p>';
	    }
	    echo get_comments_number() . '<span class="dashicons dashicons-format-chat"></span>';

	    echo  '</button>';


	//==============================================================
	//=========STANDARD COMMENT_FORM() $ARGS
	//=================================================================================================
	$comment_args = array(
		'walker'            => null,
		'max_depth'         => 4,
		'style'             => 'ul',
		'callback'          => null,
		'end-callback'      => null,
		'type'              => 'all',
		'reply_text'        => 'Reply',
		'page'              => '',
		'per_page'          => '',
		'avatar_size'       => 32,
		'reverse_top_level' => null,
		'reverse_children'  => '',
		'format'            => 'html5', // or 'xhtml' if no 'HTML5' theme support
		'short_ping'        => false,   // @since 3.6
		'echo'              => true     // boolean, default is true
	);
	$comment_form_args = array(
	'id_form'           => 'commentform',
	'class_form'      => 'comment-form',
	'id_submit'         => 'submit',
	'class_submit'      => 'submit',
	'name_submit'       => 'submit',
	'title_reply'       => __( 'Leave a Comment' ),
	'title_reply_to'    => __( 'Reply to %s' ),
	'cancel_reply_link' => __( 'Cancel Reply' ),
	'label_submit'      => __( 'Post Comment' ),
	'format'            => 'xhtml',

	'comment_field' =>  '<p class="comment-form-comment"><label for="comment">'  .
	'</label><textarea id="comment" name="comment" cols="50" rows="2" aria-required="true">' .
	'</textarea></p>',

	'must_log_in' => '<p class="must-log-in">' .
	sprintf(
		__( 'You must be <a href="%s">logged in</a> to post a comment.' ),
		wp_login_url( apply_filters( 'the_permalink', get_permalink() ) )
	) . '</p>',

	'logged_in_as' => '',

	'comment_notes_before' => '<p class="comment-notes">' .
	__( 'Your email address will not be published.' ) . ( $req ? $required_text : '' ) .
	'</p>',

	'fields' => apply_filters( 'comment_form_default_fields', $fields ),
	);

	//=============================================
	//========== USER POST MODAL
	//=============================================


  echo'<div class="modal post-modal fade" id="post' . get_the_ID() . 'Modal" tabindex="-1" role="dialog" aria-labelledby="post' . get_the_ID() . 'ModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content">
          <h2 class="community-post-author">' . get_the_author() . '</h2>
          <div>' . get_the_date() . '</div>';

          $post_content = explode("\n" , get_the_content());
          foreach ($post_content as $paragraph) {
            echo    '<p class="community-post-paragraph">' . $paragraph . '</p>';
          }
	echo '<ul>';
	 wp_list_comments($comment_args, get_comments(array('post_id' => get_the_ID())));
	echo '</ul>';
  echo '<div id="comment-form"> ';
    echo comment_form($comment_form_args, get_the_ID());
  echo '</div></div></div></div>';
  }
  echo paginate_links(array(
    'total' => $the_query->max_num_pages,
    'prev-text' => __("<<"),
    'next-text' => __(">>")
  ));
	/* Restore original Post Data */
	wp_reset_postdata();
  } else {
		// no posts found
	  echo do_shortcode('[vc_row][vc_column][vc_message]Thanks for coming by. We are still working on getting our community section to work. Baer with us while we\'re setting everything up for you.[/vc_message][/vc_column][/vc_row]');
	}
}


function filter_community_posts(){
  if(isset($_POST[category])){
    $category = $_POST[category];
    cl_ear_list_posts($category);
    die;
  }
}
add_action('wp_ajax_filter_community_posts', 'filter_community_posts');
add_action('wp_ajax_nopriv_filter_community_posts', 'filter_community_posts');
