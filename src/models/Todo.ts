import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema = new mongoose.Schema<ITodo>({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Todo ||
  mongoose.model<ITodo>("Todo", TodoSchema);
