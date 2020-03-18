import * as mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  websiteName: String,
  title: String,
  description: String,
  keywords: String,
  shopEmail: String,
  emailFrom: String,
  shopPhone: String,
  shopAddress: String,
  country: String,
  language: String,
  logo: String,
  demo: Boolean,
  pageSize: Number,
  facebook: String,
  twitter: String,
  google: String,
  GOOGLE_MAPS_API: String,
  userRoles: { type: Array, default: ['user', 'vendor', 'manager', 'admin'] }, // This should be in ascending order of authority. e.g. In this case guest will not have access to any other role, where as admin will have the role of guest+user+vendor+manager+admin
  levels: { type: Array, default: [
    'Pre-school',
    'Level 1',
    'Level 2',
    'Level 3',
    'Level 4',
    'Level 5',
    'Level 6',
    'Level 7',
    'Level 8',
    'Level 9',
    'Level 10',
    'Level 11',
    'Level 12',
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ] }, // This should be in ascending order of authority. e.g. In this case guest will not have access to any other role, where as admin will have the role of guest+user+vendor+manager+admin
  CDN_URL: String,
  q: String
}, { timestamps: true });
Schema.pre('save', function (next) {
  this.q = this.websiteName ? this.websiteName + ' ' : ''
  this.q += this.title ? this.title + ' ' : ''
  this.q += this.description ? this.description + ' ' : ''
  this.q += this.keywords ? this.keywords + ' ' : ''
  this.q += this.shopEmail ? this.shopEmail + ' ' : ''
  this.q += this.emailFrom ? this.emailFrom + ' ' : ''
  this.q += this.shopPhone ? this.shopPhone + ' ' : ''
  this.q += this.shopAddress ? this.shopAddress + ' ' : ''
  this.q += this.country ? this.country + ' ' : ''
  this.q += this.language ? this.language + ' ' : ''
  this.q += this.logo ? this.logo + ' ' : ''
  this.q += this.CDN_URL ? this.CDN_URL + ' ' : ''
  this.q += ' '
  next();
});
export default mongoose.model('Settings', Schema);
