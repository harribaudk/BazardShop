import { useEffect, useMemo, useState } from 'react'
import { ProductModel } from '../models/ProductModel'
import { productService } from '../services/productService'
import { uploadService } from '../services/uploadService'

export const useProductsViewModel = (currentUserId) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await productService.list()
      setProducts(data.map((item) => new ProductModel(item)))
      setError('')
    } catch {
      setError('Impossible de charger les produits.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const createProduct = async (payload, file) => {
    let imageUrl = ''
    if (file) {
      const uploadResponse = await uploadService.uploadFile(file)
      imageUrl = uploadResponse.data.fileUrl
    }
    await productService.create({ ...payload, image_url: imageUrl })
    await fetchProducts()
  }

  const updateProduct = async (id, payload, file) => {
    let imageUrl = payload.image_url || ''
    if (file) {
      const uploadResponse = await uploadService.uploadFile(file)
      imageUrl = uploadResponse.data.fileUrl
    }
    await productService.update(id, { ...payload, image_url: imageUrl })
    await fetchProducts()
  }

  const deleteProduct = async (id) => {
    await productService.remove(id)
    await fetchProducts()
  }

  const myProducts = useMemo(
    () => products.filter((product) => product.createdBy === currentUserId),
    [currentUserId, products]
  )

  return {
    products,
    myProducts,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
