import tape from 'tape'
import camelcase from 'camelcase'
import pkg from '../package.json' assert { type: 'json' }

const DEFAULT_LIB = 'src/index.js'
const EXT = 'test.js'

const libName = camelcase(String('/' + pkg.name).split('/').at(-1))

tape(`Running tests for ${libName}`, async t => {
  
  const mainLib = await getLibrary()

  for (const key of Object.keys(mainLib)) {
    try {
      // Import testing library if available.
      const tests = await import(`./src/${key.toLowerCase()}.${EXT}`)
      // Check for instance tests.
      if (typeof tests[key] === 'function') {
        // Run instance tests.
        t.test(`Performing instance tests for ${key}`, t => {
          tests[key](t, mainLib[key])
        })
      }
      // Check for static tests.
      for (const testName of Object.keys(tests)) {
        // Run static tests.
        const testedLib = mainLib[key][testName]
        if (typeof testedLib === 'function') {
          t.test(`Performing tests for ${key}.${testName}:`, t => {
            tests[testName](t, testedLib)
          })
        }
      }
    } catch (err) {
      console.log(`Failed to load tests for ${key}. Skipping ...`)
    }
  }
})

async function getLibrary() {
  if (typeof window !== 'undefined') {
    return window[libName]
  }

  const libpath = (process?.argv && process.argv.length > 2)
    ? process.argv.slice(2,3)
    : DEFAULT_LIB

  if (String(libpath).includes('main')) {
    throw new Error('Unable to run tests on a commonJs module!')
  }

  console.log(`Testing package: ${libpath}`)

  return import('../' + libpath).then(m => {
    return (m.default)
      ? m.default
      : m
  })
}
