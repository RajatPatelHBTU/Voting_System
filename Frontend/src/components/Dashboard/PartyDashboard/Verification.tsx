import { useEffect, useState } from 'react';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import axios from 'axios';

type VerificationStatus = 'unverified'| 'verifying' | 'verified' | 'failed';

export default function Verification () {
    const [partyCode, setPartyCode] = useState('');
    const [status, setStatus] = useState<VerificationStatus>('unverified');
    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v2/partyDetails',{
                    withCredentials : true
                })
                if(response.status === 200){
                    if(response.data.partyDetails.verified){
                        setStatus('verified')
                    }else{
                        setStatus('unverified')
                    }
                }else{
                    alert(response.data.message)
                }

            } catch (error) {
                alert("Error in fetching party status. Please try again!")
            }
        }
        checkVerificationStatus()
    },[]);
  const handleVerification = async () => {
    if (!partyCode) return;
    if(status === 'verified'){
        alert('Party already verified');
        return;
    }
    setStatus('verifying');
    // Simulate verification process
    try {
        const verification = await axios.post('http://localhost:3000/api/v2/verifyParty',{
            voterId : partyCode
        });
        if(verification.status === 200){
            setStatus('verified')
        }else{
            setStatus('failed')
        }
    } catch (error) {
        console.log("error", error)
        alert("Error in verifying party. Please try again!")
        setStatus('failed')
    }
  };

  const statusConfig = {
    unverified: {
      icon: Shield,
      text: 'Enter party code to verify',
      color: 'text-gray-600',
    },
    verifying: {
      icon: Shield,
      text: 'Verifying...',
      color: 'text-purple-600',
    },
    verified: {
      icon: ShieldCheck,
      text: 'Party Verified!',
      color: 'text-green-600',
    },
    failed: {
      icon: ShieldX,
      text: 'Verification Failed',
      color: 'text-red-600',
    },
  };

  const { icon: StatusIcon, text, color } = statusConfig[status];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-16 sm:py-24">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 text-center mb-8">
              Party Verification System
            </h1>
            <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Verify your party credentials instantly with our secure verification system
            </p>

            {/* Verification Card */}
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex flex-col items-center gap-6">
                <div className={`p-4 rounded-full bg-purple-50 ${color}`}>
                  <StatusIcon size={32} />
                </div>
                
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="partyCode" className="block text-sm font-medium text-gray-700">
                      Party Code
                    </label>
                    <input
                      type="text"
                      id="partyCode"
                      value={partyCode}
                      onChange={(e) => setPartyCode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your party code"
                      disabled={status === 'verifying'}
                    />
                  </div>

                  <button
                    onClick={handleVerification}
                    disabled={status === 'verifying' || !partyCode}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                      ${status === 'verifying'
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'}
                      disabled:opacity-50`}
                  >
                    {status === 'verifying' ? 'Verifying...' : 'Verify Party'}
                  </button>
                </div>

                <p className={`text-sm font-medium ${color}`}>
                  {text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Instant Verification',
              description: 'Get real-time verification results for your party credentials',
            },
            {
              title: 'Secure System',
              description: 'Advanced security measures to protect your verification process',
            },
            {
              title: '24/7 Availability',
              description: 'Access our verification system anytime, anywhere',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}