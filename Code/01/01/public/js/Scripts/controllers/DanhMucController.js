
var app = angular.module('loadDanhMuc', []);
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
        $http.post('/DanhMuc/LoadData', {
            searchString: $scope.searchString,
            page: Number($scope.pageIndex),
            pageSize: Number($scope.pageSize)
        }).then(function (response) {
            $scope.items = response.data.data;
			$scope.Options = response.data.categoryStatus;
			if (response.data.totalRow > 0) {
				$scope.paging(response.data.totalRow, $scope.myFunctionLoadData() ,changeSize);
			}
			$scope.AccessControlAdmin = response.data.AccessControlAdmin;
		
		});
    }
	$scope.myFunctionDetail = function (id) {
		$http.post('/DanhMuc/LoadDetail', { id: id }).then(function (response) {
			$scope.SelectedItem = response.data.data;
			$('#category-detail').modal('show');
		});
	}
    $scope.myFunctionUpdate = function (id) {
        $http.post('/DanhMuc/LoadDetail', { id: id }).then(function (response) {
            $scope.SelectedItem = response.data.data;
            $scope.Options = response.data.categoryStatus;
            $('#category-update').modal('show');
        });
    }
    $scope.myFunctionCreate = function (id) {
		$scope.ModelCreate = [{ TenDanhMuc: '', MoTa: '', IdTrangThai: '5dd6c4d03d9bfe5770f9911e' }];
        $('#category-create').modal('show');
    }
    $scope.myFunctionDelete = function (id) {
        $scope.SelectedItem = id;
        $('#modal-delete').modal('show');
    }
    $scope.myFunctionDeleteModel = function () {
        $http.post('/DanhMuc/Delete', { id: $scope.SelectedItem }).then(function (response) {
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
                        message: "Danh mục đã tồn tại sách! Không thể xóa"
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
                }
            };
        });
    }
	$scope.myFunctionUpdateModel = function () {
		var formUpdate = $("#frm-update");
		$(formUpdate).validate({
			rules: {
				"txtTenDanhMuc": {
					required: true
				}
			},
			messages: {
				"txtTenDanhMuc": {
					required: "Tên danh mục không được để trống"
				}
			}
		});
		if (!formUpdate.valid()) {
			return false;
		}
		$http.post('/DanhMuc/Update', { modelUpdate: $scope.SelectedItem }).then(function (response) {
			if (response.data.status == 'true') {
				$.notify({
					icon: 'fas fa-check-double',
					message: "Cập nhật thành công"

				}, {
					type: "success",
					z_index: 8000

                });
                $scope.myFunctionLoadData();
                $('#category-update').modal('hide');
			};
			if (response.data.status == 'false') {
				$.notify({
					icon: 'fas fa-exclamation-triangle',
					message: "Tên danh mục đã tồn tại!"

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
	$scope.myFunctionCreateModel = function () {
		var formCreate = $("#frm-create");
		$(formCreate).validate({
			rules: {
				"categoryName": {
					required: true
				}
			},
			messages: {
				"categoryName": {
					required: "Tên danh mục không được để trống"
				}
			}
		});
		if (!formCreate.valid()) {
			return false;
		}
        $http.post('/DanhMuc/Create', {
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
                $('#category-create').modal('hide');
            }
            else {
                if (response.data.status == 'false') {
                    $.notify({
                        icon: 'fas fa-exclamation-triangle',
                        message: "Tên danh mục đã tồn tại!"

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
	$scope.myFunctionAccessControlAdmin = function () {
		if ($scope.AccessControlAdmin == true) {
			return true;
		}
		if ($scope.AccessControlAdmin == false) {
			return false;
		}
	}
});