import React from 'react';
import { Clock, CheckCircle, Star } from 'lucide-react';
import { User } from '../../types';
import { getBadgeInfo, formatDate } from '../../utils/helpers';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';

interface UserCardProps {
  user: User;
  rank: number;
  className?: string;
}

export default function UserCard({ user, rank, className = '' }: UserCardProps) {
  const badgeInfo = getBadgeInfo(user.badge);
  const BadgeIcon = badgeInfo.icon;
  
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-gray-400 w-8">
              #{rank}
            </div>
            <Avatar initials={user.avatar} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
            <p className="text-gray-600">{user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant={user.badge} className="flex items-center">
            <BadgeIcon className="h-4 w-4 mr-1" />
            {badgeInfo.name}
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{user.contributions}</div>
            <div className="text-sm text-gray-500">Contributions</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{user.verified}</div>
          <div className="text-sm text-gray-500">Verified</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{user.accuracy}%</div>
          <div className="text-sm text-gray-500">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{user.specialties.length}</div>
          <div className="text-sm text-gray-500">Specialties</div>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2 mb-4">
        {user.specialties.map((specialty, index) => (
          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {specialty}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Joined {formatDate(user.joinDate)}
          </div>
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Active Contributor
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">Top Contributor</span>
        </div>
      </div>
    </div>
  );
}