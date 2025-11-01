import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  id: string;
  body: string;
  username: string;
  createdAt: Date;
}

export interface ILike {
  id: string;
  username: string;
  createdAt: Date;
}

export interface IPost extends Document {
  body: string;
  username: string;
  createdAt: Date;
  comments: IComment[];
  likes: ILike[];
  likeCount: number;
  commentCount: number;
  user: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema({
  body: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  username: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const LikeSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const PostSchema: Schema = new Schema({
  body: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  username: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  comments: [CommentSchema],
  likes: [LikeSchema],
  likeCount: { 
    type: Number, 
    default: 0 
  },
  commentCount: { 
    type: Number, 
    default: 0 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

// Create indexes for better performance
PostSchema.index({ createdAt: -1 });
PostSchema.index({ user: 1 });
PostSchema.index({ username: 1 });

// Update counts when comments or likes are modified
PostSchema.pre<IPost>('save', function(next) {
  this.likeCount = this.likes.length;
  this.commentCount = this.comments.length;
  next();
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);