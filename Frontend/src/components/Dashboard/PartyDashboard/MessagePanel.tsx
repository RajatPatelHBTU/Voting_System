import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip } from 'lucide-react';

export default function MessagePanel () {
    const [message, setMessage] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Message Center</h2>

      <div className="h-[300px] overflow-y-auto mb-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 rounded-lg p-4 ml-auto max-w-[80%]"
        >
          <p className="text-sm">Latest campaign updates have been posted. Please review and provide feedback.</p>
          <span className="text-xs text-gray-500 mt-2 block">10:30 AM</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-100 rounded-lg p-4 max-w-[80%]"
        >
          <p className="text-sm">Thank you for the update. I'll review it right away.</p>
          <span className="text-xs text-gray-500 mt-2 block">10:32 AM</span>
        </motion.div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}