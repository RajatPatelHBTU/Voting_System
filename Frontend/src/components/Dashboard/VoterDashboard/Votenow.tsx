import { useEffect, useState, useRef } from 'react';
import { Vote, Users, PartyPopper, Trophy,Circle, X } from 'lucide-react';
import axios from 'axios';

interface Party {
    id: number;
    name: string;
    votes: number;
    color: string;
  }

export default function Votenow () {
    const [ids , setIds] = useState<string[]>([]);
    const COLORS = [
        '#4C51BF', '#6B46C1', '#805AD5', '#B794F4', '#553C9A',
        '#2B6CB0', '#3182CE', '#4299E1', '#63B3ED', '#2C5282',
        '#2C7A7B', '#38B2AC', '#4FD1C5', '#81E6D9', '#234E52',
        '#2F855A', '#38A169', '#48BB78', '#9AE6B4', '#22543D',
        '#9C4221', '#C05621', '#DD6B20', '#ED8936', '#7B341E',
        '#742A2A', '#9B2C2C', '#C53030', '#E53E3E', '#742A2A'
      ];
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    let videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
      useEffect(() => {
            const getPartiesId = async () => {
                try {
                    const response = await axios.get("http://localhost:3000/api/v2/getPartiesId");
                    if(response.data?.partyIds){
                        setIds(response.data.partyIds);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            getPartiesId();
      },[]);
      useEffect(() => {
              if (ids.length === 0) return;
      
          const getPartyData = async () => {
            try {
              const requests = ids.map((party) => getFunction(party));
            const results = await Promise.all(requests);
            const validData = results
              .map((res, index) => ({
                id : res.id,
                name: res.name,
                votes: res.voteCount,
                color: COLORS[index % COLORS.length],
              }));
              setParties(validData);
            } catch (error) {
              console.log(error);
            }
          };
          getPartyData();
          },[ids])
      const getFunction = async (partyId: string) => {
        try {
          const response = await axios.get("http://localhost:3000/api/v3/partyStatus", {
            params: { partyId },
          });
          return response.data;
        } catch (error) {
          console.error(`Error fetching party ${partyId}:`, error);
          return null;
        }
      };
      const startCamera = async (id : number) => {
        setIsOpen(true);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
          setSelectedId(id);
          
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
    
      const stopCamera = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setSelectedId(null)
        setIsOpen(false);
      };
    
      const capturePhoto = async () => {
        setLoading(true);
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
          const image = canvas.toDataURL('image/jpeg');
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          const formData = new FormData();
          formData.append("file", file);
          try {
            const upload = await axios.post("http://localhost:3000/api/v1/upload",formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
            )
            if(upload.status === 200){
              const verify = await axios.post("http://localhost:3000/api/v1/verifyVoter",{
                file : upload.data.fileUrl
              },{
                withCredentials : true
              });
              if(verify.status === 200){
                handleVote(selectedId as number);
              }else{
                alert("Voter not verified. Please try again!");
              }
            }else{
              alert("Internal error. Please try again!")
            }
          } catch (error:any) {
            console.log(error)
            alert(error.response.data.message)
          }finally{
            setLoading(false)
          }
          stopCamera();
          
        }
      };
      const handleVote = async(id: number) => {
            try {
                const isVerified = await axios.get('http://localhost:3000/api/v1/getVoter',
                    {withCredentials:true}
                );
                if(!isVerified){
                    alert("voter is not login")
                }
                const status = isVerified.data.voter.verified;
                if(!status){
                    alert("voter is not verified")
                    return;
                }
                const castVote = await axios.post('http://localhost:3000/api/v3/vote',{
                    partyId : id
                },{
                    withCredentials : true
                });
                if(!castVote){
                    alert("something went wrong");
                    return;
                }
                if(castVote.status === 200){
                    setParties(parties.map(party => 
                        party.id === id ? { ...party, votes: party.votes + 1 } : party
                    ));
                }
                alert("vote cast successfully");
                window.location.reload();
            } catch (error: any) {
              console.log(error);
                alert(`${error.response.data.message}. ${error.response.data.error.reason}`);
            }
        
      };
      const maxVotes = Math.max(...parties.map(party => party.votes));
    if(loading) return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
      return (
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <PartyPopper className="h-8 w-8 text-yellow-500" />
                    Vote Now
              </h1>
              <p className="text-gray-600 text-lg">Cast your vote and make your voice heard!</p>
            </div>
    
            <div className="space-y-6">
              {parties.map((party) => (
                <div
                  key={party.id}
                  className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300` } style={{ backgroundColor: party.color }}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {party.name}
                          {party.votes === maxVotes && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline ml-2" />
                          )}
                        </h3>
                        <p className="text-gray-600">{party.votes} votes</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startCamera(party.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full
                        transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2
                        focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                    >
                      <Vote className="w-5 h-5" />
                      Vote
                    </button>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={` h-2 rounded-full transition-all duration-500 ease-out`}
                      style={{
                        width: `${(party.votes / maxVotes) * 100}%`,
                        backgroundColor: party.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isOpen  && (
                    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-10 backdrop-blur-lg z-50">
                    <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg p-6">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-lg shadow-md w-full scale-x-[-1]"
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <button
                          onClick={capturePhoto}
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                        >
                          <Circle className="text-red-500" size={32} />
                        </button>
                        <button
                          onClick={stopCamera}
                          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer"
                        >
                          <X className="text-gray-700" size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
          )}
        </div>
        
      );
}