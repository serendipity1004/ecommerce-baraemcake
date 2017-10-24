jQuery(document).ready(function ($) {

    // let table = $('#order-datatable').DataTable({
    //     "ajax": {
    //         url:"/orders",
    //         "dataType":'json'
    //     }
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
                    field: 'checkbox',
                    title: '선택',
                    sortable: false,
                    selector: {class: 'm-checkbox--solid'}
                },
                {
                    field:'paidAt',
                    title:'구매 날짜',
                    sortable:true,
                },
                {
                    field: '_id',
                    title: 'DB ID',
                    sortable: true,
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
                    field: 'delivered',
                    title: '배송 여부',
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
                // let table = e.detailCell;
                // let data = e.data;
                //
                // console.log(e)
                //
                // for(let i = 0; i < data.length; i ++){
                //     $(table).append(`<div class="col-sm-3">${data[i]}</div>`)
                // }
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

    let datatable = $('#order-datatable').mDatatable(datatableOptions);

    $('#order-datatable').on('click', 'tr.m-datatable__row', function (e) {
        if($(this).parent().is('thead')){

        }else{
            let id = $(this).find('td[data-field="_id"]').text();

            let detailsTable = $(this).closest('tr').next('tr').find('.m-datatable__detail');

            $.post('/api/admin/order/details', {id}, function (returnedData) {
                $(detailsTable).empty();
                let template = createDetailRowDom(returnedData.result);
                $(detailsTable).append(template);
            })
        }
    });

    datatable.on('m-datatable--on-update-perpage', function (e, args) {
        console.log('event')
        $('td[data-field="delivered"]').each(function (index, item) {
            console.log('event trigger')
            console.log(item)
            let spanInside = $(item).find('span');
            if ($(spanInside).text().trim() === 'false') {
                $(spanInside).addClass('label label-danger')
            } else {
                $(spanInside).addClass('label label-info')
            }
        });
    });

    function createDetailRowDom(data) {
        let keys = Object.keys(data);
        let dictionary =
            {
                _id: 'DB ID',
                senderName: '보내는 사람',
                paymentAmount: '결제 금액',
                receiverName: '받는 사람',
                searchAddress: '주소',
                additionalAddress: '상세 주소',
                email: '이메일',
                phoneNumber: '전화번호',
                postCode: '우편번호'
            };
        let template = '';

        for (let i = 0; i < keys.length; i++) {
            let curKey = keys[i];
            if (curKey === 'products') {
                let products = data[keys[i]];
                template += `<table class="table"><thead><td>제품명</td><td>갯수</td></thead><tbody>`;

                for (let j = 0; j < products.length; j++) {
                    template += '<tr>'
                    let curItem = products[j];

                    template += `<td>${curItem.name}</td><td>${curItem.quantity}</td>`
                    template += '</tr>'
                }

                template += '</tbody></table>'

            } else {
                template += `<strong>${dictionary[keys[i]]} : </strong>${data[keys[i]]}<br/>`
            }
        }
        return template
    }

    $('#delivery-done').click(function (e) {
        e.preventDefault();

        let deliveredArray = [];

        $('#order-datatable input:checkbox').each(function (index, item) {
            let template = {};
            if ($(item).is(':checked')) {
                let id = $(item).parents('td').siblings('td[data-field="_id"]').text();

                console.log(id)

                deliveredArray.push(id);
            }
        });

        $.post('/api/admin/order/update/status', {ids : deliveredArray, status:'delivered'}, function (returnedData) {
            location.href = '/admin'
        })


        // console.log(datatable.getSelectedRecords());
    });

    $('#delivery-pending').click(function (e) {
        e.preventDefault();

        let deliveredArray = [];

        $('#order-datatable input:checkbox').each(function (index, item) {
            let template = {};
            if ($(item).is(':checked')) {
                let id = $(item).parents('td').siblings('td[data-field="_id"]').text();

                // console.log(id)

                deliveredArray.push(id);
            }
        });

        $.post('/api/admin/order/update/status', {ids : deliveredArray, status:'pending'}, function (returnedData) {
            location.href = '/admin'
        })


        // console.log(datatable.getSelectedRecords());
    })
});