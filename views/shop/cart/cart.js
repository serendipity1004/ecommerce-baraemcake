"use strict";

jQuery(document).ready(function ($) {
    updateTotal();

    $("#processTabs").tabs({ show: { effect: "fade", duration: 400 } });
    $(".tab-linker").click(function () {
        $("#processTabs").tabs("option", "active", $(this).attr('rel') - 1);
        return false;
    });
    $('.cart-product-quantity').on('click', '.quantity-btn', function () {
        var quantity = $(this).siblings('.qty');
        var parentThis = this;
        if ($(this).hasClass('minus') && quantity.val() > 1) {
            $.post('/api/shop/cart/add', {
                itemId: $(this).parent().parent().parent().find('.product-id').val(),
                itemQuantity: -1
            }, function (returnData) {
                quantity.val(parseInt(quantity.val()) - 1);
                var productPrice = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-price').find('.amount');
                var subtotal = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-subtotal').find('.amount');

                subtotal.text(parseInt(quantity.val()) * parseInt(productPrice.text()));

                updateTotal();
            });
        } else if ($(this).hasClass('plus')) {
            $.post('/api/shop/cart/add', {
                itemId: $(this).parent().parent().parent().find('.product-id').val(),
                itemQuantity: 1
            }, function (returnData) {
                quantity.val(parseInt(quantity.val()) + 1);
                var productPrice = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-price').find('.amount');
                var subtotal = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-subtotal').find('.amount');

                console.log(subtotal);
                subtotal.text(parseInt(quantity.val()) * parseInt(productPrice.text()));

                updateTotal();
            });
        }
    });

    $('#use-point-btn').click(function (e) {
        e.preventDefault();

        var inputPoints = parseInt($('#input-points-to-use').val());
        var ownedPoints = parseInt($('#owned-points').text());

        if (inputPoints > ownedPoints) {
            alert('보유하신 포인트보다 많은 포인트를 입력하셨습니다.');
        } else {
            $('.points-to-use').text($('#input-points-to-use').val());
        }

        updateTotal();
    });

    function updateTotal() {
        var total = 0;
        var count = 0;
        $('.cart_item').each(function (index, item) {
            var price = $(item).find('.total-price-each-item').text();
            // console.log(price)

            total += parseInt(price);
            count++;
        });

        if (count < 1) {
            $('.final-pay-amount').text(0);
            $('.delivery-fee').text(0);
            return;
        }

        if (parseInt(total) > 35000) {
            $('.delivery-fee').text(0);
        } else {
            $('.delivery-fee').text(3000);
        }

        total += parseInt($('.delivery-fee').text());

        $('.final-pay-amount').text(total - parseInt($('.points-to-use').text()));
    }

    $('.cart-product-remove').on('click', '.remove', function (e) {
        e.preventDefault();
        $(this).attr('disabled', true);

        var productId = $(this).parents('.cart_item').find('.product-id').val();

        console.log(productId);

        $(this).parents('.cart_item').fadeTo('slow', 0, function () {
            $(this).remove();
            updateTotal();
        });

        $.post('/api/shop/cart/remove_product', { productId: productId }, function (sessionCart) {
            console.log('done');
            console.log(sessionCart);
            // setTimeout(function () {
            //     updateTotal()
            // }, 1000)
        });
    });
});

// 우편번호 찾기 찾기 화면을 넣을 element
var element_wrap = document.getElementById('wrap');

function foldDaumPostcode() {
    // iframe을 넣은 element를 안보이게 한다.
    element_wrap.style.display = 'none';
}

