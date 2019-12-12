var mongoose = require('mongoose');


var PhieuNhapSach = mongoose.Schema({
	MaSoPhieuNhapSach: String,
	IdNXB: mongoose.Types.ObjectId,//Id
	TenNhaXuatBan: String,
	NgayNhap: Date,
	TongTien: Number,
	IsDeleted: Boolean,
	IsBookStore: Boolean,
	ModifiedBy: mongoose.Types.ObjectId,//Id
	ModifiedDate: Date,
	CreatedBy: mongoose.Types.ObjectId,//Id
	CreatedDate: Date
});

module.exports = mongoose.model('PhieuNhapSach', PhieuNhapSach);