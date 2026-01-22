import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import {connectDB} from './config/db.js'

import authRoutes from './routes/auth.js'
import superAdmin from './routes/superAdmin.js'
import shopAdmin from './routes/shopAdmin.js'
import commonRoutes from './routes/common.js'

dotenv.config();
const app = express()

app.use(cors({origin:process.env.CLIENT_URL || 'http://localhost:5173', credentials:false}))
app.use(morgan('dev'))
app.use(express.json())

connectDB();
app.use('/api/auth', authRoutes)
app.use('/api/common', commonRoutes)
app.use('/api/shop', shopAdmin)
app.use('/api/superAdmin', superAdmin)

app.get('/', (_,res)=> res.send('Pos Api'))

const port= 4000 || process.env.PORT;
app.listen(port, ()=>console.log(`Server is running on port ${port}`))