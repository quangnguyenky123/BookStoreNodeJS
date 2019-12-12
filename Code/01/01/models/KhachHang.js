var mongoose = require('mongoose');


var KhachHang = mongoose.Schema({
	TaiKhoan: String,
	MatKhau: String,
	TenKhachHang: String,
	DiaChi: String,
	Email: String,
	SoDienThoai: String,
	IsDeleted: Boolean,
	ModifiedBy: String,//Id
	ModifiedDate: Date,
	CreatedBy: String,//Id
	CreatedDate: Date
});

module.exports = mongoose.model('KhachHang', KhachHang);