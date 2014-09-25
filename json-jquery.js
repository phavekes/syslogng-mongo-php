var bezig=0;
var timerId = 0;
var timer=0;

$(document).ready(function(){
	
	//update de statistieken elke 5 seconden
	setInterval(function(){ 
    	getStats();  
	}, 5000);
	
	//vul de autocomplete velden
	setTimeout(autoCompleteHosts,100);
	setTimeout(autoCompleteProgram,200);
	
	//bereid de tabel met zoektesultaten voor
	$("#dataTable").jsonTable({
        head : ['Datum','Host','Program','Prio','Message'],
        json : ['DATE','HOST_FROM','PROGRAM','PRIORITY','MESSAGE']
    });
  	
  	//attach a jQuery live event to the search button
  	$('#getdata-button').live('click', function(){
    	getData();
	});
	//en ook aan enter
	$(document.body).on('keyup', function(event) {
          if(event.keyCode == 13) { // 13 = Enter Key
            getData();
          }
    });
    
    //Auto-update vinkje
    $('#autoUpdate').change(function() {
        if($(this).is(":checked")) {
        	getData();
            timerId = setInterval(getData, 5000);
        } else {
        	clearInterval(timerId);
        }
    });
});

function getData() {
  console.log("Bezig "+bezig);
  if (bezig==0) {
    bezig=1;
    document.getElementById('loadingImage').style.visibility='visible';
    var host = $('#host_text').val();
    var program = $('#program_text').val();
    var message = $('#message_text').val();
    var limit = $('#aantalresultaten').val();
    var prio = $('#prio').val();
    var ajaxTime= new Date().getTime();
    $.getJSON( "json-data.php", { host: host, message: message, limit: limit, prio: prio, program: program } )
      .done(function( json ) {
          var options = {
          source: json,
          rowClass: "classy",
          callback: function(){
            document.getElementById('loadingImage').style.visibility='hidden';
            var totalTime = new Date().getTime()-ajaxTime;
            console.log( "Request took  " + totalTime +"ms" );
            $("#messages").html("Request took " + msToTime(totalTime));
            clearTimeout(timer)
            document.getElementById('messages').style.visibility='visible';
            timer = setTimeout(function() {
              document.getElementById('messages').style.visibility='hidden';
            }, 15000);
            bezig=0;
          }
      };

      $("#dataTable").jsonTableUpdate(options);
      $('#dataTable td:nth-child(1)').css('white-space','nowrap');
      $('#dataTable td:nth-child(1)').css('width','1px');
      $('#dataTable td:nth-child(2)').css('white-space','nowrap');
      $('#dataTable td:nth-child(2)').css('width','1px');
      $('table td:nth-child(4)').each(function() {
        var prio = $(this).text();
        if (prio=="err") {
          $(this).parent().css('backgroundColor', '#cc3333');
          $(this).parent().css('color', '#FFFFFF');
        } else if (prio=="info") {
          $(this).parent().css('backgroundColor', '#99FF33'); 
        } else if (prio=="warning") {
          $(this).parent().css('backgroundColor', '#CC6600');
          $(this).parent().css('color', '#FFFFFF');
        } else if (prio=="crit") {
          $(this).parent().css('backgroundColor', '#CC0066');
          $(this).parent().css('color', '#FFFFFF');
        } else if (prio=="notice") {
          $(this).parent().css('backgroundColor', '#CCCC33'); 
        }
      });
    })
    .fail(function( jqxhr, textStatus, error ) {
    bezig=0;
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
    document.getElementById('loadingImage').style.visibility='hidden';
    $("#messages").html(err);
    document.getElementById('messages').style.visibility='visible';
    setTimeout(function() {
            document.getElementById('messages').style.visibility='hidden';
    }, 15000);
    });
  }
}

function getStats() {
  //console.log("Stats ophalen");
    $.getJSON( "stats.php")
      .done(function( json ) {
		//console.log(json);
		var count = json.count;
		var oldest = json.oldest;
		var stats = "Aantal berichten in database: "+count+"<br>Oudste bericht : " + oldest;
		$("#stats").html(stats);
    })
}


function msToTime(s) {
  function addZ(n) {
    return (n<10? '0':'') + n;
  }
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms;
}

function autoCompleteHosts() {
	console.log("hosts ophalen");
    $.getJSON( "hosts.php")
      .done(function( json ) {
		console.log("hosts autocomplete");
    	$( "#host_text" ).autocomplete({source: json});
  });
}

function autoCompleteProgram() {
	console.log("Program ophalen");
    $.getJSON( "program.php")
      .done(function( json ) {
		console.log("program autocomplete");
    	$( "#program_text" ).autocomplete({source: json});
  });
}
