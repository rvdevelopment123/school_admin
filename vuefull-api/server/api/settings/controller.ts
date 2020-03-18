import Settings from './model';
import BaseCtrl from './../base';

export default class Ctrl extends BaseCtrl {
  model = Settings;
  public = async (req, res) => {
    try {
      const select = '-_id websiteName title description keywords emailFrom shopEmail shopPhone shopAddress country language logo pageSize demo facebook google twitter GOOGLE_MAPS_API userRoles CDN_URL';
      const r = await this.model.findOne().select(select)
      return res.status(200).json(r)
    } catch (e) {
      res.status(500).send(e.toString());
    }
  }
  admin = async (req, res) => {
    try {
      const r = await this.model.findOne()
      return res.status(200).json(r)
    } catch (e) {
      res.status(500).send(e.toString());
    }
  }
}
