const transformReactFelaDisplayName = ({ types: t }) => {
  const functionNameRegEx = /^createComponent(WithProxy)?$/;
  return {
    name: 'transform-react-fela-display-name',
    visitor: {
      VariableDeclarator: {
        enter(path) {
          const { node: { id, init, init: { callee } } } = path;
          if (t.isCallExpression(init) && callee.name.match(functionNameRegEx)) {
            const componentName = id.name;
            const left = t.memberExpression(
              t.identifier(componentName),
              t.identifier('displayName')
            );
            const right = t.stringLiteral(componentName);
            const displayNameAssignment = t.assignmentExpression('=', left, right);
            path.parentPath.insertAfter(displayNameAssignment);
          }
        }
      }
    }
  };
};

export default transformReactFelaDisplayName;
