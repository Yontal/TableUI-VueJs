<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import * as types from './store/types'

export default {
  created(){
    this.$store.dispatch(types.PULL_DISHES);
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap');
#app {
  font-family: 'Source Sans Pro', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body{
    background: #F2F2F2;
}
</style>
