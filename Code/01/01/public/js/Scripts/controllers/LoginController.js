var loginController = {
    checkLogin: function (userName, password, type) {
        $.ajax({
            url: '/login/CheckLogin',
            type: 'Post',
            data: {
                userName: userName,
				password: password,
				type: type
            },
            dataType: 'json',
            success: function (response) {
				if (response.status =='false')
				{
					if (type == 0) {
						$.notify({
							icon: 'fas fa-exclamation-triangle',
							message: "Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại!"
						},
							{
								type: "danger",
								z_index: 8000
							});
					}
					if (type == 1) {
						FB.logout();
						$.notify({
							icon: 'fas fa-exclamation-triangle',
							message: "Tài khoản của bạn chưa được đăng ký! Vui lòng kiểm tra lại!"
						},
							{
								type: "danger",
								z_index: 8000
							});
					}
					if (type == 2) {
						signOut();
						$.notify({
							icon: 'fas fa-exclamation-triangle',
							message: "Tài khoản của bạn chưa được đăng ký! Vui lòng kiểm tra lại!"
						},
							{
								type: "danger",
								z_index: 8000
							});
					}
				}
				if (response.status == 'error') {
					$.notify({
						icon: 'fas fa-exclamation-triangle',
						message: "Đã xảy ra lỗi! Vui lòng kiểm tra lại!"

					},
						{
							type: "danger",
							z_index: 8000
						});
				}
				if (response.status == 'true') {
					location.href = response.redirect;
				}
            }
        });
    }
};
$(document).ready(function () {
    $('#frm-login').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        $(form).validate({
            rules: {
                "userName": {
                    required: true
                },
                "password": {
                    required: true
                }
            },
            messages: {
                "userName": {
                    required: "Vui lòng nhập tài khoản!"
                },
                "password": {
                    required: "Vui lòng nhập mật khẩu!"
                }
            }
        });
        if (!form.valid()) {
            return false;
        }
		else{
            var userName = $('#userName').val().trim();
            var password = $('#password').val().trim();
            password = md5(password);
		}
		loginController.checkLogin(userName, password, 0);
	});
	///FB Auth
	$('.fa-facebook-square').off('click').on('click', function () {
		FB.getLoginStatus(function (response) {
			if (response.status == 'not_authorized' || response.status == 'unknown') {
				FB.login(response => {
					loginController.checkLogin(md5(response.authResponse.userID), md5(response.authResponse.userID), 1);
				}, { scope: 'public_profile,email' });
			}
			else {
				FB.logout();
				FB.login(response => {
					loginController.checkLogin(md5(response.authResponse.userID), md5(response.authResponse.userID), 1);
				}, { scope: 'public_profile,email' });
			}
		});
	});
	$('#btnDangKy').off('click').on('click', function () {
		location.href = '/DangKy';
	});
});

///Google Auth
function attachSignin(element) {
	auth2.attachClickHandler(element, {},
		function (googleUser) {
			var profile = googleUser.getBasicProfile();
			loginController.checkLogin(md5(profile.getId()), md5(profile.getId()), 2);
		}, function (error) {
		});
}
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}
