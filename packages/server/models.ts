import mongoose from 'mongoose';
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Tag = mongoose.model('Tag', TagSchema);

const PhotoSchema = new Schema({
  src: { type: String, required: true },
  description: [String],
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
