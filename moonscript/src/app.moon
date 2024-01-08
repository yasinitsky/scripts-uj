lapis = require "lapis"
lapis_application = require "lapis.application"
types = require "lapis.validate.types"
base64 = require "base64"
google = require "cloud_storage.google"

import respond_to from lapis_application
import with_params from require "lapis.validate"
import capture_errors_json from lapis_application
import json_params from lapis_application
import assert_valid from require "lapis.validate"
import yield_error from lapis_application
import decode from base64

import Categories from require "models.categories"
import Products from require "models.products"

-- storage = google.CloudStorage\from_json_key_file("gcs_key.json")

class extends lapis.Application
    "/categories": respond_to {
        POST: json_params capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"title", types.valid_text}
            }, (params) =>
                res = Categories\create { title: params.title }
                { json: res }
        }

        GET: =>
            res = Categories\select!
            { json: { categories: res } }
    }

    "/categories/:id": respond_to {
        PATCH: json_params capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id},
                {"title", types.valid_text}
            }, (params) =>
                category = Categories\find params.id
                unless category
                    return { status: 404, json: { } }

                category\update { title: params.title }
                { json: category }
        }

        DELETE: capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id}
            }, (params) =>
                category = Categories\find params.id
                unless category
                    return { status: 404, json: { } }

                category\delete!
                { json: { } }
        }

        GET: capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id}
            }, (params) =>
                category = Categories\find params.id
                unless category
                    return { status: 404, json: { } }

                { json: category }
        }
    }

    "/products": respond_to {
        POST: json_params capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"title", types.valid_text},
                {"price", types.valid_text},
                {"category", types.db_id}
            }, (params) =>
                assert_valid params, {
                    { "title", min_length: 1, max_length: 256 },
                    { "price", matches_pattern: "^%d+.%d%d" }
                }

                category = Categories\find params.category
                unless category
                    yield_error "Could not find category with gived id"
                
                res = Products\create {
                    title: params.title,
                    price: params.price
                    category_id: params.category
                }

                return { json: res }
        }

        GET: =>
            products = Products\select!

            { json: { products: products } }
    }

    "/products/:id": respond_to {
        PATCH: json_params capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id},
            }, (params) =>
                assert_valid @params, {
                    { "title", exists: true, min_length: 1, max_length: 256, optional: true },
                    { "price", exists: true, matches_pattern: "^%d+.%d%d", optional: true },
                    { "category", exists: true, matches_pattern: "^%d+", optional: true}
                }

                product = Products\find params.id

                unless product
                    return { status: 404, json: { } }

                fields_to_update = {}
                if @params.title
                    fields_to_update.title = @params.title

                if @params.price
                    fields_to_update.price = @params.price

                if @params.category
                    category = Categories\find @params.category
                    unless category
                        yield_error "Could not find category with gived id"

                    fields_to_update.category_id = @params.category

                product\update fields_to_update

                { json: product }
            
        }

        DELETE: capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id}
            }, (params) =>
                product = Products\find params.id
                unless product
                    return { status: 404, json: { } }

                product\delete!
                { json: { } }
        }

        GET: capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id}
            }, (params) =>
                product = Products\find params.id
                unless product
                    return { status: 404, json: { } }

                { json: product }
        }
    }

    "/products/:id/upload_image": respond_to {
        POST: capture_errors_json {
            on_error: => { status: 400, json: { errors: @errors } }
            with_params {
                {"id", types.db_id},
            }, (params) =>
                if @req.headers["Content-Type"] != "image/jpeg" and @req.headers["Content-Type"] != "image/png"
                    yield_error "File should have extension jpeg or png"

                product = Products\find params.id
                unless product
                    return { status: 404, json: { } }

                file_decoded = decode(@req.params_post)
                storage:put_file_string(bucket, params.id, file_decoded)

                return { status: 200 }

        }
    }