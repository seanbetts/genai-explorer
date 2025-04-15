'use client';

import React, { useMemo } from 'react';
import { Subscription } from '../types';
import { textStyles, containerStyles } from '../utils/styles';

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({ subscriptions }) => {
  // Find the subscription with the most features to determine minimum height
  const maxFeatures = useMemo(() => {
    let max = 0;
    subscriptions.forEach(sub => {
      if (sub.features && sub.features.length > max) {
        max = sub.features.length;
      }
    });
    return max;
  }, [subscriptions]);

  // Set a fixed height for subscription cards
  const cardHeight = 360; // Taller than feature cards to accommodate feature lists

  return (
    <div className={containerStyles.subscriptionGrid}>
      {subscriptions.map(subscription => {
        // Calculate how many empty features we need to add to match the tallest card
        const featuresLength = subscription.features?.length || 0;
        const emptyFeatures = Math.max(0, maxFeatures - featuresLength);
        
        return (
          <a 
            href={subscription.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            key={subscription.tier}
            className={`${containerStyles.subscriptionCard} group`}
            style={{ height: `${cardHeight}px` }}
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
                
                <ul className={containerStyles.subscriptionFeatureList}>
                  {subscription.features && subscription.features.map((feature, index) => (
                    <li key={index} className={containerStyles.subscriptionFeatureItem}>
                      <span className={containerStyles.subscriptionFeatureCheck}>✓</span>
                      <span className={containerStyles.subscriptionFeatureText}>{feature}</span>
                    </li>
                  ))}
                  
                  {/* Add empty features to make all cards the same height */}
                  {Array.from({ length: emptyFeatures }).map((_, index) => (
                    <li key={`empty-${index}`} className={`${containerStyles.subscriptionFeatureItem} opacity-0 pointer-events-none`}>
                      <span className={containerStyles.subscriptionFeatureCheck}>✓</span>
                      <span className={containerStyles.subscriptionFeatureText}>Empty space</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default SubscriptionGrid;