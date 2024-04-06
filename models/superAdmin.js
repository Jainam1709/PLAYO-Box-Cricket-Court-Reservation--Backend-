// superAdmin.js
import mongoose from 'mongoose'; // Assuming mongoose is installed as a dependency

const { Schema, model } = mongoose;

const superAdminSchema = new Schema({
  admin_user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AdminUser', 
  },
  max_reservations: {
    type: Number,
    required: true,
  },
  max_duration: {
    type: Number,
    required: true,
  },
  billing_of_court: {
    type: String, 
    required: true,
  },
  email_notification: {
    type: Boolean,
    required: true,
  },
});

const SuperAdmin = model('SuperAdmin', superAdminSchema);

export default SuperAdmin;
