'use strict';

var mailVerified = false;

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

jQuery('#login-form').validate({
    rules: {
        username: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 8,
            maxlength: 16
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
    submitHandler: function submitHandler(form) {
        form.submit();
    }
});

jQuery('#register-form-submit').on('click', function (e) {
    $('body').css('visibility', 'hidden');

    $('body').append('<h1>로딩중...</h1>');
});

jQuery('#register-form').validate({
    rules: {
        'register-form-last-name': {
            required: true,
            minlength: 1
        },
        'register-form-first-name': {
            required: true,
            minlength: 1
        },
        'register-form-email': {
            required: true,
            email: true
        },
        'register-form-address': {
            required: true
        },
        'register-form-additional-address': {
            required: true
        },
        'register-form-phone': {
            required: true,
            number: true
        },
        'register-form-password': {
            required: true,
            minlength: 8,
            maxlength: 16
        },
        'register-form-repassword': {
            required: true,
            equalTo: '#register-form-password',
            minlength: 8,
            maxlength: 16
        }
    },
    messages: {
        'register-form-last-name': {
            required: '성을 입력해 주세요',
            minlength: '최소 1자를 입력해주세요'
        },
        'register-form-first-name': {
            required: '이름을 입력해 주세요',
            minlength: '최소 1글자를 입력해주세요'
        },
        'register-form-email': {
            required: '이메일을 입력해주세요',
            email: '이메일 형식이 잘못되었습니다'
        },
        'register-form-address': {
            required: '주소찾기를 눌러주세요'
        },
        'register-form-additional-address': {
            required: '추가 주소를 입력해주세요'
        },
        'register-form-phone': {
            required: '전화번호를 입력해주세요',
            number: '숫자만 입력해주세요'
        },
        'register-form-password': {
            required: '비밀번호를 입력해주세요',
            minlength: '최소 8자를 입력해주세요',
            maxlength: '최대 16자를 입력해주세요'
        },
        'register-form-repassword': {
            required: '확인 비밀번호를 입력해주세요',
            equalTo: '같은 비밀번호를 입력해주세요',
            minlength: '최소 8자를 입력해주세요',
            maxlength: '최대 16자를 입력해주세요'
        }
    },
    submitHandler: function submitHandler(form) {
        // $('body').css('visibility', 'none');

        form.submit();

        //
        // console.log('sending')
        // $.post('/api/login/new', {
        //     lastName,
        //     firstName,
        //     email,
        //     address,
        //     additionalAddress,
        //     postCode,
        //     phoneNumber,
        //     password
        // }, function (result) {
        //     if(result.error){
        //         console.log('error')
        //     }else {
        //         console.log('account created')
        //     }
        // })
    }
});

function checkDuplicateEmail() {
    var emailToVerify = $('#register-form-email').val();

    jQuery.post('/api/login/new/verify', {
        email: emailToVerify
    }, function (result) {
        if (result.exists) {
            window.alert('이미 존재하는 ID입니다');
        } else {
            window.alert('사용 가능한 ID입니다');
        }
    });
}

// let mailVerified = false;
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
// jQuery('#login-form').validate({
//     rules: {
//         username:{
//             required: true,
//             email: true
//         },
//         password:{
//             required:true,
//             minlength: 8,
//             maxlength: 16,
//         }
//     },
//     messages: {
//         username: {
//             required: '정확한 이메일 주소를 입력해주세요',
//             email: '이메일 형식이 잘못되었습니다'
//         },
//         password: {
//             required: '비밀번호를 입력해주세요',
//             minlength: '최소 8글자를 입력해주세요',
//             maxlength: '최대 16글자를 입력해주세요'
//         }
//     },
//     submitHandler: function (form) {
//         form.submit();
//     }
// });
//
// jQuery('#register-form-submit').on('click', function (e) {
//     $('body').css('visibility', 'hidden')
//
//     $('body').append('<h1>로딩중...</h1>')
// });
//
// jQuery('#register-form').validate({
//     rules: {
//         'register-form-last-name':{
//             required:true,
//             minlength:1
//         },
//         'register-form-first-name': {
//             required:true,
//             minlength:1,
//         },
//         'register-form-email': {
//             required:true,
//             email:true
//         },
//         'register-form-address': {
//             required:true
//         },
//         'register-form-additional-address': {
//             required:true,
//         },
//         'register-form-phone':{
//             required:true,
//             number:true
//         },
//         'register-form-password': {
//             required:true,
//             minlength:8,
//             maxlength:16
//         },
//         'register-form-repassword':{
//             required:true,
//             equalTo:'#register-form-password',
//             minlength:8,
//             maxlength:16
//         }
//     },
//     messages: {
//         'register-form-last-name': {
//             required: '성을 입력해 주세요',
//             minlength: '최소 1자를 입력해주세요'
//         },
//         'register-form-first-name': {
//             required: '이름을 입력해 주세요',
//             minlength: '최소 1글자를 입력해주세요',
//         },
//         'register-form-email': {
//             required: '이메일을 입력해주세요',
//             email: '이메일 형식이 잘못되었습니다'
//         },
//         'register-form-address': {
//             required:'주소찾기를 눌러주세요'
//         },
//         'register-form-additional-address': {
//             required:'추가 주소를 입력해주세요',
//         },
//         'register-form-phone':{
//             required:'전화번호를 입력해주세요',
//             number:'숫자만 입력해주세요'
//         },
//         'register-form-password': {
//             required:'비밀번호를 입력해주세요',
//             minlength:'최소 8자를 입력해주세요',
//             maxlength:'최대 16자를 입력해주세요'
//         },
//         'register-form-repassword':{
//             required:'확인 비밀번호를 입력해주세요',
//             equalTo:'같은 비밀번호를 입력해주세요',
//             minlength:'최소 8자를 입력해주세요',
//             maxlength:'최대 16자를 입력해주세요'
//         }
//     },
//     submitHandler: function (form) {
//         // $('body').css('visibility', 'none');
//
//         form.submit();
//
//         //
//         // console.log('sending')
//         // $.post('/api/login/new', {
//         //     lastName,
//         //     firstName,
//         //     email,
//         //     address,
//         //     additionalAddress,
//         //     postCode,
//         //     phoneNumber,
//         //     password
//         // }, function (result) {
//         //     if(result.error){
//         //         console.log('error')
//         //     }else {
//         //         console.log('account created')
//         //     }
//         // })
//     }
// });
//
// function checkDuplicateEmail() {
//     let emailToVerify = $('#register-form-email').val();
//
//     jQuery.post('/api/login/new/verify', {
//         email: emailToVerify
//     }, function (result) {
//         if(result.exists){
//             window.alert('이미 존재하는 ID입니다')
//         }else {
//             window.alert('사용 가능한 ID입니다')
//         }
//     })
// }