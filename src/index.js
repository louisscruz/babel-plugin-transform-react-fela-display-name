const transformReactFelaDisplayName = ({ types: t }) => {
  const defaultFunctionNameRegEx = /^createComponent(WithProxy)?$/;
  const defaultReactFelaPackageRegEx = /react-fela(\/.*(\.js)?)?$/;

  const handleInjectDisplayName = (initialLineNodePath, componentName, objectName) => {
    if (!initialLineNodePath || !componentName) return;
    const leftLeft = objectName
      ? t.memberExpression(t.identifier(objectName), t.identifier(componentName))
      : t.identifier(componentName);
    const left = t.memberExpression(leftLeft, t.identifier('displayName'));
    const right = t.stringLiteral(componentName);
    const displayNameAssignment = t.toStatement(t.assignmentExpression('=', left, right));
    initialLineNodePath.insertAfter(displayNameAssignment);
  };

  const identifierComesFromReactFela = (
    identifierDeclarationPath,
    calleeName,
    functionNameRegEx,
    reactFelaPackageRegEx
  ) => {
    const { scope: { bindings } } = identifierDeclarationPath;
    if (!bindings[calleeName]) return false;
    const sourcePath = bindings[calleeName].path;

    if (sourcePath.isImportSpecifier() && sourcePath.parentPath.isImportDeclaration()) {
      // Handle cases where the function is imported destructured. For example:
      //
      // import { createComponent } from 'react-fela';
      // /* or */
      // import { createComponentWithProxy }j from 'react-fela';
      //
      const {
        parent: { source: { value: sourceImportFrom } },
        node: { imported: { name: importedName } }
      } = sourcePath;
      const isFromReactFela = reactFelaPackageRegEx.test(sourceImportFrom);
      const validImportedName = functionNameRegEx.test(importedName);
      return isFromReactFela && validImportedName;
    } else if (sourcePath.isVariableDeclarator()) {
      const { node: { init } } = sourcePath;
      // This handles the following case:
      //
      // const createComponent = require('react-fela').createComponent;
      //
      if (t.isMemberExpression(init)) {
        const { property, object: { callee } } = init;
        return (
          callee && callee.name === 'require' && property && functionNameRegEx.test(property.name)
        );
      }
    }

    return false;
  };

  return {
    name: 'transform-react-fela-display-name',
    visitor: {
      AssignmentExpression(path, { opts }) {
        // This adds the ability to handle components created and assigned to objects of properties.
        // This handles the case of a component being created as a class property. For example:
        //
        // class MyParentComponent extends React.Component {
        //   static MyChildComponent = createComponent(() => ({}), 'div');
        //   ...
        // }
        //
        const { node: { left, right } } = path;
        const functionNameRegEx = new RegExp(opts.functionNameRegEx) || defaultFunctionNameRegEx;
        const reactFelaPackageRegEx =
          new RegExp(opts.reactFelaPackageRegEx) || defaultReactFelaPackageRegEx;
        if (t.isMemberExpression(left) && t.isCallExpression(right)) {
          const injectAssignmentDisplayName = () => {
            const { object: { name: objectName }, property: { name: propertyName } } = left;
            return handleInjectDisplayName(path.parentPath, propertyName, objectName);
          };
          const { callee } = right;
          if (t.isMemberExpression(callee)) {
            // This handles the case where the assignment is to a default import of the package.
            // For example:
            //
            // import ReactFela from 'react-fela';
            // class MyParentComponent extends React.Component {
            //   static MyChildComponent = ReactFela.createComponent(() => ({}), 'div');
            // }
            //
            const { object: { name: variableName } } = callee;
            const { scope: { bindings } } = path;
            if (variableName && variableName === opts.globalSource) {
              injectAssignmentDisplayName();
              return;
            }
            const binding = bindings[variableName];
            if (!binding || !binding.path || !binding.path.parent) return;

            const { path: { parent: importDeclaration } } = binding;

            if (t.isImportDeclaration(importDeclaration)) {
              injectAssignmentDisplayName();
            }
          } else if (
            identifierComesFromReactFela(
              path,
              callee.name,
              functionNameRegEx,
              reactFelaPackageRegEx
            )
          ) {
            injectAssignmentDisplayName();
          }
        }
      },
      VariableDeclarator(path, { opts }) {
        // Match cases such as:
        //
        // const x = y;
        //
        const { node: { id, init } } = path;
        const functionNameRegEx = new RegExp(opts.functionNameRegEx) || defaultFunctionNameRegEx;
        const reactFelaPackageRegEx =
          new RegExp(opts.reactFelaPackageRegEx) || defaultReactFelaPackageRegEx;
        if (!init) return;

        const { callee } = init;

        if (t.isCallExpression(init)) {
          // Match cases such as:
          //
          // const x = y();
          //
          const componentName = id.name;
          const initialLineNodePath = path.parentPath;

          const injectDisplayName = () =>
            handleInjectDisplayName(initialLineNodePath, componentName);

          if (
            callee.name &&
            callee.name.match(functionNameRegEx) &&
            identifierComesFromReactFela(
              path,
              callee.name,
              functionNameRegEx,
              reactFelaPackageRegEx
            )
          ) {
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
            const { object: { name: variableName } } = callee;
            if (variableName && variableName === opts.globalSource) {
              // This handles the case where the recipient matches the provided global source name.
              // For example:
              // /* babel plugin options = { globalSource: 'ReactFela' } */
              // const MyComponent = ReactFela.createComponent(...);
              //
              injectDisplayName();
              return;
            }
            const { scope: { bindings } } = path;
            if (!bindings[variableName]) return;
            const { path: { parent, node: bindingNode } } = bindings[variableName];
            if (t.isImportDeclaration(parent)) {
              const { path: { parent: { source: { value } } } } = bindings[variableName];

              if (reactFelaPackageRegEx.test(value)) {
                injectDisplayName();
              }
            } else if (t.isVariableDeclaration(parent)) {
              // This handles the following case:
              //
              // const ReactFela = require('react-fela');
              // const MyComponent = ReactFela.createComponent(...);
              //
              const { init: bindingInit } = bindingNode;
              if (t.isVariableDeclarator(bindingNode) && t.isCallExpression(bindingInit)) {
                const isRequiredFromReact = bindingInit.arguments.some(arg =>
                  reactFelaPackageRegEx.test(arg.value)
                );
                if (isRequiredFromReact) {
                  injectDisplayName();
                }
              }
            }
          } else {
            const { scope: { bindings } } = path;
            const functionBinding = bindings[callee.name];
            if (!functionBinding) return;
            const { path: { node: { init: bindingInit } } } = functionBinding;

            if (
              t.isIdentifier(bindingInit) &&
              identifierComesFromReactFela(
                functionBinding.path,
                bindingInit.name,
                functionNameRegEx,
                reactFelaPackageRegEx
              )
            ) {
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
