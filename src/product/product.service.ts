// product.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDtoDto } from './dto/CreateProductDto.dto';
import { ProductDto } from '../utils/dto/product.dto';
import { Category } from '../category/category.entity';
import { Size } from '../size/size.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { ProductWarehouse } from '../product-warehouse/producto-warehouse.entity';
import { UpdateProductDto } from './dto/UpdateProductDto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Size) private sizeRepository: Repository<Size>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(ProductWarehouse)
    private productWarehouseRepository: Repository<ProductWarehouse>,
  ) { }

  async findAll(): Promise<ProductDto[]> {
    return (
      await this.productRepository.find({
        relations: [
          'category',
          'size',
          'productWarehouses',
          'productWarehouses.warehouse',
        ],
      })
    ).map((product) => product.ToJSON());
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'size',
        'productWarehouses',
        'productWarehouses.warehouse',
      ],
    });

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product.ToJSON();
  }

  async create(productData: CreateProductDtoDto): Promise<ProductDto> {
    try {
      // 1. Validate that the product code doesn't already exist
      const existingProduct = await this.productRepository.findOne({
        where: { code: productData.code },
      });

      if (existingProduct) {
        throw new HttpException(
          'Product with this code already exists',
          HttpStatus.CONFLICT
        );
      }

      // 2. Validate category exists
      const category = await this.categoryRepository.findOne({
        where: { id: productData.categoryId },
      });
      if (!category) {
        throw new HttpException(
          `Category with id ${productData.categoryId} not found`,
          HttpStatus.NOT_FOUND
        );
      }

      // 3. Validate size exists
      const size = await this.sizeRepository.findOne({
        where: { id: productData.sizeId },
      });
      if (!size) {
        throw new HttpException(
          `Size with id ${productData.sizeId} not found`,
          HttpStatus.NOT_FOUND
        );
      }

      // 4. Get unique warehouse IDs and validate locations
      const uniqueWarehouseIds = [...new Set(productData.location.map(loc => loc.warehouseId))];

      // 5. Fetch all warehouses at once
      const warehouses = await this.warehouseRepository.find({
        where: { id: In(uniqueWarehouseIds) },
      });

      if (warehouses.length !== uniqueWarehouseIds.length) {
        const foundIds = warehouses.map(w => w.id);
        const missingIds = uniqueWarehouseIds.filter(id => !foundIds.includes(id));
        throw new HttpException(
          `Warehouses not found: ${missingIds.join(', ')}`,
          HttpStatus.NOT_FOUND
        );
      }

      // 6. Validate locations and warehouse space
      for (const warehouse of warehouses) {
        const locationsInWarehouse = productData.location.filter(
          loc => loc.warehouseId === warehouse.id
        );

        // 6.1 Check for duplicate row/column combinations
        const locationMap = new Map();
        for (const loc of locationsInWarehouse) {
          const key = `${loc.row}-${loc.column}`;
          if (locationMap.has(key)) {
            throw new HttpException(
              `Duplicate location (${loc.row},${loc.column}) in warehouse ${warehouse.id}`,
              HttpStatus.BAD_REQUEST
            );
          }
          locationMap.set(key, true);
        }

        // 6.2 Check warehouse space availability
        const totalNewLocations = locationsInWarehouse.length;
        if (warehouse.spacesUsed + totalNewLocations > warehouse.spaces) {
          throw new HttpException(
            `Warehouse ${warehouse.id} has insufficient space. Available: ${warehouse.spaces - warehouse.spacesUsed}, Required: ${totalNewLocations}`,
            HttpStatus.BAD_REQUEST
          );
        }

        // 6.3 Validate row and column values are positive
        for (const loc of locationsInWarehouse) {
          if (loc.row <= 0 || loc.column <= 0) {
            throw new HttpException(
              `Invalid row or column values for warehouse ${warehouse.id}. Values must be positive`,
              HttpStatus.BAD_REQUEST
            );
          }
          if (loc.quantity <= 0) {
            throw new HttpException(
              `Invalid quantity for location (${loc.row},${loc.column}) in warehouse ${warehouse.id}. Quantity must be positive`,
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }

      // 7. Calculate total stock store from all locations
      const totalStockStore = productData.location.reduce(
        (acc, loc) => acc + loc.quantity,
        0
      );

      // 8. Create and save the new product
      const newProduct = this.productRepository.create({
        name: productData.name,
        code: productData.code,
        price: productData.price,
        category,
        size,
        stockStore: totalStockStore,
        stockInventory: productData.stockInventory
      });

      const savedProduct = await this.productRepository.save(newProduct);

      // 9. Create product warehouse entries and update warehouse spaces
      const productWarehousePromises = [];
      const warehouseUpdatePromises = [];

      for (const location of productData.location) {
        const warehouse = warehouses.find(w => w.id === location.warehouseId);

        // Create product warehouse entry
        const productWarehouse = this.productWarehouseRepository.create({
          product: savedProduct,
          warehouse,
          row: location.row,
          column: location.column,
          quantity: location.quantity
        });
        productWarehousePromises.push(this.productWarehouseRepository.save(productWarehouse));

        // Update warehouse spaces
        warehouse.spacesUsed++;
        warehouseUpdatePromises.push(this.warehouseRepository.save(warehouse));
      }

      // 10. Save all product warehouse entries and warehouse updates
      await Promise.all([
        ...productWarehousePromises,
        ...warehouseUpdatePromises
      ]);

      // 11. Fetch the complete product with all relations
      const completeProduct = await this.productRepository.findOne({
        where: { id: savedProduct.id },
        relations: [
          'category',
          'size',
          'productWarehouses',
          'productWarehouses.warehouse',
        ],
      });

      return completeProduct.ToJSON();
    } catch (error) {
      // If error is already an HttpException, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async update(
    id: number,
    updateData: UpdateProductDto,
  ): Promise<ProductDto> {
    // Buscar el producto existente con sus relaciones
    const existingProduct = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'size',
        'productWarehouses',
        'productWarehouses.warehouse',
      ],
    });

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Validar y actualizar la categoría si se proporciona
    if (updateData.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateData.categoryId },
      });
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      existingProduct.category = category;
    }

    // Validar y actualizar el tamaño si se proporciona
    if (updateData.sizeId) {
      const size = await this.sizeRepository.findOne({
        where: { id: updateData.sizeId },
      });
      if (!size) {
        throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
      }
      existingProduct.size = size;
    }

    // Actualizar los campos básicos del producto
    Object.assign(existingProduct, {
      name: updateData.name !== undefined ? updateData.name : existingProduct.name,
      code: updateData.code !== undefined ? updateData.code : existingProduct.code,
      price: updateData.price !== undefined ? updateData.price : existingProduct.price,
      stockInventory: updateData.stockInventory !== undefined ? updateData.stockInventory : existingProduct.stockInventory,
      stockStore: updateData.stockStore !== undefined ? updateData.stockStore : existingProduct.stockStore,
    });

    // Guardar los cambios
    const updatedProduct = await this.productRepository.save(existingProduct);

    // Buscar el producto actualizado con todas sus relaciones para retornarlo
    const productWithRelations = await this.productRepository.findOne({
      where: { id: updatedProduct.id },
      relations: [
        'category',
        'size',
        'productWarehouses',
        'productWarehouses.warehouse',
      ],
    });

    return productWithRelations.ToJSON();
  }
  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
