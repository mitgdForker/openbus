(function(){

	OpenBus.Busstop = (function()
	{
		var $modal = null;
	
		var $title = null;
	
		var $next = null;
		var $streetview = null;
	
		var createTabs = true;
	
		var hide = function()
		{
			$('#busstopDetail').modal('hide');
		};
		
		var show = function()
		{
			$('#busstopDetail').modal('show');
		};

		var title = function(title)
		{
			$title.html(title);
		};
		
		var getStreetview = function(marker)
		{
			var latLng = marker.getPosition()
	
			var headings = [];
			for(var i = 0, x = OpenBus.Busstops[marker.title].length; i < x; i += 1)
			{
				var pos = new google.maps.LatLng(OpenBus.Busstops[marker.title][i].lat, OpenBus.Busstops[marker.title][i].lng);
				var heading = google.maps.geometry.spherical.computeHeading(latLng, pos);
				headings.push(heading);
			}
			$('#streetview').html('');
			for(var i = 0, x = headings.length; i < x; i += 1)
			{
				$('#streetview').append('<img src="http://maps.googleapis.com/maps/api/streetview?size=400x200&heading=' + headings[i] + '&location=' + latLng.lat() + ',' + latLng.lng() + '&sensor=false&key=AIzaSyDBoyVRJC-572Wj7Pfgf10Z9OjRHHDkgOE">');
			}
		};
	
		var clearTabs = function()
		{
			//@TODO Scroll next?
			$next.html('');
			$streetview.html('');
		};
	
		var addOverview = function(departures)
		{
			var html = [];
			
			html.push('<ul class="next">');
			
			$(departures).each(function(index, item)
			{
				var timeTo = OpenBus.Utils.TimeTo(item.Date);
				if(timeTo.hour === 0 && timeTo.minutes < 0)
				{
					return true;
				}
				if(timeTo.hours === 0)
				{
					if(timeTo.minutes === 0)
					{
						item.timeTo = '<strong>jetzt</strong>';
					}
					if(timeTo.minutes === 1)
					{
						item.timeTo = ' in <strong>einer Minute</strong>';
					}
					else
					{
						item.timeTo = ' in <strong>' + timeTo.minutes + ' Minuten</strong>';
					}
				}
				else if(timeTo.hours === 1)
				{
					item.timeTo = ' in <strong>einer Stunde</strong> und ';
					if(timeTo.minutes === 1)
					{
						item.timeTo += '<strong>einer Minute</strong>';
					}
					else
					{
						item.timeTo += '<strong>' + timeTo.minutes + ' Minuten</strong>';
					}
				}
				else{
					item.timeTo = 'in mehr als <strong> zwei Stunden</strong>';
				}
			
				var tpl = OpenBus.Utils.Tpl.parse(item, '<li><div><span class="badge badge-info">#{number}</span> Richtung <strong>#{direction}</strong></div><div>kommt #{timeTo}</div></li>');
				html.push(tpl);
			});
			html.push('</ul>');    
	
			$next.html(html.join(''))
		};
	
		var addTabs = function()
		{
			if(createTabs === true)
			{
				$('#tabs.nav-tabs li a').click(function (e) 
				{
					e.preventDefault();
					$(this).tab('show');
				});
				createTabs = false;
			}
			clearTabs();
		};
		
		var loadBusses = function(title)
		{
			title = title.replace('/','__');
			$.ajax(
			{
				dataType: "json",
				url: '/xhr/busstop/' + title,
				success: function(data)
				{
					addOverview(data);
				}
			});
		}; 
		
		var showBusDetails = function(marker)
		{
			addTabs();
			loadBusses(marker.title);
		
			title(marker.title);

			getStreetview(marker);
			show();
		};
		
		var ready = function()
		{
			$('#busstopDetail').modal({show:false});
			$title = $('#busstopDetail').find('.modal-header h3');
		
			$next = $('#next');
			$streetview = $('#streetview');
		};
	
		return{
			hide:hide,
			show:show,
			showBusDetails:showBusDetails,
			loadBusses:loadBusses,
			ready:ready
		};
	})();

})();