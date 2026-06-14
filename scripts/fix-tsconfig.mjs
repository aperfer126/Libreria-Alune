// Nuxt 3.14 + Vite 6: Vite esbuild plugin looks for tsconfig variant files
// (.nuxt/tsconfig.app.json, tsconfig.shared.json, tsconfig.node.json) that Nuxt 3 doesn't generate.
// This script copies the generated tsconfig.json to the expected variant names.
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

const nuxtDir = join(process.cwd(), '.nuxt')
const src = join(nuxtDir, 'tsconfig.json')

if (!existsSync(src)) process.exit(0)

for (const name of ['tsconfig.app.json', 'tsconfig.shared.json', 'tsconfig.node.json']) {
  const dest = join(nuxtDir, name)
  copyFileSync(src, dest)
  console.log(`Created .nuxt/${name}`)
}
