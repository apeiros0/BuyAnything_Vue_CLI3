<template>
  <div class="message-alert">
    <transition-group name="message-alert">
      <div
        class="alert alert-dismissible"
        :class="'alert-' + item.status"
        v-for="(item, i) in messages"
        :key="i+1"
      >
        <div class="py-1">{{ item.message }}</div>
        <button type="button" class="close" @click="removeMessage(i)" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {};
  },
  methods: {
    updateMessage(message, status) {
      this.$store.dispatch('updateMessage', { message, status });
    },
    removeMessage(num) {
      this.$store.dispatch('removeMessage', num);
    },
    removeMessageWithTiming(timestamp) {
      this.$store.dispatch('removeMessageWithTiming', timestamp);
    }
  },
  computed: {
    ...mapGetters(['messages'])
  }
};
</script>

<style scope>
.message-alert {
  position: fixed;
  top: 56px;
  right: 20px;
  z-index: 1100;
}

.message-alert-enter-active,
.message-alert-leave-active {
  transition: all .3s ease;
}

.message-alert-enter, .message-alert-leave-to {
  /* opacity: 0; */
  transform: translateX(200%);
}
</style>
