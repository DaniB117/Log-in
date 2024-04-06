//Esto se usa para import de JSON's cuando se usa 
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)
