import {redirect} from "../helpers";

const config = {
    // php: "http://localhost/qwd" // change this
    php:"http://queenswebdesignandgraphics.com/php/quote-form.php"
}

export function ContactForm(){
    var quoteForm = $( "#quote-form"),
        errorClass = "field-error",
        thankyouUrl = "/articles/?leadGen=true",
        submitBtn = function() {
            return {
                button: quoteForm.find("button[type=submit]"),
                enable: function(){
                    this.button.removeAttr("disabled");
                },
                disable: function() {
                    this.button.attr("disabled", "disabled");
                }
            }
        }(),
        messages = function() {
            return {
                holder: quoteForm.find(".returnMessage"),
                show: function(text) {
                    this.holder.removeClass("hidden").text(text)
                },
                hide: function() {
                    this.holder.addClass("hidden").text("")
                }
            }
        }(),
        services = function() {
            return {
                checkboxes: quoteForm.find(".input-checkbox > input"),
                checked: function() {
                    var array = [];
                    this.checkboxes.each(function(){
                        if( $(this).is( ":checked" ) ) {
                            array.push( $(this).attr("id") );
                        } 
                    })
                    this.selected = array.length;
                    return array;
                },
                selected: 0
            }
        }(),
        textFields = function() {
            return {
                required: quoteForm.find(".validate-required"),
                isFilled: function(field) {
                    let name = field[0]["name"]
                    if( field.val() === "" ) {
                        addErrorClass(field);
                        //console.log({field});
                        return {field:name, valid:false};
                   } else {
                       removeErrorClass(field);
                       return {field:name, valid:true};
                   }
                },
                isValid: function() {
                    var isFilled, fieldsValid = {};
                    this.required.each(function(){
                        isFilled = textFields.isFilled($(this));
                        fieldsValid[isFilled.field] = isFilled.valid
                        // if(!isFilled){
                        //     isValid = false;
                        // }
                    })
                    //console.log({fieldsValid});
                    return (fieldsValid.name && fieldsValid.description && fieldsValid.email)
                }
            }
        }();
   
    services.checkboxes.on("click", function() {
        removeErrorClass($(".input-checkbox"));
    })
    services.checkboxes.on("focusin", function(e) {
       $(this).next("label").addClass("focus")
    })
    services.checkboxes.on("focusout", function() {
        $(this).next("label").removeClass("focus")
    })
    textFields.required.on("focusout", function() {
      textFields.isFilled($(this))
    })

  
    
    function validateCaptcha() {
        var response = grecaptcha.getResponse()
        return response.length ? true : false;
    }

    function formValidator(){
        var textFieldsValid = textFields.isValid(),
            servicesValid = services.checked().length > 0,
            captchaValid = validateCaptcha();
        return {
            textFields: textFieldsValid,
            services: servicesValid,
            captcha:captchaValid,
            form:textFieldsValid && servicesValid && captchaValid
        }
    }
    function addErrorClass(el) {
        el.addClass(errorClass);
    };

    function removeErrorClass(el) {
        el.removeClass(errorClass);
    }

    function clearAllErrors(){
        removeErrorClass($(`.${errorClass}`))
    }

    quoteForm.submit(function(e) {
        e.preventDefault();
        messages.hide(); // reset form
        var servicesSelected = services.checked();
        var formValid = formValidator();
        //console.log({formValid});
        if(formValid.form) {
            var formData = {
                name: $("#name").val(),
                email: $("#email").val(),
                phone: $("#phone").val(),
                currentWebsite: $("#currentWebsite").val(),
                services: servicesSelected.toString(),
                description: $("#description").val(),
                grecaptcha: formValid.captcha
            };
            //console.log({formData});
            messages.hide(); // reset form
            submitBtn.disable();
           // submitBtn.after('<img src="images/status.gif" class="loader">'),btn--loading
           postForm(formData);
        } else {
            if(!formValid.services) {
                addErrorClass($(".input-checkbox"));
                messages.show($(this).data("error"));
            }
            else if(!formValid.captcha){
                addErrorClass($(".g-recaptcha div"));
                messages.show("reCAPTCHA is required. Please check the box.");
            }
            
            submitBtn.enable();
        }
    })

    function postForm(data) { 
        //console.log({data});
        $.post(config.php, data, function(res) {
            (res["status"] === "success") ? onSuccess(res["status"]) : onFail(res)
        }, "json")
    }

    function onSuccess(response){
        messages.holder.addClass(response)
        messages.show(quoteForm.data(response));
        setTimeout(function(){
            redirect(thankyouUrl)
        }, 3000);  
    }
    function onFail(response){
        clearAllErrors();
        messages.show(response["msg"]);
        addErrorClass($("#" + response["field"]));
        submitBtn.enable();
    }
    return quoteForm;
};