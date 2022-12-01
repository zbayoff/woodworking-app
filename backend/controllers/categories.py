from flask import Blueprint, request, Response
from ..db import db
from ..models.category import CategoryModel, category_schema, categories_schema

CATEGORIES_API = Blueprint("CATEGORIES_API", __name__)

# get all categories
@CATEGORIES_API.route("/api/category", methods=["GET"])
def get_categories():
    all_categories = CategoryModel.query.all()
    return categories_schema.dump(all_categories)

# @CATEGORIES_API.route("/api/revalidate", methods=["GET"])
# def revalidate():
    
#     print(Response)
#     Response.revalidate()
#     return 'hey'


# add category
@CATEGORIES_API.route("/api/category", methods=["POST"])
def add_category():

    data = request.json

    name = data["name"]
    description = data["description"]

    new_category = CategoryModel(name=name, description=description)

    db.session.add(new_category)
    db.session.commit()

    return category_schema.jsonify(new_category)


# update product
@CATEGORIES_API.route("/api/category/<id>", methods=["PUT"])
def update_category(id):

    category = CategoryModel.query.get(id)

    data = request.json

    category.name = data["name"]
    category.description = data["description"]

    db.session.commit()

    return category_schema.jsonify(category)


# delete single category
@CATEGORIES_API.route("/api/category/<id>", methods=["DELETE"])
def delete_category(id):

    category = CategoryModel.query.get(id)
    db.session.delete(category)
    db.session.commit()

    return category_schema.jsonify(category)
