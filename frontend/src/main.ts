import './styles/_main.scss';
import { createApp } from 'vue';
import { App } from '@root/app';
import { router } from '@root/router';
import { createScreen } from '@root/hooks/screen';
import { clickOutside } from '@root/directives/click-outside';
import { WatchTimer } from '@root/utils/timers';

createScreen();
WatchTimer.init();

const app = createApp(App);
app.directive('click-outside', clickOutside);
app.use(router).mount('#app');
