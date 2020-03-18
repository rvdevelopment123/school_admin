import { extend } from 'lodash';
import { toJson } from './lib';
import Settings from './settings/model';
let { ObjectId } = require('mongodb');

abstract class BaseCtrl {
  abstract model: any;
  respondWithResult = (res: any, entity: any, statusCode = 200) => {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null
  }
  removeEntity = async (entity, res: any) => {
    if (!entity) {
      res.status(404).end();
      return null;
    } try {
      await entity.remove()
      return res.status(202).json({ msg: 'deleted' });
    } catch (err) { console.log(err); res.status(500).send(err); }
  }
  saveUpdates2 = async (entity, updates: any) => {
    try {
      extend(entity, updates);
      return await entity.save();
    } catch (err) {
      console.log('[saveUpdates2] error at base', err);
    }
  }
  patchUpdates = (patches) => {
    return function (entity) {
      try {
        entity = extend(entity, patches);
      } catch (err) {
        return Promise.reject(err);
      }
      return entity.save();
    };
  }
  my = (req, res) => {
    if (req.user.role != 'admin')
      req.my = true
    return this.index(req, res);
  }

  mysection = async (req, res) => {
    let sections = await this.model.distinct("section")
    return res.status(200).json(sections);;
  }

  index = async (req, res) => {
    const settings = await Settings.findOne()
    let page = parseInt(req.query.page || 1)
    let sort = req.query.sort || '-_id'
    let search = req.query.search
    let select = toJson(req.query.select);
    delete req.query.page
    delete req.query.sort
    delete req.query.search
    delete req.query.select
    let where = req.query
    for (let k in where) {
      if (where[k] == '' || where[k] == 'null' || where[k] == 'undefined' || where[k] == undefined)
        delete where[k]
    }
    where = toJson(where) || {};
    let role = 'user'
    if (req.user) {
      role = req.user.role
    }
    let limit = settings.pageSize
    let skip = 0
    if (page) {
      limit = settings.pageSize
      skip = (page - 1) * settings.pageSize
    }
    if (req.my) { // Find only records that belong to the logged in user
      where.email = req.user.email
    }
    let searchString = where
    if (search != 'null' && !!search)
      searchString = { ...where, q: { $regex: new RegExp(search, "ig") } }

    try {
      let data = await this.model.find(searchString).select(select).sort(sort).limit(limit).skip(skip)
      let count = await this.model.count(searchString)
      return res.status(200).json({ data, count, pageSize: settings.pageSize, page });
    } catch (e) {
      console.log('[base.ts] error at index .........', this.model, e.toString);
      return res.status(500).send(e);
    }
  }
  count = async (req, res) => {
    let where = toJson(req.query.where) || {};
    try {
      const count = await this.model.find(where).count()
      return res.status(200).json(count);

    } catch (err) {
      res.status(404).json('Not found');
      return err
    };
  }
  // Insert
  insert = async (req, res) => {
    req.body.phone = req.body.phone || req.user.phone
    req.body.email = req.body.email || req.user.email
    req.body.uid = req.user._id // id change on every registration of user hence email is used so that history will be available
    try {
      let result = await this.model.create(req.body)
      return res.status(201).json(result);
    } catch (err) {
      console.log('[base.ts] error at insert .........', err);
      return res.status(500).send(err);
    }
  }
  // Get by id
  get = async (req, res) => {
    try {
      let result = await this.model.find({ _id: req.params.id }).exec()
      if (result.length == 0) {
        return res.status(404).end();
      }
      else {
        return res.status(200).json(result[0]);
      }
    } catch (err) {
      console.log('[base.ts] error at get .........', err);
      return res.status(500).send(err);
    }
  }
  // Updates an existing this.model in the DB
  update = async (req, res) => {
    if (!req.params) {
      return res.status(402).send('record id missing. Please specify which ID to be updated.');
    }
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).send('Record not found');
    }
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    if (req.body.name)
      req.body.nameLower = req.body.name.toString().toLowerCase();
    if (req.user) {
      req.body.phone = req.body.phone || req.user.phone
      req.body.email = req.body.email || req.user.email
    }
    try {
      let result = await this.model.findById(req.params.id)
      if (result == 0) {
        return res.status(402).json('The resource belongs to a different owner');
      }
      else {
        this.saveUpdates2(result, req.body)
        this.respondWithResult(res, result)
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  // Patches an existing this.model in the DB
  patch = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).send('Record not found');
    }
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    if (req.body.email) {
      Reflect.deleteProperty(req.body, 'email');
    }
    if (req.body.name)
      req.body.nameLower = req.body.name.toString().toLowerCase();
    try {
      let table = await this.model.findById(req.params.id)
      if (table == null) {
        return res.status(500).send('Record Not found');
      }
      table.set(req.body);
      let result = await table.save()
      if (result == 0) {
        return res.status(402).json('The resource belongs to a different owner');
      }
      else {
        this.respondWithResult(res, result)
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  // Deletes a this.model from the DB
  delete = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).send('Record not found');

    }
    try {
      let entity = await this.model.findById(req.params.id).exec()
      this.removeEntity(entity, res)
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  updateAllQ = async (req, res) => { // Just to update the q field at model throught pre save trigger
    try {
      let limit = 3000
      const data = await this.model.find({}).limit(limit).skip((req.params.page - 1) * limit)
      for (let d of data) {
        d.save()
      }
      res.status(200).send('Success.')
    }
    catch (e) {
      res.status(500).send(e)
    }
  }
}

export default BaseCtrl;
