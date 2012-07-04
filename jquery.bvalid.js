/*
 *  Project: BValid
 *  Description: Validates forms
 *  Author: Hugo Silva
 *  Author URL: http://hugofvs.com
 *  Help: http://jqueryboilerplate.com/
 */

;(function ( $, window, document, undefined ) {

    var pluginName = 'bValidator',
        pluginOptions,
        errorTypes,
        errorRules,
        messageList = {},
        pluginDefaults = {
            errorLabel  : true,
            errorBoard  : 'none',
            errorTip    : false,
            errorClass  : "bvalidator_error",
            allMessages : false,
            messagePosX : 'right',
            messagePosY : 'bottom',
            focus       : true,
            onsubmit    : true,
            messages    : {
                required      : "Campo de preenchimento obrigatório",
                email         : "O e-mail que inseriu não é válido",
                url           : "O url que inseriu não é válido",
                date          : "A data que inseriu não é válida",
                time          : "A hora que inseriu não é válida",
                only          : "",
                _digits       : "Só são permitidos números",
                _int          : "Só são permitidos números inteiros",
                _float        : "Só são permitidos números",
                _letters      : "Só são permitidas letras",
                _noschars     : "Não são permitidos caracteres especiais",
                length        : "O campo deve conter entre $1 a $2 caracteres",
                range         : "O valor deverá estar entre o valor $1 e $2",
                equal         : "Os campos não correspondem",
                distinct      : "Os campos não podem corresponder",
                filetype      : "O ficheiro que inseriu não é válido",
                ajax          : "Não foram encontrados registos na base de dados"
            },
            rules       : {
                email   : RegExp("^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$", "i"),
                url     : /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                date    : RegExp("^(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/((19|20)\\d\\d)$"),
                time    : RegExp("^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$"),
                ajax    : "default"
            }
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        //this.options = $.extend( {}, pluginDefaults, options) ;

        pluginOptions = $.extend( {}, pluginDefaults, options) ;
        errorTypes = $.extend( {}, pluginDefaults["messages"], pluginOptions["messages"]) ;
        errorRules = $.extend( {}, pluginDefaults["rules"], pluginOptions["rules"]) ;
        
        //this._defaults = pluginDefaults;
        this._name = pluginName;
        
        this.init();
    }

    String.prototype.between = function(prefix, suffix) {
        s = this;

        var i = s.indexOf(prefix);

        if (i >= 0) {
            s = s.substring(i + prefix.length);
        } else {
            return '';
        }

        if (suffix) {
            i = s.indexOf(suffix);
            if (i >= 0) {
                s = s.substring(0, i);
            } else {
                return '';
            }
        }

        return s;
    }

    function generate_id()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function errorFunction(form, element){

        var error = "",
            options = "";

        //Initiates variables
        var eValue   = element.val(),
            eType    = element.attr("type"),
            eName    = element.attr("name"),
            eLength  = eValue.length,
            rEmail   = errorRules["email"],
            rUrl     = errorRules["url"],
            rDate    = errorRules["date"], 
            rTime    = errorRules["time"],
            rNumNat  = new RegExp("^ *[0-9]+ *$"),
            rNumInt  = new RegExp("^[-+]?[0-9]+$"),
            rNumDec  = new RegExp("^[-+]?[0-9]+(\.[0-9]+)?$"),
            rLetters = new RegExp("^ *[a-zA-Z]+ *$"),
            rNoSChar = new RegExp("[^0-9a-zA-Z]"),
            result   = true;

        //For each error type
        for(var errorType in errorTypes) {

            var has_error = "";

            //Normal errors
            if(element.hasClass(errorType)){
                has_error = errorType;
            }
             
            //Errors with options
            else if( element.attr("class").indexOf(errorType + "[") > -1){
                //Load error options
                options = element.attr("class").between(errorType + "[", "]");
                has_error = errorType;
            }

            //Check if that error exists in the form
            if(has_error == "") continue;
            else if(error == "") error = has_error;


            //Every error option
            switch (has_error) {

              case "required":

                    //Required checkbox
                    if(eType == "checkbox" && element.is(":checked") == false){result = false;}
                    
                    //Required radiobutton
                    else if(eType == "radio" &&
                            form.find('input[name='+eName+']:checked').length == 0)
                    { 
                        result = false;
                    }

                    //Everything else (input text, select, textarea)
                    else if(eLength == 0){result = false;}

                break;

              case "email": if(rEmail.test(eValue) == false && eLength != 0){ result = false; } break;

              case "url": if(rUrl.test(eValue) == false && eLength != 0){ result = false; } break;

              case "date": if(rDate.test(eValue) == false && eLength != 0){ result = false; } break;

              case "time": if(rTime.test(eValue) == false && eLength != 0){ result = false; } break;
            
              case "only":

                errorTypes[error] = errorTypes["_" + options];

                switch(options){
                    case "digits":
                        if(rNumNat.test(eValue) == false && eLength != 0){  result = false; } break;
                    
                    case "int":
                        if(rNumInt.test(eValue) == false && eLength != 0){ result = false; } break;

                    case "float":
                        if(rNumDec.test(eValue) == false && eLength != 0){ result = false; } break;
                    
                    case "letters":
                        if(rLetters.test(eValue) == false && eLength != 0){ result = false; } break;

                    case "noschars":
                        if(rNoSChar.test(eValue) == true && eLength != 0){ result = false; } break;
                }
                break;

              case "length":
                var option = options.split(",");

                errorTypes[error] = errorTypes[has_error].replace("$1", option[0]);
                errorTypes[error] = errorTypes[has_error].replace("$2", option[1]);
                errorTypes[error] = errorTypes[has_error].replace("#", '&infin;');

                if(option[0] == "#" && option[1] != "#"){            
                    if(eLength > parseInt(option[1])){
                        result = false;
                    }
                } else if(option[0] != "#" && option[1] == "#"){
                    if(eLength < parseInt(option[0])){
                        result = false;
                    }
                } else if(option[0] != "#" && option[1] != "#"){
                    if(eLength < parseInt(option[0]) || eLength > parseInt(option[1])){
                        result = false;
                    }
                }
                break;

              case "range":
                var option = options.split(",");

                errorTypes[has_error].replace("$1", option[0]);
                errorTypes[has_error].replace("$2", option[1]);
                errorTypes[has_error].replace("#", '&infin;');

                if(option[0] == "#" && option[1] != "#"){            
                    if(parseFloat(eValue) > parseFloat(option[1])){
                        result = false;
                    }
                } else if(option[0] != "#" && option[1] == "#"){
                    if(parseFloat(eValue) < parseFloat(option[0])){
                        result = false;
                    }
                } else if(option[0] != "#" && option[1] != "#"){
                    if(parseFloat(eValue) < parseFloat(option[0]) || parseFloat(eValue) > parseFloat(option[1])){
                        result = false;
                    }
                }

                break;
            
              case "equal": if($("#" + options).val() != eValue){ result = false; } break;

              case "distinct": if($("#" + options).val() == eValue){ result = false; } break;

              case "filetype":
                if(eLength > 0){
                    var option = options.split(","),
                        eExt   = eValue.split("."),
                        hasExt = false;

                    for(ext in option){ if(eExt[eExt.length - 1] == option[ext]){ hasExt = true; } }

                    if(hasExt == false){ result = false; }   
                }
                break;  

              case "ajax":
                if(errorRules["ajax"] == "default"){
                    $.post(options, { bvalidator : eValue }, function(response){
                        if(response.indexOf("bvalidator[false]") > -1){ result = false; }    
                    }); 
                }else{ eval(errorRules["ajax"]); }
                break;
                
               default: if(errorRules[has_error].test(eValue) == false && eLength != 0){ result = false; }
            }
        }

        //If it's a radio button
        if(eType == "radio"){ element = form.find('input[name='+eName+']').last(); }

        if(result == false){

            //For normal messages
            if( pluginOptions["errorLabel"] == true &&
                pluginOptions["errorBoard"] == "none" &&
                pluginOptions["errorTip"]   == false &&
                element.hasClass(pluginOptions["errorClass"]) == false){

                if(pluginOptions["messagePosY"] == 'top')
                    element.before('<div class="bvalidator_errordiv">'+ errorTypes[error] +'</div>');
                else
                    element.after('<div class="bvalidator_errordiv">'+ errorTypes[error] +'</div>');
            }
            else if(pluginOptions["errorBoard"] != "none" && pluginOptions["errorTip"] == false){

                var getErrorId = element.attr("class").between("hvErrorMsg[", "]"),
                    boardId = $(pluginOptions["errorBoard"]);

                if(messageList[getErrorId] == "") messageList[getErrorId] = "<p>"+ errorTypes[error] +"</p>";
                
                if(pluginOptions["allMessages"] == false){
                    
                    for(var msgId in messageList){
                        if(messageList[msgId] != ""){
                            boardId.html(messageList[msgId]);
                            break;
                        }
                    }
                    
                } else{
                    var boardContent = '';

                    for(var msgId in messageList){
                        if(messageList[msgId] != "" && boardContent.indexOf(messageList[msgId]) == -1){
                            boardContent += messageList[msgId];
                        }
                    }

                    boardId.html(boardContent);
                }

                if(boardId.css("display") == "none" && boardId.html().length > 0)
                    boardId.fadeIn("fast");
            }
            //TOOLTIPS
            else if(pluginOptions["errorTip"]   == true){

                var gettipId = element.attr("class").between("tipId[", "]");

                if(gettipId != ""){
                    if($("#"+gettipId).css("display") == "none"){
                        $("#"+gettipId).fadeIn("200", function(){
                            $("#"+gettipId).fadeIn('500');
                            $("#"+gettipId).fadeTo('10', 0.9);
                        }); 
                    }

                } else{

                    var ePos    = element.offset(),
                        tipHtml = '',
                        tipId   = 'hValidatorTip_'+ generate_id(),
                        pLeft   = 0,
                        pTop    = 0,
                        classTop    = '',
                        classBottom = '';

                    element.addClass("tipId["+tipId+"]");

                    if(pluginOptions["messagePosX"] == 'right'){

                        pLeft = (ePos.left + element.outerWidth() + 2);


                        if(pluginOptions["messagePosY"] == 'bottom'){
                            classTop = "tip_top_left";
                            classBottom = "tip_bottom_bottom";

                        } else if(pluginOptions["messagePosY"] == 'top'){
                            classTop = "tip_top_top";
                            classBottom = "tip_bottom_left";

                        } else if(pluginOptions["messagePosY"] == 'center'){
                            classTop = "tip_top_left";
                            classBottom = "tip_bottom_left";
                        }
                        
                    } else if(pluginOptions["messagePosX"] == 'left'){

                        pLeft = (ePos.left - 181 - 2);

                        if(pluginOptions["messagePosY"] == 'bottom'){
                            classTop = "tip_top_right";
                            classBottom = "tip_bottom_bottom";
                            
                        } else if(pluginOptions["messagePosY"] == 'top'){
                            classTop = "tip_top_top";
                            classBottom = "tip_bottom_right";
                            
                        }
                    } else if(pluginOptions["messagePosX"] == 'center'){

                        pLeft = (ePos.left + (element.outerWidth() / 2)) - 90.5;

                        if(pluginOptions["messagePosY"] == 'bottom'){
                            classTop = "tip_center";
                            classBottom = "tip_bottom_bottom";
                            
                        } else if(pluginOptions["messagePosY"] == 'top'){
                            classTop = "tip_top_top";
                            classBottom = "tip_center";
                        }
                    }

                    tipHtml = '<div id="'+tipId+'" class="hValidatorTip" onclick="$(\'#'+tipId+'\').fadeOut(200);"><div class="tipExtremes '+classTop+'"></div><div class="tipBody">' + errorTypes[error] + '</div><div class="tipExtremes '+classBottom+'"></div></div>';

                    $("body").append(tipHtml);

                    if(pluginOptions["messagePosY"] == 'bottom'){       pTop = ePos.top + element.outerHeight() + 2; }
                    else if(pluginOptions["messagePosY"] == 'top'){     pTop = ePos.top - $('#' + tipId).outerHeight() - 2; }
                    else if(pluginOptions["messagePosY"] == 'center'){  pTop = (ePos.top +(element.outerHeight() / 2)) - ($('#' + tipId).outerHeight() / 2); }
                    

                    $("#"+tipId).css({
                        "left"  : pLeft,
                        "top"   : pTop
                    });

                    $("#"+tipId).fadeIn('500');
                    $("#"+tipId).fadeTo('10', 0.9);
                }
            }

            if(element.hasClass(pluginOptions["errorClass"]) == false)
                element.addClass(pluginOptions["errorClass"]);


        } else if(result == true){
            element.removeClass(pluginOptions["errorClass"]);

            if( pluginOptions["errorLabel"] == true &&
                pluginOptions["errorBoard"] == "none" &&
                pluginOptions["errorTip"]   == false){

                if(pluginOptions["messagePosY"] == 'top')
                    element.prev(".bvalidator_errordiv").remove();
                else
                    element.next(".bvalidator_errordiv").remove();

            }
            else if(pluginOptions["errorBoard"] != "none" &&
                    pluginOptions["errorTip"]   == false){

                var getErrorId = element.attr("class").between("hvErrorMsg[", "]"),
                    boardId = $(pluginOptions["errorBoard"]);

                boardId.html("");

                messageList[getErrorId] = "";

                if(pluginOptions["allMessages"] == false){
                    
                    for(var msgId in messageList){
                        if(messageList[msgId] != ""){
                            boardId.html(messageList[msgId]);
                            break;
                        }
                    }
                    
                } else{
                    var boardContent = '';

                    for(var msgId in messageList){
                        if(messageList[msgId] != "" && boardContent.indexOf(messageList[msgId]) == -1){
                            boardContent += messageList[msgId];
                        }
                    }

                    boardId.html(boardContent);
                }

                if(boardId.css("display") == "none" && boardId.html().length > 0)
                    boardId.fadeIn("fast");
                else if(boardId.css("display") != "none" && boardId.html().length == 0)
                    boardId.fadeOut("fast");
                        
            }
            else if(pluginOptions["errorTip"]   == true){
                var tipId = element.attr("class").between("tipId[", "]");
                $("#"+tipId).fadeOut(200);
            }

        } else{ result = false;}

        return result;
    }

    Plugin.prototype.init = function () {
        
        var usedForm = $(this.element);


        //Each input in form
        usedForm.find("input, select, textarea").each(function(){
            
            //Initiates variables
            var _item = $(this);
            
            //For each error type
            for(var errorType in errorTypes) {

                //Normal errors
                if((_item.hasClass(errorType) || _item.attr("class").indexOf(errorType + "[") > -1) &&
                    _item.hasClass("bvalidatorField") == false){

                    if(_item.attr("type") == "radio")
                        $('input[name="'+_item.attr("name")+'"]').addClass("bvalidatorField");
                    else
                        _item.addClass("bvalidatorField");


                    if(pluginOptions["errorBoard"] != "none" && pluginOptions["errorTip"] == false){

                        var hvErrorId = generate_id();

                        if(_item.attr("type") == "radio")
                            $('input[name="'+_item.attr("name")+'"]').addClass("hvErrorMsg["+hvErrorId+"]");
                        else
                            _item.addClass("hvErrorMsg["+hvErrorId+"]");

                        messageList[hvErrorId] = "";
                    }

                }
            }

        });

        
        if(pluginOptions["onsubmit"] == true){
            //On form submit
            usedForm.submit(function(){

                //Initiates variables
                var submitResult = "";
                
                //Each input in form
                usedForm.find(".bvalidatorField").each(function(){
                    
                    //Initiates variables
                    var _item = $(this);
                    
                    submitResult += errorFunction(usedForm, _item).toString();

                });

                //Return error results
                if(submitResult.indexOf("false") > -1){
                    if(pluginOptions["focus"] == true){$("." & pluginOptions["errorClass"]).first().focus();}
                    return false;
                }
                else return true;
            }); 
        }


        usedForm.find(".bvalidatorField").keyup(function(){
            errorFunction(usedForm, $(this));
        });

        usedForm.find(".bvalidatorField").change(function(){
            errorFunction(usedForm, $(this));
        });
    };


    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    }

})(jQuery, window, document);
