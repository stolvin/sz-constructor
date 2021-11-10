$(document).ready(function(){

  $('.fancybox').fancybox({
		//padding: 0,
		helpers: {
        	overlay: {
            	locked: false
        	}
    	}//,
    	//closeBtn: false
	});


  $('.carousel__btn--prev').click(function(){
    $(this).parents('.section').find('.carousel').slick('slickPrev');
  })
  
  $('.carousel__btn--next').click(function(){
    $(this).parents('.section').find('.carousel').slick('slickNext');
  })
  

  $('.carousel').slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    // prevArrow: $('.carousel__btn--prev'),
    // nextArrow: $('.carousel__btn--next'),
    arrows: false,
    responsive: [
      {
        breakpoint: 985,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 769,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 481,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
});