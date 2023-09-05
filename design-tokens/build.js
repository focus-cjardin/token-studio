const {
  registerTransforms,
  transformColorModifiers,
  transforms,
} = require("@tokens-studio/sd-transforms");
const StyleDictionary = require("style-dictionary");

registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: true,
    shadow: false,
  },
  excludeParentKeys: false,
  "ts/color/modifiers": {
    format: "hex",
  },
});

// register custom transform to convert px sizes to numbers which are readable from React Native
StyleDictionary.registerTransform({
  name: "focus/react-native/size",
  type: "value",
  transitive: true,
  matcher: (token) =>
    [
      "fontSizes",
      "dimension",
      "borderRadius",
      "borderWidth",
      "spacing",
    ].includes(token.type),
  transformer: (token) => {
    const value = token.value;
    if (value === undefined) {
      return value;
    }

    const result = parseFloat(value, 10);
    if (!isNaN(result)) {
      return result;
    }

    return value;
  },
});

StyleDictionary.registerTransform({
  name: "focus/react-native/color-modifiers",
  type: "value",
  transitive: true,
  matcher: (token) =>
    token.type === "color" &&
    token.$extensions &&
    token.$extensions["studio.tokens"]?.modify,
  transformer: (token) => {
    token.$extensions["studio.tokens"].modify.format = "hex";
    return transformColorModifiers(token);
  },
});

// Register custom tokens-studio transform group to include the custom transform that converts sizes to number which is readable from React Native
StyleDictionary.registerTransformGroup({
  name: "focus/tokens-studio",
  transforms: [
    ...transforms.filter((e) => e !== "ts/color/modifiers"),
    "name/cti/camel",
    "focus/react-native/size",
    "focus/react-native/color-modifiers",
  ],
});

const brands = ["moes", "jamba"];

brands.forEach((brand) => buildBrand(brand));

function buildBrand(brand) {
  const sd = StyleDictionary.extend({
    source: ["./tokens/core/**.json", `./tokens/${brand}/**.json`],
    platforms: {
      ts: {
        transformGroup: "focus/tokens-studio",
        buildPath: "build/ts/",
        files: [
          {
            destination: `${brand}.js`,
            format: "javascript/module",
          },
          {
            format: "typescript/module-declarations",
            destination: `${brand}.d.ts`,
          },
        ],
        options: {
          outputReferences: true,
        },
      },
    },
  });

  sd.cleanAllPlatforms();
  sd.buildAllPlatforms();
}
