import * as mongoose from 'mongoose';
import { fields, modelName } from './config';
let f: any = { ...fields }
f.q = 'string'
let Schema = new mongoose.Schema(f, { versionKey: false, timestamps: true });

Schema.pre('save', function (next) {
  this.q = ''
  for (let key in f) {
    if (f.hasOwnProperty(key) && key != 'q') {
      let k = this[key] ? this[key] + ' ' : ''
      this.q += k.toLowerCase()
    }
  }
  next();
});
export default mongoose.model(modelName, Schema);  