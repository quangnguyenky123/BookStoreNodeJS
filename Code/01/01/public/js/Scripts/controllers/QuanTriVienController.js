//var role = sessionStorage.getItem('Role');
//if (role === "" || role === undefined || role === null) {
//    location.href = '/Login';
//}
//else
//{
//    if (role !== 'Admin') {
//        location.href = '/Error/Error401';
//    }
//    else {
//        var taiKhoanConfig = {
//            pageSize: 5,
//            pageIndex: 1,
//            searchString: ""
//        };

//        var taiKhoanController = {

//            registerEvent: function () {
//                $('#pageSize').off('change').on('change', function () {
//                    taiKhoanConfig.pageSize = $('#pageSize').val();
//                    taiKhoanController.loadData(true);
//                });
//                $('#search').off('keyup').on('keyup', function () {
//                    taiKhoanConfig.searchString = $('#search').val();
//                    taiKhoanController.loadData(true);
//                });

//                $('.btn-update').off('click').on('click', function () {
//                    var id = $(this).data('id');
//                    taiKhoanController.loadDetail(id);
//                });

//                $('#frm-update').off('submit').on('submit', function (e) {
//                    e.preventDefault();
//                    var form = $(this);
//                    $(form).validate({
//                        rules: {
//                            "txtTen": {
//                                required: true
//                            },
//                            "txtEmail": {
//                                required: true,
//                                email: true

//                            },
//                            "txtSoDienThoai": {
//                                required: true,
//                                digits: true
//                            },
//                            "txtDiaChi": {
//                                required: true
//                            },
//                            "txtQuyen": {
//                                required: true
//                            },
//                            "txtTrangThai": {
//                                required: true
//                            }
//                        },
//                        messages: {
//                            "txtTen": {
//                                required: "Vui lòng nhập tên!"
//                            },
//                            "txtEmail": {
//                                required: "Vui lòng nhập email!",
//                                email: "Vui lòng nhập đúng định dạng email!"

//                            },
//                            "txtSoDienThoai": {
//                                required: "Vui lòng nhập số điện thoại liên lạc!",
//                                digits: "Vui lòng nhập đúng định dạng số điện thoại!"
//                            },
//                            "txtDiaChi": {
//                                required: "Vui lòng nhập địa chỉ!"
//                            },
//                            "txtQuyen": {
//                                required: "Vui lòng chọn quyền!"
//                            },
//                            "txtTrangThai": {
//                                required: "Vui lòng chọn trạng thái tài khoản!"
//                            }
//                        }
//                    });
//                    if (!form.valid()) {
//                        return false;
//                    }
//                    else {
//                        var account = {
//                            Id: $('#btn-update-account').data('id'),
//                            Ten: $('#txtTen').val(),
//                            Email: $('#txtEmail').val(),
//                            DiaChi: $('#txtDiaChi').val(),
//                            SoDienThoai: $('#txtSoDienThoai').val(),
//                            IdQuyen: $('#account-role').val(),
//                            TrangThai: $('#account-status').val()
//                        };
//                        var formdt = new FormData();
//                        formdt.append("Account", JSON.stringify(account));
//                        taiKhoanController.updateAccount(formdt);
//                    }
//                });
//                $('#frm-create').off('submit').on('submit', function (e) {
//                    e.preventDefault();
//                    var form = $(this);
//                    $(form).validate({
//                        rules: {
//                            "createTen": {
//                                required: true
//                            },
//                            "createEmail": {
//                                required: true,
//                                email: true

//                            },
//                            "createSoDienThoai": {
//                                required: true,
//                                digits: true
//                            },
//                            "createDiaChi": {
//                                required: true
//                            },
//                            "createQuyen": {
//                                required: true
//                            },
//                            "createTrangThai": {
//                                required: true
//                            },
//                            "createTaiKhoan": {
//                                required: true,
//                                minlength: 5,
//                                maxlength: 20
//                            },
//                            "createMatKhau": {
//                                required: true,
//                                minlength: 8
//                            },
//                            "createReMatKhau": {
//                                equalTo: "#createMatKhau",
//                                minlength: 8
//                            }
//                        },
//                        messages: {
//                            "createTen": {
//                                required: "Vui lòng nhập tên!"
//                            },
//                            "createEmail": {
//                                required: "Vui lòng nhập email!",
//                                email: "Vui lòng nhập đúng định dạng email!"

