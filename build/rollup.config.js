import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import url from '@rollup/plugin-url';
import scss from 'rollup-plugin-scss'
import replace from 'rollup-plugin-replace'

export default {
    input: 'src/index.js', // Path relative to package.json
    output: {
        name: 'Demo',
        exports: 'named',
    },
    plugins: [
        image(),
        url(),
        commonjs(),
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true // Explicitly convert template to render function
        }),
        scss(),

        buble({
            transforms: {
                asyncAwait: false 
            }
        }), // Transpile to ES5
        resolve(),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.VUE_ENV': JSON.stringify('browser')
        })
    ],
};