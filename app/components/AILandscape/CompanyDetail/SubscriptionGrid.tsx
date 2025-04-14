'use client';

import React from 'react';
import { Subscription } from '../types';
import { textStyles, containerStyles } from '../utils/styles';

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({ subscriptions }) => {
  return (
    <div className={containerStyles.grid4col}>
      {subscriptions.map(subscription => (
        <div 
          key={subscription.tier}
          className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full ${
            subscription.type === 'enterprise' ? 'border-2 border-purple-200' : 'border border-gray-100'
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
          
          <ul className="space-y-1.5 text-sm">
            {subscription.features && subscription.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-1.5 flex-shrink-0">✓</span>
                <span className={textStyles.secondary}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionGrid;