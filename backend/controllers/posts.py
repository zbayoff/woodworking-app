from flask import abort, Blueprint, request
from db import db
from models.post import PostModel, post_schema, posts_schema

POSTS_API = Blueprint("POSTS_API", __name__)

# get single post
@POSTS_API.route("/api/post/<id>", methods=["GET"])
def get_post(id):
    post = PostModel.query.get(id)
    if post is None:
        abort(404, description="Post not found")

    return post_schema.jsonify(post)


# get all posts
@POSTS_API.route("/api/post", methods=["GET"])
def get_posts():
    all_posts = PostModel.query.all()
    return posts_schema.dump(all_posts)


# add product
@POSTS_API.route("/api/post", methods=["POST"])
def add_post():
    print(request.json)
    data = request.json

    

    title = data["title"]
    description = data["description"]
    category = data["category"]
    content = data["content"]

    new_post = PostModel(
        title=title, description=description, category=category, content=content
    )

    # new_post = PostModel(name=data["name"])
    db.session.add(new_post)
    db.session.commit()

    return post_schema.jsonify(new_post)


# update product
@POSTS_API.route("/api/post/<id>", methods=["PUT"])
def update_post(id):

    post = PostModel.query.get(id)

    data = request.json

    post.title = data["title"]
    # post.description = data["description"]
    # post.category = data["category"]
    # post.content = data["content"]

    db.session.commit()

    return post_schema.jsonify(post)


# delete single post
@POSTS_API.route("/api/post/<id>", methods=["DELETE"])
def delete_post(id):

    post = PostModel.query.get(id)
    db.session.delete(post)
    db.session.commit()

    return post_schema.jsonify(post)
