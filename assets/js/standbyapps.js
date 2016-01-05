(function($){

	$(document).ready(function() {


		$('.open-popup-property').magnificPopup({
		  // type ajax
		  type:'inline',
		  midClick: true ,
		  callbacks: {
		    open: function() {
		      	var item = $(this).attr("data-id");
		      	var magnificPopup = $.magnificPopup.instance;
				//console.log(magnificPopup);
		    },
		    close: function() {
		       
		    }
		  }
		});

		$('.open-popup-signup').magnificPopup({
		  type:'inline',
		  midClick: true ,
		  callbacks: {
		    open: function() {
		      	$('html').css({'overflow': 'hidden','height': '100%'});
				$('body').css({'overflow': 'hidden','height': '100%'});
		    },
		    close: function() {
		      $('html').css({'overflow': 'auto','height': 'auto'});
			  $('body').css({'overflow': 'auto','height': 'auto'});
		    }
		  }
		});

		$('.close-mag-popup').click(function() {
			$.magnificPopup.close();
		});
		

		$('.more-item').click(function() {
			
			var item = $(this).attr("data-id");
			console.log(item);
			//var slider = $('.hero-slider').data('flexslider');
			//slider.flexAnimate(1);

			//$('.hero-slider').flexslider(2);
			$("#moreitems").fadeIn('fast');
			$('.popup-slider').flexslider(parseInt(item));
			$('.popup-slider').flexslider("play")

			return false;
		});

		$('.close').click(function() {
			$("#moreitems").fadeOut('fast');
			$('html').css({'overflow': 'auto','height': 'auto'});
			$('body').css({'overflow': 'auto','height': 'auto'});
		});


		
		$('.submit-phone').click(function() {
			var phonecountrycode = $("#phone-countrycode").text();
			var phonenumber = $("#phone-number").val();
			var fullnumber = phonecountrycode + ' ' + phonenumber;
			console.log("|"+phonecountrycode+ '| ' +phonenumber);
			$("#form-phone").hide();
			$("#phone-callback").fadeIn('fast');
			
			return false;
		});

		
	});

	

})(jQuery);