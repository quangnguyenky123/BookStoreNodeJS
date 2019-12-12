var mongoose = require('mongoose');


var QuanTriVien = mongoose.Schema({
	TaiKhoan: { type: String, required: true },
	MatKhau: { type: String, required: true },
	TenQuanTriVien: { type: String, required: true },
	Email: { type: String, required: true },
	DiaChi: { type: String, required: true },
	SoDienThoai: { type: Number, required: true },
	IdQuyen: { type: mongoose.Types.ObjectId, required: true },//Id - Quyen
	IdLoaiTaiKhoan: { type: mongoose.Types.ObjectId, required: true },
	IdTrangThai: { type: mongoose.Types.ObjectId, required: true },
	IsDeleted: Boolean,
	ModifiedBy: mongoose.Types.ObjectId,//Id
	ModifiedDate: Date,
	CreatedBy: mongoose.Types.ObjectId,//Id
	CreatedDate: Date
});
module.exports = mongoose.model('QuanTriVien', QuanTriVien);