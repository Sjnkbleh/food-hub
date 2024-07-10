import { createApp } from "vue";
import router from "./router";
import store from "./store";
import "./style.css";
import App from "./App.vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faEye, faEyeSlash, faHeart, faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faFacebookSquare, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUser, faEye, faEyeSlash, faHeart, farHeart, faBars, faMagnifyingGlass, faFacebookSquare, faInstagram, faXTwitter);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).use(store).mount("#app");

