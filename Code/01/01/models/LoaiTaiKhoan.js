var mongoose = require('mongoose');


var LoaiTaiKhoan = mongoose.Schema({
	TenLoaiTaiKhoan: String,
	Icon: String,
	MoTa: String
});

module.exports = mongoose.model('LoaiTaiKhoan', LoaiTaiKhoan);