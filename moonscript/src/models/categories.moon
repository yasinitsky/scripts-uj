import Model from require "lapis.db.model"

class Categories extends Model
    @primary_key: "id"
    get_title: =>
            @title

{
    :Categories
}