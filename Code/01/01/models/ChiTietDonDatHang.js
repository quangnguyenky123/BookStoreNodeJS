var mongoose = require('mongoose');


var ChiTietDonDatHang = mongoose.Schema({
	IdDonDatHang: mongoose.Types.ObjectId,//Id - DonDatHang
	IdSach: mongoose.Types.ObjectId,//Id - Sach
	SoLuong: Number,
	DonGia: Number//Tong so tien
});

module.exports = mongoose.model('ChiTietDonDatHang', ChiTietDonDatHang);