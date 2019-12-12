
var app = angular.module('loadThongTinCaNhan', []);
app.controller('myCtrl', function ($scope, $http) {
	$scope.myFunctionLoadAccessControl = function () {
		$http.post('/DanhMuc/LoadAccessControl').then(function (response) {
			$scope.accessControls = response.data.accessControl;
			$scope.name = response.data.name;
		});
	}
	$scope.myFunctionLoadData = function () {
        $http.post('/ThongTinCaNhan/LoadData').then(function (response) {
			$scope.SelectedItem = response.data.data;
			$scope.Account = response.data.account;
			$scope.AccountType = response.data.accountType;
		});
	}
	$scope.myFunctionUpdatePassword = function () {
		$scope.NewPassword = [{ UserName: "", OldPassword: "", NewPassword: "", RetypeNewPassword: "" }];
		$('#user-update-password-modal').modal('show');
	};
	$scope.myFunctionUpdateModelPassword = function () {
		var formUpdate = $("#frm-info");
		$(formUpdate).validate({
			rules: {
				"txt-username": {
					required: true
				},
				"txt-oldPassword": {
					required: true
				},
				"txt-newPassword": {
					required: true,
					minlength: 8
				},
				"txt-retypeNewPassword": {
					required: true,
				}
			},
			messages: {
				"txt-username": {
					required: "Tài khoản không được để trống!"
				},
				"txt-oldPassword": {
					required: "Mật khẩu cũ không được để trống!"
				},
				"txt-newPassword": {
					required: "Mật khẩu mới không được để trống!",
					minlength: "Mật khẩu mới mới có ít nhất 8 kí tự!"
				},
				"txt-retypeNewPassword": {
					required: "Nhập lại mật khẩu mới không được để trống!",
				}
			}
		});
		if ($scope.NewPassword[0].NewPassword != $scope.NewPassword[0].RetypeNewPassword) {
			$.notify({
				icon: 'fas fa-exclamation-triangle',
				message: "Nhập lại mật khẩu không đúng!"
			}, {
				type: "danger",
				z_index: 8000
			});
			return false;
		}
		if (!formUpdate.valid()) {
			return false;
		}
		else {
			//$scope.NewPassword[0].OldPassword = md5($scope.NewPassword[0].OldPassword);
			$scope.modelPassword = $scope.NewPassword;
			$scope.modelPassword[0].OldPassword = md5($scope.modelPassword[0].OldPassword);
			$scope.modelPassword[0].NewPassword = md5($scope.modelPassword[0].NewPassword);
		}
		$http.post('/ThongTinCaNhan/UpdatePassword', { modelPassword: $scope.modelPassword }).then(function (response) {
			if (response.data.status == true) {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thành công"
				}, {
					type: "success",
					z_index: 8000

				});
				$scope.myFunctionLoadData();
				$('#user-update-password-modal').modal('hide');
			};
			if (response.data.status == false) {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Tên đăng nhập hoặc mật khẩu không đúng!"

				}, {
					type: "danger",
					z_index: 8000
				});
				$scope.NewPassword[0].OldPassword = '';
				$scope.NewPassword[0].NewPassword = '';
				$scope.NewPassword[0].RetypeNewPassword = '';
			};
			if (response.data.status == 'error') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xẩy ra lỗi!"
				}, {
					type: "danger",
					z_index: 8000
				});
				$scope.NewPassword[0].OldPassword = '';
				$scope.NewPassword[0].NewPassword = '';
				$scope.NewPassword[0].RetypeNewPassword = '';
			};
		});
	}
	//$scope.myFunctionDetail = function (id) {
	//	$http.post('/DanhMuc/LoadDetail', { id: id }).then(function (response) {
	//		$scope.SelectedItem = response.data.data;
	//		$('#category-detail').modal('show');
	//	});
	//}
    //$scope.myFunctionUpdate = function (id) {
    //    $http.post('/DanhMuc/LoadDetail', { id: id }).then(function (response) {
    //        $scope.SelectedItem = response.data.data;
    //        $scope.Options = response.data.categoryStatus;
    //        $('#category-update').modal('show');
    //    });
    //}
 //   $scope.myFunctionCreate = function (id) {
	//	$scope.ModelCreate = [{ TenDanhMuc: '', MoTa: '', IdTrangThai: '5dd6c4d03d9bfe5770f9911e' }];
 //       $('#category-create').modal('show');
 //   }
 //   $scope.myFunctionDelete = function (id) {
 //       $scope.SelectedItem = id;
 //       $('#modal-delete').modal('show');
 //   }
 //   $scope.myFunctionDeleteModel = function () {
 //       $http.post('/DanhMuc/Delete', { id: $scope.SelectedItem }).then(function (response) {
 //           if (response.data.status == 'true') {
 //               $.notify({
 //                   icon: 'fas fa-check-double',
 //                   message: "Xóa thành công"

 //               }, {
	//					type: "success",
	//					z_index: 8000
 //               });
 //               $scope.myFunctionLoadData(true);
 //               $('#modal-delete').modal('hide');
 //           }
 //           else {
 //               if (response.data.status == 'false') {
 //                   $.notify({
 //                       icon: 'fas fa-exclamation-triangle',
 //                       message: "Danh mục đã tồn tại sách! Không thể xóa"
 //                   }, {
	//						type: "danger",
	//						z_index: 8000
 //                   });
 //               };
 //               if (response.data.status == 'error') {
 //                   $.notify({
 //                       icon: 'fas fa-exclamation-triangle',
 //                       message: "Đã xẩy ra lỗi!"
 //                   }, {
	//						type: "danger",
	//						z_index: 8000
 //                   });
 //               }
 //           };
 //       });
 //   }
	$scope.myFunctionUpdateModel = function () {
		var formUpdate = $("#frm-update");
		$(formUpdate).validate({
			rules: {
				"txtTen": {
					required: true
				},
				"txtDiaChi": {
					required: true
				},
				"txtSoDienThoai": {
					required: true
				}
			},
			messages: {
				"txtTen": {
					required: "Họ và tên không được để trống"
				},
				"txtDiaChi": {
					required: "Địa chỉ không được để trống"
				},
				"txtSoDienThoai": {
					required: "Số điện thoại không được để trống"
				}
			}
		});
		if (!formUpdate.valid()) {
			return false;
		}
		$http.post('/ThongTinCaNhan/Update', { modelUpdate: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == true) {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thông tin thành công"
				}, {
					type: "success",
					z_index: 8000

                });
                $scope.myFunctionLoadData();
                $('#category-update').modal('hide');
			};
			if (response.data.status == false) {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Cập nhật thông tin thất bại!"

				}, {
					type: "danger",
					z_index: 8000
				});
			};
			if (response.data.status == 'error') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xẩy ra lỗi!"
				}, {
						type: "danger",
						z_index: 8000
				});
			};
		});
    }
	//$scope.myFunctionCreateModel = function () {
	//	var formCreate = $("#frm-create");
	//	$(formCreate).validate({
	//		rules: {
	//			"categoryName": {
	//				required: true
	//			}
	//		},
	//		messages: {
	//			"categoryName": {
	//				required: "Tên danh mục không được để trống"
	//			}
	//		}
	//	});
	//	if (!formCreate.valid()) {
	//		return false;
	//	}
 //       $http.post('/DanhMuc/Create', {
 //           modelCreate: $scope.ModelCreate
 //       }).then(function (response) {
 //           if (response.data.status == 'true') {
 //               $.notify({
 //                   icon: 'fas fa-check-double',
 //                   message: "Thêm mới thành công"
 //               }, {
 //                   type: "success",
 //                   z_index: 8000
 //               });
 //               $scope.myFunctionLoadData(true);
 //               $('#category-create').modal('hide');
 //           }
 //           else {
 //               if (response.data.status == 'false') {
 //                   $.notify({
 //                       icon: 'fas fa-exclamation-triangle',
 //                       message: "Tên danh mục đã tồn tại!"

 //                   }, {
 //                       type: "danger",
 //                       z_index: 8000
 //                   });
 //               };
 //               if (response.data.status == 'error') {
 //                   $.notify({
 //                       icon: 'fas fa-exclamation-triangle',
 //                       message: "Đã xảy ra lỗi!"
 //                   }, {
 //                       type: "danger",
 //                       z_index: 8000
 //                   });
 //               };
 //           };
           
 //       });
 //   }
 //   //Paging
 //   $scope.paging = function (totalRow, changeSize) {
 //       var totalPage = Math.ceil(totalRow / $scope.pageSize)
 //       if ($('#pagination a').length == 0 || changeSize == true) {
 //           $('#pagination').empty();
 //           $('#pagination').removeData("twbs-pagination");
 //           $('#pagination').unbind('page');
 //       }
 //       $('#pagination').twbsPagination({
 //           totalPages: totalPage,
 //           visiblePages: 5,
 //           first: 'Trang đầu',
 //           prev: 'Trang trước',
 //           next: 'Trang sau',
 //           last: 'Trang cuối',
 //           onPageClick: function (event, page) {
 //               $scope.pageIndex = page;
 //               $scope.myFunctionLoadData();
 //           }
 //       });
 //   };
	$scope.myFunctionLogOut = function () {
		$http.post('/Login/Logout').then(function (response) {
			if (response.data.status == true)
				location.href = '/';
			else {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xảy ra lỗi! Vui lòng kiểm tra lại!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
		})
	}
});