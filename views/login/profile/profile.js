jQuery(document).ready(function ($) {

    let table = $('#payment-info-datatable').DataTable({
        "ajax": "/api/login/profile/get/orders",
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "data": "_id" },
            { "data": "senderName" },
            { "data": "receiverName" },
            { "data": "searchAddress" },
            { "data": "delivered" },
        ],
        "order": [[1, 'asc']]
    });

    $('#payment-info-datatable tbody').on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = table.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

    function format ( d ) {
        // `d` is the original data object for the row
        let primaryTable = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
            '<td>보내는 사람 :</td>'+
            '<td>'+d.senderName+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>받는 사람:</td>'+
            '<td>'+d.receiverName+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>배송지:</td>'+
            '<td>'+d.searchAddress + d.additionalAddress + d.postCode+'</td>'+
            '</tr>'+
            '</table>';
        let products = d.products;

        primaryTable += '<table class="table">';

        for(let i = 0; i < products.length; i ++) {
            let curProduct = products[i];

            primaryTable += '<tr>' +
            '<td>'+ curProduct.name +'</td>' +
            '<td>'+ curProduct.quantity +'</td>' +
            '</tr>'
        }

        primaryTable += '</table>';

        return primaryTable

    }

    // $('#payment-info-datatable tbody').on('click', 'td.details-control', function () {
    //     let tr = $(this).closest('tr');
    //     let row = table.row( tr );
    //
    //     if ( row.child.isShown() ) {
    //         // This row is already open - close it
    //         row.child.hide();
    //         tr.removeClass('shown');
    //     }
    //     else {
    //         // Open this row
    //         row.child( format(row.data()) ).show();
    //         tr.addClass('shown');
    //     }
    // } );
    //
    // function format ( d ) {
    //     // `d` is the original data object for the row
    //     return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
    //         '<tr>'+
    //         '<td>Full name:</td>'+
    //         '<td>'+d.name+'</td>'+
    //         '</tr>'+
    //         '<tr>'+
    //         '<td>Extension number:</td>'+
    //         '<td>'+d.extn+'</td>'+
    //         '</tr>'+
    //         '<tr>'+
    //         '<td>Extra info:</td>'+
    //         '<td>And any further details here (images etc)...</td>'+
    //         '</tr>'+
    //         '</table>';
    // }

});