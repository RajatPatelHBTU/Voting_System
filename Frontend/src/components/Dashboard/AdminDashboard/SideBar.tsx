import { motion } from 'framer-motion';
import { BarChart3, Users, Award, Crown, House} from 'lucide-react';
import LOGO from '../../../assets/logo.png'
const menuItems = [
  {icon : House , label : "Home"},
  { icon: BarChart3, label: 'Vote Distribution' },
  { icon: Users, label: 'Voters Management' },
  { icon: Award, label: 'Parties Management' },
  {icon : Crown, label : 'Show Results'},
];

export default function Sidebar ({setRender} : {setRender : (render : string) => void}) {

    return(
        <div className="h-screen w-64 bg-white border-r border-purple-100 p-4">
      <div className="flex items-center gap-2 mb-8">
        <img src={LOGO} alt="Logo" className='w-10 h-10 rounded-full'/>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ElectCode
        </h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRender(item.label)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
    )
}