jQuery(document).ready(function ($) {
    $('#top-login').validate({
        rules: {
            username:{
                required: true,
                email: true
            },
            password:{
                required:true,
                minlength: 8,
                maxlength: 16,
            }
        },
        messages: {
            username: {
                required: '정확한 이메일 주소를 입력해주세요',
                email: '이메일 형식이 잘못되었습니다'
            },
            password: {
                required: '비밀번호를 입력해주세요',
                minlength: '최소 8글자를 입력해주세요',
                maxlength: '최대 16글자를 입력해주세요'
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });

    $('#header-logout-btn').click(function (e) {
        e.preventDefault();

        $.post('/login/logout', {

        }, function (result) {
            location.href = '/'
        })
    });

    // $('#header-cart-btn').click(function (e) {
    //     e.preventDefault();
    //
    //     location.href = '/shop/cart'
    // })
});