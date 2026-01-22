import express, { Router } from 'express'
import { auth } from '../middleware/auth.js';
import { requireRole,requireActive } from '../middleware/role.js';
import Product from '../models/Product.js'
import Sale from '../models/Sales.js'
import LedgerEntry from '../models/LedgerEntry.js'
import TeamMember from '../models/TeamMember.js'


const router = express.Router()

router.get('/product',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const products = await Product.find({shop: req.user.shop._id});
    res.json(products);
} )

router.post('/product',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const products = await Product.create({...req.body, shop:req.user.shop._id})
    res.status(201).json(products);
} )

router.post('/sales',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const {items, customerName, paymentMethod} = req.body;
    let total = 0;
    for(const item of items){
        const product = await Product.findById(item.product);
        if(!product || String(product.shop) !== String(req.user.shop._id)){
            return res.status(400).json({error:'Product not found or unauthorized'})
        }
        if(product.stock < item.quantity){
            return res.status(400).json({error:'Insufficient stock'})
        }
        product.stock -= item.quantity;
        await product.save();
        total += item.quantity * item.price;
    }
    const sale = await Sale.create({
        items,
        customerName,
        shop: req.user.shop._id,
        total,
        paymentMethod,
    })
    await LedgerEntry.create({
        shop:req.user.shop._id,
        type:'CREDIT',
        amount:total,
        description:`Sale to ${customerName || 'WalkIn'}`,
        reference: sale._id.toString(),


    })
    res.status(200).json(sale);

} )

router.get('/Ledger',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const entries = await LedgerEntry.find({shop:req.user.shop._id}).sort({createdAt:-1})
    res.json(entries);
})
router.post('/Ledger',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const entries = await LedgerEntry.create({...req.body, shop:req.user.shop._id})
    res.status(201).json(entries)
})

router.post('/team',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const member = await TeamMember.create({...req.body, shop:req.user.shop._id});
    res.status(201).json(member);
})
router.delete('/team/:id',auth, requireRole(['SHOP_ADMIN']), requireActive,async(req, res)=>{
    const member = await TeamMember.findById(req.params.id);
    if(!member || String(member.shop) !== String(req.user.shop._id)){
        return res.status(400).json({error:'Member not found or unauthorized'})
    }
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({message:'Member deleted successfully'})
})
export default router



