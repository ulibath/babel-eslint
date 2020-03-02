"use strict";
const babylonToEspree = require("../lib/babylon-to-espree");

module.exports = function(ast, traverse, tt, t, code) {
  convertNodes(ast, traverse, t, code);
  babylonToEspree(ast, traverse, tt, t, code);

  return ast;
};

function convertNodes(ast, traverse, t, code) {
  const state = { source: code };
  const traverseRules = {
    noScope: true,
    enter(path) {
      if (path.node.end) {
        path.node.range = [path.node.start, path.node.end];
      }
    },
    ObjectProperty: function(path) {
      path.node.kind = "init";
      path.node.type = "Property";
    },
    ObjectMethod: function(path) {
      if (!path.node || path.node === "method") {
        path.node.kind = "init";
      }
      path.node.value = {
        type: "FunctionExpression",
        start: path.node.start,
        end: path.node.end,
        range: [path.node.start, path.node.end],
        id: path.node.id,
        generator: path.node.generator,
        expression: path.node.expression,
        async: path.node.async,
        params: path.node.params,
        body: path.node.body,
      };
      path.node.type = "Property";
    },
    ClassMethod: function(path) {
      path.node.value = {
        type: "FunctionExpression",
        start: path.node.start,
        end: path.node.end,
        range: [path.node.start, path.node.end],
        id: path.node.id,
        generator: path.node.generator,
        expression: path.node.expression,
        async: path.node.async,
        params: path.node.params,
        body: path.node.body,
      };
      path.node.type = "MethodDefinition";
    },
    NumericLiteral: function(path) {
      path.node.type = "Literal";
      path.node.raw = path.node.value.toString();
    },
    NullLiteral: function(path) {
      path.node.type = "Literal";
      path.node.value = null;
      path.node.raw = "null";
    },
    StringLiteral: function(path) {
      path.node.type = "Literal";
      path.node.raw = path.node.value.toString();
    },
    BooleanLiteral: function(path) {
      path.node.type = "Literal";
      path.node.raw = path.node.value.toString();
    },
  };

  // Monkey patch visitor keys in order to be able to traverse the estree nodes
  // necessary for a deep traverse
  t.VISITOR_KEYS.Property = t.VISITOR_KEYS.ObjectProperty;
  t.VISITOR_KEYS.MethodDefinition = [
    "key",
    "value",
    "decorators",
    "returnType",
    "typeParameters",
  ];

  ast.range = [ast.start, ast.end];
  traverse(ast, traverseRules, null, state);

  delete t.VISITOR_KEYS.Property;
  delete t.VISITOR_KEYS.MethodDefinition;
}
