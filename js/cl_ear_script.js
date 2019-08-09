// Universal touch event to fix .onclick() incompatibilities on iOS

//let touchEvent = 'click';

jQuery(function($){

pushModalsToTop();
/*FIX MOBILE MENU OFFSET*/
$("#main") . prepend('<div id="mobile-menu-spacer" class="d-lg-none" style="width: 100%; z-index:5000;"><div>');
matchHeaderHeight();
function matchHeaderHeight(){
  $("#mobile-menu-spacer") . height($( '#masthead' ) . height());
}
/**/
$( "textarea#comment"  ) . css( 'min-height' , 'none');
});
function pushModalsToTop(){jQuery(".modal") . prependTo( jQuery( "body" ));}
