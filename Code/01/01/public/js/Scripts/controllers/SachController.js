//var role = sessionStorage.getItem('Role');
//if (role === "" || role === undefined || role === null) {
//    location.href = '/Login';
//}
//else
{
    var sachConfig = {
        pageSize: 5,
        pageIndex: 1,
        searchString: ""
    };
    var sachController = {

        registerEvent: function () {
            $('#pageSize').off('change').on('change', function () {
                sachConfig.pageSize = $('#pageSize').val();
                sachController.loadData(true);
            });
            $('#search').off('keyup').on('keyup', function () {
                sachConfig.searchString = $('#search').val();
                sachController.loadData(true);
            });
            $('.btn-delete').off('click').on('click', function () {
                var id = $(this).data('id');
                sachController.deleteBook(id);
            });
            $('.btn-detail').off('click').on('click', function () {
                var id = $(this).data('id');
                sachController.loadDetail(id);
            });
            //$('.btn-update').off('click').on('click', function () {
            //    var id = $(this).data('id');
            //    sachController.loadDetailUpdate(id);
            //    $('#author-update').modal('show');
            //})

            //$('#frm-update').off('submit').on('submit', function (e) {
            //    e.preventDefault();
            //    var form = $(this);
            //    $(form).validate({
            //        rules: {
            //            "txtTensach": {
            //                required: true
            //            }
            //        },
            //        messages: {
            //            "txtTensach": {
            //                required: "Tên tác giả không được để trống"
            //            }
            //        }
            //    });
            //    if (!form.valid()) {
            //        return false;
            //    }
            //    else {
            //        var Id = $('#btn-update').data('id');
            //        var Tensach = $('#txtTensach').val();
            //        var MoTa = $('#txtMoTa').val();
            //        var TrangThai = $('#sll-status').val();
            //        sachController.updateAuthor(Id, Tensach, MoTa, TrangThai);
            //    }
            //})
            
        },
        loadData: function (changeSize) {
            $.ajax({
                url: '/Sach/LoadData',
                type: 'GET',
                data: {
                    searchString: sachConfig.searchString,
                    page: sachConfig.pageIndex,
                    pageSize: sachConfig.pageSize
                },
                dataType: 'json',
                success: function (response) {
                    if (response.status) {
                        var data = response.data;
                        var html = '';
                        var template = $('#data-template').html();
                        $.each(data, function (i, item) {
                            html += Mustache.render(template, {
                                Id: item.id,
                                TenSach: item.tenSach,
                                HinhAnh: item.hinhAnh,
                                SoLuong: item.soLuong,
                                Gia: item.gia,
                                TrangThai: item.tenTrangThai
                            });
                        });
                        sachController.paging(response.totalRow, function () {
                            sachController.loadData();
                        }, changeSize);
                        $('#tblData').html(html);
                        sachController.registerEvent();
                    }
                }
            });
        },
        loadDetail: function (id) {
            $.ajax({
                url: '/Sach/LoadDetail',
                type: 'GET',
                data: {
                    id: id
                },
                dataType: 'json',
                success: function (response) {
                    if (response.status) {
                        var data = response.data;
                        var html = '';
                        var template = $('#detail-template').html();
                        html += Mustache.render(template, {
                            TenSach: data.tenSach,
                            TomTat: data.tomTat,
                            TenDanhMuc: data.tenDanhMuc,
                            TenTacGia: data.tenTacGia,
                            TenNhaXuatBan: data.tenNhaXuatBan,
                            Tap: data.tap,
                            Gia: data.gia,
                            SoLuong: data.soLuong,
                            SoLuotMua: data.soLuotMua,
                            TenTrangThai: data.tenTrangThai,
                            HinhAnh: data.hinhAnh
                        });
                        $('#detail-body').html(html);
                        $('#book-detail').modal('show');
                    }
                }
            });
        },
        //loadDetailUpdate: function (id) {
        //    $.ajax({
        //        url: '/sach/LoadDetail',
        //        type: 'GET',
        //        data: {
        //            id: id
        //        },
        //        dataType: 'json',
        //        success: function (response) {
        //            if (response.status) {
        //                var data = response.data;
        //                var html = '';
        //                var template = $('#update-template').html();
        //                $.each(data, function (i, item) {
        //                    stt = item.trangThai;
        //                    html += Mustache.render(template, {
        //                        Id: item.id,
        //                        Tensach: item.tensach,
        //                        MoTa: item.moTa,
        //                        TrangThai: item.trangThai
        //                    });
        //                });
        //                $('#author-update').html(html);
        //                var stt = $('#sll-status').data('stt');
        //                if (stt == 1) {
        //                    $('#sll-status option[value=1]').attr('selected', 'selected');
        //                }
        //                else {
        //                    $('#sll-status option[value=2]').attr('selected', 'selected');
        //                }

        //                sachController.registerEvent();
        //            }
        //        }
        //    })
        //},
        //updateAuthor: function (Id, Tensach, MoTa, TrangThai) {
        //    $.ajax({
        //        url: '/sach/Update',
        //        type: 'POST',
        //        data: {
        //            Id: Id,
        //            Tensach: Tensach,
        //            MoTa: MoTa,
        //            TrangThai: TrangThai
        //        },
        //        dataType: 'json',
        //        success: function (response) {
        //            if (response.status == 1) {
        //                $.notify({
        //                    icon: 'fas fa-check-double',
        //                    message: "Cập nhật thành công"

        //                }, {
        //                        type: "success",
        //                        z_index: 8000

        //                    });
        //                sachController.loadData();
        //            }
        //            else {
        //                if (response.status == 0) {
        //                    $.notify({
        //                        icon: 'fas fa-exclamation-triangle',
        //                        message: "Tên tác giả đã tồn tại!"

        //                    }, {
        //                            type: "danger",
        //                            z_index: 8000
        //                        });
        //                }
        //            }
        //        }
        //    })
        //},
        createBook: function (formData) {
            $.ajax({
                url: '/Sach/Create',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (response) {
                    if (response.status) {

                        $.notify({
                            icon: 'fas fa-check-double',
                            message: response.message

                        }, {
                                type: "success",
                                z_index: 8000

                            });
                        sachController.loadData(true);
                    }
                    else {

                        $.notify({
                            icon: 'fas fa-exclamation-triangle',
                            message: response.message

                        }, {
                                type: "danger",
                                z_index: 8000
                            });

                    }
                }
            });
        },
        deleteBook: function (id) {
            $.ajax({
                url: '/Sach/Delete',
                type: 'POST',
                data: {
                    id: id
                },
                dataType: 'json',
                success: function (response) {
                    if (response.status == 1) {
                        $.notify({
                            icon: 'fas fa-check-double',
                            message: "Xóa thành công"

                        }, {
                                type: "success"
                            });

                        sachController.loadData(true);
                    }
                    else {
                        if (response.status == 0) {
                            $.notify({
                                icon: 'fas fa-exclamation-triangle',
                                message: "Sách đã có trong phiếu nhập hoặc đơn đặt hàng! Không thể xóa"

                            }, {
                                    type: "danger"
                                });
                        }
                    }
                }
            })
        },
        paging: function (totalRow, callback, changeSize) {
            var totalPage = Math.ceil(totalRow / sachConfig.pageSize);
            if ($('#pagination a').length == 0 || changeSize === true) {
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
                    sachConfig.pageIndex = page;
                }
            });
            $('.page-item').click(function (event) {
                setTimeout(callback, 10);
            });
        }

    };
    $(document).ready(function () {

        //sachController.loadData();
        //$('#btn-choose-create').click(function () {
        //    $('#file-input-create').click();
        //});

        //$('#btn-add').off('click').on('click', function () {
        //    $('#author-create').modal('show');
        //})
    })
}


