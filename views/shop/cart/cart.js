jQuery(document).ready(function ($) {
    $("#processTabs").tabs({show: {effect: "fade", duration: 400}});
    $(".tab-linker").click(function () {
        $("#processTabs").tabs("option", "active", $(this).attr('rel') - 1);
        return false;
    });
    $('.cart-product-quantity').on('click', '.quantity-btn', function () {
        let quantity = $(this).siblings('#quantity');
        if ($(this).hasClass('minus') && quantity.val() > 1) {
            quantity.val(parseInt(quantity.val()) - 1)
        } else if ($(this).hasClass('plus')) {
            quantity.val(parseInt(quantity.val()) + 1)
        }

        let productPrice = $(this).parents('.cart-product-quantity').siblings('.cart-product-price').find('.amount');
        let subtotal = $(this).parents('.cart-product-quantity').siblings('.cart-product-subtotal').find('.amount');

        subtotal.text(parseInt(quantity.val()) * parseInt(productPrice.text()))
    });

    $('.cart-product-remove').on('click', '.remove', function (e) {
        e.preventDefault();
        $(this).attr('disabled', true);

        let productId = $(this).parents('.cart_item').find('.product-id').val();

        console.log(productId)

        $(this).parents('.cart_item').fadeTo('slow', 0, function () {
            $(this).remove();
        });

        $.post('/api/shop/cart/remove_product', {productId}, function (sessionCart) {
            console.log('done')
            console.log(sessionCart)

        });
    });
});