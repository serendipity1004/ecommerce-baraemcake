jQuery(document).ready(function ($) {
    $('.quantity-btn').click(function (e) {
        e.preventDefault();
        let curQuantity = $('#quantity-number').val();

        if($(this).hasClass('minus') && curQuantity > 1){
            $('#quantity-number').val(parseInt(curQuantity) - 1)
        }else if($(this).hasClass('plus')) {
            $('#quantity-number').val(parseInt(curQuantity) + 1)
        }
    });

    $('#update-cart-btn').click(function (e) {
        e.preventDefault();

        let prodId = $('#product-id').val();
        let prodQuantity = $('#quantity-number').val();

        $.post('/api/shop/cart/add', {
            itemId:prodId,
            itemQuantity:prodQuantity
        }, function (result) {
            console.log(result)
        })
    });
});

