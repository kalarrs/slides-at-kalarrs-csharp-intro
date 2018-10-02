const path = require('path');
const {exec} = require('child_process');

const projectRoot = path.join(__dirname, '../');
const defaultProfile = 'kalarrs';

const execAsync = function (command, options, output = true) {
  return new Promise((resolve, reject) => {
    let stdout;
    let stderr;

    const childProcess = exec(command, options);
    if (output) childProcess.stdout.pipe(process.stdout);
    if (output) childProcess.stderr.pipe(process.stderr);

    childProcess.stdout.on('data', data => stdout += data);
    childProcess.stderr.on('data', data => stderr += data);

    childProcess.on('exit', function (code) {
      if (code === 0) resolve({stdout, stderr});
      else reject({code, stdout, stderr});
    });
  });
};

module.exports = {
  async deploy({bucket, cloudFrontId, profile}) {
    await execAsync(`rm -rf ./dist`, {cwd: projectRoot});
    await execAsync(`node_modules/.bin/grunt package --force`, {cwd: projectRoot});
    await execAsync(`cd dist && unzip reveal-js-presentation.zip && rm reveal-js-presentation.zip`, {cwd: projectRoot});
    await execAsync(`aws s3 rm s3://${bucket}/csharp-intro --recursive --profile=${profile || defaultProfile}`, {cwd: projectRoot});
    await execAsync(`aws s3 cp dist s3://${bucket}/csharp-intro/ --recursive --profile=${profile || defaultProfile}`, {cwd: projectRoot});
    await execAsync(`aws cloudfront create-invalidation --distribution-id ${cloudFrontId}  --paths /csharp-intro/\\* --profile=${profile || defaultProfile}`, {cwd: projectRoot});
  }
};