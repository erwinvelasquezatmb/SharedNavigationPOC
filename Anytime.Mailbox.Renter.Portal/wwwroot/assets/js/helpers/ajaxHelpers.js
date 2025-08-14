// TODO: move to general helpers
async function ajaxPost(url, data, contentType = 'application/x-www-form-urlencoded', processData = true, cache = true) {
    return $.ajax({
        url: url,
        type: 'POST',
        contentType: contentType,
        data: data,
        processData: processData,
        cache: cache
    })
}
async function ajaxGet(url) {
    return $.ajax({
        url: url,
        type: 'GET'
    })
}