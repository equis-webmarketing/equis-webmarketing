(function ($){
'use strict';
// --- document.ready shorthand ---
$(function() {
	/**
	 * Handle contact form
	 */
	contactForm();
	
	/**
	 * Handles the contact form
	 */
	function contactForm(){
		var $form = $('#contactForm');
		
		$form.on('submit', function(e){
			e.preventDefault();
			
			var name = $form.find('#name');
			var email = $form.find('#email');
			var subject = $form.find('#subject');
			var message = $form.find('#message');
			var fields = [name, email, subject, message];
			
			onFiledsFocus(fields);
			
			if ( !notEmpty(fields) ) return;
			if ( !isEmail(email) ) return;
			
			$.ajax({
				method: 'POST',
				url: 'backend/actions/mail-contact.php',
				data: {
					name: name.val(),
					email: email.val(),
					subject: subject.val(),
					message: message.val(),
					recaptchaResponse: $("#g-recaptcha-response").val()
				},
				dataType: 'json',
				success: function succes(response){
					console.log(response);
					var $formMessage = $form.find('#formMessage');
					var submitMessage = 
						'<div class="message message-' + response.status + '">' + response.message + '</div>';
					$formMessage.html(submitMessage);

						setTimeout(function(){
							$formMessage.html('');
						}, 5000);
					if (response.status === 'success'){
						cleanInputs(fields);
					};
				},
				error: function error(response){
					console.log(response);
					var $formMessage = $form.find('#formMessage');
					var submitMessage = 
						'<div class="message message-' + response.status + '">' + response.message + '</div>';
					$formMessage.html(submitMessage);

						setTimeout(function(){
							$formMessage.html('');
						}, 5000);
					if (response.status === 'success'){
						cleanInputs(fields);
					};
				}
			});
			
			
		});
	}
	
	/**
	 * Validates if some fields are not empty
	 * 
	 * @param {array: obj} fields to validate
	 * @return {boolean} true when all fields are not empty
	 */
	function notEmpty(fields){
		var allValid = true;
		$.each(fields, function(i, field){
			if ( !field.val().length ) {
				field.addClass('input-error');
				allValid = false;
			}
		});	
		return allValid;
	}
	
	/**
	 * Validates email
	 * 
	 * @param {obj} field to validate
	 * @return {boolean} true when the field value is an email
	 */
	function isEmail(field){
		var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		var check = pattern.test( field.val() );
		if (!check) field.addClass('input-error');
		return check;
	}
	
	/**
	 * Remove error class on field focus
	 * 
	 * @param {array: obj} jquery field objects
	 */
	function onFiledsFocus(fields){
		$.each(fields, function(i, field){
			field.on('focus', function(){
				$('#formMessage').html('');
				$(this).removeClass('input-error');
			});
		});
	}
	
	/**
	 * Removes input values
	 * 
	 * @param {array: obj} jquery field objects
	 */
	function cleanInputs(fields){
		console.log('sarasa');
		$.each(fields, function(i, field){
			field.val('');
		});
	}
	
});
})(jQuery);