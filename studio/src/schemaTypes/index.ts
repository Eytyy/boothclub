import {singletons} from './singletons'
import {documents} from './documents'
import {objects} from './objects'
import {blocks} from './blocks'

export const schemaTypes = [...singletons, ...documents, ...objects, ...blocks]
