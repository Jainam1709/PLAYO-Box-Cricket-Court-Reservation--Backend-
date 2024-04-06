  import dotenv from 'dotenv'
  dotenv.config()
  import express, { json } from 'express'
  import cors from 'cors'
  import connectDB from './config/connectdb.js'
  import userRoutes from './routes/userRoutes.js'
  import superAdminRoutes from './routes/superAdminRoutes.js';
  import adminUserRoutes from './routes/adminUserRoutes.js';
  import courtRoutes from './routes/courtRoutes.js';
  import turfRoutes from './routes/turfRoutes.js';
  import cartRoutes from './routes/cartRoutes.js';


  const app = express()
  const port = process.env.PORT
  const DATABASE_URL = process.env.DATABASE_URL

  //cors policy
  app.use(cors())

  //Database connection 
  connectDB(DATABASE_URL)

  //Json
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  //Load routes
  app.use("/api/user", userRoutes)

  //adminUser and superAdmin
  app.use('/api/superadmin', superAdminRoutes);
  app.use('/api/adminuser', adminUserRoutes);
  app.use('/api/court', courtRoutes);
  app.use('/api/court', turfRoutes);

  //add to cart
  app.use('/api/cart', cartRoutes);

  

  //Error handling middleware
  app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something went wrong!');
   });

  app.listen(port, ()=>{
      console.log(`server listening at http://localhost:${port}`)
  })