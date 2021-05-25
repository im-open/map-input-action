const core = require('@actions/core');

const getInputMap = () => {
  const inputMap = core.getInput('input_map', { required: true });
  return JSON.parse(inputMap);
};

const run = () => {
  try {
    const input = core.getInput('input', { required: true }).toLowerCase();
    const inputMap = getInputMap();

    core.info(`input: ${input}`);
    core.info(`input_map: ${inputMap}`);

    if (
      !Object.entries(inputMap).every(
        ([, value]) => typeof value === 'string' || Array.isArray(value)
      )
    ) {
      throw new Error(
        'The provided input_map properties are not single string values or arrays which are the only supported types.'
      );
    }

    const match = Object.entries(inputMap).find(
      ([, value]) =>
        value === input ||
        value
          .map(potentialInput => potentialInput.toString().toLowerCase())
          .includes(input)
    );

    if (!match) throw new Error('The input did not match any expected inputs');

    core.info(
      `The value from the input_map that matched the input: ${match[0]}`
    );
    core.setOutput('mapped_input', match[0]);
  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
};

run();
