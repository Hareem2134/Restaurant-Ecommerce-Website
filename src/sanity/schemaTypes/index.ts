import { type SchemaTypeDefinition } from 'sanity'
import food from './foods'
import chef from './chefs'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [food, chef],
}
