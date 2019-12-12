var mongoose = require('mongoose');


var DanhMuc = mongoose.Schema({
	TenDanhMuc: { type: String, required: true },
	MoTa: String,
	IdTrangThai: { type: mongoose.Types.ObjectId, required: true },//Id - TrangThaiSuDung
	IsDeleted: Boolean,
	IsBookStore: Boolean,
	ModifiedBy:  mongoose.Types.ObjectId,//Id
	ModifiedDate: Date,
	CreatedBy: mongoose.Types.ObjectId,//Id
	CreatedDate: Date
});

module.exports = mongoose.model('DanhMuc', DanhMuc);