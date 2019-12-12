var mongoose = require('mongoose');

var TrangThaiSach = mongoose.Schema({
	TenTrangThai: String,
	Class: String,
	MoTa: String
});
module.exports = mongoose.model('TrangThaiSach', TrangThaiSach);