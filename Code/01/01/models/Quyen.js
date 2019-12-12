var mongoose = require('mongoose');


var Quyen = mongoose.Schema({
	TenQuyen: String,
	Mota: String,
	IsDeleted: Boolean,
	ModifiedBy: String,//Id - QuanTriVien
	ModifiedDate: Date,
	CreatedBy: String,//Id - QuanTriVien
	CreatedDate: Date
});

module.exports = mongoose.model('Quyen', Quyen);