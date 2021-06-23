$(function(){
	$(".dropdown-item").click(function(){
		var icon_text = $(this).html();
		$(".dropdown-toggle").html(icon_text)
	});
});

$(function(){
	$("[data-trigger]").on("click", function(){
		var targeet_id = $(this).attr('data-trigger');
		$(targeet_id).toggleClass("show");
		$('.navbar-toggler-icon').toggleClass("hide");
		$('body').toggleClass("offcanvas-active");
	});

	//close
	$('.btn-close').click(function(e){
		$(".navbar-collapse").removeClass("show");
		$('.navbar-toggler-icon').removeClass("hide");
		$("body").removeClass("offcanvas-active");
	});
});


