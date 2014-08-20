var light = "";
var nogood0 = 0;
var widthLight = "";
var heightLight = "";
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","?",";",".","!","%","$","€","@"];
var charachs = alphabet.length;
var lvls = {};
var victory = "";
var ocarinaOfTime = 180;
var uncount = "";
var song1 = new Audio("r/music/Reckless.mp3");
var song2 = new Audio("r/music/Wizard_House.mp3");
var defaultSong = song1;

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
	initSwitchMusic();
}

function randomise(from,until){
	multiplicateur = until - from;
	result = Math.round(Math.random()*multiplicateur)+from;
	return result;
}

function loopMusic(mobj){
	mobj.addEventListener('ended', function() {
    	this.currentTime = 0;
    	this.play();
	}, false);
}

function initLastMusic(){
	song1.pause();
	song1.currentTime = 0;
	var ifMusic = localStorage.getItem("musicSeudides");
	if(ifMusic==1){
		defaultSong = song2;
		loopMusic(song2);
		song2.play();
	}
}

function playmusicornot(){
	if('musicSeudides' in localStorage){
		var ifMusic = localStorage.getItem("musicSeudides");
		if(ifMusic==1){
			$("#music").removeClass("off").addClass("on");
			loopMusic(defaultSong);
			defaultSong.play();
		}else{
			$("#music").removeClass("on").addClass("off");
		}
	}else{
		localStorage.setItem('musicSeudides',1);
		loopMusic(defaultSong);
		defaultSong.play();
	}
}

function initBoard(){
	wboard = $(window).width();
	hboard = $(window).height();
	$("#board").width(wboard).height(hboard);
	playmusicornot();
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
	sessionStorage.setItem("seudides",lvl);
	victory = lvls["lvl"+lvl].win;
	$("#victory").html(victory);
	$("#victory div").append("<span class='nextlvl'>go to next level</span>");
	window["generateLvl"+lvl].call();
	initNextLvl(parseInt(lvl)+1);
}

function initNextLvl(lvl){
	$("#victory div span").click(function(e){
		$("body").removeClass("lvl"+(parseInt(lvl)-1)).addClass("lvl"+lvl);
		$("body").removeClass().addClass("ingame");
		$("#board").html("");
		light.offset({top:e.pageY-widthLight,left:e.pageX-heightLight});
		getLvl(lvl);
	})
}

function initSwitchMusic(){
	$("#music.on").unbind("click").click(function(e){
		e.preventDefault();
		$(this).removeClass("on").addClass("off");
		localStorage.setItem('musicSeudides',0);
		defaultSong.pause();
		initSwitchMusic();
	})
	$("#music.off").unbind("click").click(function(e){
		e.preventDefault();
		$(this).removeClass("off").addClass("on");
		localStorage.setItem('musicSeudides',1);
		loopMusic(defaultSong);
		defaultSong.play();
		initSwitchMusic();
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

function gainTime(){
	clearTimeout(uncount);
	$(".gainTime").addClass("toDisp");
	setTimeout(function(){$(".gainTime").removeClass("toDisp");}, 2000);
	var timestopped = $("#countdown").text();
	var newTime = parseInt(timestopped)+40;
	initCountDown(newTime);
}

function initClickOnKey(){
	$(".key").clone().appendTo("#board").removeClass("key").addClass("clickKey");
	$(".clickKey").click(function(){
		clearTimeout(uncount);
		$("body").removeClass("ingame").addClass("message");
	})
}

function initClickFinalKey(){
	$(".key").clone().appendTo("#board").removeClass("key").addClass("clickKey");
	$(".clickKey").click(function(){
		clearTimeout(uncount);
		sessionStorage.setItem("seudides","0");
		$("body").removeClass().addClass("win");
		$("body>*").addClass("h");
		$("#end").removeClass("h");
	})
}

function initClickOnFlash(){
	$(".flash").clone().appendTo("#board").removeClass("flash").addClass("clickFlash");
	$(".clickFlash").click(function(){
		valId = $(this).attr("data-rel");
		onFlash();
		$(".flash[data-rel="+valId+"], .clickFlash[data-rel="+valId+"]").remove();
	})
}

function initClickOnWatch(){
	$(".timewatch").clone().appendTo("#board").removeClass("timewatch").addClass("clickTimewatch");
	$(".clickTimewatch").click(function(){
		valId = $(this).attr("data-rel");
		gainTime();
		$(".timewatch[data-rel="+valId+"], .clickTimewatch[data-rel="+valId+"]").remove();
	})
}

function initSkullHover(){
	$(".skull").clone().appendTo("#board").removeClass("skull").addClass("hoverSkull");
	$(".hoverSkull").mouseover(function(){
		endGame("skullEnd");
	})
}

function endGame(why){
	defaultSong.pause();
	defaultSong.currentTime = 0;
	sessionStorage.setItem("seudides","0");
	$("body").removeClass().addClass("message").addClass("defeat");
	content = $("#"+why).html();
	$("#defeat").html(content).show().children("div").addClass("animation");
	$("#board").html('');
	clearTimeout(uncount);
	$("#countdown").html('');
	restartGame();
}

function restartGame(){
	$("#defeat div span").click(function(e){
		$("#defeat div").removeClass("animation").parent().hide();
		$("body").removeClass().addClass("ingame");
		light.offset({top:e.pageY-widthLight,left:e.pageX-heightLight});
		defaultSong = song1;
		playmusicornot();
		checkSession();
	})
}

function addColor(domNode,howmuch){
	randColor = randomise(0,4);
	for(var c=0;c<howmuch;c++){
		if(randColor===c && c===0){domNode.css({'color':'#bb2e2e'});}
		if(randColor===c && c===1){domNode.css({'color':'#f3a000'});}
		if(randColor===c && c===2){domNode.css({'color':'#fbed3e'});}
		if(randColor===c && c===3){domNode.css({'color':'#51ad28'});}
		if(randColor===c && c===4){domNode.css({'color':'#3b66f3'});}
	}
}

function setLetter(dom){
	randPos(dom);
	randRotation(dom);
	randLetter(dom);
}

////////////////////////////////////////////first level
function generateLvl0(){

	for(i0=0; i0<100; i0++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i0+")");
	  	setLetter(letter);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));
	
	initClickOnKey();
	//Initialise le compteur si user vient du dernier niveau

	song1.volume = 0.5;
	song2.volume = 0.5;

}

/////////////////////////////////////Second level
function generateLvl1(){

	for(var i1=0; i1<100; i1++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i1+")");
	  	setLetter(letter);
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
function initCountDown(hl){
	countDown(hl);
}

function countDown(howlong){
	howlong = howlong-1;
	$("#countdown").html(howlong);
	if(howlong===0){
		endGame("timeout");
	}else{
		uncount = setTimeout('countDown('+howlong+')',1000);
	}
}

function generateLvl2(){

	for(var i2=0; i2<100; i2++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i2+")");
	  	setLetter(letter);
	  	addColor(letter,2);
	}

	for(var j1=0; j1<10; j1++){
	  	$("#board").append("<div data-rel='"+j1+"' class='flash'></div>");
	  	flash = $(".flash:eq("+j1+")");
	  	randPos(flash);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));

	initCountDown(180);
	initClickOnFlash();
	initClickOnKey();

}


