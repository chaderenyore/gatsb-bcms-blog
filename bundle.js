const fs = require('fs');
const util = require('util');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');

const cacheName = 'docker-cache';
let saveModules = false;

async function print(type, data) {
  process[type].write(data);
}
async function exec(cmd, outputFn) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.exec(cmd);
    if (outputFn) {
      proc.stdout.on('data', (data) => {
        outputFn('stdout', data);
      });
      proc.stderr.on('data', (data) => {
        outputFn('stderr', data);
      });
    }
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });
}
/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {childProcess.SpawnOptions} options
 */
async function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn(cmd, args, options);
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
}
async function exist(location) {
  return await util.promisify(fs.exists)(location);
}
async function restoreCache() {
  if ((await exist(path.join(process.cwd(), cacheName))) === false) {
    await exec('mkdir docker-cache', print);
  }
  // Restore node_module
  if (await exist(path.join(process.cwd(), cacheName, 'package.json'))) {
    console.log('   - Check package.json');
    const packageJson = (
      await util.promisify(fs.readFile)(
        path.join(process.cwd(), 'package.json'),
      )
    ).toString();
    const packageJsonCache = (
      await util.promisify(fs.readFile)(
        path.join(process.cwd(), cacheName, 'package.json'),
      )
    ).toString();
    if (
      crypto.createHash('sha256').update(packageJson).digest('hex') !==
      crypto.createHash('sha256').update(packageJsonCache).digest('hex')
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
    (await exist(path.join(process.cwd(), cacheName, 'media'))) &&
    (await exist(path.join(process.cwd(), cacheName, 'media.cache.json')))
  ) {
    console.log('   - Copy BCMS media cache');
    // await fse.copy(
    //   path.join(__dirname, cacheName, 'media'),
    //   path.join(__dirname, 'static', 'media'),
    // );
    // await fse.copy(
    //   path.join(__dirname, cacheName, 'media.cache.json'),
    //   path.join(__dirname, 'bcms', 'media.cache.json'),
    // );
    await exec('mkdir bcms');
    await exec('cp -R docker-cache/media static', print);
    await exec('cp docker-cache/media.cache.json bcms/media.cache.json', print);
  }
}
async function saveCache() {
  if (await exist(path.join(process.cwd(), cacheName, 'package.json'))) {
    // await fse.remove(path.join(__dirname, cacheName, 'package.json'));
    await exec('rm -R docker-cache/package.json', print);
  }
  console.log('   - Copy package.json');
  // await fse.copy(
  //   path.join(__dirname, 'package.json'),
  //   path.join(__dirname, cacheName, 'package.json'),
  // );
  await exec('cp package.json docker-cache', print);
  if (saveModules) {
    if (await exist(path.join(process.cwd(), cacheName, 'node_module'))) {
      // await fse.remove(path.join(__dirname, cacheName, 'node_modules'));
      await exec('rm -R docker-cache/node_module', print);
    }
    console.log('   - Save node_modules');
    // await fse.copy(
    //   path.join(__dirname, 'node_modules'),
    //   path.join(__dirname, cacheName, 'node_modules'),
    // );
    await exec('cp -R node_modules docker-cache', print);
  }
  if (await exist(path.join(process.cwd(), cacheName, 'media'))) {
    // await fse.remove(path.join(__dirname, cacheName, 'media'));
    await exec('rm -R docker-cache/media', print);
  }
  if (await exist(path.join(process.cwd(), cacheName, 'media.cache.json'))) {
    // await fse.remove(path.join(__dirname, cacheName, 'media.cache.json'));
    await exec('rm -R docker-cache/media.cache.json', print);
  }
  console.log('   - Copy BCMS media cache');
  // await fse.copy(
  //   path.join(__dirname, 'static', 'media'),
  //   path.join(__dirname, cacheName, 'media'),
  // );
  // await fse.copy(
  //   path.join(__dirname, 'bcms', 'media.cache.json'),
  //   path.join(__dirname, cacheName, 'media.cache.json'),
  // );
  await exec('cp -R static/media docker-cache', print);
  await exec('cp bcms/media.cache.json docker-cache', print);
}
async function main() {
  console.log('---> Restoring cache');
  await restoreCache();
  if (saveModules) {
    console.log('---> Installing modules');
    await spawn('npm', ['install'], {
      stdio: 'inherit',
    });
    // await exec('npm install', print);
  }
  await spawn('npm', ['run', 'bcms:pull-media'], {
    stdio: 'inherit',
  });
  await spawn('npm', ['run', 'bcms:process-media'], {
    stdio: 'inherit',
  });
  // await exec('npm run bcms:pull-media', print);
  console.log('---> Saving cache');
  await saveCache();
  await spawn('npm', ['run', 'bcms:pull-content'], {
    stdio: 'inherit',
  });
  // await exec('npm run bcms:pull-content', print);
  await spawn('npm', ['run', 'bcms:call-functions'], {
    stdio: 'inherit',
  });
  // await exec('npm run bcms:call-functions', print);
  console.log('---> Gatsby build');
  await spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
  });
  // await exec('npm run build', print);
}
main().catch((error) => {
  console.error('Error occurred in bundle.', error);
  process.exit(1);
});
