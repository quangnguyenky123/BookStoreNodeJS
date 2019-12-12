var email;
var userNameSignUp;
var passwordSignUp;
var Type;

$(document).ready(function () {
	$('#btnDangNhap').off('click').on('click', function () {
		location.href = "/Login";
	});
	$('#frm-sign-up').submit(function (e) {
		e.preventDefault();
		var form = $(this);
		$(form).validate({
			rules: {
				"userName": {
					required: true,
					maxlength: 20,
					minlength: 8 
				},
				"password": {
					required: true,
					minlength: 8
				},
				"comparePassword": {
					required: true,
				}
			},
			messages: {
				"userName": {
					required: "Vui lòng nhập tài khoản!",
					minlength: "Tài khoản phải có ít nhất 8 ký tự!",
					maxlength: "Tài khoản phải ít hơn 20 ký tự!"
				},
				"password": {
					required: "Vui lòng nhập mật khẩu!",
					minlength: "Mật khẩu phải ít nhất 8 kí tự!"
				},
				"comparePassword": {
					required: "Vui lòng nhập mật khẩu!"
				}
			}
		});
		if (!form.valid()) {
			return false;
		}
		else {
			var userName = $('#userName').val().trim();
			var password = $('#password').val().trim();
			var comparePassword = $('#comparePassword').val().trim();
			if (password != comparePassword) {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Mật khẩu nhập lại không đúng! Vui lòng kiểm tra lại!"
				},
					{
						type: "danger",
						z_index: 8000

					});
				return false;
			}
			else {
				userNameSignUp = userName;
				passwordSignUp = md5(password);
				CheckUserName(userName, 0);
			}
		}
	});
	$('.fa-facebook-square').off('click').on('click', function () {
		FB.getLoginStatus(function (response) {
			console.log(response.status);
			if (response.status == 'not_authorized' || response.status == 'unknown') {
				FB.login(response => {
					userNameSignUp = md5(response.authResponse.userID);
					passwordSignUp = md5(response.authResponse.userID);
					CheckUserName(md5(response.authResponse.userID), 1);
					//loginController.checkLogin(response.authResponse.userID, md5(response.authResponse.accessToken), false);
				}, { scope: 'public_profile,email' });
			}
			else {
				FB.logout();
				FB.login(response => {
					userNameSignUp = md5(response.authResponse.userID);
					passwordSignUp = md5(response.authResponse.userID);
					CheckUserName(md5(response.authResponse.userID), 1);
					//loginController.checkLogin(response.authResponse.userID, md5(response.authResponse.accessToken), false);
				}, { scope: 'public_profile,email' });
			}
		});
	});
	 $('#frm-info').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        $(form).validate({
            rules: {
                "txt-username": {
                    required: true
                },
                "txt-address": {
                    required: true
                },
                "txt-email": {
                    required: true,
                    email: true
                },
                "txt-phone": {
                    required: true,
                    digits: true
                }
            },
            messages: {
                "txt-username": {
                    required: "Vui lòng nhập tên!"
                },
                "txt-address": {
                    required: "Vui lòng nhập địa chỉ!"
                },
                "txt-email": {
                    required: "Vui lòng nhập email!",
                    email: "Vui lòng nhập đúng email!"
                },
                "txt-phone": {
                    required: "Vui lòng nhập số điện thoại!",
                    digits: "Vui lòng nhập đúng số điện thoại!"
                }
            }
        });
        if (!form.valid()) {
            return false;
        }
        else {
			var TenQuanTriVien = $('#txt-username').val();
			var Email = $('#txt-email').val();
            var DiaChi = $('#txt-address').val();
            var SoDienThoai = $('#txt-phone').val();
            //var formData = new FormData();
				//TenTaiKhoan: userNameSignUp,
				//MatKhau: passwordSignUp,
				//TenQuanTriVien: TenQuanTriVien,
				//Email: Email,
    //            DiaChi: DiaChi,
				//SoDienThoai: SoDienThoai,
				//Type: Type
            //formData.append("Customer", JSON.stringify(customer));
			//formData.append("Order", localStorage.getItem("cart"));
			DangKy(userNameSignUp,
				passwordSignUp,
				TenQuanTriVien,
				Email,
				DiaChi,
				SoDienThoai,
				Type);
        }
    });
});
///GOOGLE auth
function attachSignin(element) {
	console.log(element.id);
	auth2.attachClickHandler(element, {},
		function (googleUser) {
			var profile = googleUser.getBasicProfile();
			email = profile.getEmail();
			userNameSignUp = md5(profile.getId());
			passwordSignUp = md5(profile.getId());
			//console.log("ID: " + profile.getId()); // Don't send this directly to your server!
			//console.log('Full Name: ' + profile.getName());
			//console.log('Given Name: ' + profile.getGivenName());
			//console.log('Family Name: ' + profile.getFamilyName());
			//console.log("Image URL: " + profile.getImageUrl());
			//console.log("Email: " + profile.getEmail());
			//var id_token = googleUser.getAuthResponse().id_token;
			//console.log("ID Token: " + id_token);
			//loginController.checkLogin(md5(profile.getId()), md5(googleUser.getAuthResponse().id_token), 2);
			CheckUserName(md5(profile.getId()),2);
		}, function (error) {
			alert(JSON.stringify(error, undefined, 2));
		});
}
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

//Kiểm tra tên tài khoản đã tồn tại chưa.
var CheckUserName = function (userName, type) {
	$.post("/DangKy/CheckUserName", { userName: userName, type: type }, function (response) {
		if (response.status == true) {
			Type = type;// phân biệt loại tài khoản đăng nhập
			if (type == 2) {
				$('#txt-email').val(email);
				document.getElementById("txt-email").disabled = true;
			}
			$('#user-infor-modal').modal('show');
		}
		if (response.status == false) {
			userNameSignUp = '';
			passwordSignUp = '';
			if (type == 1) {
				FB.logout();
			}
			if (type == 2) {
				signOut();
			}
			$.notify({
				icon: 'fas fa-exclamation-triangle',
				message: "Tên tài khoản đã tồn tại! Vui lòng kiểm tra lại!"
			},
				{
					type: "danger",
					z_index: 8000
				});
		}
		if (response.status == 'error') {
			$.notify({
				icon: 'fas fa-exclamation-triangle',
				message: "Đã xảy ra lỗi! Vui lòng kiểm tra lại!"
			},
				{
					type: "danger",
					z_index: 8000
				});
		}
	});
}
var DangKy = function (TaiKhoan,
	MatKhau,
	TenQuanTriVien,
	Email,
	DiaChi,
	SoDienThoai,
	Type) {
	$.ajax({
		url: '/DangKy/DangKy',
		type: 'Post',
		data: {
			TaiKhoan: TaiKhoan,
			MatKhau: MatKhau,
			TenQuanTriVien: TenQuanTriVien,
			Email: Email,
			DiaChi: DiaChi,
			SoDienThoai: SoDienThoai,
			Type: Type
		},
		dataType: 'json',
		success: function (response) {
			if (response.status == 'false') {
				if (Type == 1) {
					FB.logout();
				}
				if (Type == 2) {
					signOut();
				}
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xẩy ra lỗi! Vui lòng kiểm tra lại!"
				},
					{
						type: "danger",
						z_index: 8000
					});
			}
			if (response.status == 'true') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đăng ký thành công!"
				},
					{
						type: "success",
						z_index: 8000
					});
				$('#user-infor-modal').modal('hide');
			}
		}
	});
}





