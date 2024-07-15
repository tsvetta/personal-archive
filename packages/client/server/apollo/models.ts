import mongoose from 'mongoose';
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  posts: [{ type: ObjectId, ref: 'Post' }],
});

// Middleware для удаления тега
TagSchema.pre('findOneAndDelete', async function (next) {
  try {
    const options = this.getFilter();

    // Проверяем есть ли у тега связанные посты
    const posts = await Post.find({ tags: { $in: options._id } });

    if (posts.length > 0) {
      throw new Error(
        'Невозможно удалить тег, у которого есть связанные посты'
      );
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const Tag = mongoose.model('Tag', TagSchema);

const PhotoSchema = new Schema({
  src: { type: String, required: true },
  description: { type: String },
});

const PostSchema = new Schema({
  date: {
    type: Date,
  },
  title: {
    type: String,
  },
  photos: [PhotoSchema],
  tags: [{ type: ObjectId, ref: 'Tag' }],
  text: {
    type: String,
  },
  privacy: {
    type: String,
    enum: ['ALL', 'FAMILY', 'FRIENDS', 'CLOSE_FRIENDS', 'TSVETTA'],
    default: 'ALL',
    required: true,
  },
});

export const Post = mongoose.model('Post', PostSchema);

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ALL', 'FAMILY', 'FRIENDS', 'CLOSE_FRIENDS', 'TSVETTA'],
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

export const User = mongoose.model('User', UserSchema);
