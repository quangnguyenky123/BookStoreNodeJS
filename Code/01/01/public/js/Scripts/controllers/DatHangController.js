﻿//var role = sessionStorage.getItem('Role');
//if (role === "" || role === undefined || role === null) {
//    location.href = '/Login';
//}
//else
{
    var QuanLyDonHangConfig = {
        pageIndex: 1,
        pageSize: 5
    };
    var formatter = new Intl.NumberFormat('en-EN');
    var QuanLyDonHangController = {
        registerEvent: function () {

            $('.btn-detail').off('click').on('click', function () {
                var id = $(this).data('id');
                QuanLyDonHangController.loadDetail(id);
            });
        },
        loadDetail: function (id) {
            $.ajax({
                url: '/QuanLyDonHang/GetOrderDetail',
                type: 'GET',
                data: {
                    id: id
                },
                dataType: 'json',
                success: function (response) {
                    if (response.status) {
                        var customer = response.customer;
                        var order = response.order;
                        var orderDetail = response.orderDetail;
                        var orderDetailHtml = '';
                        var orderDetailTemplate = $('#detail-template').html();
                        var customerlHtml = '';
                        var customerTemplate = $('#customer-template').html();
                        $.each(orderDetail, function (i, item) {
                            orderDetailHtml += Mustache.render(orderDetailTemplate, {
                                TenSach: (item.strTap !== null && item.strTap !== "") ? item.title + " (Tập " + item.strTap + ")" : item.title,
                                SoLuong: item.quantity,
                                DonGia: formatter.format(item.price)
                            });
                        });

                        customerlHtml += Mustache.render(customerTemplate, {
                            TenKh: customer.tenKh,
                            DiaChi: customer.diaChi,
                            Email: customer.email,
                            SoDienThoai: customer.soDienThoai
                        });
                        $('#update-order').attr('disabled', true);
                        $('#detai-data').html(orderDetailHtml);
                        $('#customer-info').html(customerlHtml);
                        $("#order-id").val(order.id);
                        $("#order-create-date").val(order.ngayDat);
                        $("#order-delivery-date").val(order.ngayGiao);
                        QuanLyDonHangController.resetSelect();
                        $("#order-status option[value=" + order.idTrangThai + "]").attr('selected', 'selected');
                        $("#price").html(formatter.format(order.tongTien));
                        $("#order-detail").modal("show");
                    }
                }
            });
        },
        resetSelect: function () {
            for (var i = 1; i < $("#order-status option").length; i++) {
                $("#order-status option[value=" + i + "]").removeAttr('selected');
            }
        },
        loadData: function (changeSize) {
            $.ajax({
                url: '/QuanLyDonHang/LoadData',
                type: 'GET',
                data: {
                    searchString: $("#search").val(),
                    pageIndex: QuanLyDonHangConfig.pageIndex,
                    pageSize: QuanLyDonHangConfig.pageSize
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
                                TenKh: item.tenKh,
                                TrangThai: item.trangThai,
                                NgayDat: item.ngayDat,
                                TongTien: formatter.format(item.tongTien),
                                XacNhan: (item.isConfirm === true)? "Đã xác nhận":"Chưa xác nhận"
                            });
                        });
                        QuanLyDonHangController.paging(response.totalRow, function () {
                            QuanLyDonHangController.loadData();
                        }, changeSize);
                        $('#tblData').html(html);
                        QuanLyDonHangController.registerEvent();
                    }
                }
            });
        },
        updateOrder: function (id, date, status) {
            $.ajax({
                url: '/QuanLyDonHang/Update',
                type: 'POST',
                data: {
                    id: id,
                    date: date,
                    status: status
                },
                dataType: 'json',
                success: function (response) {
                    if (response.status) {
                        $("#order-detail").modal("hide");
                        QuanLyDonHangController.loadData();
                        $.notify({
                            icon: 'fas fa-check',
                            message: "Cập nhật đặt hàng thành công !"
                        }, {
                                type: "success",
                                delay: 100,
                                offset: {
                                    x: 20,
                                    y: 70
                                },
                                z_index: 8000
                            });
                    }
                }
            });
        },
        paging: function (totalRow, callback, changeSize) {
            var totalPage = Math.ceil(totalRow / QuanLyDonHangConfig.pageSize);
            if ($('#pagination a').length === 0 || changeSize === true) {
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
                    QuanLyDonHangConfig.pageIndex = page;
                }
            });
            $('.page-item').click(function (event) {
                setTimeout(callback, 10);
            });
        }

    };
    $(document).ready(function () {

        
            //$('#pageSize').change(function () {
            //    QuanLyDonHangConfig.pageSize = $('#pageSize').val();
            //    QuanLyDonHangController.loadData(true);
            //});
            //$('#search').keyup(function () {
            //    QuanLyDonHangConfig.searchString = $('#search').val();
            //    QuanLyDonHangController.loadData(true);
            //});
            //$('#order-delivery-date').change(function () {
            //    var date = $('#order-delivery-date').val();
            //    var now = new Date();
            //    var dd = now.getDate();
            //    var mm = now.getMonth() + 1;
            //    var yyyy = now.getFullYear();
            //    if (dd < 10) {
            //        dd = '0' + dd;
            //    }
            //    if (mm < 10) {
            //        mm = '0' + mm;
            //    }
            //    now = yyyy + '-' + mm + '-' + dd;
            //    if (date < now) {
            //        $.notify({
            //            icon: 'fas fa-exclamation-triangle',
            //            message: "Ngày giao hàng không hợp lệ! Ngày giao hàng phải bằng hoặc sau hôm nay!"
            //        }, {
            //                type: "warning",
            //                delay: 100,
            //                offset: {
            //                    x: 20,
            //                    y: 70
            //                },
            //                z_index: 8000
            //            });
            //        $('#order-delivery-date').val('yyyy-mm-dd');
            //    }
            //});
            //$('#order-status').change(function () {
            //    var date = $('#order-delivery-date').val();
            //    if (date === "" || date === null || date === undefined) {
            //        $.notify({
            //            icon: 'fas fa-exclamation-triangle',
            //            message: "Vui lòng chọn ngày giao !"
            //        }, {
            //                type: "warning",
            //                delay: 100,
            //                offset: {
            //                    x: 20,
            //                    y: 70
            //                },
            //                z_index: 8000
            //            });
            //        $('#order-status').val(1);
            //    }
            //    else {
            //        $('#update-order').attr('disabled', false);
            //    }
            //});
            //$('#update-order').click(function () {
            //    var date = $('#order-delivery-date').val();
            //    var id = $('#order-id').val();
            //    var status = $('#order-status').val();
            //    QuanLyDonHangController.updateOrder(id, date, status);
            //});
            //QuanLyDonHangController.loadData();
    });
}

