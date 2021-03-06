let postcss = require('postcss')

let clamp = require('./')

async function run (input, output, opts) {
  let result = await postcss([clamp(opts)])
    .process(input, { from: '/test.css' })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
  return result
}

it('handle simple transformation (only values)', async () => {
  await run(
    'a{ width: clamp(10px, 64px, 80px); }',
    'a{ width: max(10px, min(64px, 80px)); }'
  )
})

it('handle transformation with functions', async () => {
  await run(
    'a{ width: clamp(calc(100% - 10px), min(10px, 100%), max(40px, 4em)); }',
    'a{ width: max(calc(100% - 10px), min(min(10px, 100%), max(40px, 4em))); }'
  )
})

it('handle transformation with different units', async () => {
  await run(
    'a{ width: clamp(10%, 2px, 4rem); }',
    'a{ width: max(10%, min(2px, 4rem)); }'
  )
})

it('transform only function with 3 paramters', async () => {
  await run(
    'a{ width: clamp(10%, 2px, 4rem);' +
    '\nheight: clamp(10px, 20px, 30px, 40px); }',
    'a{ width: max(10%, min(2px, 4rem));' +
    '\nheight: clamp(10px, 20px, 30px, 40px); }'
  )
})

it('transform only clamp function', async () => {
  await run(
    'a{ width: clamp(10%, 2px, 4rem);\nheight: calc(10px + 100%); }',
    'a{ width: max(10%, min(2px, 4rem));\nheight: calc(10px + 100%); }'
  )
})

it('precalculate second and third with the same unit (int values)',
  async () => {
    await run(
      'a{ width: clamp(10%, 2px, 5px); }',
      'a{ width: max(10%, 7px); }',
      { precalculate: true }
    )
  })

it('precalculate second and third with the same unit (float values)',
  async () => {
    await run(
      'a{ width: clamp(10%, 2.5px, 5.1px); }',
      'a{ width: max(10%, 7.6px); }',
      { precalculate: true }
    )
  })

it('precalculate second and third with the same unit (float and int values)',
  async () => {
    await run(
      'a{ width: clamp(10%, 2.5px, 5px); }',
      'a{ width: max(10%, 7.5px); }',
      { precalculate: true }
    )
  })

it('precalculate all values with the same unit (int values)', async () => {
  await run(
    'a{ width: clamp(10px, 2px, 5px); }',
    'a{ width: 17px; }',
    { precalculate: true }
  )
})

it('precalculate all values with the same unit (float values)', async () => {
  await run(
    'a{ width: clamp(10.4px, 2.11px, 5.9px); }',
    'a{ width: 18.41px; }',
    { precalculate: true }
  )
})

it('precalculate all values with the same unit (int and float values)',
  async () => {
    await run(
      'a{ width: clamp(10.4px, 2px, 5.9px); }',
      'a{ width: 18.3px; }',
      { precalculate: true }
    )
  })

it('handle function with enalbe precalculation as third', async () => {
  await run(
    'a{ width: clamp(10px, 2px, calc(10px + 100%)); }',
    'a{ width: max(10px, min(2px, calc(10px + 100%))); }',
    { precalculate: true }
  )
})

it('handle function with enalbe precalculation as second', async () => {
  await run(
    'a{ width: clamp(10px, calc(10px + 100%), 2px); }',
    'a{ width: max(10px, min(calc(10px + 100%), 2px)); }',
    { precalculate: true }
  )
})

it('handle function with enalbe precalculation as first', async () => {
  await run(
    'a{ width: clamp(calc(10px + 100%), 10px, 2px); }',
    'a{ width: max(calc(10px + 100%), 12px); }',
    { precalculate: true }
  )
})

it('handle function with enalbe precalculation as all', async () => {
  await run(
    'a{ width: clamp(calc(10px + 100%), calc(10rem + 200%), 10px); }',
    'a{ width: max(calc(10px + 100%), min(calc(10rem + 200%), 10px)); }',
    { precalculate: true }
  )
})

it('handle not valid values', async () => {
  await run(
    'a{ width: clamp(a, b, c); }',
    'a{ width: max(a, min(b, c)); }',
    { precalculate: true }
  )
})

it('handle not valid values mixed with valid', async () => {
  await run(
    'a{ width: clamp(a, 1px, 2em); }',
    'a{ width: max(a, min(1px, 2em)); }',
    { precalculate: true }
  )
})
