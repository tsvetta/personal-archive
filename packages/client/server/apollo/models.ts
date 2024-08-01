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
  accessLevel: {
    type: Number,
    default: 0,
    required: true,
    min: [0, 'Access level should be between 0 and 4'],
    max: [4, 'Access level should be between 0 and 4'],
  },
});

export const Post = mongoose.model('Post', PostSchema);

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Enter username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Enter password'],
    minlength: [10, 'Minimal length is 10 characters'],
  },
  role: {
    type: String,
    enum: ['ALL', 'FAMILY', 'FRIENDS', 'CLOSE_FRIENDS', 'TSVETTA'],
    default: 'ALL',
  },
  accessLevel: {
    type: Number,
    default: 0,
    required: true,
    min: [0, 'Access level should be between 0 and 4'],
    max: [4, 'Access level should be between 0 and 4'],
  },
  refreshToken: {
    type: String,
  },
});

export const User = mongoose.model('User', UserSchema);

const BBFilesSchema = new Schema({
  fileUrl: { type: String, required: true },
  published: { type: Boolean, required: true },
});

export const BBFiles = mongoose.model('BBFiles', BBFilesSchema);
