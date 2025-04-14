'use client';

import React from 'react';
import { Subscription } from '../types';

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({ subscriptions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {subscriptions.map(subscription => (
        <div 
          key={subscription.tier}
          className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full ${
            subscription.type === 'enterprise' ? 'border-2 border-purple-200' : 'border border-gray-100'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">{subscription.tier}</h3>
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
              {subscription.type === 'enterprise' ? 'Enterprise' : 'Consumer'}
            </span>
          </div>
          
          <div className="mb-3">
            {subscription.price !== null ? (
              <div className="text-xl font-bold">
                ${subscription.price}
                <span className="text-xs text-gray-500 font-normal">/{subscription.billingCycle}</span>
                {subscription.perUser && <span className="text-xs text-gray-500 font-normal"> per user</span>}
              </div>
            ) : (
              <div className="text-base font-medium">Custom pricing</div>
            )}
          </div>
          
          <ul className="space-y-1.5 text-sm">
            {subscription.features && subscription.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-1.5 flex-shrink-0">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionGrid;