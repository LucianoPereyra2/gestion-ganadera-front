import { defineStore } from '#q-app/wrappers';
import { createPinia } from 'pinia';

/*
 * Quasar detecta este archivo y registra Pinia en la app.
 */
export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia();
  return pinia;
});
