# Map Input

An action for taking an input, comparing it to a list of values, and outputting the matching key. The comparison happens case-insensitively.

## Inputs

| Parameter                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                 | The input to map.                                                                                           |
| `input_map`               |  A json object where the property names are the desired output and the values are the list of values, or a single string value, to compare `input` against.                                               |
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
      env: ${{ steps.map-user-input.outputs.mapped_input }}
    steps:
      - name: Clean User Input
        id: clean-user-input
        uses: map-input-action
        with:
          input: ${{ github.event.inputs.someInput }}
          input_map: "{ \"Some\": [\"some\", \"sme\", \"somee\"], \"Thing\": [\"thing\", \"thingggg\"] }"
```

## Recompiling

If changes are made, you will need to re-compile the action. 

```
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and it's dependencies into a single file located in the `dist` folder.