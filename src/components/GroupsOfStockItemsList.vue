<template>
  <div class="">
      <ItemsOfGroup :group="item" v-for="item in sortedRootGroups" :key="item.id" @set-active-group="activeGroupUUID=$event" :activeItem="item.UUID == activeGroupUUID" />
  </div>
</template>

<script>
import ItemsOfGroup from './ItemsOfGroup.vue'
export default {
  name: 'GroupsOfStockItemsList',
  components: {
    ItemsOfGroup
  },
  props: {
    rootGroups: null
  },
  data () {
    return {
      activeGroupUUID: null
    }
  },
  computed: {
    sortedRootGroups () {
      var sort = this.rootGroups
      sort.sort( (a, b) => {
        if ( a.Description > b.Description) return 1
        if ( a.Description < b.Description) return -1
        if ( a.Description == b.Description) return 0
      })
      return sort
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
