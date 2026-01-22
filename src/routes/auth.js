import express from 'express';
import User from '../models/User.js'
import Shop from '../models/Shop.js'
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/generateTokens.js'


const router = express.Router();

router.post('/signup', async(req, res)=>{
    try{
        const {name, email, password, shopName, shopAddress} = req.body;
        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({message:'User already exists'});
        const shop = await Shop.create({name:shopName, address:shopAddress, isActive:false})
        const passwordHash =await bcrypt.hash(password, 10);
        const user =await User.create({
            name,
            email,
            password:passwordHash,
            shop:shop._id,
            role:'SHOP_ADMIN',
            status: 'PENDING'
        });
        res.status(201).json({message:'User created successfully. Awaiting admin approval.'})

    }catch(err){
        res.status(501).json({message:'Interal Error'})
    }
})


router.post('/signin', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}).populate('shop');
        if(!user) return res.status(401).json({message:'Invalid credentials'});
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) return res.status(401).json({message:'Invalid credentials'});
        const token = generateToken(user);
        res.json({token, id:user._id, name:user.name, role:user.role, status:user.status, shop:user.shop})

    }
    catch(err){
        res.status(500).json({message:'Internal Error', error: err.message})
    }
})

export default router