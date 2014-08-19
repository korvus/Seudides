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
		if(wboard>1000 && hboard>800){
			$("body").addClass("good").removeClass("bad");
		}else{
			colors();
			$("body").addClass("bad").removeClass("good");
		}
	});

});
