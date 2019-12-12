//var role = sessionStorage.getItem('Role');
//if (role === "" || role === undefined || role === null) {
//    location.href = '/Login';
//}
var tacGiaConfig = {
	pageSize: 5,
	pageIndex: 1,
	searchString: ""
};
//var tacGiaController = {

//	registerEvent: function () {
//		$('#pageSize').off('change').on('change', function () {
//			tacGiaConfig.pageSize = $('#pageSize').val();
//			tacGiaController.loadData(true);
//		})
//		$('#search').off('keyup').on('keyup', function () {
//			tacGiaConfig.searchString = $('#search').val();
//			tacGiaController.loadData(true);
//		})
//		$('.btn-delete').off('click').on('click', function () {
//			var id = $(this).data('id');
//			tacGiaController.deleteAuthor(id);
//		})
//		$('.btn-detail').off('click').on('click', function () {
//			var id = $(this).data('id');
//			tacGiaController.loadDetail(id);
//		})
//		$('.btn-update').off('click').on('click', function () {
//			var id = $(this).data('id');
//			tacGiaController.loadDetailUpdate(id);
//			$('#author-update').modal('show');
//		})

//		$('#frm-update').off('submit').on('submit', function (e) {
//			e.preventDefault();
//			var form = $(this);
//			$(form).validate({
//				rules: {
//					"txtTenTacGia": {
//						required: true
//					}
//				},
//				messages: {
//					"txtTenTacGia": {
//						required: "Tên tác giả không được để trống"
//					}
//				}
//			});
//			if (!form.valid()) {
//				return false;
//			}
//			else {
//				var Id = $('#btn-update').data('id');
//				var TenTacGia = $('#txtTenTacGia').val();
//				var MoTa = $('#txtMoTa').val();
//				var TrangThai = $('#sll-status').val();
//				tacGiaController.updateAuthor(Id, TenTacGia, MoTa, TrangThai);
//			}
//		})
//		$('#frm-create').off('submit').on('submit', function (e) {
//			e.preventDefault();
//			var form = $(this);
//			$(form).validate({
//				rules: {
//					"authorName": {
//						required: true
//					}
//				},
//				messages: {
//					"authorName": {
//						required: "Tên tác giả không được để trống"
//					}
//				}
//			});
//			if (!form.valid()) {
//				return false;
//			}
//			else {
//				var TentacGia = $('#authorName').val();
//				var MoTa = $('#authorDescription').val();
//				var TrangThai = $('#authorStatus').val();
//				tacGiaController.createAuthor(TentacGia, MoTa, TrangThai);
//			}
//		})
//	},
//	loadData: function (changeSize) {
//		$.ajax({
//			url: '/TacGia/LoadData',
//			type: 'GET',
//			data: {
//				searchString: tacGiaConfig.searchString,
//				page: tacGiaConfig.pageIndex,
//				pageSize: tacGiaConfig.pageSize
//			},
//			dataType: 'json',
//			success: function (response) {
//				if (response.status) {
//					var data = response.data;
//					var html = '';
//					var template = $('#data-template').html();
//					$.each(data, function (i, item) {
//						html += Mustache.render(template, {
//							Id: item.id,
//							TenTacGia: item.tenTacGia,
//							MoTa: item.moTa,
//							TrangThai: item.tenTrangThai
//						});
//					});
//					tacGiaController.paging(response.totalRow, function () {
//						tacGiaController.loadData();
//					}, changeSize);
//					$('#tblData').html(html);
//					tacGiaController.registerEvent();
//				}
//			}
//		})
//	},
//	loadDetail: function (id) {
//		$.ajax({
//			url: '/TacGia/LoadDetail',
//			type: 'GET',
//			data: {
//				id: id
//			},
//			dataType: 'json',
//			success: function (response) {
//				if (response.status) {
//					var data = response.data;
//					var html = '';
//					var template = $('#detail-template').html();
//					$.each(data, function (i, item) {
//						html += Mustache.render(template, {
//							Id: item.id,
//							TenTacGia: item.tenTacGia,
//							MoTa: item.moTa,
//							TrangThai: item.tenTrangThai
//						});
//					});
//					$('#detail-content').html(html);
//					$('#author-detail').modal('show');
//				}
//			}
//		})
//	},
//	loadDetailUpdate: function (id) {
//		$.ajax({
//			url: '/TacGia/LoadDetail',
//			type: 'GET',
//			data: {
//				id: id
//			},
//			dataType: 'json',
//			success: function (response) {
//				if (response.status) {
//					var data = response.data;
//					var html = '';
//					var template = $('#update-template').html();
//					$.each(data, function (i, item) {
//						stt = item.trangThai;
//						html += Mustache.render(template, {
//							Id: item.id,
//							TenTacGia: item.tenTacGia,
//							MoTa: item.moTa,
//							TrangThai: item.trangThai
//						});
//					});
//					$('#author-update').html(html);
//					var stt = $('#sll-status').data('stt');
//					if (stt == 1) {
//						$('#sll-status option[value=1]').attr('selected', 'selected');
//					}
//					else {
//						$('#sll-status option[value=2]').attr('selected', 'selected');
//					}

