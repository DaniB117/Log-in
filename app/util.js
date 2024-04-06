import path from 'path'
import { fileURLToPath } from 'url'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

//esto sirve para conseguir el path de donde esta el archivo.