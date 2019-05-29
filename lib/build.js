const fs = require('fs');
const path = require('path');
const fsx = require('fs-extra');
const dlrepo = require('download-git-repo');
const chalk = require('chalk');
const dlOpts = {
  clone: true
}

function prepareTheme(config) {

  return new Promise((resolve, reject) => {
    // let tmpTheme;

    // if ( config.isDrupal ) {
    //   tmpTheme = `${config.tempDir}/theme/builds/drupal`;
    // } else if ( config.isWordPress ) {
    //   tmpTheme = `${config.tempDir}/theme/builds/wordpress`;
    // }

    // var files = fs.readdirSync(tmpTheme);

    // files.forEach(file => {
    //   if ( file.startsWith('BC__BASE')) {
    //     let newName = file.replace('BC__BASE', config.project);
    //     let newPath = `${tmpTheme}/${newName}`;
    //     fs.renameSync(`${tmpTheme}/${file}`, newPath);

    //     if (fs.lstatSync(newPath).isFile()) {
    //       console.log('IS FILE');
    //       let data = fs.readFileSync(newPath, 'utf8');
    //       let result = data.replace(/BC__BASE/g, config.project);
    //       fs.writeFileSync(newPath, result, 'utf8');
    //     }
    //   }
    // });

    // fsx.ensureDirSync(config.themePath);
    // fsx.copySync(tmpTheme, `${config.themePath}/${config.project}`, {overwrite: true});

    // console.log(chalk.blue('Theme prepared'));

    // resolve(config);

  });
}

function prepareModules(config) {

  return new Promise((resolve, reject) => {

    resolve(config);
  }

}

module.exports = function(config) {

  // Download Base Theme
  console.log(chalk.blue('Downloading base theme'));

  dlrepo('bluecadet/bc-base-themes', `${config.tempDir}/theme`, dlOpts, err => {
    if (err) {
      console.log(chalk.red(`ERROR @ downloading base theme`));
      throw Error(err);
    }

    console.log(chalk.blue('Theme downloaded'));

    // Download Gulpfile
    console.log(chalk.blue('Downloading gulp'));

    dlrepo('bluecadet/bluecadet_gulpfiles#v2', `${config.tempDir}/gulp`, dlOpts, err => {
      if (err) {
        console.log(chalk.red(`ERROR @ downloading gulp`));
        throw Error(err);
      }

      console.log(chalk.blue('Gulp downloaded'));

      prepareTheme(config)
        .then(() => {
          prepareModules(config);
        });
    });


  });


}