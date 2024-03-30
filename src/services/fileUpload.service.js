const path = require('path');
const fs = require('fs');


const uploadSingleFile = (file) => {
    //  console.log(file)
    const fileName = Date.now() + file.originalFilename;
    // console.log(fileName)
    const file_path = path.join(__dirname, '../uploads', fileName);
    // console.log(file_path);
    fs.renameSync(file.filepath, file_path); // Move file to desired location
    return fileName

}

const uploadMultipleFile = (files,labels) =>  {
    // console.log(files);
    const images = []
    files.map((file,index) => {
        const fileName = Date.now() + file.originalFilename;
        const file_path = path.join(__dirname, '../uploads', fileName);
        fs.renameSync(file.filepath, file_path); // Move file to desired location
        
        images.push({value:fileName })
       
    })

    labels.map((lab,index) => {
        images[index].label = lab 
    })
    return images;
}

module.exports = {
    uploadSingleFile,
    uploadMultipleFile
}