//					tacGiaController.registerEvent();
//				}
//			}
//		})
//	},
//	updateAuthor: function (Id, TenTacGia, MoTa, TrangThai) {
//		$.ajax({
//			url: '/TacGia/Update',
//			type: 'POST',
//			data: {
//				Id: Id,
//				TenTacGia: TenTacGia,
//				MoTa: MoTa,
//				TrangThai: TrangThai
//			},
//			dataType: 'json',
//			success: function (response) {
//				if (response.status == 1) {
//					$.notify({
//						icon: 'fas fa-check-double',
//						message: "Cập nhật thành công"

//					}, {
//						type: "success",
//						z_index: 8000

//					});
//					tacGiaController.loadData();
//				}
//				else {
//					if (response.status == 0) {
//						$.notify({
//							icon: 'fas fa-exclamation-triangle',
//							message: "Tên tác giả đã tồn tại!"

//						}, {
//							type: "danger",
//							z_index: 8000
//						});
//					}
//				}
//			}
//		})
//	},
//	createAuthor: function (TenTacGia, MoTa, TrangThai) {
//		$.ajax({
//			url: '/TacGia/Create',
//			type: 'POST',
//			data: {
//				TenTacGia: TenTacGia,
//				MoTa: MoTa,
//				TrangThai: TrangThai
//			},
//			dataType: 'json',
//			success: function (response) {
//				if (response.status == 1) {
//					$.notify({
//						icon: 'fas fa-check-double',
//						message: "Thêm mới thành công"

//					}, {
//						type: "success",
//						z_index: 8000

//					});
//					tacGiaController.loadData(true);
//				}
//				else {
//					if (response.status == 0) {
//						$.notify({
//							icon: 'fas fa-exclamation-triangle',
//							message: "Tên tác giả đã tồn tại!"

//						}, {
//							type: "danger",
//							z_index: 8000
//						});
//					}
//				}
//			}
//		})
//	},
//	deleteAuthor: function (id) {
//		$.ajax({
//			url: '/TacGia/Delete',
//			type: 'POST',
//			data: {
//				id: id
//			},
//			dataType: 'json',
//			success: function (response) {
//				if (response.status == 1) {
//					$.notify({
//						icon: 'fas fa-check-double',
//						message: "Xóa thành công"

//					}, {
//						type: "success"
//					});

//					tacGiaController.loadData(true);
//				}
//				else {
//					if (response.status == 0) {
//						$.notify({
//							icon: 'fas fa-exclamation-triangle',
//							message: "Tác giả đã tồn tại sách! Không thể xóa"

