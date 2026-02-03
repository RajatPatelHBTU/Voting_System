import { motion } from 'framer-motion';
import { Bell, Settings as SettingsIcon,View ,ShieldCheck  } from 'lucide-react';
import StatsSection from './StatsSection';
import TeamSection from './TeamSection';
import NotificationsPanel from './NotificationPanel';
import MessagePanel from './MessagePanel';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import LOGO from '../../../assets/logo.png'
export default function PartyDash () {
  const token = Cookies.get('token');
    return (
        <div className="min-h-screen bg-white">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b border-purple-100 p-4"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to={`/party/dashboard/${token}`}>
                  <div className="flex items-center space-x-4">
                    <img src={LOGO} alt="Logo" className='w-10 h-10 rounded-full' />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                      ElectCode
                    </h1>
                  </div>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <Bell className="w-6 h-6 text-purple-600" />
                </button>
                <Link to={`/party/dashboard/${token}/settings`}><button className="p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <SettingsIcon className="w-6 h-6 text-purple-600" />
                </button></Link>
                <Link to={`/party/dashboard/${token}/updateProfile`}>
                  <button className='p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer'>
                    <View className='w-6 h-6 text-purple-600'/>
                  </button>
                </Link>
                <Link to={`/party/dashboard/${token}/verify`}>
                  <button className='p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer'>
                    <ShieldCheck  className='w-6 h-6 text-purple-600'/>
                  </button>
                </Link>
              </div>
            </div>
          </motion.header>
    
          {/* Main Content */}
          
          <main className="max-w-7xl mx-auto p-6">
            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-black mb-4'>Party DashBoard</h1>
            <div className="grid grid-cols-12 gap-6">
              {/* Stats Overview */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-12 lg:col-span-8"
              >
                <StatsSection />
              </motion.div>
    
              {/* Team Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="col-span-12 lg:col-span-4"
              >
                <TeamSection />
              </motion.div>
    
              {/* Notifications Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="col-span-12 lg:col-span-6"
              >
                <NotificationsPanel />
              </motion.div>
    
              {/* Message Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="col-span-12 lg:col-span-6"
              >
                <MessagePanel />
              </motion.div>
            </div>
          </main>
        </div>
      );
}