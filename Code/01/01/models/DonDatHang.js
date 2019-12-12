var mongoose = require('mongoose');


var DonDatHang = mongoose.Schema({
	MaSoDonDatHang: String,
	IdKhachHang: mongoose.Types.ObjectId,//Id - KhachHang
	IdNguoiBan: mongoose.Types.ObjectId,//Id - NguoiBan
	NgayDat: Date,
	NgayGiao: Date,
	TongTien: Number,
	IdTrangThaiGiaoHang: mongoose.Types.ObjectId,//Id - TrangThaiGiaoHang
	XacNhan: Boolean,
	IsDeleted: Boolean,
	IsBookStoreBuy: Boolean,
	IsBookStoreSale: Boolean,
	ModifiedBy: mongoose.Types.ObjectId,//Id
	ModifiedDate: Date,
	CreatedBy: mongoose.Types.ObjectId,//Id
	CreatedDate: Date
});

module.exports = mongoose.model('DonDatHang', DonDatHang);