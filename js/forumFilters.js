jQuery(function($){
//Define the right event to fix incompatibilities with onCLick on Chrome for iOS devices
let cl_ear_touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

const ajaxUrl = "https://cleaner.earth" + "/wp-admin/admin-ajax.php";
let categoryLabels = {
  'Climate': 'climate',
  'Plastics': 'plastics',
  'Take Action!': 'takeaction',
  'Projects': 'projects'
};
let activeCategories = [];


$( '.community-filter' ).on(cl_ear_touchEvent ,function(e){
  let filterCategory = categoryLabels[$('h3', this).text()];
  if(e.ctrlKey){
    $(this).toggleClass('active');
    toggleCategory(filterCategory);
  }else{
    if ((activeCategories.length == 1 && activeCategories[0] == filterCategory)) {
      flushClass();
      activeCategories = [];
    } else {
      flushClass();
      activeCategories = [ filterCategory ];
      $( this ).addClass('active');
    }
  }

//Post the AJAX request to the Server
  $.post(
    ajaxUrl,
    {
      action: 'filter_community_posts',
      category: activeCategories.join()
    },
    function(data){
      data = $.parseHTML(data);
      flushPostModals();
      //Add Posts to the dom
      $( '#community-posts-container' ) . empty() . append(data);
      pushModalsToTop();
    });
});

//Toggle active Categories
function toggleCategory(cat){
  if (activeCategories.includes(cat)){
    activeCategories = activeCategories.filter(function(active){
      return active != cat;
    })
  }else{
    activeCategories.push(cat);
  }
}
//Remove all post modals to keep them from accumulating at the top of the DOM
function flushPostModals(){
  existingModals = $('body>.post-modal');
  existingModals.each(function(oldModal){
    $(this).remove();
  });
}
//Remove .active CSS class from all community filter elements
function flushClass(){
  $( '.community-filter' ) . removeClass( 'active' );
}

});
