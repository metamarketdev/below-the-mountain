<template>
  <nav class="flex flew-row items-center justify-center mx-auto mt-2">
    <NavLink to="/">Website</NavLink>

    <NavLink to="/app/inventory">Inventory</NavLink>
    <NavLink to="/app/mine">Mine</NavLink>
    <NavLink to="/app/craft">Craft</NavLink>
  </nav>
</template>

<script>
import NavLink from './NavLink.vue';

export default {
  components: {
    NavLink,
  },
};
</script>
