// Alert Accessor

var email = "EMAIL"; // if you choose to  send through email
var sms = "SMS"; // if you choose to  send through sms
var message_type = email; // email works , sms still has some issues
var received = false;
var email_count = 1; // the number of times to send the email when theres a trigger

exports.setup = function() {

    this.input('status');

};

exports.initialize = function() {
    this.addInputHandler("status", alert.bind(this));

};


function alert() {

    var status = this.get('status');
    var msg = "status - " + status + "\nCount - " + email_count + "\n";

    var user_name = $('#user_name').val();
    var contact_name = $('#contact_name').val();
    var contact_email = $('#contact_email').val();

    msg += "user name : " + user_name + "\n";
    msg += "contact name : " + contact_name + "\n";
    msg += "contact email : " + contact_email + "\n";

//    $('#name').html(msg);

    if(status == 1 && email_count > 0)
    {
        if(message_type === "EMAIL")
        {
          var data = {
                "email_configuration":
                {
                    "user_name":  user_name,
                    "recipient_name":  contact_name,
                    "recipient_email_address": contact_email
                }
            };

            received = true;
            if(user_name == "" || contact_name == "" || contact_email == "")
            {
               $('#message').html("Email not Sent");
            } else {
                 window.email.send(function(result){}, function() {alert("not able to send");}, data);
                 $('#message').html("Email Sent to Emergency Contact");
                 email_count = email_count - 1;
                 received = true;
            }

        }
        else if (message_type === "SMS")
        {

            var number = "+xxxxxxxxxxxx";
            var message = "You have been alerted";

            //CONFIGURATION
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
        //            intent: 'INTENT'  // send SMS with the native android SMS messaging
                    intent: '' // send SMS without opening any other app
                }
            };

            // if there is a fall; display the option buttons
            // send sms
            var success = function () { alert('Message sent successfully'); };
            var error = function (e) { alert('Message Failed:' + e); };
            window.sms.send(number, message, options, success, error);
            $('#message').html("Sms Sent");
            email_count = email_count - 1;
            received = true;

        }
    }
    else if(status == 0) {
        $('#message').html("");
        received = false;
        email_count = 1;
    }

}