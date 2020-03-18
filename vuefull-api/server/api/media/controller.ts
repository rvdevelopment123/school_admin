import Media from './model';
import BaseCtrl from '../base';
import { deleteSingleImage, generateImg } from './../lib/image';
export default class MediaCtrl extends BaseCtrl {
  model = Media;
  deleteSingle = async (req, res) => {
    const image = req.body && req.body.img
    if (image) {
      try {
        deleteSingleImage(image)
        res.status(202).json('deleted');
      } catch (e) {
        res.status(500).json(e)
      }
    } else {
      res.status(404).json('Image not found');
    }
  }
  saveNoCrunchedImages = async (req, res) => {
    try {
      req.files.photos = [].concat(req.files.photos);
      let p = req.files.photos.map(photo => {
        if (!photo || !photo.originalFilename.match(/\.(jpg|jpeg|png|gif|webp|ico)$/)) {
          res.status(422).json({ message: 'Only image files are allowed!' });
          return
        } else {
          photo.firstName = req.user.firstName
          photo.lastName = req.user.lastName
          photo.uid = req.user._id
          photo.uname = req.user.firstName + ' ' + req.user.lastName
          photo.uemail = req.user.email
          photo.phone = req.user.phone
          return photo//{ name: photo.originalFilename, path: photo.path.replace(/\\/g, "/").replace(uploadDir, '') }
        }
      })
      try {
        await Media.collection.insert(p)
      } catch (e) {
        console.log('Image generation err... ', e);
      }
      try {
        let img = await generateImg(p, req.params.name)
        return res.status(201).json(img);
      } catch (err) {
        res.status(500).send(err);
      }
    } catch (e) {
      console.error('Err at media.controller:49 ', e.toString());
    }
  }
}