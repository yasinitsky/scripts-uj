testing = require "testing"

import http_request from testing
import assert_status from testing
import assert_body from testing
import set_test from testing

API_URL = 'http://localhost:8080'

set_test('get unexisting category')
res = http_request(API_URL .. '/categories/1')
assert_status(res, 404)

set_test('get unexisting product')
res = http_request(API_URL .. '/products/1')
assert_status(res, 404)

set_test('create category')
res = http_request(API_URL .. '/categories', "POST", {
    "title": "Category"
})
assert_status(res, 200)

category_id = res.data.id

set_test('get category')
res = http_request(API_URL .. '/categories/' .. category_id)
assert_status(res, 200)
assert_body(res, {
    "title": "Category",
    "id": category_id
})

set_test('create product')
res = http_request(API_URL .. '/products', "POST", {
    "title": "Product",
    "price": "12.25",
    "category": category_id
})
assert_status(res, 200)

product_id = res.data.id

set_test('get product')
res = http_request(API_URL .. '/products/' .. product_id)
assert_status(res, 200)
assert_body(res, {
    "title": "Product",
    "price": "12.25",
    "category_id": category_id,
    "id": product_id
})

set_test('update category title')
res = http_request(API_URL .. '/categories/' .. category_id, "PATCH", {
    "title": "Category 2"
})
assert_status(res, 200)

set_test('check updated category title')
res = http_request(API_URL .. '/categories/' .. category_id)
assert_status(res, 200)
assert_body(res, {
    "title": "Category",
    "id": category_id
})

set_test('update product price')
res = http_request(API_URL .. '/products/' .. product_id, "PATCH", {
    "price": "11.50"
})
assert_status(res, 200)

set_test('check updated product price')
res = http_request(API_URL .. '/categories/' .. category_id)
assert_status(res, 200)
assert_body(res, {
    "title": "Product",
    "price": "11.50",
    "category_id": category_id,
    "id": product_id
})

set_test('delete product')
res = http_request(API_URL .. '/products/' .. product_id, "DELETE")
assert_status(res, 200)

set_test('check deleted product')
res = http_request(API_URL .. '/products/' .. product_id)
assert_status(res, 404)

set_test('delete category')
res = http_request(API_URL .. '/categories/' .. category_id, "DELETE")
assert_status(res, 200)

set_test('check deleted category')
res = http_request(API_URL .. '/categories/' .. category_id)
assert_status(res, 404)

