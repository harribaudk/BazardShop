import { useEffect, useState } from 'react'
import { ProductModel } from '../models/ProductModel'
import { productService } from '../services/productService'

export const useProductDetailViewModel = (productId) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await productService.getById(productId)
        setProduct(new ProductModel(data))
      } catch {
        try {
          const { data } = await productService.list()
          const fallbackProduct = data.find((item) => String(item.id) === String(productId))
          if (!fallbackProduct) {
            setError('Produit introuvable ou indisponible.')
            return
          }
          setProduct(new ProductModel(fallbackProduct))
        } catch {
          setError('Produit introuvable ou indisponible.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  return { product, loading, error }
}
