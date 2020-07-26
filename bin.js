#!/usr/bin/env node
/**
 * Module dependencies.
 */
var program = require('commander');
var app = require("./app");
const fs = require("fs");
const path = require("path");
let packageInfo = JSON.parse(fs.readFileSync(__dirname + "/package.json",'utf8'));
program
  .version(packageInfo.version,'-v, --version')
  .command('start')
  .description('Start print service')
  .option("-p, --port <port>", "Which port to use. Default 8989")
  .action(function(options){
    app.start(options.port)
  })
program.parse(process.argv);