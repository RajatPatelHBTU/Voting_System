import { motion } from 'framer-motion';
import { Ban, CheckCircle } from 'lucide-react';
import { useElectionStore } from '../AdminStore/store';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Voter = {
  _id: string;
  voterId : string;
  firstName: string;
  lastName : string
  isBlocked : boolean;
  verified : boolean;
  hasVoted : boolean;
}
export const VotersList = () => {
const [voterList, setVoterList] = useState<Voter[]>([]);
const {toggleVoterBlock } = useElectionStore();
  useEffect(() => {
    const voterList = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/getVoters');
        if(response.status === 200 ){
          setVoterList(response.data.voters);
        }else{
          setVoterList([]);
        }
      } catch (error) {
        alert("Something went wrong. Please try again!");
        setVoterList([]);
      }
    }
    voterList();
  },[])
  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const updatedVoters = await Promise.all(
          voterList.map(async (voter) => {
            try {
              const response = await axios.get("http://localhost:3000/api/v3/getVoterStatus", {
                params: { voterId: voter.voterId },
              });
              return response.status === 200
                ? { ...voter, hasVoted: response.data.hasVoted }
                : { ...voter, hasVoted: false };
            } catch {
              return { ...voter, hasVoted: false };
            }
          })
        );
        setVoterList(updatedVoters);
      } catch (error) {
        console.error("Error fetching voter status:", error);
      }
    };

    if (voterList.length > 0) {
      fetchVotingStatus();
    }
  }, []);

  const handleBlocked = async (voterId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to block this voter?");
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/v1/toggleBlock', {
        voterId: voterId,
      });
  
      if (response.status !== 200) {
        alert("Failed to block voter. Please try again.");
        return;
      }
  
      const response2 = await axios.post('http://localhost:3000/api/v3/blockVoter', {
        voterId: voterId,
      });
  
      if (response2.status !== 200) {
        await axios.post('http://localhost:3000/api/v1/toggleBlock', {
          voterId: voterId,
        });
  
        alert("Failed to update block status in external system. Changes have been reverted.");
        return;
      }
      alert("Voter blocked successfully!");
      window.location.reload();
  
    } catch (error) {
      console.error("Error handling voter block:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  const handleUnblocked = async (voterId : string) =>{
    const isConfirmed = window.confirm("Are you sure you want to unblock this voter?");
    if (!isConfirmed) {
      return;
    }
      try {
        const response = await axios.post('http://localhost:3000/api/v1/toggleBlock', {
          voterId: voterId,
        });
    
        if (response.status !== 200) {
          alert("Failed to unblock voter. Please try again.");
          return;
        }
        const response2 = await axios.post('http://localhost:3000/api/v3/unblockVoter', {
          voterId: voterId,
        });
    
        if (response2.status !== 200) {
          await axios.post('http://localhost:3000/api/v1/toggleBlock', {
            voterId: voterId,
          });
          alert("Failed to update block status in external system. Changes have been reverted.");
        return;
        }
        alert("Voter blocked successfully!");
      window.location.reload();
      } catch (error) {
        console.error("Error handling voter block:", error);
      alert("Something went wrong. Please try again.");
      }
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-y-scroll">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Voters Management</h2>
      </div>
      <div className="divide-y divide-gray-100 ">
        {voterList.map((voter) => (
          <motion.div
            key={voter._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${voter.verified ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="font-medium">{voter.firstName} {voter.lastName}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${voter.hasVoted ? 'text-green-500' : 'text-red-500'}`}>
                {voter.hasVoted ? 'Voted' : 'Not Voted'}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleVoterBlock(voter._id)}
                className={`p-2 rounded-lg ${
                  voter.isBlocked
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {voter.isBlocked ? <div className='relative group' onClick={() => handleUnblocked(voter.voterId)}>
              <Ban className="w-5 h-5 cursor-pointer text-red-500" />
              <span className="absolute right-2  bottom-5 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Banned
              </span>
              </div> : <div className='relative group' onClick={() => handleBlocked(voter.voterId)}>
              <CheckCircle className="w-5 h-5 cursor-pointer  text-green-500" />
              <span className="absolute right-2  bottom-5 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Allowed
              </span>
              </div>}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}