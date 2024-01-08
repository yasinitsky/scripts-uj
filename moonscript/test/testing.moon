http = require "socket.http"
json = require "cjson"
ltn12 = require "ltn12"

test = ''

set_test = (test_title) ->
    test = test_title

assert_status = (res, status) ->
    unless res.status == status
        print "[ERROR]: Status assertion failed. Expected " .. status .. " . Actual: " .. res.status .. "."
        print "[ERROR]: Test: " .. test .. "."

assert_body = (res, body) ->
    unless res.data == body
        print "[ERROR]: Body assertion failed."
        print "[ERROR]: Test: " .. test .. "."

http_request = (url, body={}, method="GET") ->
    response = {}
    client, code, headers, status = http.request {
        url,
        sink: ltn12.sink.table(response),
        headers: {
            "Content-Type": "application/json"
        },
        source: ltn12.source.string(json.encode(body))
    }

    return {
        status,
        data: json.decode(response)
    }

tables_equals = (o1, o2) ->
    if o1 == o2 return true
    o1Type = type(o1)
    o2Type = type(o2)
    if o1Type ~= o2Type return false 
    if o1Type ~= 'table' return false

    mt1 = getmetatable(o1)
    if mt1 and mt1.__eq
        return o1 == o2

    keySet = {}

    for key1, value1 in pairs(o1)
        value2 = o2[key1]
        if value2 == nil or tables_equals(value1, value2) == false
            return false
        keySet[key1] = true

    for key2, _ in pairs(o2)
        if not keySet[key2] return false
    return true

{
    :http_request
    :assert_status
    :assert_body
    :set_test
}