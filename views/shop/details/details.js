'use strict';

jQuery(document).ready(function ($) {
    $('.quantity-btn').click(function (e) {
        e.preventDefault();
        var curQuantity = $('#quantity-number').val();

        if ($(this).hasClass('minus') && curQuantity > 1) {
            $('#quantity-number').val(parseInt(curQuantity) - 1);
        } else if ($(this).hasClass('plus')) {
            $('#quantity-number').val(parseInt(curQuantity) + 1);
        }
    });

    $('#update-cart-btn').click(function (e) {
        e.preventDefault();

        var prodId = $('#product-id').val();
        var prodQuantity = $('#quantity-number').val();

        var clickedBtn = $(this);
        clickedBtn.attr('disabled', true);
        var target = $(clickedBtn);
        $(target).addClass('running');

        $.post('/api/shop/cart/add', {
            itemId: prodId,
            itemQuantity: prodQuantity
        }, function (result) {
            setTimeout(function () {
                clickedBtn.attr('disabled', false);
                $(target).removeClass('running');
            }, 1000);
        });
    });
});
// jQuery(document).ready(function ($) {
//     $('.quantity-btn').click(function (e) {
//         e.preventDefault();
//         let curQuantity = $('#quantity-number').val();
//
//         if($(this).hasClass('minus') && curQuantity > 1){
//             $('#quantity-number').val(parseInt(curQuantity) - 1)
//         }else if($(this).hasClass('plus')) {
//             $('#quantity-number').val(parseInt(curQuantity) + 1)
//         }
//     });
//
//     $('#update-cart-btn').click(function (e) {
//         e.preventDefault();
//
//         let prodId = $('#product-id').val();
//         let prodQuantity = $('#quantity-number').val();
//
//         let clickedBtn = $(this);
//         clickedBtn.attr('disabled', true);
//         let target = $(clickedBtn);
//         $(target).addClass('running');
//
//         $.post('/api/shop/cart/add', {
//             itemId:prodId,
//             itemQuantity:prodQuantity
//         }, function (result) {
//             setTimeout(function () {
//                 clickedBtn.attr('disabled', false);
//                 $(target).removeClass('running')
//             }, 1000)
//         })
//     });
// });
//
