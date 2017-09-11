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
        oncomplete: function(data) {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = data.address; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 기본 주소가 도로명 타입일때 조합한다.
            if(data.addressType === 'R'){
                //법정동명이 있을 경우 추가한다.
                if(data.bname !== ''){
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if(data.buildingName !== ''){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
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
        onresize : function(size) {
            element_wrap.style.height = size.height+'px';
        },
        width : '100%',
        height : '100%'
    }).embed(element_wrap);

    // iframe을 넣은 element를 보이게 한다.
    element_wrap.style.display = 'block';
}

var IMP = window.IMP; // 생략가능
IMP.init('imp95847967'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용

$('#pay-test-btn').click(function (e) {
    e.preventDefault();

    IMP.request_pay({
        pg : 'danal', // version 1.1.0부터 지원.
        pay_method : 'card',
        merchant_uid : 'merchant_' + new Date().getTime(),
        name : '주문명:결제테스트',
        amount : 14000,
        buyer_email : 'iamport@siot.do',
        buyer_name : '구매자이름',
        buyer_tel : '010-1234-5678',
        buyer_addr : '서울특별시 강남구 삼성동',
        buyer_postcode : '123-456',
        m_redirect_url : 'https://www.yourdomain.com/payments/complete'
    }, function(rsp) {
        if ( rsp.success ) {
            var msg = '결제가 완료되었습니다.';
            msg += '고유ID : ' + rsp.imp_uid;
            msg += '상점 거래ID : ' + rsp.merchant_uid;
            msg += '결제 금액 : ' + rsp.paid_amount;
            msg += '카드 승인번호 : ' + rsp.apply_num;
        } else {
            var msg = '결제에 실패하였습니다.';
            msg += '에러내용 : ' + rsp.error_msg;
        }
        alert(msg);
    });
})

jQuery('#billing-form').validate({
    rules: {
        'last-name':{
            required: true,
            minlength:1
        },
        'first-name':{
            required:true,
            minlength:1
        },
        'register-form-address':{
            required:true,
        },
        'register-form-additional-address':{
            required:true,
        },
        'email':{
            required:true,
            email:true
        },
        'phone-number': {
            required:true,
            number:true
        }
    },
    messages: {
        'last-name':{
            required: '성을 입력해주세요',
            minlength:'최소 1자를 입력해주세요'
        },
        'first-name':{
            required:'이름을 입력해주세요',
            minlength:'최소 1자를 입력해주세요'
        },
        'register-form-address':{
            required:'주소를 입력해주세요',
        },
        'register-form-additional-address':{
            required:'추가 주소를 입력해주세요',
        },
        'email':{
            required:'이메일을 입력해주세요',
            email:'올바른 이메일 형식을 입력해주세요'
        },
        'phone-number': {
            required:'전화번호를 입력해주세요',
            number:'숫자만 입력해주세요'
        }
    },
    submitHandler: function (form) {
        form.submit();
    }
});
