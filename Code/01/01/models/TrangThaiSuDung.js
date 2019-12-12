var mongoose = require('mongoose');


var TrangThaiSuDung = mongoose.Schema({
	TenTrangThai: String,
	Class: String,
	MoTa: String
	//IsDeleted: Boolean,
	//ModifiedBy: String,//Id
	//ModifiedDate: Date,
	//CreatedBy: String,//Id
	//CreatedDate: Date
});

module.exports = mongoose.model('TrangThaiSuDung', TrangThaiSuDung);