var app = angular.module('loadSach', []);
app.controller('myCtrl', function ($scope, $http) {
	$scope.pageSize = '5';
	$scope.pageIndex = 1;
	$scope.searchString = "";
	$scope.updateImage = 0;
	$scope.createImage = 0;
	$scope.myFunctionLoadFileUpdate = function () {
		$('#file-input-update').click();
	}
	$scope.myFunctionLoadFileUpdateChanged = function (event) {
		$scope.updateImage = 1;
		$scope.file = event.files[0];
		var output = document.getElementById('image-update');
		output.src = URL.createObjectURL($scope.file);
	}
	$scope.myFunctionLoadFileCreate = function () {
		$('#file-input-create').click();
	}
	$scope.myFunctionLoadFileCreateChanged = function (event) {
		$scope.createImage = 1;
		$scope.file = event.files[0];
		var output = document.getElementById('image-create');
		output.src = URL.createObjectURL($scope.file);
	}
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
		$http.post('/Sach/LoadData', {
			searchString: $scope.searchString,
			page: Number($scope.pageIndex),
			pageSize: Number($scope.pageSize)
		}).then(function (response) {
			$scope.tacGias = response.data.tacGia;
			$scope.danhMucs = response.data.danhMuc;
			$scope.nhaXuatBans = response.data.nhaXuatBan;
			$scope.trangThaiSachs = response.data.trangThaiSach;
			$scope.items = response.data.data;
			if (response.data.totalRow > 0) {
				$scope.paging(response.data.totalRow, $scope.myFunctionLoadData() , changeSize);
			}
		});
	}
	$scope.myFunctionDetail = function (id) {
		$http.post('/Sach/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#book-detail').modal('show');
		});
	}
	$scope.myFunctionUpdate = function (id) {
		document.getElementById('file-input-update').value = "";
		$scope.updateImage = 0;
		$http.post('/Sach/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#book-update').modal('show');
		});
	}
	$scope.myFunctionCreate = function () {
		$http.post('/Sach/LoadEmpty').then(function (response) {
			if (response.data.status == "NoDanhMuc") {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Vui lòng tạo danh mục trước khi thêm sách!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
			if (response.data.status == "NoTacGia") {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Vui lòng tạo tác giả trước khi thêm sách!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
			if (response.data.status == "NoNhaXuatBan") {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Vui lòng tạo nhà xuất bản trước khi thêm sách!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
			if (response.data.status == true) {
				document.getElementById('file-input-create').value = "";
				$scope.createImage = 0;
				var output = document.getElementById('image-create');
				output.src = '/images/HinhAnhSach/empty.jpg';
				$scope.ModelCreate = response.data.data;
				$('#book-create').modal('show');
			}
		});
	}
	$scope.myFunctionDelete = function (id) {
		$scope.SelectedItem = id;
		$('#modal-delete').modal('show');
	}
	$scope.myFunctionDeleteModel = function () {
		$http.post('/Sach/Delete', { id: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Xóa thành công"

				}, {
						type: "success",
						z_index: 8000
				});
				$scope.myFunctionLoadData(true);
				$('#modal-delete').modal('hide');
			}
			else {
				if (response.data.status == 'false') {
					$.notify({
						icon: 'fas fa-exclamation-triangle',
						message: "Sách đã tồn tại trong phiếu nhập hoặc đơn đặt hàng! Không thể xóa"
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
				}
			};
		});
	}
	$scope.myFunctionUpdateModel = function () {
		var form = $('#frm-update-book');
		$(form).validate({
			rules: {
				"update-title": {
					required: true
				},
				"update-category": {
					required: true
				},
				"update-author": {
					required: true
				},
				"update-publisher": {
					required: true
				},
				"update-price": {
					required: true
				},
				"update-image": {
					required: true
				}
			},
			messages: {
				"update-title": {
					required: "Tên sách không được để trống"
				},
				"update-category": {
					required: "Danh mục không được để trống"
				},
				"update-author": {
					required: "Tác giả không được để trống"
				},
				"update-publisher": {
					required: "Nhà xuất bản không được để trống"
				},
				"update-price": {
					required: "Giá sách không được để trống"
				},
				"update-image": {
					required: "Hình ảnh không được để trống"
				}
			}
		});
		if (!form.valid()) {
			return false;
		}
		else {
			if ($scope.updateImage == 1) {
				var formData = new FormData();
				var files = $('#file-input-update').get(0).files;
				if (files.length > 0) {
					formData.append('HinhAnh', files[0]);
				}
				else {
					$.notify({
						icon: 'fas fa-exclamation-triangle',
						message: "Hình ảnh không được để trống!"
					}, {
						type: "danger",
						z_index: 8000
					});
					return false;
				}
				$http({
					url: '/Sach/UpdateFile',
					method: 'POST',
					data: formData,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (response) {
					if (response.data.status == 'true') {
						$scope.myFunctionUpdateFileModel();
					}
					else {
						if (response.data.status == 'false') {
							$.notify({
								icon: 'fas fa-exclamation-triangle',
								message: "Hình ảnh không được để trống!"
							}, {
								type: "danger",
								z_index: 8000
							});
						};
					};
				});
			}
			else {
				$scope.myFunctionUpdateFileModel();
			}
		}
	};
	$scope.myFunctionUpdateFileModel = function () {
		$http.post('/Sach/Update', {
			modelUpdate: $scope.SelectedItem
		}).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thành công"
				}, {
					type: "success",
					z_index: 8000
				});
				$scope.myFunctionLoadData(true);
				$scope.updateImage = 0;
				$('#book-update').modal('hide');
			}
			else {
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
		})
	};
	$scope.myFunctionCreateModel = function () {
		var form = $('#frm-create-book');
		$(form).validate({
			rules: {
				"create-title": {
					required: true
				},
				"create-category": {
					required: true
				},
				"create-author": {
					required: true
				},
				"create-publisher": {
					required: true
				},
				"create-price": {
					required: true
				}
				//,
				//"create-image": {
				//	required: true
				//}
			},
			messages: {
				"create-title": {
					required: "Tên sách không được để trống"
				},
				"create-category": {
					required: "Danh mục không được để trống"
				},
				"create-author": {
					required: "Tác giả không được để trống"
				},
				"create-publisher": {
					required: "Nhà xuất bản không được để trống"
				},
				"create-price": {
					required: "Giá sách không được để trống"
				}
				//,
				//"create-image": {
				//	required: "Hình ảnh không được để trống"
				//}
			}
		});
		if (!form.valid()) {
			return false;
		}
		else {
			if ($scope.createImage == 1) {
				var formData = new FormData();
				var files = $('#file-input-create').get(0).files;
				if (files.length > 0) {
					formData.append('HinhAnh', files[0]);
				}
				else {
					$.notify({
						icon: 'fas fa-exclamation-triangle',
						message: "Hình ảnh không được để trống!"
					}, {
						type: "danger",
						z_index: 8000
					});
					return false;
				}
				$http({
					url: '/Sach/CreateFile',
					method: 'POST',
					data: formData,
					headers: {
						'Content-Type': undefined
					}
				}).then(function (response) {
					if (response.data.status == 'true') {
						$scope.myFunctionCreateFileModel();
					}
					else {
						if (response.data.status == 'false') {
							$.notify({
								icon: 'fas fa-exclamation-triangle',
								message: "Hình ảnh không được để trống!"
							}, {
								type: "danger",
								z_index: 8000
							});
						};
					};
				});
			}
			else {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Hình ảnh không được để trống!"
				}, {
					type: "danger",
					z_index: 8000
				});
				return false;
			}
			
		}
	};
	$scope.myFunctionCreateFileModel = function () {
		$http.post('/Sach/Create', {
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
				$('#book-create').modal('hide');
			}
			else {
				if (response.data.status == 'error' || response.data.status == 'false') {
					$.notify({
						icon: 'fas fa-exclamation-triangle',
						message: "Đã xảy ra lỗi!"
					}, {
						type: "danger",
						z_index: 8000
					});
				};
			};
		})
	};
	//Paging
	$scope.paging = function (totalRow, callback,changeSize) {
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
				$scope.myFunctionLoadData();
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
