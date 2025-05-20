import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  chatId: { type: Number, unique: true, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
