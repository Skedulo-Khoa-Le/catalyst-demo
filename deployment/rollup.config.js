import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'migrationScript/dist/migrationScript/newVendor/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [resolve({
    preferBuiltins: true
  }), commonjs({
    namedExports: {
      'node_modules/lodash/lodash.js': ['mapValues', 'get'],
      'node_modules/lodash/fp.js': ['flatMap'],
    }
  }), json()]
};