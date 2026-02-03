
import { Users,TrendingUp } from 'lucide-react';
import Sidebar from './SideBar';
import ElectionControls from './ElectionControls';
import StatsCard from './StatsCard';
import { VotersList } from './VotersList';
import { ElectionChart } from './ElectionChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PartiesList } from './PartiesList';
import { ShowResults } from './ShowResults';

export interface Party {
    id: string;
    name: string;
    votes: number;
    color: string;
  }
  
  export interface Voter {
    id: string;
    name: string;
    isBlocked: boolean;
    hasVoted: boolean;
  }
  
export interface ElectionState {
    isActive: boolean;
    totalVoters: number;
    parties: Party[];
    voters: Voter[];
    startElection: () => void;
    endElection: () => void;
    resetElection: () => void;
    removeParty: (id: string) => void;
    toggleVoterBlock: (id: string) => void;
  }

export default function AdminDash () {
    const[totalVoters, setTotalVoters] = useState<number>();
    const [totalVotes, setTotalVotes] = useState<number>();
    const [blockedVoters,setBlockedVoters] = useState<number>();
    const [render, setRender] = useState<string>("Home")

    useEffect(() => {
      const getTotalVoters = async () => {
        try {
          const totalVoters = await axios.get('http://localhost:3000/api/v3/totalVoters');
          if(totalVoters.status === 200){
              setTotalVoters(totalVoters.data.totalVoters);
          }else{
            setTotalVoters(0.0);
          }
        } catch (error) {
          setTotalVoters(0.0);
          alert("Error fetching total voters");
        }
      }
      const getTotalVotes = async () => {
        try {
          const totalVotes = await axios.get('http://localhost:3000/api/v3/totalVotes');
          if(totalVotes.status === 200){
            setTotalVotes(totalVotes.data.totalVotes);
          }else{
            setTotalVotes(0.0);
          }
        } catch (error) {
          setTotalVotes(0.0);
          alert("Error fetching total votes");
        }
      }
      const getBlockedVoters = async () => {
        try {
            const blockedVoters = await axios.get('http://localhost:3000/api/v1/getBlockedVoters');
            if(blockedVoters.status === 200){
              setBlockedVoters(blockedVoters.data.blockedVoters.length);
            }else{
              setBlockedVoters(0.0);
            }
        } catch (error) {
           setBlockedVoters(0.0);
           alert("Error fetching blocked voters")
        }
      }
      getTotalVoters();
      getTotalVotes();
      getBlockedVoters();
    },[]);
    const handleRendering = (render : string) => {
        switch (render) {
            case "Home" :
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ElectionChart />
                        <VotersList />
                    </div>
                )
            case "Voters Management" :
                return <VotersList />
            case "Vote Distribution" : 
                return <ElectionChart />
            case "Parties Management" : 
                return <PartiesList />
            case "Show Results" :
                return <ShowResults />
            default : 
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ElectionChart />
                        <VotersList />
                        <PartiesList />
                    </div>
                )
        }
    }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setRender={setRender} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Election Dashboard</h1>
            <ElectionControls />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Voters"
              value={totalVoters}
              icon={Users}
            />
            <StatsCard
              title="Active Voters"
              value={(totalVoters as number) - (blockedVoters as number)}
              icon={Users}
              trend={(((totalVoters as number) - (blockedVoters as number))/(totalVoters as number)) * 100}
            />
            <StatsCard
              title="Total Votes"
              value={totalVotes}
              icon={TrendingUp}
            />
          </div>

          {handleRendering(render)}
        </div>
        <br />
        <br />
        <footer>
        <div className="grid md:grid-cols-3 gap-8">
         
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Digital Voting Platform. All rights reserved.</p>
        </div>
  
      </footer>
      </main>
      
    </div>
  );
}