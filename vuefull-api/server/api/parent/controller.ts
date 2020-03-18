import model from './model';
import BaseCtrl from './../base';
import { exportCSV, toJson } from '../lib';
import { modelName, fields } from './config';
export default class Ctrl extends BaseCtrl {
  model = model;
  export = async (req, res) => {
    const name = modelName
    const sort = req.query.sort || '-updatedAt';
    const skip = parseInt(req.query.skip || 0);
    const limit = parseInt(req.query.limit || 30);
    const where = toJson(req.query.where) || {};
    if (req.query.search)
      where.q = { $regex: new RegExp(req.query.search, "ig") }
    try {
      let filePath = await exportCSV({
        name, model, skip, limit, where,
        fields: Object.keys(fields)
      })
      res.download(filePath);
    } catch (e) {
      return res.status(500).send(e.toString());
    }
  }
}

