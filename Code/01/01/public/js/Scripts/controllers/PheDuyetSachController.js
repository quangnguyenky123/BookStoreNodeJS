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


var app = angular.module('loadPheDuyetSach', []);
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
		$http.post('/PheDuyetSach/LoadData', {
			searchString: $scope.searchString,
			page: Number($scope.pageIndex),
			pageSize: Number($scope.pageSize)
		}).then(function (response) {
			$scope.items = response.data.data;
			$scope.Options = response.data.trangThaiChapNhan;
			if (response.data.totalRow > 0) {
				$scope.paging(response.data.totalRow, changeSize);
			}
		});
	}

	$scope.myFunctionUpdate = function (id) {
		$http.post('/PheDuyetSach/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#book-update').modal('show');
		});
	}

	$scope.myFunctionUpdateModel = function () {
		$http.post('/PheDuyetSach/Update', {
			modelUpdate: $scope.SelectedItem
		}).then(function (response) {
			if (response.data.status == true) {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thành công"
				}, {
					type: "success",
					z_index: 8000
				});
				$scope.myFunctionLoadData(true);
				$('#book-update').modal('hide');
			}
			else {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xảy ra lỗi!"
				}, {
					type: "danger",
					z_index: 8000
				});
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
		$(".page-item").off('click').on('click', function (e) {
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
			//$http.post('/Sach/Create', {
			//	formData: formData,
			//	modelCreate: $scope.ModelCreate
			//})

