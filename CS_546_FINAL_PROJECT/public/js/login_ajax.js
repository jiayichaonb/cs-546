$("#submit").click(function () {
    event.preventDefault()

    const username = $('#login-name').val()
    const password = $('#login-password').val()
    var param = { 'username': username, 'password': password }

    if (!username) {
        event.preventDefault()
        $('#error').html('Please enter the username')
        $('#error').show()
        return
    }

    if (!password) {
        event.preventDefault()
        $('#error').html('Please enter the password')
        $('#error').show()
        return
    }

    $('#error').hide()


    $.ajax({
        url: '/login',
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        credential: 'same-origin',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-ajax-call", "no-cache");
        },
        success: function (data) {
            let token = data.token
            window.location.href = "http://localhost:3000/login/"+token
            //console.log('Success');
        },
        error: function (jqXHR, exception) {

            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 401) {
                msg = JSON.parse(jqXHR.responseText).error;
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + JSON.parse(jqXHR.responseText).error;
            }

            alert(msg)
            $('#error').html(msg)
            $('#error').show()

        }
    });

});