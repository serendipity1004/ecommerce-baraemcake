jQuery(document).ready(function ($) {

    $('.left-icon').click(function (e) {
        console.log('clicked')
        e.preventDefault();

        let clickedBtn = $(this);
        clickedBtn.attr('disabled', true);

        let curProduct = $(this).siblings('.product-id').val();
        let target = $(this).parent().parent();
        target.addClass('running');

        $.post('/api/shop/cart/add', {
            itemId: curProduct,
            itemQuantity:1
        }, function (result) {
            setTimeout(function () {
                clickedBtn.attr('disabled', false);
                target.removeClass('running')
            }, 500)
        })
    })
});