//                            },
//                            "createSoDienThoai": {
//                                required: "Vui lòng nhập số điện thoại liên lạc!",
//                                digits: "Vui lòng nhập đúng định dạng số điện thoại!"
//                            },
//                            "createDiaChi": {
//                                required: "Vui lòng nhập địa chỉ!"
//                            },
//                            "createQuyen": {
//                                required: "Vui lòng chọn quyền!"
//                            },
//                            "createTrangThai": {
//                                required: "Vui lòng chọn trạng thái tài khoản!"
//                            },
//                            "createTaiKhoan": {
//                                required: "Vui lòng nhập tài khoản!",
//                                minlength: "Tài khoản phải có ít nhất 5 ký tự!",
//                                maxlength: "Tài khoản phải ít hơn 20 ký tự!"
//                            },
//                            "createMatKhau": {
//                                required: "Vui lòng nhập mật khẩu!",
//                                minlength: "Mật khẩu phải có ít nhất 8 ký tự!"
//                            },
//                            "createReMatKhau": {
//                                equalTo: "Hai mật khẩu phải giống nhau",
//                                minlength: "Mật khẩu phải có ít nhất 8 ký tự!"
//                            }
//                        }
//                    });
//                    if (!form.valid()) {
//                        return false;
//                    }
//                    else {
//                        var account = {
//                            Ten: $('#createTen').val(),
//                            Email: $('#createEmail').val(),
//                            DiaChi: $('#createDiaChi').val(),
//                            SoDienThoai: $('#createSoDienThoai').val(),
//                            IdQuyen: $('#createQuyen').val(),
//                            TrangThai: $('#createTrangThai').val(),
//                            TaiKhoan: $('#createTaiKhoan').val(),
//                            MatKhau: md5($('#createMatKhau').val())
//                        };
//                        var formdt = new FormData();
//                        formdt.append("Account", JSON.stringify(account));
//                        taiKhoanController.createAccount(formdt);
//                    }
//                });

//            },
//            loadData: function (changeSize) {
//                $.ajax({
//                    url: '/QuanLyQuanTriVien/LoadData',
//                    type: 'GET',
//                    data: {
//                        searchString: taiKhoanConfig.searchString,
//                        pageIndex: taiKhoanConfig.pageIndex,
//                        pageSize: taiKhoanConfig.pageSize
//                    },
//                    dataType: 'json',
//                    success: function (response) {
//                        if (response.status) {
//                            var data = response.data;
//                            var html = '';
//                            var template = $('#data-template').html();
//                            $.each(data, function (i, item) {
//                                html += Mustache.render(template, {
//                                    Id: item.id,
//                                    TaiKhoan: item.taiKhoan,
//                                    Ten: item.ten,
//                                    TenQuyen: item.tenQuyen,
//                                    TrangThai: (item.trangThai === 1) ? "Enable" : "Disable"
//                                });
//                            });
//                            taiKhoanController.paging(response.totalRow, function () {
//                                taiKhoanController.loadData();
//                            }, changeSize);
//                            $('#tblData').html(html);
//                            taiKhoanController.registerEvent();
//                        }
//                    }
//                });
//            },
//            loadDetail: function (id) {
//                $.ajax({
//                    url: '/QuanLyQuanTriVien/LoadDetail',
//                    type: 'GET',
//                    data: {
//                        id: id
//                    },
//                    dataType: 'json',
//                    success: function (response) {
//                        if (response.status) {
//                            var data = response.data;
//                            var html = '';
//                            var template = $('#detail-template').html();

