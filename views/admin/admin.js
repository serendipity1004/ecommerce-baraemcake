jQuery(document).ready(function ($) {
    // $('.save-btn').click(function (e) {
    //     e.preventDefault();
    //
    //     let name = $(this).parent().find('.name').val();
    //     let overviewComments = $(this).parent().find('.overview-comments').val();
    //     let detailedDescription = $(this).parent().find('.detailed-description').val();
    //     let id = $(this).siblings('.product-id').val();
    //     let quantity = $(this).parent().find('.quantity').val();
    //     let weight = $(this).parent().find('.weight').val();
    //
    //     let additionalInfo = {quantity, weight};
    //
    //     console.log(name);
    //
    //     let productDetails =
    //         {
    //             id: id,
    //             productDetails:
    //                 {
    //                     name, overviewComments, detailedDescription, additionalInfo
    //                 }
    //         };
    //
    //     console.log(productDetails)
    //
    //     $.post('/api/shop/details/update', productDetails, function (data) {
    //         console.log(data)
    //     })
    // })
    let datatableOptions = {
        data:
            {
                type: 'remote',
                source:
                    {
                        read:
                            {
                                url: '/api/admin/orders'
                            }
                    },
                pageSize: 10,
                saveState: {
                    cookie: true,
                    webstorage: true
                },

                serverPaging: false,
                serverFiltering: false,
                serverSorting: false
            },
        columns:
            [
                {
                    field: 'details',
                    title: '상세보기',
                    sortable: false
                },
                {
                    field:'_id',
                    title:'DB ID',
                    sortable:true,
                },
                {
                    field: 'email',
                    title: '구매자',
                    sortable: true,
                },
                {
                    field: 'senderName',
                    title: '보내는 사람',
                    sortable: true,
                },
                {
                    field: 'receiverName',
                    title: '받는 사람',
                    sortable: true,
                },
                {
                    field: 'paymentAmount',
                    title: '결제 금액',
                    sortable: true
                },
                {
                    field:'delivered',
                    title:'배송 여부',
                    sortalbe: true,
                }
            ],
        layout: {
            theme: 'default',
            class: 'm-datatable--brand',
            scroll: false,
            height: null,
            footer: false,
            header: true,

            smoothScroll: {
                scrollbarShown: true
            },

            spinner: {
                overlayColor: '#000000',
                opacity: 0,
                type: 'loader',
                state: 'brand',
                message: true
            },

            icons: {
                sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
                pagination: {
                    next: 'la la-angle-right',
                    prev: 'la la-angle-left',
                    first: 'la la-angle-double-left',
                    last: 'la la-angle-double-right',
                    more: 'la la-ellipsis-h'
                },
                rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'}
            }
        },

        sortable: true,

        pagination: true,

        searchDelay: 400,

        detail: {
            title: 'Load sub table',
            content: function (e) {
                // e.data
                // e.detailCell
                let table = e.detailCell;
                let data = e.data;

                console.log(e)

                for(let i = 0; i < data.length; i ++){
                    $(table).append(`<div class="col-sm-3">${data[i]}</div>`)
                }
            }
        },
        toolbar: {
            layout: ['pagination', 'info'],

            placement: ['bottom'],  //'top', 'bottom'

            items: {
                pagination: {
                    type: 'default',

                    pages: {
                        desktop: {
                            layout: 'default',
                            pagesNumber: 6
                        },
                        tablet: {
                            layout: 'default',
                            pagesNumber: 3
                        },
                        mobile: {
                            layout: 'compact'
                        }
                    },

                    navigation: {
                        prev: true,
                        next: true,
                        first: true,
                        last: true
                    },

                    pageSizeSelect: [10, 20, 30, 50, 100]
                },

                info: true
            }
        },
        translate: {
        records: {
            processing: '로딩중...',
                noRecords: '데이터가 없습니다'
        },
        toolbar: {
            pagination: {
                items: {
                default: {
                        first: 'First',
                            prev: 'Previous',
                            next: 'Next',
                            last: 'Last',
                            more: 'More pages',
                            input: 'Page number',
                            select: 'Select page size'
                    },
                    info: '현재 페이지 : {{start}} - {{end}} & 전체 : {{total}}'
                }
            }
        }
    }
    };

    let datatable = $('#order-datatable').mDatatable(datatableOptions)
});