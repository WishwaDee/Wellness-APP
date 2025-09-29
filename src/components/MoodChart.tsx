import React from 'react';
import { MoodEntry } from '../types';

interface MoodChartProps {
  entries: MoodEntry[];
}

const MoodChart: React.FC<MoodChartProps> = ({ entries }) => {
  const maxRating = 5;
  const chartHeight = 200;
  const chartPadding = 20;

  if (entries.length === 0) {
    return <div className="text-gray-500 text-center py-8">No mood data available</div>;
  }

  const getPointPosition = (index: number, rating: number) => {
    const x = (index / Math.max(entries.length - 1, 1)) * 100;
    const y = ((maxRating - rating) / maxRating) * 100;
    return { x, y };
  };

  const pathData = entries.map((entry, index) => {
    const { x, y } = getPointPosition(index, entry.rating);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const getMoodColor = (rating: number) => {
    if (rating <= 1.5) return '#EF4444';
    if (rating <= 2.5) return '#F97316';
    if (rating <= 3.5) return '#EAB308';
    if (rating <= 4.5) return '#10B981';
    return '#8B5CF6';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full">
      <div className="relative" style={{ height: chartHeight }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 100 100`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((rating) => {
            const y = ((maxRating - rating) / maxRating) * 100;
            return (
              <line
                key={rating}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#F3F4F6"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Area fill */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#moodGradient)"
            opacity="0.1"
          />

          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {entries.map((entry, index) => {
            const { x, y } = getPointPosition(index, entry.rating);
            return (
              <g key={entry.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill={getMoodColor(entry.rating)}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-4 transition-all"
                />
                <title>{`${entry.moodLabel} (${entry.rating}/5) - ${formatDate(entry.date)}`}</title>
              </g>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <span>{rating}</span>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {entries.map((entry, index) => {
          if (entries.length <= 4 || index === 0 || index === entries.length - 1) {
            return (
              <span key={entry.id} className="text-center">
                {formatDate(entry.date)}
              </span>
            );
          }
          return <span key={entry.id} />;
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Very Sad</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600">Sad</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Happy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600">Very Happy</span>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;