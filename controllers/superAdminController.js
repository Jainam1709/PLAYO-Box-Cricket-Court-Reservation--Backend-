// superAdminController.js
import SuperAdmin from "../models/superAdmin.js";
import AdminUser from "../models/adminUser.js";
import mongoose from 'mongoose'; // Assuming mongoose is installed as a dependency


// GET Super Admin details
const getSuperAdmin = async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.find();
    if (!superAdmins || superAdmins.length === 0) {
      return res.status(404).json({ message: 'Super Admins not found' });
    }
    res.json(superAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Super Admin by ID
const getSuperAdminById = async (req, res) => {
  const superAdminId = req.params.id;

  try {
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    } 
    res.json(superAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST Create Super Admin
const createSuperAdmin = async (req, res) => {
  const superAdmin = new SuperAdmin(req.body);
  try {
    const newSuperAdmin = await superAdmin.save();
    res.status(201).json(newSuperAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST Create Admin User with Random ID and Password
const createAdminUser = async (req, res) => {
  try {
    // Generate a random ID for the Admin User
    const adminUserId = new mongoose.Types.ObjectId();
    
    // Generate a random password (you can adjust the logic as needed)
    const randomPassword = Math.random().toString(36).substring(7);

    // Create the Admin User with the generated ID and password
    const adminUser = new AdminUser({
      _id: adminUserId,
      username: req.body.username,
      password: randomPassword,
      date: req.body.date,
      time: req.body.time,
      role: req.body.role,
      user_mail: req.body.user_mail,
    });

    // Save the Admin User to the database
    const newAdminUser = await adminUser.save();

    // Log the generated ID and password
    console.log(`Generated Admin User ID: ${adminUserId}`);
    console.log(`Generated Admin User Password: ${randomPassword}`);

    // Return the newly created Admin User in the response
    res.status(201).json(newAdminUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getSuperAdmin,
  getSuperAdminById,
  createSuperAdmin,
  createAdminUser,
};
