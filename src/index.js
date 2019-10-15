import vm from 'vm'
import fs from 'fs-extra'
import { rollup } from 'rollup'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import posthtml from 'posthtml'
import beautify from 'posthtml-beautify'
import insertAt from 'posthtml-insert-at'

// TODO template, test head
// TODO inline styles
// TODO css, head ?
export default function svelteStaticHtml(options = {}) {
  const {
    component,
    output,
    preprocess,
    props,
    selector = 'body',
    template
  } = options

  if (!component) {
    throw new Error('(plugin svelte-static-html) "component" must be specified')
  }

  if (!output) {
    throw new Error('(plugin svelte-static-html) "output" must be specified')
  }

  return {
    name: 'svelte-static-html',
    async writeBundle() {
      const { generate } = await rollup({
        input: component,
        plugins: [
          resolve(),
          svelte({
            preprocess: preprocess || sveltePreprocess(),
            generate: 'ssr'
          })
        ]
      })
      const bundle = await generate({ format: 'cjs' })
      const { code } = bundle.output.find((chunkOrAsset) => chunkOrAsset.isEntry)
      const { render } = vm.runInNewContext(code, { module })
      const { css, head, html } = render(props)
      const templateHtml = template ? await fs.readFile(template, 'utf8') : html
      const processedHtml = await posthtml([
        ...(template ? [insertAt({ selector, prepend: html })] : []),
        beautify({
          rules: {
            blankLines: false
          }
        })
      ]).process(templateHtml)

      await fs.outputFile(output, processedHtml.html)
    }
  }
}
