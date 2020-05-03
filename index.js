var postcss = require('postcss')
var valueParser = require('postcss-value-parser')

module.exports = postcss.plugin('postcss-clamp', function (opts) {
  if (typeof opts === 'undefined') opts = { }
  return function (css) {
    css.walkDecls(function (decl) {
      if (!decl || decl.value.indexOf('clamp') === -1) {
        return
      }
      valueParser(decl.value).walk(function (node) {
        var nodes = node.nodes
        if (
          node.type !== 'function' ||
            node.value !== 'clamp' ||
            nodes.length !== 5
        ) {
          return
        }
        var firstValue = valueParser.stringify(nodes[0])
        var secondValue = valueParser.stringify(nodes[2])
        var thirdValue = valueParser.stringify(nodes[4])

        decl.value = 'max(' +
            firstValue +
            ', min(' +
            secondValue +
            ', ' +
            thirdValue +
            ')' +
        ')'
      })
    })
  }
})
