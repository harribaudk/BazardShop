export class ProductModel {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.price = data.price
    this.imageUrl = data.image_url
    this.sellerName = data.seller_name
    this.createdBy = data.created_by
  }
}
