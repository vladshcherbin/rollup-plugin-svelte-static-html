# rollup-plugin-svelte-static-html

[![Build Status](https://travis-ci.org/vladshcherbin/rollup-plugin-svelte-static-html.svg?branch=master)](https://travis-ci.org/vladshcherbin/rollup-plugin-svelte-static-html)
[![Codecov](https://codecov.io/gh/vladshcherbin/rollup-plugin-svelte-static-html/branch/master/graph/badge.svg)](https://codecov.io/gh/vladshcherbin/rollup-plugin-svelte-static-html)

Generate static html file from your Svelte component using Rollup.

## Installation

```bash
# yarn
yarn add rollup-plugin-svelte-static-html -D

# npm
npm install rollup-plugin-svelte-static-html -D
```

## Usage

```js
// rollup.config.js
import svelteStaticHtml from 'rollup-plugin-svelte-static-html'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/app.js',
    format: 'iife'
  },
  plugins: [
    svelteStaticHtml({
      component: 'src/App.svelte',
      output: 'dist/index.html',
      template: 'src/assets/template.html'
    })
  ]
}
```

### Configuration

There are some useful options:

#### component

Type: `string`

Path to the component from which html is generated.

```js
svelteStaticHtml({
  component: 'src/App.svelte'
})
```

#### output

Type: `string`

Path for the generated html file.

```js
svelteStaticHtml({
  component: 'src/App.svelte',
  output: 'dist/index.html'
})
```

#### template

Type: `string`

Path to the template to use. When not set, only component html is saved.

```js
svelteStaticHtml({
  component: 'src/App.svelte',
  output: 'dist/index.html',
  template: 'src/assets/template.html'
})
```

#### selector

Type: `string` | Default: `body`

Selector to append generated component html to. Can be a tag, a class or an id. Only used only when *template* is set.

```js
svelteStaticHtml({
  component: 'src/App.svelte',
  output: 'dist/index.html',
  template: 'src/assets/template.html',
  selector: '#widget'
})
```

#### props

Type: `object`

Properties to pass to the component.

```js
svelteStaticHtml({
  component: 'src/App.svelte',
  output: 'dist/index.html',
  props: {
    name: 'Jack'
  }
})
```

#### inlineCss

Type: `boolean` | Default: `false`

Add component css to the top of generated html or append to `head` if *template* is set.

```js
svelteStaticHtml({
  component: 'src/App.svelte',
  output: 'dist/index.html',
  inlineCss: true
})
```

#### preprocess

Type: `array` | `object`

Preprocess the component. By default, [svelte-preprocess](https://github.com/kaisermann/svelte-preprocess) is used in auto mode.

```js
svelteStaticHtml({
  component: 'src/App.svelte',
  output: 'dist/index.html',
  preprocess: [
    scss(),
    pug()
  ]
})
```

## License

MIT
