import { type SchemaTypeDefinition } from 'sanity'
import product from './food'
import chef from './chefs'
import order from './order'
import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, chef, order, user],
}
