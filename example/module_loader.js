import WasmLoader from '../dist/wasm-loader';

const loader = new WasmLoader();
loader.load(
  () => import('./hello'),
  () => import('./hello-wasm')
).then(module => {
  console.log('loaded module', module);
  module.hello();
});
