import React from 'react';
import { Vote, Users, Check, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Background from '../assets/Background.mp4'
import { Link } from 'react-router-dom';
const LandingPage = () => {
  return (
    <>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src= {Background}
              type="video/mp4"
            />
          </video>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-20">
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Democracy Goes Digital
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12">
              Secure, transparent, and accessible voting for everyone. 
              Join the future of democratic participation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to={'/admin/auth'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white cursor-pointer text-indigo-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Admin Login
              </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link to='/party/auth'>
            <RegistrationCard 
              title="Party Registration"
              description="Register your political party and manage campaigns efficiently."
              icon={<Users className="w-8 h-8" />}
              type="party"
            /> </Link>
            <Link to='/voter/auth'>
            <RegistrationCard 
              title="Voter Registration"
              description="Quick and secure registration for eligible voters to ensure seamless participation."
              icon={<Vote className="w-8 h-8" />}
              type="voter"
            /> </Link>
          </div>
        </div>

         
      </motion.section>

      <Features />
      <Footer />
    </>
  );
};

const RegistrationCard = ({ title, description, icon, type }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'party' | 'voter';
}) => {
  return (
    
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`
        p-8 rounded-xl backdrop-blur-lg shadow-xl
        ${type === 'party' ? 'bg-white/10' : 'bg-purple-900/20'}
        cursor-pointer transition-all
      `}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-white/10">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-indigo-100">{description}</p>
    </motion.div>
    
  );
};

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-indigo-600" />,
      title: "Secure Voting",
      description: "End-to-end encryption ensures your vote remains confidential and tamper-proof."
    },
    {
      icon: <Check className="w-12 h-12 text-indigo-600" />,
      title: "Easy Verification",
      description: "Verify your vote was counted correctly with our transparent blockchain system."
    },
    {
      icon: <Lock className="w-12 h-12 text-indigo-600" />,
      title: "Identity Protection",
      description: "Advanced security measures protect your personal information and voting privacy."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Digital Voting?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines security, accessibility, and transparency to revolutionize the voting process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-gray-50 text-center"
            >
              <div className="mb-4 inline-block p-3 rounded-full bg-indigo-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Digital Voting</h3>
            <p className="text-gray-400">
              Transforming democracy through secure and accessible digital voting solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Digital Voting Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default LandingPage;