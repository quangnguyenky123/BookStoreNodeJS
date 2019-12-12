var mongoose = require('mongoose');


var TrangThaiChapNhan = mongoose.Schema({
	TenTrangThaiChapNhan: String,
	MoTa: String
});

module.exports = mongoose.model('TrangThaiChapNhan', TrangThaiChapNhan);