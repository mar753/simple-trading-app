import { Socket } from 'net'
import Product from '../models/product.model.js'

const store: {
  socketsList: Socket[]
  buyQueue: Product[]
  sellQueue: Product[]
} = {
  socketsList: [],
  buyQueue: [],
  sellQueue: [],
}

export default store
