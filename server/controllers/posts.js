import Post from "../models/Post.js";
import User from "../models/User.js";

//this is gonna handle the function we created in index.js file, it will have an image pass through the middleware, but not past middleware. middleware handles pic, here just logic to create post

/* CREATE */
export const createPost = async (req, res) => {
  try {
        //this is all the front-end sends us
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {}, //its represented like this {"someid":true}
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();//this is grabbing all the posts, once we add the post above, we need all teh posts to be returned to front-end(which has the list of updated posts)
    //so we always have to consider what we have to return and how front-end is affected by that return
    //we have to consider what back-end is sending you, need to format that and make sure that when backend sends info we need to update it in front-end accordingly
    //so hard part: how api sending info, how we grab info and how we formating it, sometime we have differnt restricions
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// // READ: this is grabbing all the posts from everyone thus like newsfeed

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post); //200->successful req
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post); //200->successful req
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; //we grab from front-end caz thats how we sending from front-end, userid comes from body of req
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); //in likes, if userid exists checked to find if the person likes it

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate( //we have to update post once like button is hit
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost); //we finally pass in updated version to the front-end
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
