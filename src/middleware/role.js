export const requireRole = (roles = []) => {
return (req, res, next)=>{
    if(!roles.includes(req.user.role)) return res.status(403).json({message: 'Forbidden'});
    next();
}
}

export const requireActive = ()=>{
    return(req,res, next)=>{
        if(req.user.status !== 'active') return res.status(403).json({message:'Forbidden'});
        next();
    }
}