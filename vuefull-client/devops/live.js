const shell = require('shelljs');
require('dotenv').config()

// Start Config
const PM2_NAME = 'vuefull'
const REMOTE_DIR = '/var/www/vuefull/client'
const REMOTE_HOST = '139.59.42.129'
const REMOTE_USER = 'root'
const PRIVATE_KEY = process.env.LIVE_KEY
const FILE_NAMES = '.nuxt static config nuxt.config.js package.json'
// End Config

// Zip and send file to remote server
shell.cd('prod').exec('tar czf vuefull.tar.gz ' + FILE_NAMES)
    .exec('scp -i ' + PRIVATE_KEY + ' vuefull.tar.gz ' + REMOTE_USER + '@' + REMOTE_HOST + ':' + REMOTE_DIR);
shell.rm('vuefull.tar.gz')

// Extract and reload pm2
var host = {
    server: {
        host: REMOTE_HOST,
        port: 22,
        userName: REMOTE_USER,
        privateKey: require('fs').readFileSync(PRIVATE_KEY)
    },
    commands: [
        "cd " + REMOTE_DIR,
        "sudo tar xf vuefull.tar.gz -C " + REMOTE_DIR,
        "sudo rm vuefull.tar.gz",
        "sudo yarn install",
        "sudo pm2 reload " + PM2_NAME
    ]
};

var SSH2Shell = require('ssh2shell'),
    SSH = new SSH2Shell(host),
    //Use a callback function to process the full session text
    callback = function (sessionText) {
        console.log(sessionText)
    }

//Start the process
SSH.connect(callback);
