import { useEffect, useState} from 'react';
import { LineChart, Vote } from 'lucide-react';
import axios from 'axios';
type DATA = {
    voterId : string;
    partyId : string;
    partyName : string;
    votes : number;
    color: string;
}


export const ShowResults = () => {
    const [data, setData] = useState<DATA[] | []>([]);
    const [activeParty, setActiveParty] = useState<string | null>(null);
    useEffect(() => {
            const getPartiesData = async () => {
                try {
                    const parties = await axios.get('http://localhost:3000/api/v2/getPartiesData');
                    if(!parties){
                        setData([]);
                        alert("Error in fetching result");
                        return;
                    }
                    if(parties.status === 200){
                        const filterdData = parties.data.parties.map((party : any) => ({
                                partyId : party.partyId,
                                partyName : party.partyName,
                                voterId : party.voterId,
                                votes : 0,
                                color : "purple"
                        }))
                        setData(filterdData);
                    }else{
                        setData([]);
                        alert("Error in fetching result");
                    }
                } catch (error) {
                    setData([]);
                    alert("Error in fetching result")
                }  
            }
            getPartiesData();
    },[])
    useEffect(() => {
        if(data.length === 0) return;
        const fetchVotes = async () => {
            try {
                const votes = await Promise.all(data.map(async (party) => {
                    try {
                        const response = await axios.get('http://localhost:3000/api/v3/partyStatus',{
                            params : {
                                partyId : party.voterId
                            }
                        })
                        return response.status === 200
                    ? { ...party, votes: response.data.voteCount }
                    : { ...party, votes: 0 };
                    } catch (error) {
                        return { ...party, votes: 0 };
                    }
                    
                }))
                setData(votes);
            } catch (error) {
                alert("Error fetching votes");
            }
                
        }
        fetchVotes();
    },[data])
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-900/10 to-purple-600/10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Vote className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
              Election Results 2025
            </h1>
          </div>
          <p className="text-gray-600">Real-time voting statistics and analytics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid gap-6">
          {/* Stats Overview */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/5 to-purple-600/5 rounded-2xl border border-purple-100">
            <div>
              <p className="text-gray-600">Total Votes Cast</p>
              <h2 className="text-4xl font-bold text-purple-600">
                {data.reduce((acc, party) => acc + party.votes, 0).toLocaleString()}
              </h2>
            </div>
            <LineChart className="w-12 h-12 text-purple-400" />
          </div>

          {/* Results Grid */}
          <div className="grid gap-4">
            {data.map((party) => (
              <div
                key={party.partyId}
                className={`relative overflow-hidden p-6 rounded-xl border transition-all duration-300 ${
                  activeParty === party.partyId
                    ? 'border-purple-400 shadow-lg shadow-purple-100'
                    : 'border-gray-100 hover:border-purple-200'
                }`}
                onMouseEnter={() => setActiveParty(party.partyId)}
                onMouseLeave={() => setActiveParty(null)}
              >
                {/* Background Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent transition-opacity duration-300 ${
                    activeParty === party.partyId ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{party.partyName}</h3>
                      <p className="text-gray-500">ID: {party.partyId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        {party.votes.toLocaleString()}
                      </p>
                      <p className="text-gray-500">votes</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                      style={{
                        width: `${(party.votes / Math.max(...data.map(p => p.votes))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}