var app = angular.module('loadDatHang', []);
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
		$http.post('/DatHang/LoadData', {
			searchString: $scope.searchString,
			page: Number($scope.pageIndex),
			pageSize: Number($scope.pageSize)
		}).then(function (response) {
			$scope.items = response.data.data;
			//$scope.Options = response.data.trangThaiGiaoHang;
			if (response.data.totalRow > 0) {
				$scope.paging(response.data.totalRow, $scope.myFunctionLoadData() ,changeSize);
			}
		});
	}
	$scope.myFunctionDetail = function (id) {
		$http.post('/DatHang/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$scope.matHangs = response.data.matHang;
			$("#order-detail").modal("show");
		});
	}
	//$scope.myFunctionUpdateModel = function () {
	//	var date = $('#order-delivery-date').val();
 //       if (date == "" || date == null || date == undefined) {
 //           $.notify({
 //               icon: 'fas fa-exclamation-triangle',
 //               message: "Vui lòng chọn ngày giao !"
 //           }, {
 //                   type: "warning",
 //                   delay: 100,
 //                   offset: {
 //                       x: 20,
 //                       y: 70
 //                   },
 //                   z_index: 8000
 //               });
	//		//$('#order-status').val(1);
	//		return false;
	//	}
	//	var now = new Date();
 //       var dd = now.getDate();
 //       var mm = now.getMonth() + 1;
 //       var yyyy = now.getFullYear();
 //       if (dd < 10) {
 //           dd = '0' + dd;
 //       }
 //       if (mm < 10) {
 //           mm = '0' + mm;
	//	}
	//	now = yyyy + '-' + mm + '-' + dd;
	//	console.log(now);
	//	console.log(date);
 //       if (date < now) {
 //           $.notify({
 //               icon: 'fas fa-exclamation-triangle',
 //               message: "Ngày giao hàng không hợp lệ! Ngày giao hàng phải bằng hoặc sau hôm nay!"
 //           }, {
 //                   type: "warning",
 //                   delay: 100,
 //                   offset: {
 //                       x: 20,
 //                       y: 70
 //                   },
 //                   z_index: 8000
 //               });
	//		$('#order-delivery-date').val('yyyy-mm-dd');
	//		return false;
 //       }
	//	$http.post('/DonDatHang/Update', { modelUpdate: $scope.SelectedItem }).then(function (response) {
	//		if (response.data.status == true) {
	//			$.notify({
	//				icon: 'fas fa-check-double',
	//				message: "Cập nhật thành công"

	//			}, {
	//				type: "success",
	//				z_index: 8000

	//			});
	//			$scope.myFunctionLoadData();
	//			$("#order-detail").modal("hide");
	//		};
	//		if (response.data.status == false) {
	//			$.notify({
	//				icon: 'fas fa-exclamation-triangle',
	//				message: "Đã xẩy ra lỗi!"
	//			}, {
	//					type: "danger",
	//					z_index:8000
	//			});
	//		};
	//		//if (response.data.status == 'error') {
	//		//	$.notify({
	//		//		icon: 'fas fa-exclamation-triangle',
	//		//		message: "Đã xẩy ra lỗi!"
	//		//	}, {
	//		//		type: "danger"
	//		//	});
	//		//};
	//	});
	//}
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

