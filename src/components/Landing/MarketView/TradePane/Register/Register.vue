<template src="./template.html"></template>

<script>
import EventBus, { EventNames, } from '@/eventBuses/default';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

const loggedInUser = LocalStorage.get(Keys.username);
const mqttKey = LocalStorage.get(Keys.mqtt);

export default {
  name: 'register',
  data() {
    return {
      showLoader: false,
      formData: {
        login: '',
        password: '',
      },
    };
  },
  methods: {
    register() {
      EventBus.$emit(EventNames.userLogin, { username: loggedInUser, mqttKey: mqttKey, });
      this.$showSuccessMsg({
        message: 'Registered Successfully',
      });
    },

  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>
