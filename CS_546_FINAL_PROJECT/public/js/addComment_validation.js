

$('#add-comment').submit((event) => {
    $('#error').hide()
    const content = $('#commentID').val()

    if (!content) {
        event.preventDefault()
        $('#error').html('Comment can not be empty')
        $('#error').show()
        return
    }

})












