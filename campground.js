const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
module.exports.index = async (req,res)=>{
    const camps = await Campground.find({});
     res.render('campground',{camps});
 };
 module.exports.newCamp = (req, res) => {
    res.render('new');
};
module.exports.show = async (req,res)=>{
    var {id} = req.params;
    const camps =  await Campground.findById(id).populate({
       path:'reviews',
       populate:{
           path:'author'
       }
    }).populate('author');;
    if(!camps){
       req.flash('error',"can't find it:(");
       return res.redirect('/campgrounds');
    }
    const currentUser = req.user.username;
console.log(currentUser);
    res.render('show',{camps,currentUser});
};
module.exports.edit= async (req,res)=>{
    var {id} = req.params;
    const camps =  await Campground.findById(id);
    res.render('edit',{camps});
};
module.exports.create = async (req,res)=>{
    const campground =  new Campground(req.body);
    campground.image = req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }));
    campground.author = req.user._id;
    await campground.save();
     req.flash('success',"successfully made a new campground:)");
     res.redirect('/campgrounds');
 };
 module.exports.editCampground = async(req,res)=>{
    var {id} = req.params;
  const camps =  await Campground.findByIdAndUpdate(id,req.body);
  const imgs = req.files.map(f=>({
    url:f.path,
    filename:f.filename
}));
camps.image.push(...imgs);
await camps.save();
console.log(req.body.deleteImages);
if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
    }
    await camps.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    console.log(camps);
}
  req.flash('success',"successfully updated!");
    res.redirect(`/campgrounds/${camps._id}`)
};
module.exports.deleteCampground = async(req,res)=>{
    var {id} = req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success',"successfully deleted!");
    res.redirect(`/campgrounds`)
};