var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	note: {
		type: String,
		required: true
	},
	_articleId: {
		type: Schema.Types.ObjectId,
		ref: "Article"
	}
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;