<template>
  <div class="about">
    <h1>This is an about page</h1>

    <ItemManager/>
  </div>
</template>

<script>
//import TodoManager from "@/components/TodoManager.vue";
import ItemManager from "../components/ItemManager.vue";

export default {
  name: "About",
  components: {
    //TodoManager,
    ItemManager
  }
};
</script>
<style scoped>
</style>