function sample3_execDaumPostcode() {
    // 현재 scroll 위치를 저장해놓는다.
    var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    new daum.Postcode({
        oncomplete: function oncomplete(data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = data.address; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 기본 주소가 도로명 타입일때 조합한다.
            if (data.addressType === 'R') {
                //법정동명이 있을 경우 추가한다.
                if (data.bname !== '') {
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if (data.buildingName !== '') {
                    extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += extraAddr !== '' ? ' (' + extraAddr + ')' : '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('register-form-post-code').value = data.zonecode; //5자리 새우편번호 사용
            document.getElementById('register-form-address').value = fullAddr;

            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            element_wrap.style.display = 'none';

            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll;
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function onresize(size) {
            element_wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%'
    }).embed(element_wrap);

    // iframe을 넣은 element를 보이게 한다.
    element_wrap.style.display = 'block';
}

var IMP = window.IMP; // 생략가능
IMP.init('imp46274458'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용

$('.payment-anchor-kakao').click(function (e) {
    e.preventDefault();

    var pointsUsed = parseInt($('.points-to-use').text());
    var receiverName = $('#last-name-receiver').val().trim() + $('#first-name-sender').val().trim();
    var searchAddress = $('#register-form-address').val();
    var additionalAddress = $('#register-form-additional-address').val();
    var postCode = $('#register-form-post-code').val();
    var email = $('#email').val();
    var phoneNumber = $('#phone-number').val();
    var deliveryFee = $('.delivery-fee').text();
    var paymentMethod = 'kakao';
    var senderName = $('#last-name-sender').val().trim() + $('#first-name-sender').val().trim();

    $.post('/api/shop/cart/req_payment_info', {
        pointsUsed: pointsUsed,
        receiverName: receiverName,
        searchAddress: searchAddress,
        additionalAddress: additionalAddress,
        email: email,
        phoneNumber: phoneNumber,
        deliveryFee: deliveryFee,
        postCode: postCode
    }, function (paymentInfo) {
        IMP.request_pay({
            pg: 'kakao', // version 1.1.0부터 지원.
            pay_method: 'card',
            merchant_uid: new Date().getTime(),
            name: '주문',
            // amount:1000,
            amount: parseInt(paymentInfo.totalPrice),
            buyer_email: paymentInfo.buyer_email,
            buyer_name: paymentInfo.buyer_name,
            buyer_tel: paymentInfo.buyer_tel,
            buyer_addr: paymentInfo.buyer_addr,
            buyer_postcode: paymentInfo.buyer_postcode,
            m_redirect_url : 'localhost:3000/shop/cart/paid',
        }, function (rsp) {
            if (rsp.success) {
                console.log('rsp');
                var msg = '결제가 완료되었습니다.';
                msg += '고유ID : ' + rsp.imp_uid;
                msg += '상점 거래ID : ' + rsp.merchant_uid;
                msg += '결제 금액 : ' + rsp.paid_amount;
                msg += '카드 승인번호 : ' + rsp.apply_num;

                $.post('/api/shop/cart/payment_success', {
                    senderName: senderName,
                    paymentMethod: paymentMethod,
                    merchantId: rsp.merchant_uid,
                    paidAmount: rsp.paid_amount,
                    impId: rsp.imp_uid,
                    paymentId: rsp.apply_num,
                    pointsUsed: pointsUsed,
                    receiverName: receiverName,
                    searchAddress: searchAddress,
                    additionalAddress: additionalAddress,
                    email: email,
                    phoneNumber: phoneNumber,
                    deliveryFee: deliveryFee,
                    postCode: postCode
                }, function (returnResult) {
                    console.log('last return');
                    location.href = "/shop/cart/paid/?id=" + returnResult.paymentInfoId;
                });
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
                window.alert(msg);
            }
        });
    });
});

$('.payment-anchor-naver').click(function (e) {
    e.preventDefault();

    // $.post('/api/shop/cart/request_payment_info/naver', {}, function (paymentInfo) {});
    //
    // IMP.request_pay({
    //     pg: 'naverco',
    //     pay_method: 'card', //연동되지 않습니다. 네이버페이 결제창 내에서 결제수단을 구매자가 직접 선택하게 됩니다.
    //     merchant_uid: 'merchant_' + new Date().getTime(), //상점에서 관리하시는 고유 주문번호를 전달
    //     name: '주문명:결제테스트',
    //     amount: 14000,
    //     buyer_email: 'iamport@siot.do',
    //     buyer_name: '구매자이름',
    //     buyer_tel: '010-1234-5678', //누락되면 이니시스 결제창에서 오류
    //     buyer_addr: '서울특별시 강남구 삼성동',
    //     buyer_postcode: '123-456',
    //     naverProducts: [{
    //         id: "singleProductId",
    //         name: "네이버페이 상품1",
    //         basePrice: 1000,
    //         taxType: 'FREE', //TAX or FREE
    //         quantity: 2,
    //         infoUrl: "http://www.iamport.kr/product/detail",
    //         imageUrl: "http://www.iamport.kr/product/detail/thumbnail",
    //         shipping: {
    //             groupId: "",
    //             method: "DELIVERY", //DELIVERY(택배·소포·등기), QUICK_SVC(퀵 서비스), DIRECT_DELIVERY(직접 전달), VISIT_RECEIPT(방문 수령), NOTHING(배송 없음)
    //             baseFee: 0,
    //             feeType: "FREE", //FREE(무료), CHARGE(유료), CONDITIONAL_FREE(조건부 무료), CHARGE_BY_QUANTITY(수량별 부과)
    //             feePayType: "FREE" //FREE(무료), PREPAYED(선불), CASH_ON_DELIVERY(착불)
    //         }
    //     }, {
    //         id: "optionProductId",
    //         name: "네이버페이 상품2",
    //         basePrice: 1000,
    //         taxType: 'FREE', //TAX or FREE
    //         infoUrl: "http://www.iamport.kr/product/detail",
    //         imageUrl: "http://www.iamport.kr/product/detail/thumbnail",
    //         options: [//네이버페이 상품2에 대해서 빨강-170mm사이즈 3개와 빨강-180mm사이즈 2개: 총 5개 구매
    //             {
    //                 optionQuantity: 3,
    //                 optionPrice: 100,
    //                 selectionCode: "R_�M",
    //                 selections: [{
    //                     code: "RED",
    //                     label: "색상",
    //                     value: "빨강"
    //                 }, {
    //                     code: "170",
    //                     label: "사이즈",
    //                     value: "170"
    //                 }]
    //             }, {
    //                 optionQuantity: 2,
    //                 optionPrice: 200,
    //                 selectionCode: "R_L",
    //                 selections: [{
    //                     code: "RED",
    //                     label: "색상",
    //                     value: "빨강"
    //                 }, {
    //                     code: "180",
    //                     label: "사이즈",
    //                     value: "180"
    //                 }]
    //             }],
    //         shipping: {
    //             groupId: "",
    //             method: "DELIVERY", //DELIVERY(택배·소포·등기), QUICK_SVC(퀵 서비스), DIRECT_DELIVERY(직접 전달), VISIT_RECEIPT(방문 수령), NOTHING(배송 없음)
    //             baseFee: 3000,
    //             feeType: "FREE", //FREE(무료), CHARGE(유료), CONDITIONAL_FREE(조건부 무료), CHARGE_BY_QUANTITY(수량별 부과)
    //             feePayType: "FREE" //FREE(무료), PREPAYED(선불), CASH_ON_DELIVERY(착불)
    //         }
    //     }]
    // });
});

$('.payment-anchor-card').click(function (e) {
    e.preventDefault();

    var pointsUsed = parseInt($('.points-to-use').text());
    var receiverName = $('#last-name-receiver').val().trim() + $('#first-name-sender').val().trim();
    var searchAddress = $('#register-form-address').val();
    var additionalAddress = $('#register-form-additional-address').val();
    var postCode = $('#register-form-post-code').val();
    var email = $('#email').val();
    var phoneNumber = $('#phone-number').val();
    var deliveryFee = $('.delivery-fee').text();
    var paymentMethod = 'card';
    var senderName = $('#last-name-sender').val().trim() + $('#first-name-sender').val().trim();

    $.post('/api/shop/cart/req_payment_info', { pointsUsed: pointsUsed,
        receiverName: receiverName,
        searchAddress: searchAddress,
        additionalAddress: additionalAddress,
        email: email,
        phoneNumber: phoneNumber,
        deliveryFee: deliveryFee,
        postCode: postCode
    }, function (paymentInfo) {
        IMP.request_pay({
            pg: 'danal_tpay', // version 1.1.0부터 지원.
            pay_method: 'card',
            merchant_uid: new Date().getTime(),
            name: '주문',
            amount: parseInt(paymentInfo.totalPrice),
            buyer_email: paymentInfo.buyer_email,
            buyer_name: paymentInfo.buyer_name,
            buyer_tel: paymentInfo.buyer_tel,
            buyer_addr: paymentInfo.buyer_addr,
            buyer_postcode: paymentInfo.buyer_postcode,
            m_redirect_url : 'localhost:3000/shop/cart/paid',
        }, function (rsp) {
            if (rsp.success) {
                $.post('/api/shop/cart/payment_success', {
                    senderName: senderName,
                    paymentMethod: paymentMethod,
                    merchantId: rsp.merchant_uid,
                    paidAmount: rsp.paid_amount,
                    impId: rsp.imp_uid,
                    paymentId: rsp.apply_num,
                    pointsUsed: pointsUsed,
                    receiverName: receiverName,
                    searchAddress: searchAddress,
                    additionalAddress: additionalAddress,
                    email: email,
                    phoneNumber: phoneNumber,
                    deliveryFee: deliveryFee,
                    postCode: postCode
                }, function (returnResult) {
                    console.log('last return');
                    location.href = "/shop/cart/paid/?id=" + returnResult.paymentInfoId;
                });
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
                window.alert(msg);
            }
        });
    });
});

$('.payment-anchor-phone').click(function (e) {
    e.preventDefault();

    var pointsUsed = parseInt($('.points-to-use').text());
    var receiverName = $('#last-name-receiver').val().trim() + $('#first-name-sender').val().trim();
    var searchAddress = $('#register-form-address').val();
    var additionalAddress = $('#register-form-additional-address').val();
    var postCode = $('#register-form-post-code').val();
    var email = $('#email').val();
    var phoneNumber = $('#phone-number').val();
    var deliveryFee = $('.delivery-fee').text();
    var paymentMethod = 'phone';
    var senderName = $('#last-name-sender').val().trim() + $('#first-name-sender').val().trim();

    $.post('/api/shop/cart/req_payment_info', { pointsUsed: pointsUsed,
        receiverName: receiverName,
        searchAddress: searchAddress,
        additionalAddress: additionalAddress,
        email: email,
        phoneNumber: phoneNumber,
        deliveryFee: deliveryFee,
        postCode: postCode
    }, function (paymentInfo) {
        IMP.request_pay({
            pg: 'danal', // version 1.1.0부터 지원.
            pay_method: 'phone',
            merchant_uid: new Date().getTime(),
            name: '주문',
            amount: parseInt(paymentInfo.totalPrice),
            buyer_email: paymentInfo.buyer_email,
            buyer_name: paymentInfo.buyer_name,
            buyer_tel: paymentInfo.buyer_tel,
            buyer_addr: paymentInfo.buyer_addr,
            buyer_postcode: paymentInfo.buyer_postcode,
            m_redirect_url : 'localhost:3000/shop/cart/paid',
        }, function (rsp) {
            if (rsp.success) {
                $.post('/api/shop/cart/payment_success', {
                    senderName: senderName,
                    paymentMethod: paymentMethod,
                    merchantId: rsp.merchant_uid,
                    paidAmount: rsp.paid_amount,
                    impId: rsp.imp_uid,
                    paymentId: rsp.apply_num,
                    pointsUsed: pointsUsed,
                    receiverName: receiverName,
                    searchAddress: searchAddress,
                    additionalAddress: additionalAddress,
                    email: email,
                    phoneNumber: phoneNumber,
                    deliveryFee: deliveryFee,
                    postCode: postCode
                }, function (returnResult) {
                    console.log('last return');
                    location.href = "/shop/cart/paid/?id=" + returnResult.paymentInfoId;
                });
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
                window.alert(msg);
            }
        });
    });
});

jQuery('#billing-form').validate({
    rules: {
        'last-name': {
            required: true,
            minlength: 1
        },
        'first-name': {
            required: true,
            minlength: 1
        },
        'register-form-address': {
            required: true
        },
        'register-form-additional-address': {
            required: true
        },
        'email': {
            required: true,
            email: true
        },
        'phone-number': {
            required: true,
            number: true
        }
    },
    messages: {
        'last-name': {
            required: '성을 입력해주세요',
            minlength: '최소 1자를 입력해주세요'
        },
        'first-name': {
            required: '이름을 입력해주세요',
            minlength: '최소 1자를 입력해주세요'
        },
        'register-form-address': {
            required: '주소를 입력해주세요'
        },
        'register-form-additional-address': {
            required: '추가 주소를 입력해주세요'
        },
        'email': {
            required: '이메일을 입력해주세요',
            email: '올바른 이메일 형식을 입력해주세요'
        },
        'phone-number': {
            required: '전화번호를 입력해주세요',
            number: '숫자만 입력해주세요'
        }
    },
    submitHandler: function submitHandler(form) {
        form.submit();
    }
});

// jQuery(document).ready(function ($) {
//     updateTotal();
//
//     $("#processTabs").tabs({show: {effect: "fade", duration: 400}});
//     $(".tab-linker").click(function () {
//         $("#processTabs").tabs("option", "active", $(this).attr('rel') - 1);
//         return false;
//     });
//     $('.cart-product-quantity').on('click', '.quantity-btn', function () {
//         let quantity = $(this).siblings('.qty');
//         let parentThis = this;
//         if ($(this).hasClass('minus') && quantity.val() > 1) {
//             $.post('/api/shop/cart/add', {
//                 itemId:$(this).parent().parent().parent().find('.product-id').val(),
//                 itemQuantity:-1,
//             }, function (returnData) {
//                 quantity.val(parseInt(quantity.val()) - 1)
//                 let productPrice = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-price').find('.amount');
//                 let subtotal = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-subtotal').find('.amount');
//
//                 subtotal.text(parseInt(quantity.val()) * parseInt(productPrice.text()))
//
//                 updateTotal()
//             });
//         } else if ($(this).hasClass('plus')) {
//             $.post('/api/shop/cart/add', {
//                 itemId:$(this).parent().parent().parent().find('.product-id').val(),
//                 itemQuantity:1,
//             }, function (returnData) {
//                 quantity.val(parseInt(quantity.val()) + 1)
//                 let productPrice = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-price').find('.amount');
//                 let subtotal = $(parentThis).parents('.cart-product-quantity').siblings('.cart-product-subtotal').find('.amount');
//
//                 console.log(subtotal)
//                 subtotal.text(parseInt(quantity.val()) * parseInt(productPrice.text()))
//
//                 updateTotal()
//             });
//         }
//     });
//
//     $('#use-point-btn').click(function (e) {
//         e.preventDefault();
//
//         let inputPoints = parseInt($('#input-points-to-use').val());
//         let ownedPoints = parseInt($('#owned-points').text());
//
//         if(inputPoints > ownedPoints){
//             window.alert('보유하신 포인트보다 많은 포인트를 입력하셨습니다.')
//         }else {
//             $('.points-to-use').text($('#input-points-to-use').val())
//         }
//
//         updateTotal()
//     });
//
//     function updateTotal() {
//         let total = 0;
//         let count = 0;
//         $('.cart_item').each(function (index, item) {
//             let price = $(item).find('.total-price-each-item').text();
//             // console.log(price)
//
//             total += parseInt(price);
//             count ++;
//         });
//
//         if(count < 1){
//             $('.final-pay-amount').text(0);
//             $('.delivery-fee').text(0);
//             return;
//         }
//
//         if(parseInt(total) > 35000){
//             $('.delivery-fee').text(0)
//
//         }else {
//             $('.delivery-fee').text(3000)
//         }
//
//         total += parseInt($('.delivery-fee').text());
//
//         $('.final-pay-amount').text(total - parseInt($('.points-to-use').text()))
//     }
//
//     $('.cart-product-remove').on('click', '.remove', function (e) {
//         e.preventDefault();
//         $(this).attr('disabled', true);
//
//         let productId = $(this).parents('.cart_item').find('.product-id').val();
//
//         console.log(productId)
//
//         $(this).parents('.cart_item').fadeTo('slow', 0, function () {
//             $(this).remove();
//             updateTotal()
//
//         });
//
//         $.post('/api/shop/cart/remove_product', {productId}, function (sessionCart) {
//             console.log('done')
//             console.log(sessionCart)
//             // setTimeout(function () {
//             //     updateTotal()
//             // }, 1000)
//         });
//     });
// });
//
// // 우편번호 찾기 찾기 화면을 넣을 element
// var element_wrap = document.getElementById('wrap');
//
// function foldDaumPostcode() {
//     // iframe을 넣은 element를 안보이게 한다.
//     element_wrap.style.display = 'none';
// }
//
// function sample3_execDaumPostcode() {
//     // 현재 scroll 위치를 저장해놓는다.
//     var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
//     new daum.Postcode({
//         oncomplete: function(data) {
//             // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
//
//             // 각 주소의 노출 규칙에 따라 주소를 조합한다.
//             // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
//             var fullAddr = data.address; // 최종 주소 변수
//             var extraAddr = ''; // 조합형 주소 변수
//
//             // 기본 주소가 도로명 타입일때 조합한다.
//             if(data.addressType === 'R'){
//                 //법정동명이 있을 경우 추가한다.
//                 if(data.bname !== ''){
//                     extraAddr += data.bname;
//                 }
//                 // 건물명이 있을 경우 추가한다.
//                 if(data.buildingName !== ''){
//                     extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
//                 }
//                 // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
//                 fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
//             }
//
//             // 우편번호와 주소 정보를 해당 필드에 넣는다.
//             document.getElementById('register-form-post-code').value = data.zonecode; //5자리 새우편번호 사용
//             document.getElementById('register-form-address').value = fullAddr;
//
//             // iframe을 넣은 element를 안보이게 한다.
//             // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
//             element_wrap.style.display = 'none';
//
//             // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
//             document.body.scrollTop = currentScroll;
//         },
//         // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
//         onresize : function(size) {
//             element_wrap.style.height = size.height+'px';
//         },
//         width : '100%',
//         height : '100%'
//     }).embed(element_wrap);
//
//     // iframe을 넣은 element를 보이게 한다.
//     element_wrap.style.display = 'block';
// }
//
// var IMP = window.IMP; // 생략가능
// IMP.init('imp46274458'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
//
// $('.payment-anchor-kakao').click(function (e) {
//     e.preventDefault();
//
//     let pointsUsed = parseInt($('.points-to-use').text());
//     let receiverName = $('#last-name-receiver').val().trim() + $('#first-name-sender').val().trim();
//     let searchAddress = $('#register-form-address').val();
//     let additionalAddress = $('#register-form-additional-address').val();
//     let postCode = $('#register-form-post-code').val();
//     let email = $('#email').val();
//     let phoneNumber = $('#phone-number').val();
//     let deliveryFee = $('.delivery-fee').text();
//     let paymentMethod = 'kakao';
//     let senderName = $('#last-name-sender').val().trim() + $('#first-name-sender').val().trim();
//
//     $.post('/api/shop/cart/req_payment_info', {
//         pointsUsed,
//         receiverName,
//         searchAddress,
//         additionalAddress,
//         email,
//         phoneNumber,
//         deliveryFee,
//         postCode
//     }, function (paymentInfo) {
//         IMP.request_pay({
//             pg : 'kakao', // version 1.1.0부터 지원.
//             pay_method : 'card',
//             merchant_uid : new Date().getTime(),
//             name : '주문',
//             // amount:1000,
//             amount : parseInt(paymentInfo.totalPrice),
//             buyer_email : paymentInfo.buyer_email,
//             buyer_name : paymentInfo.buyer_name,
//             buyer_tel : paymentInfo.buyer_tel,
//             buyer_addr : paymentInfo.buyer_addr,
//             buyer_postcode : paymentInfo.buyer_postcode,
//             // m_redirect_url : `localhost:3000/shop/cart/paid`,
//         }, function(rsp) {
//             if ( rsp.success ) {
//                 console.log('rsp')
//                 var msg = '결제가 완료되었습니다.';
//                 msg += '고유ID : ' + rsp.imp_uid;
//                 msg += '상점 거래ID : ' + rsp.merchant_uid;
//                 msg += '결제 금액 : ' + rsp.paid_amount;
//                 msg += '카드 승인번호 : ' + rsp.apply_num;
//
//                 $.post('/api/shop/cart/payment_success', {
//                     senderName:senderName,
//                     paymentMethod:paymentMethod,
//                     merchantId:rsp.merchant_uid,
//                     paidAmount:rsp.paid_amount,
//                     impId:rsp.imp_uid,
//                     paymentId:rsp.apply_num,
//                     pointsUsed: pointsUsed,
//                     receiverName:receiverName,
//                     searchAddress:searchAddress,
//                     additionalAddress:additionalAddress,
//                     email:email,
//                     phoneNumber:phoneNumber,
//                     deliveryFee:deliveryFee,
//                     postCode:postCode
//                 }, function (returnResult) {
//                     console.log('last return');
//                     location.href = `/shop/cart/paid/?id=${returnResult.paymentInfoId}`
//                 })
//             } else {
//                 var msg = '결제에 실패하였습니다.';
//                 msg += '에러내용 : ' + rsp.error_msg;
//                 window.alert(msg);
//
//             }
//         });
//     });
// });
//
// $('.payment-anchor-naver').click(function (e) {
//     e.preventDefault();
//
//     $.post('/api/shop/cart/request_payment_info/naver', {}, function (paymentInfo) {
//
//     });
//
//     IMP.request_pay({
//         pg : 'naverco',
//         pay_method : 'card', //연동되지 않습니다. 네이버페이 결제창 내에서 결제수단을 구매자가 직접 선택하게 됩니다.
//         merchant_uid : 'merchant_' + new Date().getTime(), //상점에서 관리하시는 고유 주문번호를 전달
//         name : '주문명:결제테스트',
//         amount : 14000,
//         buyer_email : 'iamport@siot.do',
//         buyer_name : '구매자이름',
//         buyer_tel : '010-1234-5678', //누락되면 이니시스 결제창에서 오류
//         buyer_addr : '서울특별시 강남구 삼성동',
//         buyer_postcode : '123-456',
//         naverProducts : [
//             {
//                 id : "singleProductId",
//                 name : "네이버페이 상품1",
//                 basePrice : 1000,
//                 taxType : 'FREE', //TAX or FREE
//                 quantity : 2,
//                 infoUrl : "http://www.iamport.kr/product/detail",
//                 imageUrl : "http://www.iamport.kr/product/detail/thumbnail",
//                 shipping : {
//                     groupId : "",
//                     method : "DELIVERY", //DELIVERY(택배·소포·등기), QUICK_SVC(퀵 서비스), DIRECT_DELIVERY(직접 전달), VISIT_RECEIPT(방문 수령), NOTHING(배송 없음)
//                     baseFee : 0,
//                     feeType : "FREE", //FREE(무료), CHARGE(유료), CONDITIONAL_FREE(조건부 무료), CHARGE_BY_QUANTITY(수량별 부과)
//                     feePayType : "FREE" //FREE(무료), PREPAYED(선불), CASH_ON_DELIVERY(착불)
//                 }
//             },
//             {
//                 id : "optionProductId",
//                 name : "네이버페이 상품2",
//                 basePrice : 1000,
//                 taxType : 'FREE', //TAX or FREE
//                 infoUrl : "http://www.iamport.kr/product/detail",
//                 imageUrl : "http://www.iamport.kr/product/detail/thumbnail",
//                 options : [ //네이버페이 상품2에 대해서 빨강-170mm사이즈 3개와 빨강-180mm사이즈 2개: 총 5개 구매
//                     {
//                         optionQuantity : 3,
//                         optionPrice : 100,
//                         selectionCode : "R_�M",
//                         selections : [
//                             {
//                                 code : "RED",
//                                 label : "색상",
//                                 value : "빨강"
//                             },
//                             {
//                                 code : "170",
//                                 label : "사이즈",
//                                 value : "170"
//                             }
//                         ]
//                     },
//                     {
//                         optionQuantity : 2,
//                         optionPrice : 200,
//                         selectionCode : "R_L",
//                         selections : [
//                             {
//                                 code : "RED",
//                                 label : "색상",
//                                 value : "빨강"
//                             },
//                             {
//                                 code : "180",
//                                 label : "사이즈",
//                                 value : "180"
//                             }
//                         ]
//                     }
//                 ],
//                 shipping : {
//                     groupId : "",
//                     method : "DELIVERY", //DELIVERY(택배·소포·등기), QUICK_SVC(퀵 서비스), DIRECT_DELIVERY(직접 전달), VISIT_RECEIPT(방문 수령), NOTHING(배송 없음)
//                     baseFee : 3000,
//                     feeType : "FREE", //FREE(무료), CHARGE(유료), CONDITIONAL_FREE(조건부 무료), CHARGE_BY_QUANTITY(수량별 부과)
//                     feePayType : "FREE" //FREE(무료), PREPAYED(선불), CASH_ON_DELIVERY(착불)
//                 }
//             }
//         ]
//     });
// });
//
// $('.payment-anchor-card').click(function (e) {
//     e.preventDefault();
//
//     let pointsUsed = parseInt($('.points-to-use').text());
//     let receiverName = $('#last-name-receiver').val().trim() + $('#first-name-sender').val().trim();
//     let searchAddress = $('#register-form-address').val();
//     let additionalAddress = $('#register-form-additional-address').val();
//     let postCode = $('#register-form-post-code').val();
//     let email = $('#email').val();
//     let phoneNumber = $('#phone-number').val();
//     let deliveryFee = $('.delivery-fee').text();
//     let paymentMethod = 'card';
//     let senderName = $('#last-name-sender').val().trim() + $('#first-name-sender').val().trim();
//
//     $.post('/api/shop/cart/req_payment_info', {pointsUsed,
//         receiverName,
//         searchAddress,
//         additionalAddress,
//         email,
//         phoneNumber,
//         deliveryFee,
//         postCode
//     }, function (paymentInfo) {
//         IMP.request_pay({
//             pg : 'danal_tpay', // version 1.1.0부터 지원.
//             pay_method : 'card',
//             merchant_uid : new Date().getTime(),
//             name : '주문',
//             amount : parseInt(paymentInfo.totalPrice),
//             buyer_email : paymentInfo.buyer_email,
//             buyer_name : paymentInfo.buyer_name,
//             buyer_tel : paymentInfo.buyer_tel,
//             buyer_addr : paymentInfo.buyer_addr,
//             buyer_postcode : paymentInfo.buyer_postcode,
//             // m_redirect_url : `localhost:3000/shop/cart/paid`,
//         }, function(rsp) {
//             if ( rsp.success ) {
//                 $.post('/api/shop/cart/payment_success', {
//                     senderName:senderName,
//                     paymentMethod:paymentMethod,
//                     merchantId:rsp.merchant_uid,
//                     paidAmount:rsp.paid_amount,
//                     impId:rsp.imp_uid,
//                     paymentId:rsp.apply_num,
//                     pointsUsed: pointsUsed,
//                     receiverName:receiverName,
//                     searchAddress:searchAddress,
//                     additionalAddress:additionalAddress,
//                     email:email,
//                     phoneNumber:phoneNumber,
//                     deliveryFee:deliveryFee,
//                     postCode:postCode
//                 }, function (returnResult) {
//                     console.log('last return');
//                     location.href = `/shop/cart/paid/?id=${returnResult.paymentInfoId}`
//                 })
//             } else {
//                 var msg = '결제에 실패하였습니다.';
//                 msg += '에러내용 : ' + rsp.error_msg;
//                 window.alert(msg);
//             }
//         });
//     });
// });
//
// $('.payment-anchor-phone').click(function (e) {
//     e.preventDefault();
//
//     let pointsUsed = parseInt($('.points-to-use').text());
//     let receiverName = $('#last-name-receiver').val().trim() + $('#first-name-sender').val().trim();
//     let searchAddress = $('#register-form-address').val();
//     let additionalAddress = $('#register-form-additional-address').val();
//     let postCode = $('#register-form-post-code').val();
//     let email = $('#email').val();
//     let phoneNumber = $('#phone-number').val();
//     let deliveryFee = $('.delivery-fee').text();
//     let paymentMethod = 'phone';
//     let senderName = $('#last-name-sender').val().trim() + $('#first-name-sender').val().trim();
//
//     $.post('/api/shop/cart/req_payment_info', {pointsUsed,
//         receiverName,
//         searchAddress,
//         additionalAddress,
//         email,
//         phoneNumber,
//         deliveryFee,
//         postCode
//     }, function (paymentInfo) {
//         IMP.request_pay({
//             pg : 'danal', // version 1.1.0부터 지원.
//             pay_method : 'phone',
//             merchant_uid : new Date().getTime(),
//             name : '주문',
//             amount : parseInt(paymentInfo.totalPrice),
//             buyer_email : paymentInfo.buyer_email,
//             buyer_name : paymentInfo.buyer_name,
//             buyer_tel : paymentInfo.buyer_tel,
//             buyer_addr : paymentInfo.buyer_addr,
//             buyer_postcode : paymentInfo.buyer_postcode,
//             // m_redirect_url : `localhost:3000/shop/cart/paid`,
//         }, function(rsp) {
//             if ( rsp.success ) {
//                 $.post('/api/shop/cart/payment_success', {
//                     senderName:senderName,
//                     paymentMethod:paymentMethod,
//                     merchantId:rsp.merchant_uid,
//                     paidAmount:rsp.paid_amount,
//                     impId:rsp.imp_uid,
//                     paymentId:rsp.apply_num,
//                     pointsUsed: pointsUsed,
//                     receiverName:receiverName,
//                     searchAddress:searchAddress,
//                     additionalAddress:additionalAddress,
//                     email:email,
//                     phoneNumber:phoneNumber,
//                     deliveryFee:deliveryFee,
//                     postCode:postCode
//                 }, function (returnResult) {
//                     console.log('last return');
//                     location.href = `/shop/cart/paid/?id=${returnResult.paymentInfoId}`
//                 })
//             } else {
//                 var msg = '결제에 실패하였습니다.';
//                 msg += '에러내용 : ' + rsp.error_msg;
//                 window.alert(msg);
//             }
//         });
//     });
// });
//
// jQuery('#billing-form').validate({
//     rules: {
//         'last-name':{
//             required: true,
//             minlength:1
//         },
//         'first-name':{
//             required:true,
//             minlength:1
//         },
//         'register-form-address':{
//             required:true,
//         },
//         'register-form-additional-address':{
//             required:true,
//         },
//         'email':{
//             required:true,
//             email:true
//         },
//         'phone-number': {
//             required:true,
//             number:true
//         }
//     },
//     messages: {
//         'last-name':{
//             required: '성을 입력해주세요',
//             minlength:'최소 1자를 입력해주세요'
//         },
//         'first-name':{
//             required:'이름을 입력해주세요',
//             minlength:'최소 1자를 입력해주세요'
//         },
//         'register-form-address':{
//             required:'주소를 입력해주세요',
//         },
//         'register-form-additional-address':{
//             required:'추가 주소를 입력해주세요',
//         },
//         'email':{
//             required:'이메일을 입력해주세요',
//             email:'올바른 이메일 형식을 입력해주세요'
//         },
//         'phone-number': {
//             required:'전화번호를 입력해주세요',
//             number:'숫자만 입력해주세요'
//         }
//     },
//     submitHandler: function (form) {
//         form.submit();
//     }
// });
