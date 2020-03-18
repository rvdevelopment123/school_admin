import Settings from './../../api/settings/model';
const helpers = require('./hbs-helpers');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const sg = require('nodemailer-sendgrid-transport');
const hbsOptions = {
    viewEngine: { extname: '.hbs', layoutsDir: './templates/', defaultLayout: 'default', partialsDir: './templates/partials/', helpers }, viewPath: './templates/', extName: '.hbs'
};
const { SENDGRID_API_KEY } = process.env
const options = { auth: { api_key: SENDGRID_API_KEY } }
var mailer = nodemailer.createTransport(sg(options));
mailer.use('compile', hbs(hbsOptions));

export const email = async ({ to, cc = null, bcc = null, subject, template, context = {}, attachments = [] }) => {
    const settings = await Settings.findOne()
    if (!SENDGRID_API_KEY) {
        return 'Sendgrid API key not set at .env'
    }
    try {
        const info = await mailer.sendMail({
            from: settings.emailFrom, to, cc, bcc,
            subject, template, context, attachments
        })
        console.log('email sent...', info);
        return info
    } catch (e) {
        console.log('email err..', e.toString());
        return false
    }
}
