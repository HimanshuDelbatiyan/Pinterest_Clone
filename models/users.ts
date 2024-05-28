// Note: Here we are trying to understand the "Data Association".

/**
 * Importing the mongoose which will be used to communicate with the MongoDB.
 */
import mongoose, {mongo} from 'mongoose';

/**
 * Importing the passport-local-mongoose
 * to integrate the passport.js into the mongoose
 * which will provide us more security and authentication
 */
import passportLocalMongoose from "passport-local-mongoose";
/**
 * Getting the Schema Class from the mongoose.
 */
const Schema = mongoose.Schema;

/**
 * Creating the new Schema for user collections
 * Which will define what fields and type of data each of the document of the users collection will contain
 */
const userSchema = new Schema(
    {
        username: {type:String,required:true, unique:true},
        fullname: {type:String,required:true},
        email:{type:String,required:true, unique:true},
        password: {type:String},
        profileImage: {type:String},
        contact:{type:Number},
        boards: {type:[], default:[]},
        posts:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "posts"
            }

        ]
    },
    {
    collection: "users" // Associating the defined Schema with the Specific Collection
})

/**
 * Configuring the User Schema to integrate the Passport into itself
 * Which will provide methods for authentication as well as specifying the fields
 * based on which user will be authenticated.
 */
userSchema.plugin(passportLocalMongoose,{usernameField:"username",passwordField:"password"})

/**
 * Creating the Model using the defined Schema.
 * Which will be used to create the documents for the collection.
 */                     // collection name // defined Schema
const Model:any = mongoose.model("users",userSchema);

/**
 * Exporting the modules to be used in the other modules.
 */
export default Model;