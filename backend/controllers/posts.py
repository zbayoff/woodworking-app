from flask import abort, Blueprint, request
from werkzeug.utils import secure_filename
from db import db

from ..s3 import s3, BUCKET_NAME
from ..models.models import CategoryModel, PostModel, post_schema, posts_schema

# from ..models.category import CategoryModel


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

    data = request.json

    title = data["title"]
    description = data["description"]
    content = data["content"]
    categories = data["categories"]

    new_post = PostModel(title=title, description=description, content=content)

    if categories:
        for category in categories:
            existing_category = CategoryModel.query.filter_by(
                name=category["name"]
            ).first()
            if not existing_category:
                new_category = CategoryModel(name=category["name"])
                db.session.add(new_category)

                new_post.categories.append(new_category)
            else:
                db.session.add(existing_category)
                new_post.categories.append(existing_category)

    db.session.add(new_post)
    db.session.commit()

    return post_schema.jsonify(new_post)


# update post
@POSTS_API.route("/api/post/<id>", methods=["PUT"])
def update_post(id):

    post = PostModel.query.get(id)

    data = request.json

    post.title = data["title"]
    post.description = data["description"]
    post.content = data["content"]
    post.categories = []  # reset categories
    categories = data["categories"]

    # TODO when post is updated and a category is removed from a post and the category belongs to no other posts, it should be deleted, right?

    if categories:
        for category in categories:
            existing_category = CategoryModel.query.filter_by(
                name=category["name"]
            ).first()
            if not existing_category:
                new_category = CategoryModel(name=category["name"])
                db.session.add(new_category)
                post.categories.append(new_category)
            else:
                db.session.add(existing_category)
                post.categories.append(existing_category)

    db.session.commit()

    return post_schema.jsonify(post)


# delete single post
@POSTS_API.route("/api/post/<id>", methods=["DELETE"])
def delete_post(id):

    post = PostModel.query.get(id)
    db.session.delete(post)
    db.session.commit()

    return post_schema.jsonify(post)


# get all categories
@POSTS_API.route("/api/post/categories", methods=["GET"])
def get_categories():
    all_categories = PostModel.query.all()
    return posts_schema.dump(all_categories)


# upload file to s3
@POSTS_API.route("/api/upload", methods=["POST"])
def upload_image():
    file = request.files["image"]
    print(file)
    if file:
        
        file.filename = secure_filename(file.filename)
        print(file.filename)
        print(file.content_type)
        try:
            s3.upload_file(
                Bucket=BUCKET_NAME,
                Filename=file.filename,
                Key=file.filename,
                ExtraArgs={
                    "ACL": "public-read",
                    "ContentType": file.content_type,  # Set appropriate content type as per the file
                },
            )
        except Exception as e:
            print("Something Happened: ", e)
            abort(500, description=e)
            # return e
        return f"https://{BUCKET_NAME}.s3.amazonaws.com/{file.filename}"
    return "no file selected"
