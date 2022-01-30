<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="div" :show="open" :appear="true">
    <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="$emit('close')">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          :appear="true"
          as="div"
          enter="ease-out duration-200"
          enter-from="opacity-50"
          leave="ease-in duration-200"
          leave-to="opacity-50"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-800 opacity-70 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <TransitionChild
          :appear="true"
          as="div"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="min-w-4 max-w-2xl min-w-md inline-block align-bottom bg-gray-900 rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          >
            <button @click="$emit('close')" class="absolute top-2 right-2">
              <XIcon class="h-4 w-4 text-gray-400 hover:text-gray-500 p2" />
            </button>

            <div>
              <!-- <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div> -->
              <div class="text-gray-200 mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-2xl leading-6 font-medium text-gray-200">
                  <slot name="title"></slot>
                </DialogTitle>

                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <slot name="description"></slot>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-sm text-gray-300 my-6 text-center">
              <slot />
            </div>

            <div class="flex flex-row items-center justify-center gap-3">
              <slot name="buttons"></slot>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { XIcon } from '@heroicons/vue/solid';
import { CheckIcon } from '@heroicons/vue/outline';

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon,
    CheckIcon,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
