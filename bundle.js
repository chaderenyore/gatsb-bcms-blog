const fs = require('fs');
const util = require('util');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');

let saveModules = false;

async function print(type, data) {
  process[type].write(data);
}
async function exec(cmd, outputFn) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.exec(cmd);
    if (outputFn) {
      proc.stdout.on('data', data => {
        outputFn('stdout', data);
      });
      proc.stderr.on('data', data => {
        outputFn('stderr', data);
      });
    }
    proc.on('close', code => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });
}
async function restoreCache() {
  if (
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache'),
    )) === false
  ) {
    await exec('mkdir docker-cache', print);
  }
  // Restore node_module
  if (
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache', 'package.json'),
    )) === true
  ) {
    console.log('   - Check package.json');
    const packageJson = (
      await util.promisify(fs.readFile)(
        path.join(process.cwd(), 'package.json'),
      )
    ).toString();
    const packageJsonCache = (
      await util.promisify(fs.readFile)(
        path.join(process.cwd(), 'docker-cache', 'package.json'),
      )
    ).toString();
    if (
      crypto
        .createHash('sha256')
        .update(packageJson)
        .digest('hex') !==
      crypto
        .createHash('sha256')
        .update(packageJsonCache)
        .digest('hex')
    ) {
      saveModules = true;
    } else {
      console.log('   - Link node_modules');
      await exec(
        'ln -s /app/docker-cache/node_modules /app/node_modules',
        print,
      );
    }
  } else {
    saveModules = true;
  }
  // Restore BCMS media
  if (
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache', 'media'),
    )) === true &&
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache', 'bcms-media.cache.json'),
    )) === true
  ) {
    console.log('   - Copy BCMS media cache');
    await exec('cp -R docker-cache/media static', print);
    await exec(
      'cp docker-cache/bcms-media.cache.json bcms-media.cache.json',
      print,
    );
  }
}
async function saveCache() {
  if (
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache', 'package.json'),
    )) === true
  ) {
    await exec('rm -R docker-cache/package.json', print);
  }
  console.log('   - Copy package.json');
  await exec('cp package.json docker-cache', print);
  if (saveModules) {
    if (
      (await util.promisify(fs.exists)(
        path.join(process.cwd(), 'docker-cache', 'node_module'),
      )) === true
    ) {
      await exec('rm -R docker-cache/node_module', print);
    }
    console.log('   - Save node_modules');
    await exec('cp -R node_modules docker-cache', print);
  }
  if (
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache', 'media'),
    )) === true
  ) {
    await exec('rm -R docker-cache/media', print);
  }
  if (
    (await util.promisify(fs.exists)(
      path.join(process.cwd(), 'docker-cache', 'bcms-media.cache.json'),
    )) === true
  ) {
    await exec('rm -R docker-cache/bcms-media.cache.json', print);
  }
  console.log('   - Copy BCMS media cache');
  await exec('cp -R static/media docker-cache', print);
  await exec('cp bcms-media.cache.json docker-cache', print);
}
async function main() {
  console.log('---> Restoring cache');
  await restoreCache();
  if (saveModules) {
    console.log('---> Installing modules');
    await exec('npm install', print);
  }
  await exec('npm run bcms:pull-media', print);
  console.log('---> Saving cache');
  await saveCache();
  await exec('npm run bcms:pull-content', print);
  await exec('npm run bcms:call-functions', print);
  console.log('---> Gatsby build');
  await exec('npm run build', print);
}
main().catch(error => {
  console.error('Error occurred in bundle.', error);
  process.exit(1);
});
