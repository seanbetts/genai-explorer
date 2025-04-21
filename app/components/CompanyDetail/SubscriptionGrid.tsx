'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Subscription } from '../types';
import { textStyles } from '../utils/theme';
import { containerStyles } from '../utils/layout';

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({ subscriptions }) => {
  // No need to calculate max features for height, as CSS Grid auto-rows-fr handles this now


  const gridRef = useRef<HTMLDivElement>(null);
  // Equalize subscription card heights for consistency
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll('.subscription-card')
    ) as HTMLElement[];
    if (cards.length === 0) return;
    const adjustHeights = () => {
      cards.forEach(card => { card.style.height = 'auto'; });
      const maxH = cards.reduce(
        (max, card) => Math.max(max, card.getBoundingClientRect().height),
        0
      );
      cards.forEach(card => { card.style.height = `${maxH}px`; });
    };
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    return () => { window.removeEventListener('resize', adjustHeights); };
  }, [subscriptions]);

  return (
    <div className="w-full flex justify-center">
      <div ref={gridRef} className="flex flex-wrap justify-center gap-6">
      {subscriptions.map(subscription => (
        <div key={subscription.tier} className="flex-shrink-0 mb-6">
          <a
            href={subscription.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`${containerStyles.subscriptionCard} group subscription-card`}
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
        </div>
      ))}
    </div>
    </div>
  );
};

export default SubscriptionGrid;