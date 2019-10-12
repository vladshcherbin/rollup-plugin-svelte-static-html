import vm from 'vm'
import fs from 'fs-extra'
import rollup from 'rollup'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

// TODO check node version for vm
// TODO pass preprocess options
// TODO add possibility to pass custom preprocess function / array?
// TODO template, test head
// TODO inline styles
// TODO no template
// TODO template is required?
// TODO move error in hook?
// TODO css, head ?
export default function svelteStaticHtml(options = {}) {
  const { component, output } = options

  if (!output) {
    throw new Error('You must specify "output"')
  }

  return {
    name: 'svelte-static-html',
    writeBundle: async () => {
      const { generate } = await rollup.rollup({
        input: component,
        plugins: [
          resolve(),
          svelte({
            preprocess: sveltePreprocess(),
            generate: 'ssr'
          })
        ]
      })
      const bundle = await generate({ format: 'cjs' })
      const { code } = bundle.output.find((chunkOrAsset) => chunkOrAsset.isEntry)
      const { render } = vm.runInNewContext(code, { module })
      const { css, head, html } = render()

      await fs.outputFile(output, html)
    }
  }
}
