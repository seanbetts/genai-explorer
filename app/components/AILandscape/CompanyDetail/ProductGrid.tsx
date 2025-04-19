'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { textStyles, containerStyles, buttonStyles } from '../utils/styles';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // Set a fixed height that's tall enough for product cards
  const cardHeight = 320; // Increased height to ensure consistent sizing
  
  return (
    <div className={containerStyles.featureGrid}>
      {products.map(product => (
        <a 
          key={product.name}
          href={product.url}
          target="_blank"
          rel="noopener"
          className={`${containerStyles.featureCard} group`}
          style={{ height: `${cardHeight}px` }}
        >
          <div className={containerStyles.featureImage}>
            <Image 
              src={product.image && product.image.startsWith("/") ? product.image : "/images/companies/placeholder.png"} 
              alt={product.name}
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
            {/* Absolute positioning ensures consistent footer placement */}
            <div className="absolute bottom-0 right-0 left-0 px-5 pb-4 flex justify-end">
              <div className={containerStyles.featureLink}>
                <span>Learn more</span>
                <i className="bi bi-arrow-right ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ProductGrid;