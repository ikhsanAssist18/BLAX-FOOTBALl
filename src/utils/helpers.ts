import { BadgeInfo } from '../types';
import { Crown, Trophy, Medal, Award, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'safe':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'moderate':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel) {
    case 'safe':
      return CheckCircle;
    case 'moderate':
      return AlertTriangle;
    case 'high':
      return Shield;
    default:
      return Shield;
  }
};

export const getBadgeInfo = (badge: string): BadgeInfo => {
  switch (badge) {
    case 'diamond':
      return {
        color: 'from-cyan-400 to-blue-500',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-900',
        icon: Crown,
        name: 'Diamond'
      };
    case 'gold':
      return {
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-900',
        icon: Trophy,
        name: 'Gold'
      };
    case 'silver':
      return {
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-900',
        icon: Medal,
        name: 'Silver'
      };
    case 'bronze':
      return {
        color: 'from-orange-400 to-red-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-900',
        icon: Award,
        name: 'Bronze'
      };
    default:
      return {
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-900',
        icon: Award,
        name: 'Bronze'
      };
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};