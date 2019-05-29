#!/usr/bin/env node

const os = require('os');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const fsx = require('fs-extra');
const dlrepo = require('download-git-repo');
const args = require('yargs').argv;
const qoa = require('qoa');
const builder = require('../lib/build.js');

let config = {
  curPath: process.cwd(),
  tempDir: path.join(os.homedir(), '.bcnew'),
};

config.isPantheon = fs.existsSync(`${config.curPath}/web`);
config.isDrupal = config.isPantheon ? fs.existsSync(`${config.curPath}/web/themes`) : fs.existsSync(`${config.curPath}/core`);
config.isWordPress = config.isPantheon ? fs.existsSync(`${config.curPath}/web/wp`) : fs.existsSync(`${config.curPath}/wp-content`);


// Create a directory for temp storage
fsx.ensureDirSync(config.tempDir);

// Setup theme and module dirs
if ( config.isDrupal ) {

  if ( config.isPantheon ) {
    config.themePath = `${config.curPath}/web/themes/custom`;
    config.modulePath = `${config.curPath}/web/modules/custom`;
  } else {
    config.themePath = `${config.curPath}/themes/custom`;
    config.modulePath = `${config.curPath}/modules/custom`;
  }

} else if ( config.isWordPress ) {

  if ( config.isPantheon ) {
    config.themePath = `${config.curPath}/web/wp-content/themes`;
    config.modulePath = `${config.curPath}/web/wp-content/plugins`;
  } else {
    config.themePath = `${config.curPath}/wp-content/themes`;
    config.modulePath = `${config.curPath}/wp-content/plugins`;
  }

}


// Prompts
const settings = [
  {
    type: 'input',
    query: 'Project Name:',
    handle: 'project'
  }
];

qoa.prompt(settings)
  .then(response => {
    config.project = response.project.toLowerCase();
    config.tempDir = `${config.tempDir}/${config.project}`;
    fsx.ensureDirSync(config.tempDir);
    fsx.emptyDirSync(config.tempDir);

    // Build out project
    builder(config);
  });