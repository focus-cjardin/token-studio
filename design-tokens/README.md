# Design Tokens from Token Studio (Figma)

This folder contains the design tokens definitions and values in JSON format stored in the tokens.json file which gets written via integration with the Token Studio Figma plugin.

# Generating TypeScript consumables

The tokens.json file contains all the tokens for all the brands in a single file.
The build.js script was created to generate TypeScript files that can be consumed by React Native.

Currently the build.js script expects the tokens json to be splitted by brand. This has been done manually initially but the script can be evolved to do this job once the tokens structure is stable and well defined.

The following steps are needed to generate the files:

1. Install the dependencies with `npm install`
1. Copy each of the main properties in the tokens.json into separate files in their respective folders.
1. Run the script with `npm run build`
1. Copy the generated files from `build` to the react native app
