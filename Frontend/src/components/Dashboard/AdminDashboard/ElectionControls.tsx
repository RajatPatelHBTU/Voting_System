import { motion } from 'framer-motion';
import { Play, Square, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function ElectionControls () {
    const [loading, setLoading] = useState<boolean>(false);
    const [isVisible,setIsVisible] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [active, setActive] = useState<boolean>(false);
    const handleStartElection = async() => {
      setLoading(true);
        try {
            
            const startElection = await axios.post('http://localhost:3000/api/v3/startElection',{
              duration : duration
            });
            if(startElection.status === 200){
              alert(startElection.data.message);
              setActive(true);
            }else(
              alert(startElection.data.message)
            )
        } catch{
            alert("Error in starting election");
        } finally{
          setLoading(false);
        }
    }
    const handleEndElection = async() => {
      setLoading(true);
      try {
        
          const endElection = await axios.post('http://localhost:3000/api/v3/endElection');
          if(endElection.status === 200){
            alert(endElection.data.message);
            setActive(false);
          }else(
            alert(endElection.data.message)
          )
      } catch{
        alert("Error in ending election");
      }finally{
        setLoading(false)
      }
    }
    const handleResetElection = async() => {
      setLoading(true);
        try {
            const resetElection = await axios.post('http://localhost:3000/api/v4/resetElection');
            if(resetElection.status === 200){
              alert(resetElection.data.message);
              setActive(false);
            }else(
              alert(resetElection.data.message)
            )
        } catch{
            alert("Error in resetting election");
        }finally{
          setLoading(false)
        }
    }
    const handleSubmit = async() => {
      setIsVisible(false);
      await handleStartElection();
      
    }
  return (
    <div className="flex gap-4 relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={() => active ? handleEndElection() : setIsVisible(true)}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
          active
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
          
        {active ? (
          <>
            <Square className="w-5 h-5" />
            End Election
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start Election
          </>
        )}
      </motion.button>
      {isVisible && (
            <div className="absolute top-10 right-[20vw] bg-blue-50 shadow-md p-3 rounded w-[50vw] h-[50vh] flex flex-col items-center justify-center gap-12 z-10">
              <label htmlFor="duration" className="text-black text-2xl font-bold">Enter Duration</label>
              <input
                id="duration"
                type="number"
                placeholder="Enter duration"
                className="border-b-black text-black p-2 w-full"
                onChange={(e) => setDuration(Number(e.target.value))}
              />
              <div className='flex items-center justify-center gap-10'>
              <button
                onClick={handleSubmit}
                className="border rounded bg-blue-300 p-1 cursor-pointer text-black"
              >
                Submit
              </button>
              <button onClick={() =>setIsVisible(false)} className="border rounded bg-red-300 p-1 cursor-pointer text-black">Cancel</button>
              </div>
              
            </div>
          )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={handleResetElection}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </motion.button>
    </div>
  );
}