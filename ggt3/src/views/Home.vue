<template>
  <div class="home">
    <Grid msg="Tic Tac Toe"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Grid from '@/components/Grid.vue'

export default {
  name: 'Home',
  components: {
    Grid
  }
}
</script>
