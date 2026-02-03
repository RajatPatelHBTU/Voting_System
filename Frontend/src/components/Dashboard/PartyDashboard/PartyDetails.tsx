import { motion } from 'framer-motion';
import { CheckCircle, Building2, Phone, Mail, FileText, Scale, User } from 'lucide-react';
import { PartyInfo } from './View';

interface PartyDetailsProps {
    publicUrl : string
    party: PartyInfo;
    onViewDocument: (type: 'manifesto' | 'constitution') => void;
  }

  
export default function PartyDetails ({ publicUrl,party, onViewDocument }: PartyDetailsProps) {
    
    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto p-8"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-purple-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-bold mb-2"
                  >
                    {party.name}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-purple-200"
                  >
                    {party.abbreviation}
                  </motion.p>
                </div>
                {party.isVerified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white text-purple-600 px-4 py-2 rounded-full flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verified
                  </motion.div>
                )}
              </div>
            </div>
    
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-start">
                    <User className="w-6 h-6 text-purple-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Party Leader</h3>
                      <p className="text-gray-600">{party.leaderName}</p>
                    </div>
                  </div>
    
                  <div className="flex items-start">
                    <Building2 className="w-6 h-6 text-purple-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Address</h3>
                      <p className="text-gray-600 flex flex-wrap">{party.address}</p>
                    </div>
                  </div>
    
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-purple-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Contact</h3>
                      <p className="text-gray-600">{party.mobile}</p>
                    </div>
                  </div>
                </motion.div>
    
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-purple-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">{party.email}</p>
                    </div>
                  </div>
    
                  <div className="flex items-start">
                    <Scale className="w-6 h-6 text-purple-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Party Symbol</h3>
                      <img src={publicUrl} alt="PartySymbol" className="w-20 h-20 rounded-full mt-2" />
                    </div>
                  </div>
                </motion.div>
              </div>
    
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid md:grid-cols-2 gap-4"
              >
                <button
                  onClick={() => onViewDocument('manifesto')}
                  className="flex items-center cursor-pointer justify-center px-6 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Manifesto
                </button>
                <button
                  onClick={() => onViewDocument('constitution')}
                  className="flex items-center cursor-pointer justify-center px-6 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Constitution
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      );
}