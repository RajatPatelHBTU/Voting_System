import { motion } from 'framer-motion';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const notifications = [
  {
    id: '1',
    title: 'Campaign Update',
    message: 'New campaign strategy document is ready for review',
    type: 'info',
    timestamp: new Date(2024, 2, 15, 14, 30),
  },
  {
    id: '2',
    title: 'Member Milestone',
    message: 'Party membership has reached 25,000!',
    type: 'success',
    timestamp: new Date(2024, 2, 15, 12, 45),
  },
  {
    id: '3',
    title: 'Urgent: Policy Review',
    message: 'Please review updated policy guidelines',
    type: 'warning',
    timestamp: new Date(2024, 2, 15, 10, 15),
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Bell className="w-5 h-5 text-purple-500" />;
  }
};

export default function NotificationPanel () {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <span className="bg-purple-100 text-purple-600 text-sm py-1 px-3 rounded-full">
              {notifications.length} New
            </span>
          </div>
    
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
    
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full mt-6 text-purple-600 border border-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
          >
            View All Notifications
          </motion.button>
        </div>
      );
}