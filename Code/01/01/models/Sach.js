var mongoose = require('mongoose');


var Sach = mongoose.Schema({
	MaSoSach: String,
	TenSach: { type: String, required: true },
	IdTacGia: { type: mongoose.Types.ObjectId, required: true },//Id - TacGia
	IdNXB: { type: mongoose.Types.ObjectId, required: true },//Id -  NhaXuatBan
	IdDanhMuc: { type: mongoose.Types.ObjectId, required: true },//Id - DanhMuc
	Tap: Number,
	SoLuong: Number,
	Gia: Number,
	TomTat: String,
	NgayThem: Date,
	IdTrangThai: { type: mongoose.Types.ObjectId, required: true },//Id - TrangThaiSach
	HinhAnh: String,//Url
	SoLuotMua: Number,
	IdTrangThaiChapNhan: mongoose.Types.ObjectId,
	IsBookStore: Boolean,
	IsDeleted: Boolean,
	ConfirmedBy:  mongoose.Types.ObjectId,//Id - QuanTriVien
	ConfirmedDate: Date,
	ModifiedBy:  mongoose.Types.ObjectId,//Id - QuanTriVien
	ModifiedDate: Date,
	CreatedBy: { type: mongoose.Types.ObjectId, required: true },//Id - QuanTriVien
	CreatedDate: Date
});

module.exports = mongoose.model('Sach', Sach);