var mongoose = require('mongoose');


var ChiTietPhieuNhapSach = mongoose.Schema({
	IdPhieuNhapSach: mongoose.Types.ObjectId,//Id - PhieuNhapSach
	IdSach: mongoose.Types.ObjectId,//Id - Sach
	SoLuong: Number,
	DonGia: Number,//Tong so tien
	IsDeleted: Boolean,
	ModifiedBy: mongoose.Types.ObjectId,//Id
	ModifiedDate: Date,
	CreatedBy: mongoose.Types.ObjectId,//Id
	CreatedDate: Date
});

module.exports = mongoose.model('ChiTietPhieuNhapSach', ChiTietPhieuNhapSach);