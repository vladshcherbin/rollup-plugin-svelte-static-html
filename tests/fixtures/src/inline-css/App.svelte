<script>
  import Nested from './Nested.svelte'

  export let title
</script>

<style>
  h1 {
    font-size: 4rem;
  }
</style>

<section>
  <header>
    <h1>{title}</h1>
  </header>
  <Nested language="JavaScript" />
</section>
