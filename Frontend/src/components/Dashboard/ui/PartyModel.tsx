import { X, ScrollText , MapPin, Users, BookText  } from "lucide-react"
import { PartyListProps } from './PartyList'
import { useEffect, useState } from "react";
import axios from "axios";

type PartyModelprops = {
    party : PartyListProps;
    onClose : () => void;
}

export default function PartyModel({ party, onClose }: PartyModelprops) {
      const [manifesto,setManifesto] = useState<string>('');
      const [constitution,setConstitution] = useState<string>('');
        useEffect(() => {
            const fetchPublicUrl = async () => {
              try {
                const requests = await Promise.all(
                  [party.manifesto,party.partyConstitution].map(async (url) => {
                    const response = await axios.post("http://localhost:3000/api/v1/getPublicUrl",{
                      file : url
                    })
                    return response.status === 200 ? response.data.url : url;
                  })
                )
                setManifesto(requests[0])
                setConstitution(requests[1])
              } catch (error) {
                alert("Error fetching public URL")
                console.log(error);
              }
            }
            fetchPublicUrl();
        },[party.manifesto,party.partyConstitution])
        return(
            <div className="fixed inset-0 backdrop-blur-lg bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-purple-800 rounded-lg overflow-hidden shadow-2xl w-full max-w-2xl animate-fade-in">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 bg-purple-900 text-white p-2 rounded-full hover:bg-purple-700 transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {party.partyName} ({party.partyAbbreviation})
          </h2>
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 mr-2 text-purple-400" />
            <span className="font-bold text-white mr-2">Address:</span>
            <span>{party.address}</span>
          </div>
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            <span className="font-bold text-white mr-2">Leader:</span>
            <span>{party.partyLeaderName}</span>
          </div>
          <div className=" mb-2 justify-center">
            
            <span className="font-bold text-white mr-2 flex"> <ScrollText  className="w-5 h-5 mr-2 text-purple-400" /> <a href={manifesto} className="hover:text-blue-500 hover:underline">Manifesto:</a></span>
            <iframe src={manifesto} title="Manifesto" className="w-full h-56"></iframe>
          </div>
          <div className="justify-center mb-2">
            
            <span className="font-bold text-white mr-2 flex"> <BookText  className="w-5 h-5 mr-2 text-purple-400" /> <a href={constitution} className="hover:text-blue-500 hover:underline">Constitution:</a></span>
            <iframe src={constitution} title="constitution" className="w-full h-56"></iframe>
          </div>
        </div>
      </div>
    </div>
        )
}