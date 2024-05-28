// Note: Here we are trying to understand the "Data Association".

/**
 * Importing the mongoose which will be used to communicate with the MongoDB.
 */
import mongoose from 'mongoose';

/**
 * Getting the Schema Class from the mongoose.
 */
const Schema = mongoose.Schema;

/**
 * Creating the new Schema for posts collections
 * Which will define what fields and type of data each of the document of the posts collection will contain
 */
const pinSchema = new Schema(
    {
        imageURL: {type:String,required:true},
        description:{type:String},
        user:{type:mongoose.Schema.Types.ObjectId, ref:"users", required:true},
    },
    {
        collection: "pin" // Associating the defined Schema with the Specific Collection
    })


/**
 * Creating the Model using the defined Schema.
 * Which will be used to create the documents for the posts collection.
 */                     // collection name // defined Schema
const Model:any = mongoose.model("pin",pinSchema);

/**
 * Exporting the modules to be used in the other modules.
 */
export default Model;