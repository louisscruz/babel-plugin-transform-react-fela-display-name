'use strict';

var transformReactFelaDisplayName = function transformReactFelaDisplayName(_ref) {
  var t = _ref.types;

  var defaultFunctionNameRegEx = /^createComponent(WithProxy)?$/;
  var defaultReactFelaPackageRegEx = /react-fela(\/.*(\.js)?)?$/;

  var handleInjectDisplayName = function handleInjectDisplayName(initialLineNodePath, componentName, objectName) {
    if (!initialLineNodePath || !componentName) return;
    var leftLeft = objectName ? t.memberExpression(t.identifier(objectName), t.identifier(componentName)) : t.identifier(componentName);
    var left = t.memberExpression(leftLeft, t.identifier('displayName'));
    var right = t.stringLiteral(componentName);
    var displayNameAssignment = t.toStatement(t.assignmentExpression('=', left, right));
    initialLineNodePath.insertAfter(displayNameAssignment);
  };

  var identifierComesFromReactFela = function identifierComesFromReactFela(identifierDeclarationPath, calleeName, functionNameRegEx, reactFelaPackageRegEx) {
    var bindings = identifierDeclarationPath.scope.bindings;

    if (!bindings[calleeName]) return false;
    var sourcePath = bindings[calleeName].path;

    if (sourcePath.isImportSpecifier() && sourcePath.parentPath.isImportDeclaration()) {
      // Handle cases where the function is imported destructured. For example:
      //
      // import { createComponent } from 'react-fela';
      // /* or */
      // import { createComponentWithProxy }j from 'react-fela';
      //
      var sourceImportFrom = sourcePath.parent.source.value,
          importedName = sourcePath.node.imported.name;

      var isFromReactFela = reactFelaPackageRegEx.test(sourceImportFrom);
      var validImportedName = functionNameRegEx.test(importedName);
      return isFromReactFela && validImportedName;
    } else if (sourcePath.isVariableDeclarator()) {
      var init = sourcePath.node.init;
      // This handles the following case:
      //
      // const createComponent = require('react-fela').createComponent;
      //

      if (t.isMemberExpression(init)) {
        var property = init.property,
            callee = init.object.callee;

        return callee && callee.name === 'require' && property && functionNameRegEx.test(property.name);
      }
    }

    return false;
  };

  return {
    name: 'transform-react-fela-display-name',
    visitor: {
      AssignmentExpression: function AssignmentExpression(path, _ref2) {
        var opts = _ref2.opts;

        // This adds the ability to handle components created and assigned to objects of properties.
        // This handles the case of a component being created as a class property. For example:
        //
        // class MyParentComponent extends React.Component {
        //   static MyChildComponent = createComponent(() => ({}), 'div');
        //   ...
        // }
        //
        var _path$node = path.node,
            left = _path$node.left,
            right = _path$node.right;

        var functionNameRegEx = new RegExp(opts.functionNameRegEx) || defaultFunctionNameRegEx;
        var reactFelaPackageRegEx = new RegExp(opts.reactFelaPackageRegEx) || defaultReactFelaPackageRegEx;
        if (t.isMemberExpression(left) && t.isCallExpression(right)) {
          var injectAssignmentDisplayName = function injectAssignmentDisplayName() {
            var objectName = left.object.name,
                propertyName = left.property.name;

            return handleInjectDisplayName(path.parentPath, propertyName, objectName);
          };
          var callee = right.callee;

          if (t.isMemberExpression(callee)) {
            // This handles the case where the assignment is to a default import of the package.
            // For example:
            //
            // import ReactFela from 'react-fela';
            // class MyParentComponent extends React.Component {
            //   static MyChildComponent = ReactFela.createComponent(() => ({}), 'div');
            // }
            //
            var variableName = callee.object.name;
            var bindings = path.scope.bindings;

            if (variableName && variableName === opts.globalSource) {
              injectAssignmentDisplayName();
              return;
            }
            var binding = bindings[variableName];
            if (!binding || !binding.path || !binding.path.parent) return;

            var importDeclaration = binding.path.parent;


            if (t.isImportDeclaration(importDeclaration)) {
              injectAssignmentDisplayName();
            }
          } else if (identifierComesFromReactFela(path, callee.name, functionNameRegEx, reactFelaPackageRegEx)) {
            injectAssignmentDisplayName();
          }
        }
      },
      VariableDeclarator: function VariableDeclarator(path, _ref3) {
        var opts = _ref3.opts;

        // Match cases such as:
        //
        // const x = y;
        //
        var _path$node2 = path.node,
            id = _path$node2.id,
            init = _path$node2.init;

        var functionNameRegEx = new RegExp(opts.functionNameRegEx) || defaultFunctionNameRegEx;
        var reactFelaPackageRegEx = new RegExp(opts.reactFelaPackageRegEx) || defaultReactFelaPackageRegEx;
        if (!init) return;

        var callee = init.callee;


        if (t.isCallExpression(init)) {
          // Match cases such as:
          //
          // const x = y();
          //
          var componentName = id.name;
          var initialLineNodePath = path.parentPath;

          var injectDisplayName = function injectDisplayName() {
            return handleInjectDisplayName(initialLineNodePath, componentName);
          };

          if (callee.name && callee.name.match(functionNameRegEx) && identifierComesFromReactFela(path, callee.name, functionNameRegEx, reactFelaPackageRegEx)) {
            // Match cases such as:
            //
            // const x = createComponent(...);
            // /* or */
            // const y = createComponentWithProxy(...);
            //
            injectDisplayName();
          } else if (t.isMemberExpression(callee)) {
            // This handles default imports of createComponent functions. For example:
            //
            // import ReactFela from 'react-fela';
            // const renameIt = createComponent;
            // const MyComponent = renameIt(...);
            //
            var variableName = callee.object.name;

            if (variableName && variableName === opts.globalSource) {
              // This handles the case where the recipient matches the provided global source name.
              // For example:
              // /* babel plugin options = { globalSource: 'ReactFela' } */
              // const MyComponent = ReactFela.createComponent(...);
              //
              injectDisplayName();
              return;
            }
            var bindings = path.scope.bindings;

            if (!bindings[variableName]) return;
            var _bindings$variableNam = bindings[variableName].path,
                parent = _bindings$variableNam.parent,
                bindingNode = _bindings$variableNam.node;

            if (t.isImportDeclaration(parent)) {
              var value = bindings[variableName].path.parent.source.value;


              if (reactFelaPackageRegEx.test(value)) {
                injectDisplayName();
              }
            } else if (t.isVariableDeclaration(parent)) {
              // This handles the following case:
              //
              // const ReactFela = require('react-fela');
              // const MyComponent = ReactFela.createComponent(...);
              //
              var bindingInit = bindingNode.init;

              if (t.isVariableDeclarator(bindingNode) && t.isCallExpression(bindingInit)) {
                var isRequiredFromReact = bindingInit.arguments.some(function (arg) {
                  return reactFelaPackageRegEx.test(arg.value);
                });
                if (isRequiredFromReact) {
                  injectDisplayName();
                }
              }
            }
          } else {
            var _bindings = path.scope.bindings;

            var functionBinding = _bindings[callee.name];
            if (!functionBinding) return;
            var _bindingInit = functionBinding.path.node.init;


            if (t.isIdentifier(_bindingInit) && identifierComesFromReactFela(functionBinding.path, _bindingInit.name, functionNameRegEx, reactFelaPackageRegEx)) {
              // This handles renaming of the createComponent functions. For example:
              //
              // import { createComponent } from 'react-fela';
              // const renameIt = createComponent;
              // const MyComponent = renameIt(...);
              //
              injectDisplayName();
            }
          }
        }
      }
    }
  };
};

module.exports = transformReactFelaDisplayName;
//# sourceMappingURL=index.js.map