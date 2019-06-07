const fs = require('fs');
const dlrepo = require('download-git-repo');

module.exports = function(config) {

  return new Promise((resolve, reject) => {

    if ( !config.addComponents ) {
      resolve(config);
    } else {

      const componentsDir = `${config.tempDir}/components`;

      dlrepo('bluecadet/saucepot', componentsDir, { clone: true }, err => {
        if (err) {
          console.log(chalk.red(`ERROR @ downloading saucepot`));
          throw Error(err);
        }

        const components = fs.readdirSync(`${componentsDir}/src/fractal/components`);

        console.log(components);

        // prepareTheme(config)
      });

      console.log(config.addComponents);
    }
  });
}