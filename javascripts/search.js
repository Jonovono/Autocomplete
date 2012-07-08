var back = [];

$(function() {
	// Begin by being on youtube search tab
	youtube_search();
	
	// Functions to define youtube search and normal search
	
	function normal_search() {
		$("#search").focus();
		$("#search").attr("placeholder", "Search for any artist, album, or song");

		$( "#search" ).catcomplete({	
			focus: function(event, ui) {
				if (ui.item) {
					$("#search").val(ui.item.label);
				}
				return false;
			},
			select: function(event, ui) {
				//Make sure ui.item is true
				if (ui.item) {
					//Set value of search field to selection
					$("#search").val(ui.item.label);		

					//If selected a album call the function to display
					//a list of songs from that album
					if (ui.item.category == "Albums"  || ui.item.category == "Live" || ui.item.category == "Album" ||
					ui.item.category == "Compilation" || ui.item.category == "EP") {
						getSongsForAlbumAndDisplay(ui.item);
					}

					else if (ui.item.category == "Artists") {
						getAlbumsForArtist(ui.item);
					}

					else if (ui.item.category == "Songs" || ui.item.category == "Top Songs") {
						$(ui).css({opacity: 0.4});
						addSongToPlaylist(ui.item);
					}
				}
				return false;
			},
			delay: 700,
			source: function (request,response) {
				var encode = encodeURI(request.term);
				$("#search").addClass("searching");
				$.get('autocomplete/'+request.term, function(data) {
					$("#search").removeClass("searching");
					var test = "";
					console.log('poop');
					console.log(data);
					if (data == 'nothing') {
						var items = new Array();
						  items.push({value: "No matches found. Dearly sorry. Try again.", 
							category: "No Results", isa: 'None', 
							label: "No matches found. Dearly sorry. Try again.", 
						});
						response(items);
					} else {
						back.pop();
						back.push(data);
						response(data);
					}
					// back.push(data);
					// setAutocompleter(data);
				});

				// now.receiveResponse = function(data) {
				// 	$("#search").removeClass("searching");
				// 	var test = "";
				// 	if (!data.length) {
				// 		response("");
				// 	} else {
				// 		back.pop();
				// 		back.push(data);
				// 		response(data);
				// 	}
				// }
				// 
				// now.ready(function() {
				// 	$("#search").addClass("searching");
				// 	now.sendAutocomplete(encode);
				// });
			},
			minLength: 0
		});
	}
	
	function youtube_search() {
		$("#search").focus();
		$("#search").attr("placeholder", "Search Youtube for any song or video (then press enter or click a dropdown to search)");
		var autocomplete = new Array();
		$( "#search" ).catcomplete({	
			focus: function(event, ui) {
				if (ui.item) {
	        $("#search").val(ui.item.label);
	      }
	      return false;
	    },
	    select: function(event, ui) {
				//Make sure ui.item is true
				if (ui.item) {
					if (ui.item.category == "Songs" || ui.item.category == "Top Songs" || ui.item.category == "Youtube Songs") {
						$(ui.item).css({opacity: 0.4});
						addSongToPlaylist(ui.item);
					} else {
						if (ui.item != "Add to playlist") { 
							//Set value of search field to selection
							$("#search").val(ui.item.label);	
							getYoutubeSearchResults(ui.item);
						}
					}
 				}
				return false;
			},
			delay: 0,
			source: function (request,response) {
				var search = request.term;
				$.ajax({
					url: "http://clients1.google.com/complete/search?client=youtube&hl=en&ds=yt&cp=5&gs_id=k&q=" + search + "&callback=google.sbox.p0",
					dataType: 'jsonp',
					success: function(data) {
						search = $("#search").val();
						if (search == "") {
							$( "#search" ).catcomplete( "close");
						} else {
							autocomplete = [];

							$.each(data[1], function(key, val) {
								autocomplete.push({value: val[0], category: "Autocomplete", label: val[0]});
							});
						}
					},
					type: "post"
				});
					
				if (!jQuery.isEmptyObject(autocomplete)) {
					back.push(autocomplete);
					response(autocomplete);
				} else {
					$(".ui-autocomplete-table").hide();
				}
			},
			minLength: 0
		});
	}
	
	// Normal search tab clicked
	$("#normal_search").click(function() {
		normal_search();
	});
	
	// When youtube tab clicked
	$("#youtube_search").click(function() {
			youtube_search();
	});
	

	// If press enter when searching youtube
	$(document).keypress(function(e){
		if(e.which == 13 ){
			if ( ($("#youtube_search").hasClass('active'))) {
				var search = $("#search").val();
				if (search != "") {
					getYoutubeSearchResults(search);
				}
			}
		}
	});
/////////////////////////////////////////////////////////////////////////////
//---------------------			FUNCTIONS ------------------------------------//
////////////////////////////////////////////////////////////////////////////
	// 
	// //Delay before sending request to server
	$( "#search" ).catcomplete( "option", "delay", 10 );
	// 		
			
	//Called when the drop down is closed
	$( "#search" ).bind( "catcompleteclose", function(event, ui) {
		ytPage = 11;
		page = 2;
		back = [];							
		//Initialize the search input to normal state
		initializeAutocomplete();
		$("#search").val('');
	});
				
	//Put the spinner on when loading ajax call. Stop when request returned. 
	$('#search')
	.ajaxStart(function() {
		$(this).addClass("ui-autocomplete-loading");
	})
	.ajaxStop(function() {
		$(this).removeClass("ui-autocomplete-loading");
	});
					
				
	//Function initalizes the search to normal state
	//so when it is searched it performs autocompletion.				
	function initializeAutocomplete() {	
		if ( ($("#youtube_search").hasClass('active'))) {
			youtube_search();			
		} 
		else {
			normal_search();
		}
	}
});