//                            html += Mustache.render(template, {
//                                Id: data.id,
//                                TaiKhoan: data.taiKhoan,
//                                Ten: data.ten,
//                                Email: data.email,
//                                DiaChi: data.diaChi,
//                                SoDienThoai: data.soDienThoai,
//                                MatKhau: data.matKhau,
//                                TrangThai: data.trangThai,
//                                IdQuyen: data.idQuyen
//                            });
//                            $('#detail-content').html('');
//                            $('#detail-content').html(html);
//                            var stt = $('#account-status').data('stt');
//                            if (stt === 1) {
//                                $('#account-status option[value=1]').attr('selected', 'selected');
//                            }
//                            else {
//                                $('#account-status option[value=0]').attr('selected', 'selected');
//                            }
//                            var role = $('#account-role').data('role');
//                            if (role === 1) {
//                                $('#account-role option[value=1]').attr('selected', 'selected');
//                            }
//                            else {
//                                $('#account-role option[value=2]').attr('selected', 'selected');
//                            }
//                            $('#btn-update-account').data('id', id);
//                            $('#account-detail').modal('show');
//                        }
//                    }
//                });
//            },
//            //loadDetailUpdate: function (id) {
//            //    $.ajax({
//            //        url: '/QuanTriVien/LoadDetail',
//            //        type: 'GET',
//            //        data: {
//            //            id: id
//            //        },
//            //        dataType: 'json',
//            //        success: function (response) {
//            //            if (response.status) {
//            //                var data = response.data;
//            //                var html = '';
//            //                var template = $('#update-template').html();
//            //                $.each(data, function (i, item) {
//            //                    stt = item.trangThai;
//            //                    html += Mustache.render(template, {
//            //                        Id: item.id,
//            //                        TenQuanTriVien: item.tenQuanTriVien,
//            //                        MoTa: item.moTa,
//            //                        TrangThai: item.trangThai
//            //                    });
//            //                });
//            //                $('#category-update').html(html);
//            //                var stt = $('#sll-status').data('stt');
//            //                if (stt == 1) {
//            //                    $('#sll-status option[value=1]').attr('selected', 'selected');
//            //                }
//            //                else {
//            //                    $('#sll-status option[value=2]').attr('selected', 'selected');
//            //                }
//            //                QuanTriVienController.registerEvent();
//            //            }
//            //        }
//            //    })
//            //},
//            updateAccount: function (form) {
//                $.ajax({
//                    url: '/QuanLyQuanTriVien/Update',
//                    type: 'POST',
//                    data: form,
//                    contentType: false,
//                    processData: false,
//                    dataType: 'json',
//                    success: function (response) {
//                        if (response.status) {
//                            $.notify({
//                                icon: 'fas fa-check-double',
//                                message: "Cập nhật thành công"

//                            }, {
//                                    type: "success",
//                                    z_index: 8000

//                                });
//                            $('#account-detail').modal('hide');
//                            taiKhoanController.loadData();
//                            taiKhoanController.registerEvent();
//                        }
//                    }
//                });
//            },
//            createAccount: function (form) {
//                $.ajax({
//                    url: '/QuanLyQuanTriVien/Create',
//                    type: 'POST',
//                    data: form,
//                    contentType: false,
//                    processData: false,
//                    dataType: 'json',
//                    success: function (response) {
//                        if (response.status === 1) {
//                            $.notify({
//                                icon: 'fas fa-check-double',
//                                message: "Cập nhật thành công"

//                            }, {
//                                    type: "success",
//                                    z_index: 8000

//                                });
//                            $('#account-create').modal('hide');
//                            taiKhoanController.loadData(true);
//                            taiKhoanController.registerEvent();
//                        }
//                        else {
//                            $.notify({
//                                icon: 'fas fa-exclamation-triangle',
//                                message: "Tên tài khoản đã tồn tại!"
//                            }, {
//                                    type: "warning",
//                                    delay: 100,
//                                    offset: {
//                                        x: 20,
//                                        y: 70
//                                    },
//                                    z_index: 8000
//                                });
//                        }
//                    }
//                });
//            },
//            //createCategory: function (TenQuanTriVien, MoTa, TrangThai) {
//            //    $.ajax({
//            //        url: '/QuanTriVien/Create',
//            //        type: 'POST',
//            //        data: {
//            //            TenQuanTriVien: TenQuanTriVien,
//            //            MoTa: MoTa,
//            //            TrangThai: TrangThai
//            //        },
//            //        dataType: 'json',
//            //        success: function (response) {
//            //            if (response.status == 1) {
//            //                $.notify({
//            //                    icon: 'fas fa-check-double',
//            //                    message: "Thêm mới thành công"

//            //                }, {
//            //                        type: "success",
//            //                        z_index: 8000

//            //                    });
//            //                //QuanTriVienController.loadData(true);
//            //            }
//            //            else {
//            //                if (response.status == 0) {
//            //                    $.notify({
//            //                        icon: 'fas fa-exclamation-triangle',
//            //                        message: "Tên danh mục đã tồn tại!"

