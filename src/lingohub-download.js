const request = require('request');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const {BASE_URL} = require('./config');

const LANGUAGE_KEY_VARIABLE = /{LANGUAGE_KEY}/g;

const getRessources = async ({account, project, token}) => {
  const RESOURCERS_URL = `${BASE_URL}${account}/projects/${project}/resources.json?auth_token=${token}`;

  const resources = await axios.get(RESOURCERS_URL);

  return resources && resources.data && resources.data.members;
};

const downloadOne = ({link, token}) => {
  const FILE_URL = `${link}?auth_token=${token}`;

  return request(FILE_URL);
};

const downloadAllResources = async ({
                                      account,
                                      project,
                                      token,
                                      workingDirectory,
                                      fileName = false,
                                      baseOverrideLanguage = false,
                                      baseOverrideFileName = false,
                                    }) => {
  const resources = await getRessources({account, project, token});
  const workingPath = path.resolve(process.cwd(), workingDirectory);

  console.info('Download resource files into target directory', workingPath);

  return Promise.all(resources.map(({links, name, project_locale}) => new Promise((resolve, reject) => {
    let currentWorkingPath = workingPath;
    if (baseOverrideLanguage && baseOverrideFileName && project_locale === baseOverrideLanguage) {
      console.info(`Overwrite base locale (${baseOverrideLanguage}) to`, baseOverrideFileName);
      currentWorkingPath = path.join(
        currentWorkingPath,
        baseOverrideFileName.replace(LANGUAGE_KEY_VARIABLE, project_locale),
      );
    } else if (fileName) {
      currentWorkingPath = path.join(workingPath, fileName.replace(LANGUAGE_KEY_VARIABLE, project_locale));
    } else {
      currentWorkingPath = path.join(workingPath, name);
    }

    const fileWriteStream = fs.createWriteStream(path.resolve(currentWorkingPath));
    const fileDownloadStream = downloadOne({link: links[0].href, token});
    fileDownloadStream.pipe(fileWriteStream);

    fileWriteStream.on('close', () => {
      console.info('Downloaded', name);
      resolve();
    });

    fileWriteStream.on('error', err => reject(err));
  })));
};

module.exports = async function LingoHubDownload({
                                                   account,
                                                   project,
                                                   token,
                                                   workingDirectory,
                                                   fileName = false,
                                                   baseOverrideLanguage = false,
                                                   baseOverrideFileName = false,
                                                 }) {
  if (!account || !project || !token || !workingDirectory) {
    return console.error('Download: invalid parameters. Please consider the help and examples.');
  }

  try {
    console.info('Start downloading resource files.');
    await downloadAllResources({
      account,
      project,
      token,
      workingDirectory,
      fileName,
      baseOverrideLanguage,
      baseOverrideFileName
    });
    console.info('Finished downloading resource files.');
  } catch (e) {
    console.error(e);
  }
};
