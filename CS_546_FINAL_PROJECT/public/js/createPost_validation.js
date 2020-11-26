$('#createPost').submit((event) => {
    $('#error').hide()
    const title = $('#titleID').val()
    const content = $('#contentID').val()

    if (!title) {
        event.preventDefault()
        $('#error').html('Title can not be empty')
        $('#error').show()
        return
    }

    if (!content) {
        event.preventDefault()
        $('#error').html('Content can not be empty')
        $('#error').show()
        return
    }

    if (!$('#auto').is(':checked') && !$('#food').is(':checked') && !$('#course').is(':checked')){
        event.preventDefault()
        $('#error').html('You must choose a category')
        $('#error').show()
        return
    }

})