function colors(){
	wboard = $(window).width();
	hboard = $(window).height();
	$("#rszW").html(wboard+"px");
	$("#rszH").html(hboard+"px");
	if(wboard<1000){
		$("#rszW").addClass("bad").removeClass("good");
	}else{
		$("#rszW").addClass("good").removeClass("bad");
	}
	if(hboard<800){
		$("#rszH").addClass("bad").removeClass("good");
	}else{
		$("#rszH").addClass("good").removeClass("bad");
	}
}

function initMusiqStorage(){
	if('musicSeudides' in localStorage){
		var ifMusic = localStorage.getItem("musicSeudides");
		if(ifMusic==1){
			$(".musiq").removeClass("off").addClass("on");
		}else{
			$(".musiq").removeClass("on").addClass("off");
		}
	}else{
		localStorage.setItem('musicSeudides',1);
	}
}

function initClickMusiq(){
	$(".musiq.on").unbind("click").click(function(e){
		e.preventDefault();
		$(this).removeClass("on").addClass("off").html("<span class='icon'></span>Click for put music");
		localStorage.setItem('musicSeudides',0);
		initClickMusiq();
	})
	$(".musiq.off").unbind("click").click(function(e){
		e.preventDefault();
		$(this).removeClass("off").addClass("on").html("<span class='icon'></span>Click here for remove music");
		localStorage.setItem('musicSeudides',1);
		initClickMusiq();
	})
}

$(document).ready(function(){

	wboard = $(window).width();
	hboard = $(window).height();

	if(wboard>1000 && hboard>800){
		$("body").addClass("good").removeClass("bad");
	}else{
		colors();
		$("body").addClass("bad").removeClass("good");
	}

	$(window).resize(function(){
		wboard = $(window).width();
		hboard = $(window).height();
		if(wboard>1000 && hboard>800){
			$("body").addClass("good").removeClass("bad");
		}else{
			colors();
			$("body").addClass("bad").removeClass("good");
		}
	});

	initMusiqStorage();
	initClickMusiq();

});
