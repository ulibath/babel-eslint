const babelParser = require("./babelParser");
const ast = require("./astSource");
const tokTypes = require("./tokTypes");
const { traverse, types: t } = require("@babel/core");

const newAST = babelParser(
  ast,
  traverse,
  tokTypes,
  t,
  "const a = {\n" +
    "  b: {c: true},\n" +
    "  d() {return 4},\n" +
    "  get e() {return 6},\n" +
    "  f: true\n" +
    "};"
);
console.log(JSON.stringify(newAST));
