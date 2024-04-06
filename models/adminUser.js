// adminUser.js
import mongoose from 'mongoose';


const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  admin_email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isAdmin: {
    type: Boolean,
    default: true
}
}, {
  timestamps: true
  
});


const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;
