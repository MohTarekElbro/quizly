$(function() {


    $(".item").on("click" , function(){
        
        $('html, body').animate({
            
            scrollTop: $('#' + $(this).data('scroll')).offset().top-60
        } , 1000);
    })

    $(window).scroll(function(){
        $('.block').each(function(){
            console.log($(window).scrollTop());

            if($(window).scrollTop() > $(this).offset().top-61){
                var blockID = $(this).attr('id');
                $('.item[data-scroll = "' + blockID + '"]').addClass('active1').siblings().removeClass('active1');
            }
        })
    })

  

    
    $(".toggle").on("click", function() {
        if ($(".item").hasClass("active")) {
            $(".item").removeClass("active");
            $(this).find("a").html("<i class='fas fa-bars'></i>");
        } else {
            $(".item").addClass("active");
            $(this).find("a").html("<i class='fas fa-times'></i>");
        }
    });

    
    

    $('.item').on('click' , function(){
        if ($(".item").hasClass("active")){
            $(".item").removeClass("active");
            $(".toggle").find("a").html("<i class='fas fa-bars'></i>");

        }
    })


    $(".featuers .tabs div").on("click" , function(){
        $(this).addClass("active1").siblings().removeClass("active1");
        if($(this).attr('id') == 'tab1'){
            $("#contents h2").html('quiz.ai your intelligent Question generator')
        }
        else if($(this).attr('id') == 'tab2'){
            $("#contents h2").html('quiz.ai your exam helper')
            $("#contents p")
        }
        else{
            $("#contents h2").html('quiz.ai your featuers assistant')
        }
    })


    
    var flag1 =0;
    var flag2 =0;
    var flag3 =0;
    var flag4 =0;

    function fun(){
        let button = $('.contact .downloadButton')
        if(flag1==1 && flag2==1 && flag3==1 && flag4==1){
            button.css({
                'cursor':'pointer',
                'opacity':'1'
                
            })
            button.prop('disabled' , 'false')
            button.addClass('hover')
        }
        else{
            button.css({
                'cursor':'not-allowed',
                'opacity':'0.5'
                
            })
            button.prop('disabled' , 'true')
        }
    }

    $('.name').blur(function(){
        if($(this).val().length < 7 ){
            $(this).css('border-bottom' , '2px solid red')
            flag1=0
        }
        else{
            $(this).css('border-bottom' , '2px solid green')
            flag1=1;
            
        }
        fun();
    })

    $('.email').blur(function(){
        if($(this).val().includes('@') && $(this).val().includes('.') && $(this).val().length > 10){
            $(this).css('border-bottom' , '2px solid green')
            flag2=1
            fun();
        }
        else{
            $(this).css('border-bottom' , '2px solid red')
            flag2=0
        }
        fun();
    })

    $('.subject').blur(function(){
        if($(this).val().length<=1){
            $(this).css('border-bottom' , '2px solid red')
            flag3=0
        }
        else{
            $(this).css('border-bottom' , '2px solid green')
            flag3=1
            fun();
        }
        fun();
 
    })

    $('textarea').blur(function(){
        if($(this).val().length<=1){
            $(this).css('border-bottom' , '2px solid red')
            flag4=0
        }
        else{
            $(this).css('border-bottom' , '2px solid green')
            flag4=1
            fun();
        }
        fun();
    })
    

    // $('body').mousemove(function(){
    //     let button = $('.contact .downloadButton')
    //     if(flag1==1 && flag2==1 && flag3==1 && flag4==1){
    //         button.css({
    //             'cursor':'pointer',
    //             'opacity':'1'
                
    //         })
    //         button.prop('disabled' , 'false')
    //     }
    //     else{
    //         button.css({
    //             'cursor':'not-allowed',
    //             'opacity':'0.5'
                
    //         })
    //         button.prop('disabled' , 'true')
    //     }
    // })

    

});