//            //                    }, {
//            //                            type: "danger",
//            //                            z_index: 8000
//            //                        });
//            //                }
//            //            }
//            //        }
//            //    })
//            //},
//            //deleteCategory: function (id) {
//            //    $.ajax({
//            //        url: '/QuanTriVien/Delete',
//            //        type: 'POST',
//            //        data: {
//            //            id: id
//            //        },
//            //        dataType: 'json',
//            //        success: function (response) {
//            //            if (response.status == 1) {
//            //                $.notify({
//            //                    icon: 'fas fa-check-double',
//            //                    message: "Xóa thành công"

//            //                }, {
//            //                        type: "success"
//            //                    });

//            //                QuanTriVienController.loadData(true);
//            //            }
//            //            else {
//            //                if (response.status == 0) {
//            //                    $.notify({
//            //                        icon: 'fas fa-exclamation-triangle',
//            //                        message: "Danh mục đã tồn tại sách! Không thể xóa"

//            //                    }, {
//            //                            type: "danger"
//            //                        });
//            //                }
//            //            }
//            //        }
//            //    })
//            //},
//            paging: function (totalRow, callback, changeSize) {
//                var totalPage = Math.ceil(totalRow / taiKhoanConfig.pageSize);
//                if ($('#pagination a').length === 0 || changeSize === true) {
//                    $('#pagination').empty();
//                    $('#pagination').removeData("twbs-pagination");
//                    $('#pagination').unbind('page');
//                }
//                $('#pagination').twbsPagination({
//                    totalPages: totalPage,
//                    visiblePages: 5,
//                    first: 'Trang đầu',
//                    prev: 'Trang trước',
//                    next: 'Trang sau',
//                    last: 'Trang cuối',
//                    onPageClick: function (event, page) {
//                        taiKhoanConfig.pageIndex = page;
//                    }
//                });
//                $('.page-item').click(function (event) {
//                    setTimeout(callback, 10);
//                });
//            }
//        };
//        $(document).ready(function () {
//            //taiKhoanController.loadData();
//            //$('#btn-add').off('click').on('click', function () {
//               // $('#account-create').modal('show');
//            //});

