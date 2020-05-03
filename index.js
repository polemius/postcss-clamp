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
          node.type === 'function' &&
            node.value === 'clamp' &&
            nodes.length === 5
        ) {
          var firstValue = nodes[0].value
          var secondValue = nodes[2].value
          var thirdValue = nodes[4].value
          decl.value = 'max(' +
            firstValue + ', min(' +
            secondValue + ', ' +
            thirdValue + ')' +
            ')'
        }
      })
    })
  }
})
