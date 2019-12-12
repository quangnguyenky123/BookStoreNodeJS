var mongoose = require('mongoose');


var TacGia = mongoose.Schema({
	TenTacGia: String,
	MoTa: String,
	IdTrangThai: mongoose.Types.ObjectId,//Id
	IsDeleted: Boolean,
	IsBookStore: Boolean,
	ModifiedBy: mongoose.Types.ObjectId,//Id
	ModifiedDate: Date,
	CreatedBy: mongoose.Types.ObjectId,//Id
	CreatedDate: Date
});

module.exports = mongoose.model('TacGia', TacGia);