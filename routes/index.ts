/**
 * Getting the Express Package
 */
import express, {Request, Response, NextFunction} from "express";

/**
 * Importing the Passport Package for user authentication.
 */
import passport from "passport";

/**
 * Getting the Router Object from the express.
 */
const router = express.Router();

/**
 * Getting the defined models from other modules
 */
import User from "../models/users"
import Post from "../models/posts";

/**
 * Importing the configured Multer to handle the user uploaded files.
 */
import upload from "./multer";
import {post} from "jquery";

/**
 * Creating the Routes for the Current express application
 * or creating the group of routes for current express application
 * Which will be executed on user requests.
 *
 * At last mounting this Router Instance using the Middleware.
 * ============================================================>
 */


//------------> Home Page (Login Page) Method: GET
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login',nav:false});
});

//------------> Home Page (Login Page) Method: POST
router.post('/', function(req, res, next)
{
  // Note: Here "failureFlash" will automatically insert the flash messages into the user session which we can utilize in another route handler
  // One Time messages are called Flash Messages.
  passport.authenticate("local",{successRedirect: "/profile", failureRedirect:"/", failureFlash: true})(req,res,next)
});

//------------> Register Page Method: POST
router.post('/register', function(req, res, next)
{

  // Using the named import to get the values from the Req.body Object
  let {username,fullname,password,email,contact} = req.body;

  // Creating a new document for user collections or creating the object of the Model
  let newUser = new User({username, fullname, email, profileImage: "", contact})

  User.register(newUser,password,(err:any) =>
  {
    if(err)
    {
        if (err.name === "UserExistsError") // User Already exists with that email
        {
          console.log("Error:User Already Exists with this email") // Log Message into the console.
          req.flash("registerMessage", "Warning: User already exists") // Flash Message for user
          res.redirect("/register"); // Redirection
        }
        else
        {
          req.flash("registerMessage", "Server Error") // For General Error
          res.redirect("/register"); // Redirection
        }
    }
    else
    {
      return passport.authenticate("local")
      (req, res, () => {res.redirect("/profile")})
    }
  })
});



//------------> Register Page (Register Page) Method:GET
router.get('/register', function(req, res, next)
{
  res.render('register', { title: 'Register',nav:false});
});

/**
 * -----------> Protected Routes.
 */
//------------> Add Page Method:GET
router.post('/edit', isLoggedIn, async  function(req, res, next)
{

    // Using the named import to get the values from the Req.body Object
    let {username,fullName,email,contact} = req.body;

    // Creating a new document for user collections or creating the object of the Model
    // for updated User
    let updatedUser = await new User({
        // @ts-ignore
        _id: req.user._id,
        username,
        fullname:fullName,
        // @ts-ignore
        password: req.user.password,
        email,
        // @ts-ignore
        profileImage: req.user.profileImage,
        contact,
        // @ts-ignore
        posts: req.user.posts
    })

    // @ts-ignore
    await User.updateOne({"_id":req.user._id},updatedUser)

    res.redirect("/profile");

});

router.get('/feed', isLoggedIn,async function(req, res, next)
{
    //@ts-ignore
  const currentUser =  await User.findOne({"_id":req.user._id}).populate("posts");

  const posts = await Post.find().populate("user");

  res.render("feed",{nav:true, title: "Feed", posts, user:currentUser})
});

router.get('/show/posts', isLoggedIn, async function(req, res, next)
{
    //@ts-ignore
    const currentUser = await User.findOne({"_id":req.user._id}).populate("posts");

    console.log(currentUser)

  res.render('show', { title: 'Posts',nav:true, user:currentUser});
});



//------------> Logout Page (Register Page) Method:GET
router.get('/logout', function(req, res, next)
{
  req.logout((err:any) =>
  {
    if(err)
    {
      console.log(err)
      next(err);
    }
    res.redirect("/");
  })
});

//------------> Profile Page (Register Page) Method:GET
router.get('/profile', isLoggedIn, async function(req, res, next)
{
  //@ts-ignore
  const currentUser = await User.findOne({"_id": req.user._id}).populate("posts");

  res.render('profile',{title:"Profile", userData:currentUser,nav:true});
});

//------------> Upload Page (Where user will upload a file) Method:GET
                                        // This middleware will get the file from specified named field.
                     //  Validation     // as well as process the file like saving and changing the name etc.
router.post('/upload', isLoggedIn, upload.single("image"), async function(req, res, next)
{

  ////////-------------> Remember after the passport authenticate the user it uses the deserialize method which retrieves the user
  // id from the session and then retrieve the while object then attach it to the req object to be used inside the route handler functions.

  // After processing the file uploaded by the user.
  // The Multer will attach the information extracted from file to the request object.
                                          //@ts-ignore
  const currentUser = await User.findOne({"_id": req.user._id});
  // @ts-ignore
  currentUser.profileImage = req.file.filename; // Updating the field of the user.

  await currentUser.save(); // Save the Changes which return a promise

  res.redirect("/profile")
});


//------------> Create Post Page  Method: POST
router.post('/createPost',isLoggedIn, upload.single("postImage"), async function(req, res, next)
{
    //@ts-ignore
    console.log(req.file.filename);

    // Creating the new post using the Model ".create()" method which will insert the newly created document into the
    // collection.
    const newPost = await Post.create(
        {
          postTitle: req.body.postTitle,
          postDescription: req.body.postDescription,
          //@ts-ignore
          postImage:req.file.filename,
          //@ts-ignore
          user: req.user._id
        }
    )

    console.log(newPost) // Post Document into the console.

  // Associating the newly created post with the user;
    // @ts-ignore
  const currentUser = await User.findOne({"_id":req.user._id})

  currentUser.posts.push(newPost._id); // Add the newly created post to the user posts array

  await currentUser.save(); // Save the changes.

  res.redirect("/profile"); // Redirection
});


/**
 * This function authenticate the upcoming request and executes the next middleware if the request is authenticated.
 * otherwise user is redirected to the Home Page.
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req:Request,res:Response,next:NextFunction)
{
  /**
   * As Request is an Object.
   * So,isAuthenticated is variable which is attached by the Passport.js on successful authentication
   * to the request object.
   */
  if(req.isAuthenticated()) return next(); // Next Middleware will only work if the request is authenticated.
  res.redirect("/"); // Redirection
}

// Exporting the Router instance to be used in Main Express Application.
export default router;
