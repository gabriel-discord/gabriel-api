const fs = require('fs');
const set = require('lodash/set');
const path = require('path');

module.exports = (config) => () => {
  const getDataSources = (dirPath, exclusions = []) => {
    return fs.readdirSync(path.join(...dirPath), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && !exclusions.includes(dirent.name))
      .map((dirent) => {
        console.log(`Creating new GQL dataSource instance ${dirent.name}`);
        return {
          name: `${dirPath.length > 1 ? `${dirPath.slice(1).join('.')}.` : ''}${dirent.name}`,
          path: path.join(...dirPath, dirent.name),
        };
      });
  };

  const rootDataSources = getDataSources([__dirname]);
  const dataSources = rootDataSources.reduce((arr, dir) => {
    const DataSource = require(dir.path);

    fs.readdirSync(dir.path, { withFileTypes: true })
      .filter((dirent) => !dirent.isDirectory() && dirent.name !== 'index.js')
      .forEach(({ name }) => {
        const component = require(`${dir.path}/${name}`);
        return Object.assign(DataSource.prototype, component);
      });
    return set(arr, dir.name, new DataSource(config));
  }, {});

  return dataSources;
};
