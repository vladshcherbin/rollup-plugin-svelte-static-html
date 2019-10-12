import fs from 'fs-extra'
import { rollup } from 'rollup'
import svelteStaticHtml from '../src'

process.chdir(`${__dirname}/fixtures`)

async function build(options) {
  const bundle = await rollup({
    input: 'src/index.js',
    plugins: [
      svelteStaticHtml(options)
    ]
  })

  await bundle.write({
    file: 'dist/app.js',
    format: 'esm'
  })
}

function readFile(filename) {
  return fs.readFile(filename, 'utf8')
}

afterEach(async () => {
  await fs.remove('dist')
})

test('Basic', async () => {
  await build({
    component: 'src/basic/App.svelte',
    output: 'dist/index.html'
  })

  expect(await fs.pathExists('dist/app.js')).toBe(true)
  expect(await fs.pathExists('dist/index.html')).toBe(true)
  expect(await readFile('dist/index.html')).toBe(await readFile('samples/basic.html'))
})

test('Nested', async () => {
  await build({
    component: 'src/nested/App.svelte',
    output: 'dist/index.html'
  })

  expect(await fs.pathExists('dist/app.js')).toBe(true)
  expect(await fs.pathExists('dist/index.html')).toBe(true)
  expect(await readFile('dist/index.html')).toBe(await readFile('samples/nested.html'))
})

test('Props', async () => {
  await build({
    component: 'src/props/App.svelte',
    output: 'dist/index.html',
    props: { title: 'Rollup' }
  })

  expect(await fs.pathExists('dist/app.js')).toBe(true)
  expect(await fs.pathExists('dist/index.html')).toBe(true)
  expect(await readFile('dist/index.html')).toBe(await readFile('samples/props.html'))
})

test('Template', async () => {
  await build({
    component: 'src/template/App.svelte',
    output: 'dist/index.html',
    props: { title: 'Rollup' },
    template: 'src/template/template.html'
  })

  expect(await fs.pathExists('dist/app.js')).toBe(true)
  expect(await fs.pathExists('dist/index.html')).toBe(true)
  expect(await readFile('dist/index.html')).toBe(await readFile('samples/template.html'))
})
