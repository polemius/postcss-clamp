var postcss = require('postcss')

var clamp = require('./')

async function run (input, output, opts) {
  var result = await postcss([clamp(opts)])
    .process(input, { from: '/test.css' })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
  return result
}

it('handle simple transformation (only values)', async function () {
  await run(
    'a{ width: clamp(10px, 64px, 80px); }',
    'a{ width: max(10px, min(64px, 80px)); }'
  )
})

it('handle transformation with functions', async function () {
  await run(
    'a{ width: clamp(calc(100% - 10px), min(10px, 100%), max(40px, 4em)); }',
    'a{ width: max(calc(100% - 10px), min(min(10px, 100%), max(40px, 4em))); }'
  )
})

it('handle transformation with different units', async function () {
  await run(
    'a{ width: clamp(10%, 2px, 4rem); }',
    'a{ width: max(10%, min(2px, 4rem)); }'
  )
})

it('transform only function with 3 paramters', async function () {
  await run(
    'a{ width: clamp(10%, 2px, 4rem);' +
    '\nheight: clamp(10px, 20px, 30px, 40px); }',
    'a{ width: max(10%, min(2px, 4rem));' +
    '\nheight: clamp(10px, 20px, 30px, 40px); }'
  )
})

it('transform only clamp function', async function () {
  await run(
    'a{ width: clamp(10%, 2px, 4rem);\nheight: calc(10px + 100%); }',
    'a{ width: max(10%, min(2px, 4rem));\nheight: calc(10px + 100%); }'
  )
})
