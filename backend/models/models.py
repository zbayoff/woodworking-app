from db import db, ma

post_category = db.Table(
    "post_category",
    db.Column("post_id", db.Integer, db.ForeignKey("posts.id")),
    db.Column("category_id", db.Integer, db.ForeignKey("categories.id")),
)


class CategoryModel(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True)
    # posts = db.relationship("PostModel", secondary=post_category, back_populates="categories")
    # description = db.Column(db.String(150))
    def __repr__(self):
        return f'<Category "{self.name}">'


class PostModel(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.now())
    date_modified = db.Column(db.DateTime, default=db.func.now())
    title = db.Column(db.String(150))
    description = db.Column(db.String(150))
    categories = db.relationship(
        "CategoryModel", secondary=post_category, backref="posts"
    )
    content = db.Column(db.Text)

    def __repr__(self):
        return f'<Post "{self.title}">'


# def __init__(self, id, name):
#     self.id = id
#     self.name = name


class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PostModel
        include_fk = True
        include_relationships = True
    categories = ma.Nested('CategorySchema', many=True, exclude=["posts"])

post_schema = PostSchema()
posts_schema = PostSchema(many=True)



class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CategoryModel
        include_fk = True
        include_relationships = True

    posts = ma.Nested('PostSchema', many=True, exclude=["categories"])


category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
