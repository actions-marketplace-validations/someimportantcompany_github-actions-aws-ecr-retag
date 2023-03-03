/**
 * @author: jdrydn <james@jdrydn.com> (https://github.com/jdrydn)
 * @license: MIT
 * @link: https://github.com/someimportantcompany/github-actions-aws-ecr-retag
 * @variation: 003b805464d1
 */
const core = require('@actions/core');
const { ECRClient, BatchGetImageCommand, BatchDeleteImageCommand, PutImageCommand } = require('@aws-sdk/client-ecr');

function assert(value, err) {
  if (!value) {
    throw err;
  }
}

async function getImageManifest(client, repository, srcTag) {
  const res = await client.send(new BatchGetImageCommand({
    repositoryName: repository,
    imageIds: [{ imageTag: srcTag }],
  }));
  return res && res.images && res.images[0] && res.images[0].imageManifest
    ? res.images[0].imageManifest
    : null;
}

async function deleteImageTag(client, repository, destTag) {
  const res = await client.send(new BatchDeleteImageCommand({
    repositoryName: repository,
    imageIds: [{ imageTag: destTag }],
  }));
  return Boolean(res && res.images && res.images[0] && res.images[0].imageTag);
}

async function putImageTag(client, repository, destTag, manifest) {
  const res = await client.send(new PutImageCommand({
    repositoryName: repository,
    imageTag: destTag,
    imageManifest: manifest,
  }));
  return Boolean(res && res.image && res.image.imageId && res.image.imageId.imageTag);
}

module.exports = async function run() {
  try {
    const repository = core.getInput('repository', { required: true });
    const srcTag = core.getInput('src-tag', { required: true });
    const destTag = core.getInput('dest-tag', { required: true });
    const deleteBefore = core.getInput('delete-before').toString() === 'true';

    const client = new ECRClient({});

    const manifest = await getImageManifest(client, repository, srcTag);
    assert(manifest, new Error(`Image not found: ${repository}:${srcTag}`));

    if (deleteBefore) {
      await deleteImageTag(client, repository, destTag);
    }

    await putImageTag(client, repository, destTag, manifest);
    core.info(`Retagged ${repository}:${srcTag} as ${repository}:${destTag}`);
  } catch (err) {
    core.setFailed(err.message);
  }
};

/* istanbul ignore next */
if (require.main === module) {
  module.exports();
}