/////////////////////////////////////forth level
function generateLvl3(){

	for(var i3=0; i3<100; i3++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i3+")");
	  	setLetter(letter);
	  	addColor(letter,3);
	}

	for(var j2=0; j2<10; j2++){
	  	$("#board").append("<div data-rel='"+j2+"' class='flash'></div>");
	  	flash = $(".flash:eq("+j2+")");
	  	randPos(flash);
	}

	for(var k0=0; k0<10; k0++){
	  	$("#board").append("<div data-rel='"+k0+"' class='timewatch'></div>");
	  	tw = $(".timewatch:eq("+k0+")");
	  	randPos(tw);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));

	initCountDown(60);
	initClickOnFlash();
	initClickOnWatch();
	initClickOnKey();

}

/////////////////////////////////////level 5
function generateLvl4(){

	for(var i4=0;i4<100; i4++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i4+")");
	  	setLetter(letter);
	  	addColor(letter,4);
	}

	for(var j3=0; j3<10; j3++){
	  	$("#board").append("<div data-rel='"+j3+"' class='flash'></div>");
	  	flash = $(".flash:eq("+j3+")");
	  	randPos(flash);
	}

	for(var k1=0; k1<10; k1++){
	  	$("#board").append("<div data-rel='"+k1+"' class='timewatch'></div>");
	  	tw = $(".timewatch:eq("+k1+")");
	  	randPos(tw);
	}

	for(var l0=0; l0<10; l0++){
	  	$("#board").append("<div data-rel='"+l0+"' class='skull'></div>");
	  	tw = $(".skull:eq("+l0+")");
	  	randPos(tw);
	}

	$("#board").append("<div class='key'></div>");
	randPos($(".key"));
	randRotation($(".key"));

	initCountDown(120);
	initClickOnFlash();
	initClickOnWatch();
	initClickOnKey();
	initSkullHover();

}

/////////////////////////////////////Last lvl
function generateLvl5(){

	for(var i5=0;i5<100; i5++){
		charach = randomise(0,charachs-1);
	  	$("#board").append("<div class='letter'>"+alphabet[charach]+"</div>");
	  	letter = $(".letter:eq("+i5+")");
	  	setLetter(letter);
	  	addColor(letter,5);
	}

	for(var k2=0; k2<10; k2++){
	  	$("#board").append("<div data-rel='"+k2+"' class='timewatch'></div>");
	  	tw = $(".timewatch:eq("+k2+")");
	  	randPos(tw);
	}

	for(var l1=0; l1<30; l1++){
	  	$("#board").append("<div data-rel='"+l1+"' class='skull'></div>");
	  	tw = $(".skull:eq("+l1+")");
	  	randPos(tw);
	}

	$("#board").append("<div class='key end'></div>");
	randPos($(".key"));
	randRotation($(".key"));

	initCountDown(120);
	initClickOnWatch();
	initClickFinalKey();
	initSkullHover();
	initLastMusic();

}
