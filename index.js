let postcss = require('postcss')
let valueParser = require('postcss-value-parser')

function parseValue (value) {
  let parsed = value.match(/([\d.-]+)(.*)/)
  if (!parsed || !parsed[1] || !parsed[2] || isNaN(parsed[1])) {
    return undefined
  }
  return [parseFloat(parsed[1]), parsed[2]]
}

function compose (first, second, third) {
  if (first && second && third) {
    return `max(${ first }, min(${ second }, ${ third }))`
  }
  if (first && second) {
    return `max(${ first }, ${ second })`
  }

  return first
}

module.exports = postcss.plugin('postcss-clamp', opts => {
  opts = opts || {}
  let precalculate = opts.precalculate ? Boolean(opts.precalculate) : false

  return function (css) {
    css.walkDecls(decl => {
      if (!decl || !decl.value.includes('clamp')) {
        return
      }
      valueParser(decl.value).walk(node => {
        let nodes = node.nodes
        if (
          node.type !== 'function' ||
            node.value !== 'clamp' ||
            nodes.length !== 5
        ) {
          return
        }

        let first = nodes[0]
        let second = nodes[2]
        let third = nodes[4]

        let naive = compose(
          valueParser.stringify(first),
          valueParser.stringify(second),
          valueParser.stringify(third)
        )

        if (!precalculate || second.type !== 'word' || third.type !== 'word') {
          decl.value = naive
          return
        }

        let parsedSecond = parseValue(second.value)
        let parsedThird = parseValue(third.value)

        if (parsedSecond === undefined || parsedThird === undefined) {
          decl.value = naive
          return
        }

        let [secondValue, secondUnit] = parsedSecond
        let [thirdValue, thirdUnit] = parsedThird

        if (secondUnit !== thirdUnit) {
          decl.value = naive
          return
        }

        let parsedFirst = parseValue(first.value)

        if (parsedFirst === undefined) {
          let secondThirdValue = `${ secondValue + thirdValue }${ secondUnit }`
          decl.value = compose(valueParser.stringify(first), secondThirdValue)
          return
        }

        let [firstValue, firstUnit] = parsedFirst

        if (firstUnit !== secondUnit) {
          let secondThirdValue = `${ secondValue + thirdValue }${ secondUnit }`
          decl.value = compose(valueParser.stringify(first), secondThirdValue)
          return
        }

        decl.value =
          compose(`${ firstValue + secondValue + thirdValue }${ secondUnit }`)
      })
    })
  }
})
