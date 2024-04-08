import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, '../../public/assets/img/users');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        sharp(directoryPath + '/' + file)
            .resize(150, 150) // width, height
            .toFile('dist/assets/img/users/' + file, (err) => { 
                if(err) console.log(err);
            });
    });
});