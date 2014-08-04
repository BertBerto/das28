$(document).ready(function(){

    /* init */
    var locale = 'cs';
    fillTexts('cs');
    var numTender;
    var numSwollen;
    var mode = 'das28';
    var modeTxt = 'DAS28';
    $('.formSectionCalculate h2').text(modeTxt);
    var result;
    var tenderJointScore = 0;
    var swollenJointScore = 0;
    $('input[type=text]').each(function(){
        $(this).val('');
    }); 
    $('input#tender, input#swollen').each(function(){
        $(this).attr('disabled','disabled').addClass('disabled');
    });
    $('input[name=health]').val(0); 
    $('input[type=radio], input[type=checkbox]').each(function(){
        $(this).removeAttr('checked');
    }); 
    $('input#mannequin, input#esr, input#global').each(function(){
        $( this ).prop('checked', true);
    }); 
    
    /* lang buttons */
    $('.lang a').click(function(e){
        $('.lang a').removeClass('active');
        $(this).addClass('active');
        locale = $(this).attr('data-lang');
        fillTexts(locale);
        e.preventDefault();
    });
     
    $( "#slider" ).slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100,
        slide: function( event, ui ) {
        $( "input[name=health]" ).val( ui.value );
        }
    });
    $("input[name=health]").keyup(function(){
        $( "#slider" ).slider( "value", $(this).val() );
    });
    
    /**/
    $('input[name=enter]').change(function(){
        if ( $(this).val()=='type' ){
            $('input#tender, input#swollen').removeAttr('disabled').removeClass('disabled');
            $('.overlay').removeClass('hidden');
            $('.col.colRight input').removeAttr('checked');
        }else{
            $('input#tender, input#swollen').attr('disabled','disabled').addClass('disabled').val('');
            $('.overlay').addClass('hidden');
        }
    });
    
    /**/
    $('input[name=measures]').change(function(){
        if ( $(this).val()=='esr' ){
            $('input#crpText').attr('disabled','disabled').addClass('disabled').val('');
            $('input#esrText').removeAttr('disabled').removeClass('disabled');
            if ( $('input[name=global]').is(':checked') ){
                mode = 'das28';
                modeTxt = 'DAS28';              
            }else{
                mode = 'das28-3';
                modeTxt = 'DAS28 3';            
            }
            $('.formSectionCalculate h2').text(modeTxt);
        }else{
            $('input#esrText').attr('disabled','disabled').addClass('disabled').val('');
            $('input#crpText').removeAttr('disabled').removeClass('disabled');
            if ( $('input[name=global]').is(':checked') ){
                mode = 'das28-crp';
                modeTxt = 'DAS28-CRP';               
            }else{
                mode = 'das28-crp-3';
                modeTxt = 'DAS28-CRP 3';             
            }
            $('.formSectionCalculate h2').text(modeTxt);
        }
    });
    
    /* validation */
    $('input[type=text][name!=patient-id]').keyup(function(){
            var control = isNaN( $(this).val() );
            if (control==true){
                alert('Je třeba zadat číslo');
                if (( $(this).is('#tender')==true )||( $(this).is('#swollen')==true )){
                    $(this).val(0).focus();
                }else if ( $(this).is('#health') ){
                    $(this).val(0).focus();
                }else{
                    $(this).val(1).focus();
                }
            }    
    });
    $('input#tender, input#swollen').keyup(function(){
            if ( $(this).val()>28){
                alert('Je třeba zadat číslo od 0 - 28');
                $(this).val(0).focus();
            }    
    });
    $('input#esrText, input#crpText').keyup(function(){
            if ( $(this).val()>150){
                alert('Je třeba zadat číslo od 1 - 150');
                $(this).val(1).focus();
            }    
    });
    $('input[name=health]').keyup(function(){
            if ( $(this).val()>100){
                alert('Je třeba zadat číslo od 0 - 100');
                $(this).val(0).focus();
            }    
    });
    
    /**/
    $('input[name=global]').change(function(){
        if ( $(this).is(':checked')==true ){
            $('#slider, .left, .right').removeClass('hidden');
            $('input[name=health]').removeClass('disabled').removeAttr('disabled');
            $('input[name=health]').val(0); 
            if ( $('input#esr').is(':checked') ){
                mode = 'das28';
                modeTxt = 'DAS28';              
            }else{
                mode = 'das28-crp';
                modeTxt = 'DAS28-CRP';            
            }
            $('.formSectionCalculate h2').text(modeTxt);
        }else{
            $('#slider, .left, .right').addClass('hidden');
            $('input[name=health]').val('').addClass('disabled').attr('disabled','disabled');
            $( "#slider" ).slider( "value", 0 );
            if ( $('input#esr').is(':checked') ){
                mode = 'das28-3';
                modeTxt = 'DAS28 3';               
            }else{
                mode = 'das28-crp-3';
                modeTxt = 'DAS28-CRP 3';            
            }
            $('.formSectionCalculate h2').text(modeTxt);
        }
    });
    
    /* clear results */
    $('.clear').click(function(e){
        $(this).closest('.mannequinBox').find('input').removeAttr('checked');
        tenderJointScore = $('.mannequinLeft input:checked').length;
        swollenJointScore = $('.mannequinRight input:checked').length;
        $('input#tender').val(tenderJointScore);
        $('input#swollen').val(swollenJointScore);
        $('.result .txt, .result .num').text('');
        $('.formula p').text('Formula:');
        $('.result').removeClass('RemissionStatus').removeClass('LowActivityStatus').removeClass('ModerateActivityStatus').removeClass('HighActivityStatus');
        e.preventDefault();
    });
    $('input').change(function(){
        $('.result .txt, .result .num').text('');
        $('.formula p').text('Formula:');
        $('.result').removeClass('RemissionStatus').removeClass('LowActivityStatus').removeClass('ModerateActivityStatus').removeClass('HighActivityStatus');
    });
    
    /**/
    $('.mannequinBox input').change(function(){
        tenderJointScore = $('.mannequinLeft input:checked').length;
        swollenJointScore = $('.mannequinRight input:checked').length;
        $('input#tender').val(tenderJointScore);
        $('input#swollen').val(swollenJointScore);
    });
    
    /**/
    $('button[name=calculate]').click(function(e){
        var result = 0;
        var resultText;
        var formula = '';
        var resultClass;
        var esrScore;
        var crpScore;
        if ( $('input#esrText').val()=='' ){
            esrScore = 0;
        }else{
            esrScore = parseInt( $('input#esrText').val() );
        }
        if ( $('input#crpText').val()=='' ){
            crpScore = 0;
        }else{
            crpScore = parseInt( $('input#crpText').val() );
        }
        if (esrScore>0){
             if (mode=='das28'){
                result = (0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.70 * Math.log( esrScore )) + 0.014 * $('input[name=health]').val();
                formula = '(0.56 * Math.sqrt('+tenderJointScore+') + 0.28 * Math.sqrt('+swollenJointScore+') + 0.70 * Math.log( '+$('input#esrText').val()+' )) + 0.014 * '+$('input[name=health]').val();
            }
            if (mode=='das28-3'){
                result = (0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.70 * Math.log( esrScore )) *1.08 + 0.16;
                formula = '(0.56 * Math.sqrt('+tenderJointScore+') + 0.28 * Math.sqrt('+swollenJointScore+') + 0.70 * Math.log( '+$('input#esrText').val()+' )) *1.08 + 0.16';
            
            }           
        }
        if (crpScore>0){
              if (mode=='das28-crp-3'){
                result = [0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log(crpScore+1)] * 1.10 + 1.15;
                formula = '[0.56 * Math.sqrt('+tenderJointScore+') + 0.28 * Math.sqrt('+swollenJointScore+') + 0.36 * Math.log( '+$('input#crpText').val()+' +1)] * 1.10 + 1.15';
            }
            if (mode=='das28-crp'){
                var result = (0.56 * Math.sqrt(tenderJointScore)) + (0.28 * Math.sqrt(swollenJointScore)) + (0.36 * Math.log( (crpScore+1) )) + ((0.014 * $('input[name=health]').val()) + 0.96);
                formula = '0.56 * Math.sqrt('+tenderJointScore+') + 0.28 * Math.sqrt('+swollenJointScore+') + 0.36 * Math.log('+$('input#crpText').val()+' +1) + 0.014 * '+$('input[name=health]').val()+' + 0.96';
            }          
        }

        result = Math.round(result * 100) / 100;
        if (result < 2.6)
        {
            if (locale='cs'){
                resultText = "Remise";
            }else{
                resultText = "Remission";
            }
            resultClass = "RemissionStatus";
        }
        else if (result < 3.2)
        {
            if (locale='cs'){
                resultText = "Nízká aktivita nemoci";
            }else{
                resultText = "Low disease activity";
            }
            resultClass = "LowActivityStatus";
        }
        else if (result >=3.2 && result <= 5.1)
        {
            if (locale='cs'){
                resultText = "Střední aktivita nemoci";
            }else{
                resultText = "Moderate disease activity";
            }
            resultClass = "ModerateActivityStatus";
        }  
        else if (result >5.1)
        {
            if (locale='cs'){
                resultText = "Vysoká aktivita nemoci";
            }else{
                resultText = "High disease activity";
            }
            resultClass = "HighActivityStatus";
        } 
        $('.result').addClass(resultClass);
        $('.result p.num').html(result);
        $('.result p.txt').html(resultText);
        $('.formula p').html('Formula: '+formula);     

        e.preventDefault();
    });
    
    
});


