$(document).ready(function(){
     
    /* init*/
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
            resultText = "Remission";
            resultClass = "RemissionStatus";
        }
        else if (result < 3.2)
        {
            resultText = "Low disease activity";
            resultClass = "LowActivityStatus";
        }
        else if (result >=3.2 && result <= 5.1)
        {
            resultText = "Moderate disease activity";
            resultClass = "ModerateActivityStatus";
        }  
        else if (result >5.1)
        {
            resultText = "High disease activity";
            resultClass = "HighActivityStatus";
        } 
        $('.result').addClass(resultClass);
        $('.result p.num').html(result);
        $('.result p.txt').html(resultText);
        $('.formula p').html('Formula: '+formula);     

        e.preventDefault();
    });
    
    
});

/*

FORMULA:DAS28-CRP(4) = 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.36*ln(CRP+1) + 0.014*GH + 0.96     Reference: http://www.das-score.nl


2 crp 1 0
0.56 * Math.sqrt(2) + 0.28 * Math.sqrt(0) + 0.36 * Math.log( 1 +1) + 0.014 * 0 + 0.96
má vyjít 2
ale vychází 2,6

0.56 X 1,41 + 0.28 X 0 + 0.36 X 0,69 + 0 + 0,96
0.78 + 0 + 0,24 + 0,96








 
if (errorText == "")
        {
            case "DAS28 3":

              // FORMULA:  DAS28(3) = [0.56*sqrt(t28) + 0.28*sqrt(sw28) + 0.70*Ln(ESR)]*1.08 + 0.16 

              nResult = (0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.70 * Math.log(ESRScore)) *1.08 + 0.16
              break;

            case "DAS28-CRP 3":

            // FORMULA: DAS28-CRP(3) = [0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.36*ln(CRP+1)] * 1.10 + 1.15 

              nResult = [0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log(CRPScore+1)] * 1.10 + 1.15
              break;
            default:
             errorText = "Unknown test";
             alert("Error Text: " + errorText)
            }    
            nResult = Math.round(nResult * 100) / 100 //round to two decimal places
        }
    }

*/

$(window).ready(function(){

 
});