/**
 * Importing the Multer which will be used to handle the files uploaded by the user
 * as well as saves and name the file as well.
 * using the enctype form equal to "multipart/form-data".
 */
import multer from "multer";
// Using the "as" in the named import
import {v4 as uniqueHex} from "uuid"; // This is a "Universal Unique Identifier" Which generated a unique ID
import path from "path"; // Used when working with files

// Defining which "storage engine" to be used by the multer.
// For Now, it is "diskStorage" on local Computer.
const storage = multer.diskStorage(
    {
    // Specifying the location where the uploaded files will be stored.
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')// This line specify the directory as well store the uploaded file there
        // First parameter specify that there is no error
    },
    // Specifying the filename for the uploaded file.
    filename: function (req, file, cb)
    {
        // Generating the unique file name for the uploaded file
        const uniqueFilename = uniqueHex();
                                            // Find the file extension using the path.extname(fileName)
        cb(null,uniqueFilename+path.extname(file.originalname)) // Setting the name for the uploaded file.
    }
})
// Creating the instance of Multer and passing the storage configurations as Object.
const upload = multer({ storage: storage })

// Export the Multer instance to be used in other modules.
export default upload;