import { 
  BarChart, 
  Calendar, 
  CheckCircle,
  TrendingUp,
  CircleX
} from 'lucide-react';
import DynamicChart from './DynamicChart';
import Broadcasting from './Broadcasting';
export default function VoterMain({verified, firstName, lastName, setRender} : {verified : boolean, firstName : string, lastName : string , setRender : (render : string) => void}) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {firstName} {lastName}!</h1>
        <p className="text-gray-600 mt-2">
          Stay informed about upcoming elections and track your voting activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-medium">Next Election</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Mar 15, 2024</h3>
            </div>
            <Calendar className="w-8 h-8 text-purple-700" />
          </div>
        </div>
        {verified ? 
        <button onClick={() => {setRender("VoterVerification")}}>
        <div className="bg-green-50 rounded-lg p-6 cursor-pointer hover:shadow">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Voter ID Status</p>
              <div className="flex items-center mt-1 space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-xl font-bold text-gray-800">Verified</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-700 font-bold">✓</span>
            </div>
          </div>
        </div>
      </button>
         : 
        <button onClick={() => {setRender("VoterVerification")}}>
        <div className="bg-orange-50 rounded-lg p-6 cursor-pointer hover:shadow">
          
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium">Voter ID Status</p>
                <div className="flex items-center mt-1 space-x-2">
                  <CircleX className="w-5 h-5 text-orange-700" />
                  <span className="text-xl font-bold text-gray-800">Unverified</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <span className=" font-bold">❌</span>
              </div>
            </div>
          </div>
        </button>
        
        }

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Voter Turnout</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">67.5%</h3>
            </div>
            <BarChart className="w-8 h-8 text-blue-700" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 font-medium">Active Polls</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">3 Ongoing</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-700" />
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming Elections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        
        <DynamicChart/>
        <Broadcasting/>
      </div>
    </div>
  );
}