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

  return (
    <div className={containerStyles.subscriptionGrid}>
      {subscriptions.map(subscription => {
        // Calculate how many empty features we need to add to match the tallest card
        const featuresLength = subscription.features?.length || 0;
        const emptyFeatures = Math.max(0, maxFeatures - featuresLength);
        
        return (
          <div 
            key={subscription.tier}
            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] transform hover:scale-105 ${
              subscription.type === 'enterprise' ? 'border-2 border-gray-200 hover:border-gray-300' : 'border border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-bold ${textStyles.primary}`}>{subscription.tier}</h3>
              <span className={`px-2 py-0.5 bg-gray-100 rounded text-xs ${textStyles.primary}`}>
                {subscription.type === 'enterprise' ? 'Enterprise' : 'Consumer'}
              </span>
            </div>
            
            <div className="mb-3">
              {subscription.price !== null ? (
                <div className={`text-xl font-bold ${textStyles.primary}`}>
                  ${subscription.price}
                  <span className={`text-xs ${textStyles.muted} font-normal`}>/{subscription.billingCycle}</span>
                  {subscription.perUser && <span className={`text-xs ${textStyles.muted} font-normal`}> per user</span>}
                </div>
              ) : (
                <div className={`text-base font-medium ${textStyles.primary}`}>Custom pricing</div>
              )}
            </div>
            
            <ul className="space-y-1.5 text-sm flex-1">
              {subscription.features && subscription.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-1.5 flex-shrink-0">✓</span>
                  <span className={textStyles.secondary}>{feature}</span>
                </li>
              ))}
              
              {/* Add empty features to make all cards the same height */}
              {Array.from({ length: emptyFeatures }).map((_, index) => (
                <li key={`empty-${index}`} className="flex items-start opacity-0 pointer-events-none">
                  <span className="text-green-500 mr-1.5 flex-shrink-0">✓</span>
                  <span className={textStyles.secondary}>Empty space</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionGrid;