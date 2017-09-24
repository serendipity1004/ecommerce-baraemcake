jQuery(document).ready(function ($) {
    $('.save-btn').click(function (e) {
        e.preventDefault();

        let name = $(this).parent().find('.name').val();
        let overviewComments = $(this).parent().find('.overview-comments').val();
        let detailedDescription = $(this).parent().find('.detailed-description').val();
        let id = $(this).siblings('.product-id').val();

        console.log(name);

        let productDetails =
            {
                id: id,
                productDetails:
                    {
                        name, overviewComments, detailedDescription
                    }
            };


        $.post('/api/shop/details/update', productDetails, function (data) {
            console.log(data)
        })
    })
});