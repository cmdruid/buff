import commonjs    from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser      from '@rollup/plugin-terser'
import typescript  from '@rollup/plugin-typescript'

const treeshake = {
	moduleSideEffects       : false,
	propertyReadSideEffects : false,
	tryCatchDeoptimization  : false
}

const onwarn = (warning) => {
  if (
    warning.code === 'INVALID_ANNOTATION' && 
    warning.message.includes('@__PURE__')
  ) {
    return
  }

  throw new Error(warning)
}

export default {
  input: 'src/index.ts',
//  onwarn,
  output: [
    {
      file: 'dist/main.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/module.mjs',
      format: 'es',
      sourcemap: true,
      minifyInternalExports: false
    },
    {
      file: 'dist/browser.js',
      format: 'iife',
      name: 'buff',
      plugins: [terser()],
      sourcemap: true,
      globals: {
        crypto : 'crypto',
      }
    }
  ],
  plugins: [ typescript(), nodeResolve(), commonjs() ],
  strictDeprecations: true,
  treeshake
}
