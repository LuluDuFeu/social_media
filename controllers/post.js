const Post = require('../models/post');
const fs = require('fs');

exports.getPosts = (req, res) => {
    const posts = Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
        res.json({posts});
    })
    .catch(err => console.log(err));
};


exports.createPost = (req, res) => {
    if(!req.file) {
        return res.status(200).json({message: 'Please, upload a valid image'});
    }

    let post = new Post(req.body);

    post.photo.data = fs.readFile(req.file.path);
    post.photo.contentType = req.file.mimetype;
    post.postedBy = req.profile._id;
    post.save((err, result)=> {
        if(err) {
            return res.status(400).json({error: err});
        }
        res.json({result});
    })

}

exports.postByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(posts);
    })
}