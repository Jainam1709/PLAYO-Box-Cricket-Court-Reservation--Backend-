// adminUserController.js
import AdminUser from "../models/adminUser.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AdminUserController {
  // GET All Admin Users
  static getAllAdminUsers = async (req, res) => {
    try {
      const adminUsers = await AdminUser.find();
      res.json(adminUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // GET Admin User by ID
  static getAdminUserById = async (req, res) => {
    const adminuserId = req.params.id;

    try {
      const adminUser = await AdminUser.findById(adminuserId);
      if (!adminUser) {
        return res.status(404).json({ message: "Admin User not found" });
      }
      res.json(adminUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // POST Create / register Admin User
  

  static createAdminUser = async (req,res)=>{
    const {username, password, role, password_confirmation, admin_email} = req.body

    // Validate email
    if (!validateEmail(admin_email)) {
      return res.send({"status": "failed", "message": "Invalid email format"});
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.send({"status": "failed", "message": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"});
    }

    const admin = await AdminUser.findOne({admin_email:admin_email})
    if(admin){
        res.send({"status":"failed","message":"Admin Email already exists"})
    }else{
        if(username  && admin_email && password && password_confirmation && role){
            if (password === password_confirmation){
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const adminUser = new AdminUser({
                      username: username,
                      admin_email: admin_email,
                      password: hashPassword,
                      role: role
                })
                const newAdminUser = await adminUser.save();
                res.status(201).json(newAdminUser);
                const saved_adminuser = await AdminUser.findOne({admin_email:admin_email})
                
                //Generate JWT Token
                const token = jwt.sign({adminuserID: saved_adminuser._id}, process.env.JWT_SECRET_KEY, {expiresIn : '2d'})

                res.status(201).send({"status":"success","message":"Admin Registration Successfull" , "token": token, newAdminUser})
                } catch (error) {
                    console.log(error)
                    res.status(400).json({ message: error.message });
                }

            }else{
                res.send({"status":"failed","message":"Admin password and confirm password dosen't match"})
            }

        }else{
            res.send({"status":"failed","message":"All fields are required"})
        }

    }
  };
  static adminLogin = async (req, res)=>{
      try {
          const{admin_email, password} = req.body
          if(admin_email && password){
              const admin_user = await AdminUser.findOne({admin_email:admin_email})
              if(admin_user != null){
                  const isMatch = await bcrypt.compare(password, admin_user.password)
                  if((admin_user.admin_email === admin_email) && isMatch){
                      const token = jwt.sign({adminuserID: admin_user._id}, process.env.JWT_SECRET_KEY, {expiresIn : '2d'})
                      res.send({"status":"success","message":"Admin Login Successfull" , "token": token})
                  }else{
                      res.send({"status":"failed","message": "Invalid credentials. Please check your email and password."})
                  }
              }else{
                  res.send({"status":"failed","message":"Admin user not found. Please register first."})
              }
          }else{
              res.send({"status":"failed","message":"All fields are required"})
          }
      } catch (error) {
          console.log(error)
          res.send({"status":"failed","message":"Unable to Login"})
      }
  };

  static adminLogout = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { adminuserID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // Add the token to the blacklist
      await UserModel.findByIdAndUpdate(req.user._id, { $set:{ blacklistedTokens: token } })

      res.send({ status: 'success', message: 'Admin Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(401).json({ status: 'failed', message: 'Invalid Token. Logout failed.' });
    }
  };

  // PUT Update Admin User by ID
  static updateAdminUser = async (req, res) => {
    const adminuserId = req.params.id;

    try {
      const updatedAdminUser = await AdminUser.findByIdAndUpdate(
        adminuserId,
        req.body,
        { new: true }
      );
      if (!updatedAdminUser) {
        return res.status(404).json({ message: "Admin User not found" });
      }
      res.json(updatedAdminUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // DELETE Admin User by ID
  static deleteAdminUser = async (req, res) => {
    const adminuserId = req.params.id;

    try {
      const deletedAdminUser = await AdminUser.findByIdAndDelete(adminuserId);
      if (!deletedAdminUser) {
        return res.status(404).json({ message: "Admin User not found" });
      }
      res.json({ message: "Admin User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Function to add new court with turfs
  static addCourt = async (req, res) => {
    

    try {
      const { username, password, courts } = req.body;
      const adminUser = await AdminUser.findOne({ username });

      if (!adminUser) {
        return res.status(404).json({ message: "Admin User not found" });
      }

      // Check if courts array is provided in the request body
      if (!courts || !Array.isArray(courts) || courts.length === 0) {
        return res.status(400).json({ message: "Courts array is required" });
      }

      // Check each court in the courts array
      for (const court of courts) {
        const { Name_of_Court, city, turfs } = court;

        // Check if Name_of_Court and city fields are provided for each court
        if (!Name_of_Court || !city || !turfs) {
          return res
            .status(400)
            .json({ message: "Name_of_Court, city and turfs are required" });
        }

        // Push the court to the adminUser's courts array
        adminUser.courts.push({ Name_of_Court, city, turfs });
      }

      await adminUser.save();

      res
        .status(201)
        .json({ message: "New courts added successfully", courts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Function to update login credentials
  static updateCredentials = async (req, res) => {
    const { username, password } = req.body;

    try {
      const adminUser = await AdminUser.findOne({ username });

      if (!adminUser) {
        return res.status(404).json({ message: "Admin User not found" });
      }

      adminUser.username = username;
      adminUser.password = password;

      await adminUser.save();

      res.json({
        message: "Login credentials updated successfully",
        adminUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Function to update ball charges for a turf
  static updateBallCharges = async (req, res) => {
    const { username, turfId, numberOfBalls, chargePerBall } = req.body;

    try {
      const adminUser = await AdminUser.findOne({ username });

      if (!adminUser) {
        return res.status(404).json({ message: "Admin User not found" });
      }

      const court = adminUser.courts.find((court) =>
        court.turfs.some((turf) => turf.id === turfId)
      );

      if (!court) {
        return res
          .status(404)
          .json({ message: "Court with specified turf ID not found" });
      }

      const turf = court.turfs.find((turf) => turf.id === turfId);

      if (!turf) {
        return res
          .status(404)
          .json({ message: "Turf with specified ID not found" });
      }

      turf.ballCharges = { numberOfBalls, chargePerBall };

      await adminUser.save();

      res.json({ message: "Ball charges updated successfully", turf });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}

export default AdminUserController;
