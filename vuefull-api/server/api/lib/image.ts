const fsx = require('fs-extra'); // Create the directory if not exists
const path = require('path');
import { uploadDir } from '../../config'

export const deleteSingleImage = async (image) => {
    if (!image) return
    let deleted;
    try {
        deleted = await fsx.unlinkSync(uploadDir + image)
        return deleted
    } catch (e) {
        console.log('[base.ts] deleteSingleImage err... ', e.toString());
        throw e.toString()
    }
}
export const generateImg = async (imgUrls, subdirectory: String) => {
    let imageCollection = []
    for (let i of imgUrls) {
        if (i) {
            let name = i.name
            let url = i.path.replace(/\\/g, "/")
            let filename = path.basename(name).split('.')[0] + '-' + Math.floor(new Date().valueOf() * Math.random()) + path.extname(name)
            let img = '/' + subdirectory + '/' + filename
            try {
                await fsx.moveSync(url, uploadDir + img, { overwrite: true })
            } catch (e) {
            }
            imageCollection.push(img)
        }
    }
    return imageCollection
}
export const createFolder = async (path) => {
    try {
        if (!fsx.existsSync(path))
            fsx.ensureDirSync(path)
    } catch (e) {
        console.log('Directory creation error ', e);
    }
}
this.getDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let dd1 = ''
    let mm1 = ''
    if (dd < 10) {
        dd1 = '0' + dd;
    } else {
        dd1 = '' + dd;
    }
    if (mm < 10) {
        mm1 = '0' + mm;
    } else {
        mm1 = '' + mm
    }
    return dd1 + mm1 + yyyy
}
