import express from 'express'
import {auth} from '../middleware/auth.js'

const router = express.Router();
router.get('/me', auth, (req,res)=>{
    const {_id,name, email,role, status, shop} = req.user;
    res.json({_id,name, email, role, status, shop})
})

export default router