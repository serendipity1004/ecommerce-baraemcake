jQuery('.add-to-cart').click(function (e) {
    e.preventDefault();

    let target = jQuery(this).parent().parent();

    target.addClass('running');

    let clickedBtn = jQuery(this);
    clickedBtn.attr('disabled', true);

    let curProduct = jQuery(this).siblings('.product-id').val();

    jQuery.post('/api/shop/cart/add', {
        itemId: curProduct,
        itemQuantity: 1
    }, function (result) {
        setTimeout(function () {
            clickedBtn.attr('disabled',false);
            target.removeClass('running')
        }, 500);
    })
});

// var tpj = jQuery;
// tpj.noConflict();
//
// tpj(document).ready(function () {
//
//     var apiRevoSlider = tpj('#rev_slider_ishop').show().revolution(
//         {
//             sliderType: "standard",
//             jsFileLocation: "include/rs-plugin/js/",
//             sliderLayout: "fullwidth",
//             dottedOverlay: "none",
//             delay: 9000,
//             navigation: {},
//             responsiveLevels: [1200, 992, 768, 480, 320],
//             gridwidth: 1140,
//             gridheight: 500,
//             lazyType: "none",
//             shadow: 0,
//             spinner: "off",
//             autoHeight: "off",
//             disableProgressBar: "on",
//             hideThumbsOnMobile: "off",
//             hideSliderAtLimit: 0,
//             hideCaptionAtLimit: 0,
//             hideAllCaptionAtLilmit: 0,
//             debugMode: false,
//             fallbacks: {
//                 simplifyAll: "off",
//                 disableFocusListener: false,
//             },
//             navigation: {
//                 keyboardNavigation: "off",
//                 keyboard_direction: "horizontal",
//                 mouseScrollNavigation: "off",
//                 onHoverStop: "off",
//                 touch: {
//                     touchenabled: "on",
//                     swipe_threshold: 75,
//                     swipe_min_touches: 1,
//                     swipe_direction: "horizontal",
//                     drag_block_vertical: false
//                 },
//                 arrows: {
//                     style: "ares",
//                     enable: true,
//                     hide_onmobile: false,
//                     hide_onleave: false,
//                     tmp: '<div class="tp-title-wrap">	<span class="tp-arr-titleholder">{{title}}</span> </div>',
//                     left: {
//                         h_align: "left",
//                         v_align: "center",
//                         h_offset: 10,
//                         v_offset: 0
//                     },
//                     right: {
//                         h_align: "right",
//                         v_align: "center",
//                         h_offset: 10,
//                         v_offset: 0
//                     }
//                 }
//             }
//         });
//
//     apiRevoSlider.bind("revolution.slide.onloaded", function (e) {
//         SEMICOLON.slider.sliderParallaxDimensions();
//     });
//
// }); //ready
jQuery('#top-banner').click(function () {
    jQuery('html, body').animate({
        scrollTop: jQuery(jQuery(this).attr('href')).offset().top
    }, 500);
    return false;
});
if (/Mobi/.test(navigator.userAgent)) {
    jQuery('#why-baraem-header').text('바램떡이여야만 하는 이유 맛있으니까');
    jQuery('#top-typed').text('맛있으니까 바램떡이다');
}else{
    let typed = new Typed('#why-baraem-header', {
        strings:['바램떡 이여야만 하는 이유', '맛있으니까 ^200'],
        typeSpeed:100,
        backSpeed:50,
        loop:true,
        showCursor:false,
        backDelay:1500
    });

    let topTyped = new Typed('#top-typed', {
        strings:['맛있으니까 바램떡이다'],
        typeSpeed:100,
        backSpeed:50,
        loop:true,
        showCursor:false,
        backDelay:1500
    });
}


// jQuery(document).ready(function ($) {
//     $('#why-baraem-header').textillate({in:{effect:'rollIn'}})
// });