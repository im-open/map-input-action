# Map Input

An action for taking an input, comparing it to a list of values, and outputting the matching key. The comparison happens case-insensitively.

## Index <!-- omit in toc -->

- [Map Input](#map-input)
  - [Inputs](#inputs)
  - [Output](#output)
  - [Usage Examples](#usage-examples)
  - [Contributing](#contributing)
    - [Incrementing the Version](#incrementing-the-version)
    - [Source Code Changes](#source-code-changes)
    - [Recompiling Manually](#recompiling-manually)
    - [Updating the README.md](#updating-the-readmemd)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Inputs

| Parameter              | Required | Description                                                                                                                                                                                                                                |
|------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `input`                | True     | The input to map.                                                                                                                                                                                                                          |
| `input_map`            | True     | A json object where the property names are the desired output and the values are the list of values, or a single string value, to compare `input` against.                                                                                 |
| `get_all_matches`      | False    | An optional flag for whether or not to output all matches. By default the output is the first item from the input_map that matches. If this value is true then an array with every match is returned.                                      |
| `error_on_no_match`    | False    | A flag to determine if the action should exit with an error code or not. Only the value `true` will cause an error.                                                                                                                        |
| `custom_error_message` | False    | A custom error message to print out when no match is found and `error_on_no_match` is true. If no value is given and `error_on_no_match` is true, then the generic message "`The input did not match any of the expected inputs`" is used. |

## Output

The matching property name(s) from the `input_map` where the value of the property equals the `input`. Depending on the `get_all_matches`, flag this will either be a single string (default) or an array of strings.

## Usage Examples

```yml
name: Do Something
on:
  workflow_dispatch:
    inputs:
      someInput:
        description: Some value you want the user to specify
        required: true
jobs:
  map-input:
    runs-on: ubuntu-20.04
    outputs:
      someInputMapped: ${{ steps.clean-user-input.outputs.mapped_input }}
    steps:
      - name: Clean User Input
        id: clean-user-input
        # You may also reference the major or major.minor version
        uses: im-open/map-input-action@v1.1.3
        with:
          input: ${{ github.event.inputs.someInput }}
          input_map: "{ \"Some\": [\"some\", \"sme\", \"somee\"], \"Thing\": [\"thing\", \"thingggg\"] }"
      - name: Do Some
        if: ${{ steps.clean-user-input.outputs.mapped_input == 'Some' }}
        run: echo "Some was the input"
      - name: Do Thing
        if: ${{ steps.clean-user-input.outputs.mapped_input == 'Thing' }}
        run: echo "Thing was the input"
```

**Throw a custom error message when no match happens**

```yml
name: Throw error
on:
  workflow_dispatch:
    inputs:
      someInput:
        description: Some value you want the user to specify
        required: true
jobs:
  map-input:
    runs-on: ubuntu-20.04
    outputs:
      someInputMapped: ${{ steps.clean-user-input.outputs.mapped_input }}
    steps:
      - name: Clean User Input
        id: clean-user-input
        # You may also reference the major or major.minor version
        uses: im-open/map-input-action@v1.1.3
        with:
          input: ${{ github.event.inputs.someInput }}
          input_map: "{ \"Some\": [\"some\", \"sme\", \"somee\"], \"Thing\": [\"thing\", \"thingggg\"] }"
          error_on_no_match: true
          custom_error_message: "Oh no, the user didn't enter some or thing!"
      - name: Do Some
        if: ${{ steps.clean-user-input.outputs.mapped_input == 'Some' }}
        run: echo "Some was the input"
      - name: Do Thing
        if: ${{ steps.clean-user-input.outputs.mapped_input == 'Thing' }}
        run: echo "Thing was the input"
```

## Contributing

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The action has been recompiled.  See [Recompiling Manually] for details.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version and the action should be recompiled.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates and recompiles do not need to be performed.

### Recompiling Manually

This command utilizes [esbuild] to bundle the action and its dependencies into a single file located in the `dist` folder.  If changes are made to the action's [source code], the action must be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2023, Extend Health, LLC. Code released under the [MIT license](LICENSE).

 <!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Recompiling Manually]: #recompiling-manually
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[esbuild]: https://esbuild.github.io/getting-started/#bundling-for-node
[git-version-lite]: https://github.com/im-open/git-version-lite
