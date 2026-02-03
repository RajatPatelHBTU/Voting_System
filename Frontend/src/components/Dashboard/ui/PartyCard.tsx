import { useEffect, useState } from 'react';
import {PartyListProps} from './PartyList'
import { MicVocal, MapPin, PersonStanding  } from "lucide-react"
import axios from 'axios';
type partyCardProbs = {
    party : PartyListProps;
    onClick : () => void;
}
export default function PartyCard ({party, onClick} : partyCardProbs) {
    const [publicUrl , setPublicUrl] = useState<string>("");
    useEffect(() => {
            const fetchPublicUrl = async () => {
                try {
                    const response = await axios.post("http://localhost:3000/api/v1/getPublicUrl",{
                        file : party.symbolUrl
                    })
                    if(response.status === 200){
                        setPublicUrl(response.data.url);
                    }else{
                        setPublicUrl(party.symbolUrl);
                    }
                } catch (error) {
                    alert("Backend is down!");
                    setPublicUrl(party.symbolUrl);
                }
            }
            fetchPublicUrl();
    },[party.symbolUrl])
    return (
        <div className= "bg-white text-black rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer p-4" onClick={onClick}>
            <img src={publicUrl ||"/placeholder.svg"}
                        alt={party.partyAbbreviation}
                        className="w-full  h-48 object-fill" />
            <div className='p-6'>
                <h2 className='text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                    {party.partyName};
                </h2>
            </div>
            <div className='flex items-center mb-2'>
                <MicVocal className="w-4 h-4 mr-2 text-purple-400" />
                <span>{party.partyAbbreviation}</span>
            </div>
            <div className='flex items-center mb-2'>
                <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                <span>{party.address}</span>
            </div>
            <div className="flex items-center">
                <PersonStanding className="w-5 h-5 mr-2 text-purple-400" />
                <span>{party.partyLeaderName} attendees</span>
            </div>
        </div>
    )
}