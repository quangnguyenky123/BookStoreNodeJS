var mongoose = require('mongoose');


var TrangThaiGiaoHang = mongoose.Schema({
	TenTrangThaiGiaoHang: String,//Id
	MoTa: String
});

module.exports = mongoose.model('TrangThaiGiaoHang', TrangThaiGiaoHang);