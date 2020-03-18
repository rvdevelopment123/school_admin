var Generator = require('yeoman-generator');
var fs = require("fs");
var menu = require("../../vuefull-client/config/menu.json");
var routes = require("../../vuefull-api/server/routes.json");
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.argument("model", { type: String, required: false });
    }
    // async prompting() {
    //     this.answers = await this.prompt([
    //         {
    //             type: "input",
    //             name: "model",
    //             message: "Name for your new Database Model name",
    //         },
    // {
    //     type: "input",
    //     name: "api",
    //     message: "Name the API end point",
    // }
    //     ]);
    // }

    writing() {
        const { model } = this.options;
        const api = model + 's'
        // let { model, api } = this.answers
        if (!model) {
            console.log('Please enter model name as argument')
            return
        }
        // if (!api) {
        //     console.log('Please enter api name')
        //     return
        // }

        // Add Client route
        let newItem = { title: api.charAt(0).toUpperCase() + api.slice(1), href: api, icon: 'folder_open', dashboard: true }
        let insert = true
        for (let i of menu) {
            if (i.href == api) insert = false
        }
        if (insert) menu.push(newItem)
        fs.writeFileSync('vuefull-client/config/menu.json', JSON.stringify(menu), 'utf8');

        // Add server route
        let newRoute = { model, api }
        let insertRoute = true
        for (let i of routes) {
            if (i.api == api) insertRoute = false
        }
        if (insertRoute) routes.push(newRoute)
        fs.writeFileSync('vuefull-api/server/routes.json', JSON.stringify(routes), 'utf8');
        this.fs.copyTpl(
            this.templatePath(`crud-client/pages/index.vue`),
            this.destinationPath(`vuefull-client/pages/${api}/index.vue`),
        );
        this.fs.copyTpl(
            this.templatePath(`crud-client/pages/index.vue`),
            this.destinationPath(`vuefull-client/pages/${api}/index.vue`),
        );
        this.fs.copyTpl(
            this.templatePath(`crud-client/pages/_id.vue`),
            this.destinationPath(`vuefull-client/pages/${api}/_id.vue`),
        );
        this.fs.copyTpl(
            this.templatePath(`crud-client/pages/config.js`),
            this.destinationPath(`vuefull-client/pages/${api}/config.js`),
            { model: model, api: api }
        );
        this.fs.copyTpl(
            this.templatePath(`crud-api/api/index.ts`),
            this.destinationPath(`vuefull-api/server/api/${model}/index.ts`),
        );
        this.fs.copyTpl(
            this.templatePath(`crud-api/api/controller.ts`),
            this.destinationPath(`vuefull-api/server/api/${model}/controller.ts`),
        );
        this.fs.copyTpl(
            this.templatePath(`crud-api/api/model.ts`),
            this.destinationPath(`vuefull-api/server/api/${model}/model.ts`)
        );
        this.fs.copyTpl(
            this.templatePath(`crud-api/api/config.ts`),
            this.destinationPath(`vuefull-api/server/api/${model}/config.ts`),
            { model: model.charAt(0).toUpperCase() + model.slice(1), api: api }
        );
    }
};