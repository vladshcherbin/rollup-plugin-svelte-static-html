<script>
  import Nested from './Nested.svelte'

  export let title
</script>

<section>
  <header>
    <h1>{title}</h1>
  </header>
  <Nested language="JavaScript" />
</section>
