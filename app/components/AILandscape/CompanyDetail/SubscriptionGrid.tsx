'use client';

import React, { useMemo } from 'react';
import { Subscription } from '../types';
import { textStyles } from '../utils/theme';
import { containerStyles } from '../utils/layout';

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({ subscriptions }) => {
  // No need to calculate max features for height, as CSS Grid auto-rows-fr handles this now

  // Calculate grid layout based on number of items
  const itemCount = subscriptions.length;
  
  // For 1 item: single column at all screen sizes
  // For 2 items: single column on mobile, 2 columns on larger screens
  // For 3+ items: responsive grid with max 3 columns
  const gridCols = itemCount === 1 ? 'grid-cols-1' : 
                  itemCount === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  
  // Control max width based on number of items
  // This ensures the grid doesn't stretch too wide with few items
  const maxWidthClass = itemCount === 1 ? 'max-w-md' : 
                      itemCount === 2 ? 'max-w-2xl' : 
                      'max-w-6xl';
                      
  // We use a consistent gap for all layouts
  const gapClass = 'gap-6';

  return (
    <div className="w-full flex justify-center">
      <div className={`${gridCols} ${gapClass} auto-rows-fr grid ${maxWidthClass} w-full`}>
      {subscriptions.map(subscription => {
        // No need to add empty features for height matching, as CSS Grid auto-rows-fr handles this now
        
        return (
          <a 
            href={subscription.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            key={subscription.tier}
            className={`${containerStyles.subscriptionCard} group h-full`}
          >
            <div className={containerStyles.subscriptionHeader}>
              <div className="flex justify-between items-center">
                <h3 className={containerStyles.subscriptionTier}>{subscription.tier}</h3>
                <span className={containerStyles.subscriptionType}>
                  {subscription.type === 'enterprise' ? 'Enterprise' : 'Consumer'}
                </span>
              </div>
            </div>
            
            <div className={containerStyles.subscriptionContent}>
              <div className="flex-1">
                {subscription.price !== null ? (
                  <div className={containerStyles.subscriptionPrice}>
                    ${subscription.price}
                    <span className={containerStyles.subscriptionPriceUnit}>/{subscription.billingCycle}</span>
                    {subscription.perUser && <span className={containerStyles.subscriptionPriceUnit}> per user</span>}
                  </div>
                ) : (
                  <div className={containerStyles.subscriptionPrice}>Custom pricing</div>
                )}
                
                <ul className={`${containerStyles.subscriptionFeatureList} mb-3`}>
                  {subscription.features && subscription.features.map((feature, index) => (
                    <li key={index} className={containerStyles.subscriptionFeatureItem}>
                      <span className={containerStyles.subscriptionFeatureCheck}>✓</span>
                      <span className={containerStyles.subscriptionFeatureText}>{feature}</span>
                    </li>
                  ))}
                  
                  {/* No longer need empty features - grid handles equal heights */}
                </ul>
              </div>
            </div>
          </a>
        );
      })}
    </div>
    </div>
  );
};

export default SubscriptionGrid;