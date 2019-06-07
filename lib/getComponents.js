const fs = require('fs');
const dlrepo = require('download-git-repo');
const prompt = require('multiselect-prompt')


function recursiveDetermineComponents(itemPath, suffix, options) {
  if ( fs.lstatSync(itemPath).isDirectory() ) {
    const childItems = fs.readdirSync(itemPath);

    for (let item of childItems) {

      if ( item.includes('config.js')) {
        options.push({
          title: `${suffix}`,
          value: `${itemPath}`
        });

        break;

      } else {
        let newSuffix = `${suffix}/${item}`
        recursiveDetermineComponents(`${itemPath}/${item}`, newSuffix, options)
      }
    }
  }
};

const selected = (items) =>
  items
    .filter((item) => item.selected)
    .map((item) => item.value);


module.exports = function(config) {

  return new Promise((resolve, reject) => {

    if ( !config.addComponents ) {
      resolve(false);
    } else {

      const tmpComponentStore = `${config.tempDir}/components`;

      dlrepo('bluecadet/saucepot', tmpComponentStore, { clone: true }, err => {
        if (err) {
          console.log(chalk.red(`ERROR @ downloading saucepot`));
          throw Error(err);
        }

        let componentsDir = `${tmpComponentStore}/src/fractal/components`;

        const components = fs.readdirSync(componentsDir);
        const options = [];

        components.forEach(item => {
          recursiveDetermineComponents(`${componentsDir}/${item}`, item, options);
        });

        const opts = {
          cursor: 1,     // Initial position of the cursor, defaults to 0 (first entry)
          // The message to display as hint if enabled, below is the default value
          hint: '– Space to select. Return to submit.'
        }

        prompt('Which components?', options, opts)
          // .on('data', (data) => console.log('Changed to', selected(data.value)))
          .on('abort', () => {
            console.log('No components selected');
            resolve(false);
          })
          .on('submit', (items) => resolve(selected(items)));

      });
    }
  });
}