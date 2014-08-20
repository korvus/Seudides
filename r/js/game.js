var light = "";
var nogood0 = 0;
var widthLight = "";
var heightLight = "";
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","?",";",".","!","%","$","€","@"];
var charachs = alphabet.length;
var lvls = {};
var victory = "";
var ocarinaOfTime = 10;

$(document).ready(function(){

	light = $("#light");
	widthLight = Math.round(light.width()/2);
	heightLight = Math.round(light.height()/2);
	ListenResize();
	initGame();

});


//////////////////////////////////////////////////////////////////////////////////FUNCTIONS
function initLight(){
    $(document).mousemove(function(e){
        light.offset({top:e.pageY-widthLight,left:e.pageX-heightLight});
    })
}

function ListenResize(){
	$(window).resize(function(e){
		alert("You can't resize your browser because board is setted for your windows area.");
	});
}

function initGame(){
	$.getJSON("r/json/lvl.json", function(data){
		lvls = data;
		checkSession();
	});
	initLight();
	initBoard();
}

function randomise(from,until){
	multiplicateur = until - from;
	result = Math.round(Math.random()*multiplicateur)+from;
	return result;
}

function initBoard(){
	wboard = $(window).width();
	hboard = $(window).height();
	$("#board").width(wboard).height(hboard);
}

function randPos(domNode){
	wboard = $(window).width()-100;
	hboard = $(window).height()-150;
	posW = randomise(50,wboard);
	posH = randomise(10,hboard);
	domNode.css({'top':posH,'left':posW});
}

function randRotation(domNode){
	rotation = randomise(0,180);
	domNode.css({'transform':'rotate('+rotation+'deg)'});
}

function randLetter(domNode){
	fontsize = randomise(9,180);
	domNode.css({'font-size':fontsize+'px','opacity':Math.random()});
}

function getLvl(lvl){
	$("body").addClass("lvl"+lvl);
	sessionStorage.setItem("lvl",lvl);
	victory = lvls["lvl"+lvl].win;
	$("#victory").html(victory);
	$("#victory div").append("<span class='nextlvl'>go to next level</span>");
	window["generateLvl"+lvl].call();
	initNextLvl(parseInt(lvl)+1);
}

function initNextLvl(lvl){
	$("#victory div span").unbind("click");
	$("#victory div span").bind("click",function(e){
		$("body").removeClass("lvl"+(parseInt(lvl)-1)).addClass("lvl"+lvl);
		$("body").removeClass("message").addClass("ingame");
		$("#board").html("");
		light.offset({top:e.pageY-widthLight,left:e.pageX-heightLight});
		getLvl(lvl);
	})
}

function checkSession(){
	if(typeof sessionStorage!='undefined'){
	  	if('seudides' in sessionStorage){
	  	  	var lvl = sessionStorage.getItem('seudides');
	  	  	getLvl(lvl);
	  	}else{
	  		sessionStorage.setItem("seudides","0");
	  		getLvl(0);
	  	}
	}else{
		alert("Sorry you can't play this game because your browser don't support session storage feature");
	}
}

function onFlash(){
	$("#light").addClass("hsalf");
	setTimeout(function(){$("#light").removeClass("hsalf");}, 2000);
}

function initClickOnKey(){
	$(".key").clone().appendTo("#board").removeClass("key").addClass("clickKey");
	$(".clickKey").click(function(){
		$("body").removeClass("ingame").addClass("message");
	})

}

function initClickOnFlash(){
	$(".flash").clone().appendTo("#board").removeClass("flash").addClass("clickFlash");
	$(".clickFlash").click(function(){
		valId = $(this).attr("data-rel");
		onFlash();
		$(".flash[data-rel="+valId+"]").remove();
	})

}

////////////////////////////////////////////first level
function generateLvl0(){

	for(i0=0; i0<100; i0++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i0+")");
	  	randPos(letter);
	  	randRotation(letter);
	  	randLetter(letter);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));
	
	initClickOnKey();

}

function addColor(domNode,howmuch){
	randColor = randomise(0,5);
	console.log(randColor);
	for(var c=0;c<howmuch;c++){
		if(randColor===c && c===0){domNode.css({'color':'#bb2e2e'});}
		if(randColor===c && c===1){domNode.css({'color':'#f3a000'});}
		if(randColor===c && c===2){domNode.css({'color':'#fbed3e'});}
		if(randColor===c && c===3){domNode.css({'color':'#bb2e2e'});}
		if(randColor===c && c===4){domNode.css({'color':'#bb2e2e'});}
		if(randColor===c && c===5){domNode.css({'color':'#bb2e2e'});}
	}
}

/////////////////////////////////////Second level


function generateLvl1(){

	for(var i1=0; i1<100; i1++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i1+")");
	  	randPos(letter);
	  	randLetter(letter);
	  	randRotation($(letter));
	  	addColor(letter,1);
	}

	for(j0=0; j0<10; j0++){
	  	$("#board").append("<div data-rel='"+j0+"' class='flash'></div>");
	  	flash = $(".flash:eq("+j0+")");
	  	randPos(flash);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));
	
	initClickOnFlash();
	initClickOnKey();

}

/////////////////////////////////////third level
function initCountDown(){
	countDown();
}

function countDown(){
	ocarinaOfTime = ocarinaOfTime-1;
	$("#countdown").html(ocarinaOfTime);
	compte=setTimeout('countDown()',1000);
}

function generateLvl2(){

	for(i2=0; i2<100; i2++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i2+")");
	  	randPos(letter);
	  	randLetter(letter);
	  	randRotation($(letter));
	  	addColor(letter,2);
	}

	for(j1=0; j1<10; j1++){
	  	$("#board").append("<div data-rel='"+j1+"' class='flash'></div>");
	  	flash = $(".flash:eq("+j1+")");
	  	randPos(flash);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));

	initCountDown();
	initClickOnFlash();
	initClickOnKey();

}