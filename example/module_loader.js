import WasmLoader from '../dist/wasm-loader';

const loader = new WasmLoader();
loader.load(
  () => import('./hello-wasm'),
  () => import('./hello')
).then(module => {
  console.log('loaded module', module);
  module.hello();
});