//						}, {
//							type: "danger"
//						});
//					}
//				}
//			}
//		})
//	},
//	paging: function (totalRow, callback, changeSize) {
//		var totalPage = Math.ceil(totalRow / tacGiaConfig.pageSize)
//		if ($('#pagination a').length == 0 || changeSize === true) {
//			$('#pagination').empty();
//			$('#pagination').removeData("twbs-pagination");
//			$('#pagination').unbind('page');
//		}
//		$('#pagination').twbsPagination({
//			totalPages: totalPage,
//			visiblePages: 5,
//			first: 'Trang đầu',
//			prev: 'Trang trước',
//			next: 'Trang sau',
//			last: 'Trang cuối',
//			onPageClick: function (event, page) {
//				tacGiaConfig.pageIndex = page;
//			}
//		});
//		$('.page-item').click(function (event) {
//			setTimeout(callback, 10);
//		})
//	}
//};
    //$(document).ready(function () {
    //    //tacGiaController.loadData();
    //    //$('#btn-add').off('click').on('click', function () {
    //    //    $('#author-create').modal('show');
    //    //})
    //})
var app = angular.module('loadTacGia', []);
app.controller('myCtrl', function ($scope, $http) {
	$scope.pageSize = "5";
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
		$http.post('/TacGia/LoadData', {
			searchString: $scope.searchString,
			page: Number($scope.pageIndex),
			pageSize: Number($scope.pageSize)
		}).then(function (response) {
			$scope.items = response.data.data;
			$scope.Options = response.data.categoryStatus;
			if (response.data.totalRow > 0) {
				$scope.paging(response.data.totalRow,$scope.myFunctionLoadData(), changeSize);
			}
		});
	}
	$scope.myFunctionDetail = function (id) {
		$http.post('/TacGia/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#author-detail').modal('show');
		});
	}
	$scope.myFunctionDelete = function (id) {
		$scope.SelectedItem = id;
		$('#author-delete').modal('show');
	}
	$scope.myFunctionUpdate = function (id) {
		$http.post('/TacGia/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#author-update').modal('show');
		});
	}
	$scope.myFunctionCreate = function () {
		$scope.SelectedItem = [{ TenTacGia: '', MoTa: '', IdTrangThai:'5dd6c4d03d9bfe5770f9911e' }];
		$('#author-create').modal('show');
	}
	$scope.myFunctionUpdateModel = function () {
		$http.post('/TacGia/Update', { modelUpdate: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thành công"
				}, {
					type: "success",
					z_index: 8000
				});
				$scope.myFunctionLoadData();
				$('#author-update').modal('hide');
			}
			if (response.data.status == 'false') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Tên tác giả đã tồn tại!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
			if (response.data.status == 'error') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xảy ra lỗi!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
		});
	}
	$scope.myFunctionCreateModel = function () {
		$http.post('/TacGia/Create', { modelCreate: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Thêm mới thành công"
				}, {
					type: "success",
					z_index: 8000
				});
				$scope.myFunctionLoadData(true);
				$('#author-create').modal('hide');
			}
			if (response.data.status == 'false') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Tên tác giả đã tồn tại!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
			if (response.data.status == 'error') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xảy ra lỗi!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
		});		
	}
	$scope.myFunctionDeleteModel = function () {
		$http.post('/TacGia/Delete', { id: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Xóa thành công"
				}, {
					type: "success",
					z_index: 8000
				});
				$scope.myFunctionLoadData(true);
				$('#author-delete').modal('hide');
			}
			if (response.data.status == 'false') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Tác giả đã tồn tại sách! Không thể xóa"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
			if (response.data.status == 'error') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Đã xảy ra lỗi!"
				}, {
					type: "danger",
					z_index: 8000
				});
			}
		});
	}
	$scope.paging = function (totalRow, callback, changeSize) {
		var totalPage = Math.ceil(totalRow / $scope.pageSize);	
		if (changeSize == true) {
			$('#pagination').empty();
			$('#pagination').removeData("twbs-pagination");
			$('#pagination').unbind('page');
		}
		$('#pagination').twbsPagination({
			//startPage: $scope.pageIndex,
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
	}
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
