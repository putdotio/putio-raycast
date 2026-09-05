const raycast = require("@raycast/eslint-config");

module.exports = [
  ...raycast.flatMap((config) => config),
  {
    files: ["src/api/withPutioClient.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "react", importNames: ["useEffect"], message: "Account bootstrap belongs in usePromise." }] },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.object.name='React'][callee.property.name='useEffect']",
          message: "Account bootstrap belongs in usePromise.",
        },
      ],
    },
  },
];
