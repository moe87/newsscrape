function saveArticle(id, index) {
	console.log("DATA:"+id);
	$.ajax("/api/article/"+id , {
		type: "PUT",
		data: {"saved": true}
	}).then(
		function() {
			$("#article_"+index).remove();
		}
	);
}

function deleteArticle(id, index) {
	console.log("DATA:"+id);
	$.ajax("/api/article/"+id , {
		type: "DELETE"
	}).then(
		function() {
			$("#article_"+index).remove();
		}
	);
}


function clear() {
	$.ajax("/api/clear").then(function() {
		$("#latestNews").html('<div class="card"><div class="card-body">Articles are cleard, please scrape for latest articles!!!</div></div>');
	});
}

function saveNote(btnId, textId) {
	var articleId = $("#"+btnId).val();
	var note = $("#"+textId).val();

	console.log(articleId);
	console.log(note);

	var notes = {
		_articleId: articleId,
		note: note
	};

	$.ajax("/api/note", {
		type: 'POST',
		data: notes
	}).then(
		function(res) {
			console.log(res);
		}
	);
}

function deleteNote(id) {
	$.ajax("/api/note/"+id, {
		type: 'DELETE'
	}).then(
		function(res) {
			console.log(res);
			$("#"+id).remove();
			$('#notes').modal('hide');
			$('.note-item').remove();
		}
	);
}

$(function() {
	$("#addNoteBtn").on("click", function(event) {
		console.log($("#addNoteBtn").val());
		$.ajax("/api/note/"+$("#addNoteBtn").val())
			.then(function(response) {
				console.log(response);
				for(i=0; i<response.length; i++) {
					$(".notes-list").append('<li id='+response[i]._id+' class="list-group-item note-item">'+response[i].note+'&nbsp;<button class="btn btn-danger" onclick="deleteNote(\''+response[i]._id+'\')">X</button></li>');
				}
			});
	});
});