$(window).ready(function(){

 
});

function fillTexts(locale){
    /* locale */
    var texts = [
        { name:'jointScores', en:'Joint Scores', cs:'Počet kloubů' },
        { name:'tender', en:'Tender', cs:'Bolestivý' },
        { name:'swollen', en:'Swollen', cs:'Oteklý' },
        { name:'toEnter', en:'To enter joint scores, I prefer to:', cs:'To enter joint scores, I prefer to:' },
        { name:'useMannequin', en:'Use Mannequin', cs:'Use Mannequin' },
        { name:'typeTotals', en:'Type totals Scores', cs:'Type totals' },
        { name:'measures', en:'Additional measures', cs:'Additional measures' },
        { name:'esr', en:'ESR', cs:'Sedimentace' },
        { name:'crp', en:'CRP - C', cs:'Reaktivní protein' },
        { name:'globalHealth', en:'Patient Global Health', cs:'Celkový zdravotní stav' },
        { name:'calculate', en:'Calculate', cs:'Calculate' },
        { name:'formula', en:'Formula', cs:'Formula' },
        { name:'tenderJoints', en:'Tender Joints', cs:'Bolestivé klouby' },
        { name:'swollenJoints', en:'Swollen Joints', cs:'Oteklé klouby' },
        { name:'remission', en:'Remission', cs:'Remise' },
        { name:'lowActivity', en:'Low disease activity', cs:'Nízká aktivita nemoci' },
        { name:'moderateActivity', en:'Moderate disease activity', cs:'Střední aktivita nemoci' },
        { name:'highActivity', en:'High disease activity', cs:'Vysoká aktivita nemoci' }
    ];
    /* fill text function */
    $('.locale').each(function(){
        var thisId = $(this).attr('data-locale');
        $(this).text( texts[thisId][locale] );
    });
}