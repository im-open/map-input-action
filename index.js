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
    const errorOnNoMatch = core.getInput('error_on_no_match');
    const errorMessage =
      core.getInput('custom_error_message') || 'The input did not match any of the expected inputs';

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
        (Array.isArray(value) &&
          value.map(potentialInput => potentialInput.toString().toLowerCase()).includes(input))
    );

    if (!matchingEntries || matchingEntries.length <= 0) {
      if (errorOnNoMatch && errorOnNoMatch.toLowerCase() === 'true') {
        throw new Error(errorMessage);
      } else return;
    }

    const output =
      shouldOutputAllMatches && shouldOutputAllMatches.toLowerCase() === 'true'
        ? matchingEntries.map(match => match[0])
        : matchingEntries[0][0];

    core.info(`The value(s) from the input_map that matched the input: ${output}`);
    core.setOutput('mapped_input', output);
  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
};

run();
