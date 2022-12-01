from ..db import db, ma


class PostModel(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.now())
    date_modified = db.Column(db.DateTime, default=db.func.now())
    title = db.Column(db.String(150))
    description = db.Column(db.String(150))
    category = db.Column(db.String(150))
    content = db.Column(db.String(150))


# def __init__(self, id, name):
#     self.id = id
#     self.name = name


class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PostModel
        include_fk = True


post_schema = PostSchema()
posts_schema = PostSchema(many=True)
