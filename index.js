const core = require('@actions/core');

const getInputMap = () => {
  const inputMap = core.getInput('input_map', { required: true });
  return JSON.parse(inputMap);
};

const run = () => {
  try {
    const input = core.getInput('input', { required: true }).toLowerCase();
    const inputMap = getInputMap();
    const shouldOutputAllMatches = core.getInput('get_all_matches');

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

    const matchingEntries = Object.entries(inputMap).filter(
      ([, value]) =>
        value === input ||
        value
          .map(potentialInput => potentialInput.toString().toLowerCase())
          .includes(input)
    );

    if (!matchingEntries || matchingEntries.length <= 0)
      throw new Error('The input did not match any expected inputs');

    const output =
      shouldOutputAllMatches && shouldOutputAllMatches.toLowerCase() === 'true'
        ? matchingEntries.map(match => match[0])
        : matchingEntries[0][0];

    core.info(
      `The value(s) from the input_map that matched the input: ${output}`
    );
    core.setOutput('mapped_input', output);
  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
};

run();
