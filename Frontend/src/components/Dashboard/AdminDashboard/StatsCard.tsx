import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | undefined;
  icon: typeof LucideIcon;
  trend?: number;
  color?: string;
}


export default function StatsCard ({ title, value, icon: Icon, trend, color = 'purple' }: StatsCardProps) {
    return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{title}</p>
              <h3 className="text-2xl font-bold mt-2">{value}</h3>
              {trend && (
                <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg bg-${color}-100`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
          </div>
        </motion.div>
      );
}