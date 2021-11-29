# Map Input

An action for taking an input, comparing it to a list of values, and outputting the matching key. The comparison happens case-insensitively.
    
## Index 

- [Inputs](#inputs)
- [Output](#output)
- [Examples](#examples)
- [Contributing](#contributing)
  - [Recompiling](#recompiling)
  - [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Inputs

| Parameter              | Required | Description                                                                                                                                                                                                                                |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `input`                | True     | The input to map.                                                                                                                                                                                                                          |
| `input_map`            | True     | A json object where the property names are the desired output and the values are the list of values, or a single string value, to compare `input` against.                                                                                 |
| `get_all_matches`      | False    | An optional flag for whether or not to output all matches. By default the output is the first item from the input_map that matches. If this value is true then an array with every match is returned.                                      |
| `error_on_no_match`    | False    | A flag to determine if the action should exit with an error code or not. Only the value `true` will cause an error.                                                                                                                        |
| `custom_error_message` | False    | A custom error message to print out when no match is found and `error_on_no_match` is true. If no value is given and `error_on_no_match` is true, then the generic message "`The input did not match any of the expected inputs`" is used. |

## Output

The matching property name(s) from the `input_map` where the value of the property equals the `input`. Depending on the `get_all_matches`, flag this will either be a single string (default) or an array of strings.

## Examples

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
        uses: im-open/map-input-action@v1.0.3
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
        uses: im-open/map-input-action@v1.0.3
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

When creating new PRs please ensure:
1. The action has been recompiled.  See the [Recompiling](#recompiling) section below for more details.
2. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
3. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
4. The action code does not contain sensitive information.

### Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[git-version-lite]: https://github.com/im-open/git-version-lite