//        });
//    }
//}
var app = angular.module('loadQuanTriVien', []);
app.controller('myCtrl', function ($scope, $http) {
	$scope.pageSize = '5';
	$scope.pageIndex = 1;
	$scope.searchString = "";
	$scope.myFunctionLoadAccessControl = function () {
		$http.post('/DanhMuc/LoadAccessControl').then(function (response) {
			$scope.accessControls = response.data.accessControl;
			$scope.name = response.data.name;
		});
	}
	$scope.myFunctionLoadData = function (changeSize) {
		if (changeSize == true) {
			$scope.pageIndex = 1;
		}
		$http.post('/QuanTriVien/LoadData', {
			searchString: $scope.searchString,
			page: Number($scope.pageIndex),
			pageSize: Number($scope.pageSize)
		}).then(function (response) {
			$scope.items = response.data.data;
			$scope.Options = response.data.categoryStatus;
			$scope.ListRole = response.data.listRole;
			if (response.data.totalRow > 0) {
				$scope.paging(response.data.totalRow, $scope.myFunctionLoadData(), changeSize);
			}
		});
	}
	$scope.myFunctionUpdate = function (id) {
		$http.post('/QuanTriVien/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#account-update').modal('show');
		});
	}
	$scope.myFunctionCreate = function (id) {
		$scope.ModelCreate = [{ TaiKhoan: '', MatKhau: '', retypeMatKhau: '', TenQuanTriVien: '', Email: '', DiaChi: '', SoDienThoai: '', IdQuyen: '5da322ff1c9d4400002a2f79', IdTrangThai: '5dd6c4d03d9bfe5770f9911e' }];
		$('#account-create').modal('show');
	}
	$scope.myFunctionUpdateModel = function () {
		$http.post('/QuanTriVien/Update', { modelUpdate: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thành công"

				}, {
					type: "success",
					z_index: 8000

				});
				$scope.myFunctionLoadData();
				$('#account-update').modal('hide');
			};
			if (response.data.status == 'false') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Tên tài khoản đã tồn tại!"

				}, {
					type: "danger",
					z_index: 8000
				});
			};
			if (response.data.status == 'error') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xảy ra lỗi!"
				}, {
						type: "danger",
						z_index: 8000
				});
			};
		});
	}
	$scope.myFunctionCreateModel = function () {
		var form = $('#frm-create');
        $(form).validate({
            rules: {
                "createTen": {
                    required: true
                },
                "createEmail": {
                    required: true,
                    email: true

                },
                "createSoDienThoai": {
                    required: true,
                    digits: true
                },
                "createDiaChi": {
                    required: true
                },
                "createQuyen": {
                    required: true
                },
                "createTrangThai": {
                    required: true
                },
                "createTaiKhoan": {
                    required: true,
                    minlength: 8,
                    maxlength: 20
                },
                "createMatKhau": {
                    required: true,
                    minlength: 8
                },
                "createReMatKhau": {
                    //equalTo: "#createMatKhau",
                    minlength: 8
                }
            },
            messages: {
                "createTen": {
                    required: "Vui lòng nhập tên!"
                },
                "createEmail": {
                    required: "Vui lòng nhập email!",
                    email: "Vui lòng nhập đúng định dạng email!"

                },
                "createSoDienThoai": {
                    required: "Vui lòng nhập số điện thoại liên lạc!",
                    digits: "Vui lòng nhập đúng định dạng số điện thoại!"
                },
                "createDiaChi": {
                    required: "Vui lòng nhập địa chỉ!"
                },
                "createQuyen": {
                    required: "Vui lòng chọn quyền!"
                },
                "createTrangThai": {
                    required: "Vui lòng chọn trạng thái tài khoản!"
                },
                "createTaiKhoan": {
                    required: "Vui lòng nhập tài khoản!",
                    minlength: "Tài khoản phải có ít nhất 8 ký tự!",
                    maxlength: "Tài khoản phải ít hơn 20 ký tự!"
                },
                "createMatKhau": {
                    required: "Vui lòng nhập mật khẩu!",
                    minlength: "Mật khẩu phải có ít nhất 8 ký tự!"
                },
                "createReMatKhau": {
                    equalTo: "Hai mật khẩu phải giống nhau",
                    minlength: "Mật khẩu phải có ít nhất 8 ký tự!"
                }
            }
        });
		if (!form.valid()) {
			return false;
		}
		if ($scope.ModelCreate[0].MatKhau == $scope.ModelCreate[0].retypeMatKhau) {
			$scope.ModelCreate[0].MatKhau = md5($scope.ModelCreate[0].MatKhau);
			$http.post('/QuanTriVien/Create', {
				modelCreate: $scope.ModelCreate
			}).then(function (response) {
				if (response.data.status == 'true') {
					$.notify({
						icon: 'fas fa-check-double',
						message: "Thêm mới thành công"
					}, {
						type: "success",
						z_index: 8000
					});
					$scope.myFunctionLoadData(true);
					$('#account-create').modal('hide');
				}
				else {
					if (response.data.status == 'false') {
						$.notify({
							icon: 'fas fa-exclamation-triangle',
							message: "Tên tài khoản đã tồn tại!"

						}, {
							type: "danger",
							z_index: 8000
						});
					};
					if (response.data.status == 'error') {
						$.notify({
							icon: 'fas fa-exclamation-triangle',
							message: "Đã xảy ra lỗi!"
						}, {
							type: "danger",
							z_index: 8000
						});
					};
				};

			});
		}
	}
	//Paging
	$scope.paging = function (totalRow, callback ,changeSize) {
		var totalPage = Math.ceil(totalRow / $scope.pageSize)
		if ($('#pagination a').length == 0 || changeSize == true) {
			$('#pagination').empty();
			$('#pagination').removeData("twbs-pagination");
			$('#pagination').unbind('page');
		}
		$('#pagination').twbsPagination({
			totalPages: totalPage,
			visiblePages: 5,
			first: 'Trang đầu',
			prev: 'Trang trước',
			next: 'Trang sau',
			last: 'Trang cuối',
			onPageClick: function (event, page) {
				$scope.pageIndex = page;
				callback;
			}
		});
		$('.page-item').click(function (event) {
			setTimeout(callback, 100);
		});
	};
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


