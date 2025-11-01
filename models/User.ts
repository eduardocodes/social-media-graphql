import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Link to Clerk user.id
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create indexes for better performance
UserSchema.index({ clerkId: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);