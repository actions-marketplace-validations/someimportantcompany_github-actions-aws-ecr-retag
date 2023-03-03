const assert = require('assert');
const formatDate = require('date-fns/format');
const rewire = require('rewire');

describe('@someimportantcompany/github-actions-aws-ecr-retag', () => {
  const action = rewire('./index');
  const FORMAT = 'yyyy.MM.ddTHH.mm.ss.SSS';

  const mockCore = ({
    inputs = {},
    outputs = {},
    stdout = [],
  } = {}) => ({
    getInput: key => inputs[key] || '',
    getOutput: key => outputs[key] || null,
    getFailed: () => outputs.failed || null,
    setFailed: value => outputs.failed = value,
    debug: value => stdout.push(value),
    info: value => stdout.push(value),
    getStdout: () => stdout || [],
  });

  it('should retag an image', async () => {
    const core = {
      inputs: {
        repository: 'someimportantcompany/github-actions-aws-ecr-retag',
        'src-tag': 'latest',
        'dest-tag': formatDate(new Date(), FORMAT),
      },
      outputs: {},
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    const { repository: repo, 'src-tag': srcTag, 'dest-tag': destTag } = core.inputs;
    assert.deepStrictEqual(core, {
      inputs: core.inputs,
      outputs: {},
      stdout: [`Retagged ${repo}:${srcTag} as ${repo}:${destTag}`],
    });
  });

  it('should delete an image tag before retagging', async () => {
    const core = {
      inputs: {
        repository: 'someimportantcompany/github-actions-aws-ecr-retag',
        'src-tag': 'latest',
        'dest-tag': formatDate(new Date(), FORMAT),
        'delete-before': true,
      },
      outputs: {},
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    const { repository: repo, 'src-tag': srcTag, 'dest-tag': destTag } = core.inputs;
    assert.deepStrictEqual(core, {
      inputs: core.inputs,
      outputs: {},
      stdout: [`Retagged ${repo}:${srcTag} as ${repo}:${destTag}`],
    });
  });

  it('should handle a missing image tag', async () => {
    const core = {
      inputs: {
        repository: 'someimportantcompany/github-actions-aws-ecr-retag',
        'src-tag': 'missing-latest',
        'dest-tag': formatDate(new Date(), FORMAT),
      },
      outputs: {},
      stdout: [],
    };

    await action.__with__({ core: mockCore(core) })(() => action());

    const { repository: repo, 'src-tag': srcTag } = core.inputs;
    assert.deepStrictEqual(core, {
      inputs: core.inputs,
      outputs: { failed: `Image not found: ${repo}:${srcTag}` },
      stdout: [],
    });
  });

});
