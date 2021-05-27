# Map Input

An action for taking an input, comparing it to a list of values, and outputting the matching key. The comparison happens case-insensitively.

## Inputs

| Parameter                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                 | The input to map.                                                                                           |
| `input_map`               |  A json object where the property names are the desired output and the values are the list of values, or a single string value, to compare `input` against.                                               |
| `get_all_matches`        | An optional flag for whether or not to output all matches. By default the output is the first item from the input_map that matches. If this value is true then an array with every match is returned.                                           |

## Output

The matching property name(s) from the `input_map` where the value of the property equals the `input`. Depending on the `get_all_matches`, flag this will either be a single string (default) or an array of strings.

## Example

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
        uses: im-open/map-input-action@v1
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

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and its dependencies into a single file located in the `dist` folder.