$(document).ready(function(){
     
    /* init*/
    var numTender;
    var numSwollen;
    var mode = 'das28-3';
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
    $('input[type=text]').keyup(function(){
            var control = isNaN( $(this).val() );
            if (control==true){
                alert('Je třeba zadat číslo');
                $(this).val('').focus();
            }    
    });
    $('input#tender, input#swollen').keyup(function(){
            if ( $(this).val()>28){
                alert('Je třeba zadat číslo od 0 - 28');
                $(this).val('').focus();
            }    
    });
    $('input#esrText, input#crpText').keyup(function(){
            if ( $(this).val()>150){
                alert('Je třeba zadat číslo od 0 - 150');
                $(this).val('').focus();
            }    
    });
    $('input[name=health]').keyup(function(){
            if ( $(this).val()>100){
                alert('Je třeba zadat číslo od 0 - 100');
                $(this).val('').focus();
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
    
    /**/
    $('.clear').click(function(e){
        $(this).closest('.mannequinBox').find('input').removeAttr('checked');
        tenderJointScore = $('.mannequinLeft input:checked').length;
        swollenJointScore = $('.mannequinRight input:checked').length;
        $('input#tender').val(tenderJointScore);
        $('input#swollen').val(swollenJointScore);
        e.preventDefault();
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
        if (mode=='das28'){
            result = (0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.70 * Math.log( $('input#esrText').val() )) + 0.014 * $('input[name=health]').val();
        }
        if (mode=='das28-3'){
            result = (0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.70 * Math.log( $('input#esrText').val() )) *1.08 + 0.16;
        
        }
        if (mode=='das28-crp-3'){
            //result = [0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log( $('input#crpText').val()+1)] * 1.10 + 1.15;
            //nResult = [0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log(CRPScore+1)] * 1.10 + 1.15
            //
            result = [0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log($('input#crpText').val()+1)] * 1.10 + 1.15;
        }
        if (mode=='das28-crp'){
            //result = [0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log( $('input#crpText').val()+1)] + 0.014 * $('input[name=health]').val() + 0.96;
            // nResult = 0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log(CRPScore+1) + 0.014 * patientGlobalScore + 0.96
            //
            result = 0.56 * Math.sqrt(tenderJointScore) + 0.28 * Math.sqrt(swollenJointScore) + 0.36 * Math.log($('input#crpText').val()+1) + 0.014 * $('input[name=health]').val() + 0.96;
        }
        $('.result p').html(result);
        e.preventDefault();
    });
    
    
});

/*

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