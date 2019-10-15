import vm from 'vm'
import fs from 'fs-extra'
import { rollup } from 'rollup'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import posthtml from 'posthtml'
import beautify from 'posthtml-beautify'
import insertAt from 'posthtml-insert-at'

function formatCss(css) {
  return css.replace('}\n', '}')
}

async function generateHtmlTemplate(template, html, css, inlineCss) {
  if (template) {
    return fs.readFile(template, 'utf8')
  }

  return (inlineCss && css)
    ? `<style>${formatCss(css)}</style>${html}`
    : html
}

export default function svelteStaticHtml(options = {}) {
  const {
    component,
    inlineCss = false,
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
      const entryChunk = bundle.output.find((chunkOrAsset) => chunkOrAsset.isEntry)
      const Component = vm.runInNewContext(entryChunk.code, { module })
      const { css, html } = Component.render(props)
      const htmlTemplate = await generateHtmlTemplate(template, html, css.code, inlineCss)
      const processedHtml = await posthtml([
        template && insertAt({ selector, prepend: html }),
        template && inlineCss && css.code && insertAt({
          selector: 'head',
          append: `<style>${formatCss(css.code)}</style>`
        }),
        beautify({
          rules: {
            blankLines: false
          }
        })
      ].filter(Boolean)).process(htmlTemplate)

      await fs.outputFile(output, processedHtml.html)
    }
  }
}
