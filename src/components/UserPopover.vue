<template>
  <Menu as="div" class="inline-block text-left" key="test">
    <div>
      <MenuButton
        class="inline-flex items-center justify-center w-full rounded-md px-2 py-1 bg-gray-900 text-sm font-medium text-gray-200 hover:bg-sky-500 hover:bg-opacity-20 focus:outline-none"
      >
        <img
          v-if="$store.state.avatar"
          class="inline-block h-6 w-6 rounded-full mr-2"
          :src="$store.state.avatar"
          alt="Avatar"
        />

        {{ $store.getters.displayAddress }}

        <ChevronDownIcon class="mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      as="div"
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem @click.once="$emit('openAvatarModal')">
            <button
              class="flex flex-row items-center gap-2 text-gray-200 w-full px-4 py-2 text-left text-sm hover:bg-sky-500 hover:bg-opacity-20"
            >
              <UserCircleIcon class="w-6 h6 text-blue-300" />
              Change avatar
            </button>
          </MenuItem>

          <button
            @click="$emit('logOut')"
            class="flex flex-row items-center gap-2 text-gray-200 w-full px-4 py-2 text-left text-sm hover:bg-sky-500 hover:bg-opacity-20"
          >
            <LogoutIcon class="w-6 h6 text-red-400" />

            Sign out
          </button>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/solid';
import { UserCircleIcon, LogoutIcon } from '@heroicons/vue/solid';

export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon,
    UserCircleIcon,
    LogoutIcon,
  },
};
</script>
