import { IncomingForm } from 'formidable'
import { mkdir } from 'fs';
const fs = require("fs");
var mv = require('mv');

export const config = {
    api: {
       bodyParser: false,
    }
};
 
export default async (req, res) => {
    
    const data = await new Promise((resolve, reject) => {
       const form = new IncomingForm()
       console.log('data',form);
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            console.log(fields, files)
            console.log(files.file.filepath)
            var oldPath = files.file.filepath;

            var newPath = `./public/uploads/${files.file.originalFilename}`;

            fs.access(`./public/uploads/`, async (error) => {
   
                // To check if the given directory 
                // already exists or not
                if (error) {
                  // If current directory does not exist
                  // then create it
                  await fs.mkdir(`./public/uploads/`, (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("New Directory created successfully !!");
                    }
                  });
                } else {
                  console.log("Given Directory already exists !!");
                }
              })

            mv(oldPath, newPath, function(err) {
            });
            res.status(200).json({ fields, files })
        })
    })
    
}