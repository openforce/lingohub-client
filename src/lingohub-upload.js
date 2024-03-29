const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data')
const BASE_URL = require('./config').BASE_URL;

const uploadOne = ({account, project, token, filePath}) => {
  const UPLOAD_URL = `${BASE_URL}${account}/projects/${project}/resources?auth_token=${token}`;

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  return axios.post(UPLOAD_URL, form);
};

module.exports = async function LingoHubUpload({account, project, token, fileName, workingDirectory}) {
  if (!account || !project || !token || !workingDirectory) {
    return console.error('Upload: invalid parameters. Please consider the help and examples.');
  }

  try {
    if (fileName) {
      console.info('Start uploading resource file', fileName);
      await uploadOne({account, project, token, filePath: path.resolve(workingDirectory, fileName)});
      console.info('Finished uploading resource file');
    } else {
      console.info('Start uploading resource files from', workingDirectory);
      await uploadAll({account, project, token, workingDirectory});
      console.info('Finished uploading multiple resource files');
    }
  } catch (e) {
    console.error(e);
  }
};
