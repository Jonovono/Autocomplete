$.widget( "custom.catmenu", $.ui.menu, {
  _findSubmenus: function() {
    return $([]);
  },
  _findNewItems: function(root) {
    return root.find( "li:not(.ui-menu-item)" );
  },
  _menuItems: function(menu) {
    return menu.find("ul").children(".ui-menu-item");
  },
  _prevItems: function() {
    var previous = this.active.prevAll(".ui-menu-item")
    .add(
      this.active
      .closest(".ui-autocomplete-category")
      .prevAll(".ui-autocomplete-category")
      .find(".ui-menu-item"));

      // HACK: $.fn.add sorts by DOM-order, but not on .add([])
      // so we re-sort it using $.unique
      return $($.unique(previous).get().reverse());
  },
  _nextItems: function() {
    return this.active.nextAll(".ui-menu-item")
    .add(
      this.active
      .closest(".ui-autocomplete-category")
      .nextAll(".ui-autocomplete-category")
      .find(".ui-menu-item"));
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	////////////////////////////////////////////////////////////////////////////////////////////
$.widget( "custom.catcomplete", $.ui.autocomplete, {
  menuWidget: "catmenu",
  menuRoot: "<div></div>",

  _renderItem: function( ul, item ) {

    //var listItem = $( "<div></div>" )
    var listItem = $( "<li></li>" )
    .data( "item.autocomplete", item )
    .append( $( "<a></a>" ).text( item.label ) )
    .appendTo( ul[0] );

		listItem.click(function() {
			if (item.category == "Songs" || item.category == "Youtube Songs") {
				//console.log($(listItem).nextAll().next('td'));
				listItem.css({opacity: 0.4});
				
				var index = $(listItem).index();
				var element = $(listItem).parents('td').next('td').find('li')[index];
				$(element).css({ opacity: 0.4});
				
			//	(test.parentElement).parents('td').next('td').closest('li');
			}
		});


		//If item is an aritst append View Albums
    if( item.category == "Artists" ) {
      // listItem.find('a').prepend("<img src='http://dummyimage.com/40x30/09f/fff&text=x' width='40' />");
      var albums = $( "<li></li>")
      .data("item.autocomplete", "View Albums")
      .append( $("<a></a>").text("View Albums"))
      .appendTo(ul[1]);
			//Calls function to get all albums for the artist
      albums.click(function() {
					getAlbumsForArtist(item);
      });
			//And append view songs for that artist
      var songs = $( "<li></li>")
      .data("item.autocomplete", "View Top Songs")
      .append( $("<a></a>").text("View Top Songs"))
      .appendTo(ul[2]);
			songs.click(function() {
				getTopSongsForArtist(item);
			});

			//Else if item is an album
    } else if (item.isa == "Album") {
      //	listItem.find('a').prepend("<img src='http://dummyimage.com/40x40/f90/fff&text=a' width='40' />");
      var addAll = $( "<li></li>")
      .data("item.autocomplete", "Add to playlist")
      .append( $("<a></a>").text("Add to playlist"))
      .appendTo(ul[1]);

			//Adds all the songs to the playlist
      addAll.click(function() {
					addAllToPlaylist(item);
      });

			//View all songs on album. Not add to playlist
      var viewAll = $( "<li></li>")
      .data("item.autocomplete", "View Songs")
      .append( $("<a></a>").text("View Songs"))
      .appendTo(ul[2]);
      viewAll.click(function() {
					getSongsForAlbumAndDisplay(item);
      });				

    } else if (item.category == "Songs" || item.category == "Top Songs" || item.category == "Youtube Songs") {
      var addSong = $( "<li></li>")
      .data("item.autocomplete", "Add to playlist")
      .append( $("<a></a>").text("Add to playlist"))
      .appendTo(ul[1]);
      addSong.click(function(e) {
        //$("#playlist").append(item.label+'<br />');
			addSong.css({opacity: 0.4});
				addSongToPlaylist(item);
      });
    } else if (item.isa == "None") {
	
		} else if (item.category = "Autocomplete") {
	    var addSearch = $( "<li></li>")
	    .data("item.autocomplete", "Search")
	    .append( $("<a></a>").text("Search"))
	    .appendTo(ul[1]);
	    addSearch.click(function(e) {
		console.log(item.value);
				getYoutubeSearchResults(item.value);
      });
  
  
  
  
		}
    return listItem;
  },

  _renderMenu: function( ul, items ) {
    var self = this,
    currentCategory = "",
    categoryList = null;
				
    var table = $("<table class='ui-autocomplete-table'></table>").appendTo(ul);
		table.append("<a href='#' id='back-button' onclick='navBack()' class='icon-arrow-left'></a>");
		

		table.append("<a href='#' id='close-button' onclick='closeDropDown()' class='icon-remove'></a>");
    // table.append("<button id='testbut' onclick='closeDropDown()'>Close</button>");
		//table.append("<span id='close-button' onclick='closeDropDown()' class='ui-state-defualt ui-corner-all ui-icon ui-icon-circle-close'></span>");
		//table.append("<span id='back-button' onclick='navBack()' class='ui-state-defualt ui-corner-all ui-icon ui-icon-arrowthick-1-w'></span>");
    //table.append("<button id='testbut' onclick='navBack()'>Back</button>");
    $.each( items, function( index, item ) {
	console.log(item.category);
		//	console.log(item);
      if ( item.category != currentCategory ) {
        var src = "<tr class='ui-autocomplete-category'><th><h3></h3></th><td><ul></ul></td><td><ul></ul></td><td><ul></ul></td></tr>";
        categoryList = $(src).appendTo(table)
        .find('h3')
        .text(item.category)
        .end()
        .find('ul');
        //.find('ul')[0];
        currentCategory = item.category;
				if (currentCategory == "Top Songs") {
					//table.append("<button id='testbut' onclick='loadMoreTopSongs()'>More Songs</button>");
					// table.append("<button id='moreSongs'>More Songs</button>");
					table.append("<a href='#' id='moreSongs' class='btn btn-warning'>More Songs</a>")
					$("#moreSongs").click(function() {
						loadMoreTopSongs();
					});
			    
				}
				
				if (currentCategory == "Youtube Songs") {
					//table.append("<button id='testbut' onclick='loadMoreTopSongs()'>More Songs</button>");
					// table.append("<button id='moreSongs'>More Songs</button>");
					table.append("<a href='#' id='more-youtube' class='btn btn-warning'>More Results</a>")
					$("#more-youtube").click(function() {
						loadMoreYoutube();
					});
				}
      }
      self._renderItem( categoryList, item);
    });
  }
});


function navBack() {
	back.pop();
	javascript: console.log(back);
  var prev = back.pop();
	javascript: console.log(back);
	page = page -1;


  if (prev == null) {
    $("#search").catcomplete("close");
}
   else {
    //var prev = back.pop();

    $("#search").catcomplete({
      source: prev
    });

    $("#search").catcomplete('search', '');
    back.push(prev);
  }
}

function closeDropDown() {
  $("#search").catcomplete('close');
}
