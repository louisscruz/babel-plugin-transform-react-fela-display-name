const transformReactFelaDisplayName = ({ types: t }) => {
  const functionNameRegEx = /^createComponent(WithProxy)?$/;

  const injectDisplayName = (initialLineNodePath, componentName) => {
    const left = t.memberExpression(t.identifier(componentName), t.identifier('displayName'));
    const right = t.stringLiteral(componentName);
    const displayNameAssignment = t.assignmentExpression('=', left, right);
    initialLineNodePath.insertAfter(displayNameAssignment);
  };

  const getFunctionBinding = (path, callee) => {
    const { scope: { bindings } } = path;
    return bindings[callee.name];
  };

  const identifierComesFromReactFela = (identifierDeclarationPath, calleeName) => {
    const reactFelaRegEx = /react-fela(\/index(\.js)?)?$/;
    const { scope: { bindings } } = identifierDeclarationPath;
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
      const isFromReactFela = reactFelaRegEx.test(sourceImportFrom);
      const validImportedName = functionNameRegEx.test(importedName);
      return isFromReactFela && validImportedName;
    }
    return false;
  };

  return {
    name: 'transform-react-fela-display-name',
    visitor: {
      // Match cases such as:
      //
      // const x = y;
      //
      VariableDeclarator(path) {
        const { node: { id, init, init: { callee } } } = path;

        // Match cases such as:
        //
        // const x = y();
        //
        if (t.isCallExpression(init)) {
          const componentName = id.name;
          const initialLineNodePath = path.parentPath;

          // Match cases such as:
          //
          // const x = createComponent(...);
          // /* or */
          // const y = createComponentWithProxy(...);
          //
          if (
            callee.name.match(functionNameRegEx) &&
            identifierComesFromReactFela(path, callee.name)
          ) {
            injectDisplayName(initialLineNodePath, componentName);
          } else {
            const functionBinding = getFunctionBinding(path, callee);
            const { path: { node: { init: bindingInit } } } = functionBinding;

            // This handles renaming of the createComponent functions. For example:
            //
            // import { createComponent } from 'react-fela';
            // const renameIt = createComponent;
            // const MyComponent = renameIt(...);
            //
            // console.log(bindingInit);
            if (
              t.isIdentifier(bindingInit) &&
              identifierComesFromReactFela(
                functionBinding.path,
                bindingInit.name
              ) /* path.parent.declarations[0]) */
            ) {
              injectDisplayName(initialLineNodePath, componentName);
            }
          }
        }
      }
      // ImportDeclaration(path) {
      //   console.log(Object.keys(path));
      //   console.log(path.node.source);
      // }
    }
  };
};

export default transformReactFelaDisplayName;
