var zipdir = require('zip-dir');
const path = require('path')

const dirPath = path.join(process.cwd(),'testdelete')
console.log(dirPath)
zipdir(dirPath, { saveTo: './myzip.zip' }, function (err, buffer) {
    if (err){
        console.log(err)
    }
    console.log('aaaaaaaa')
    console.log(buffer)
    // `buffer` is the buffer of the zipped file
    // And the buffer was saved to `~/myzip.zip`
});

