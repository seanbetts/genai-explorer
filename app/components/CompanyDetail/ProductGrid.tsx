'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { textStyles } from '../utils/theme';
import { containerStyles, buttonStyles } from '../utils/layout';
import { getValidImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';
import OptimizedImage from '../utils/OptimizedImage';

// Product image component optimized for SEO and performance
const ProductImage = ({ src, alt, ...props }: {
  src: string;
  alt: string;
  [key: string]: any;
}) => {
  return (
    <OptimizedImage
      {...props}
      src={getValidImageUrl(src)}
      alt={alt}
      quality={80}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 320px"
      loading="lazy"
    />
  );
};


interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // Card heights will be automatically equalized by CSS Grid
  
  // Using the shared utility function from imageUtils.ts
  

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap justify-center gap-6">
        {products.map(product => (
          <div key={product.name} className="flex-shrink-0 w-80 mb-6">
            <div
              className={`${containerStyles.featureCard} ${product.url ? 'group cursor-pointer' : ''}`}
              onClick={product.url ? () => window.open(product.url, '_blank', 'noopener') : undefined}
            >
              <div className={containerStyles.featureImage}>
                <ProductImage
                  src={product.image}
                  alt={`${product.name} - Product from ${product.name}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={containerStyles.featureContent}>
                <div className="flex-1">
                  <h3 className={containerStyles.featureTitle}>{product.name}</h3>
                  <div className="flex-1 min-h-[80px] overflow-auto">
                    <p className={containerStyles.featureDescription}>{product.description}</p>
                  </div>
                </div>
                {product.url && (
                  <div className="absolute bottom-0 right-0 left-0 px-5 pb-4 flex justify-end">
                    <div className={containerStyles.featureLink}>
                      <span>Learn more</span>
                      <i className="bi bi-arrow-right ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;