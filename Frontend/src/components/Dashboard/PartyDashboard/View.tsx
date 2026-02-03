import { useEffect, useState } from 'react';
import PartyDetails from './PartyDetails';
import PDFViewer from './PDFViewer';
import axios from 'axios';

export interface PartyInfo {
    name: string;
    abbreviation: string;
    address: string;
    gender: string;
    leaderName: string;
    partySymbol: string;
    mobile: string;
    email: string;
    manifesto: string;
    constitution: string;
    isVerified: boolean;
  }
export default function View () {
    const[partySymbol,setPartySymbol] = useState<string>("");
    const[manifesto,setManifesto] = useState<string>("");
    const[constitution,setConstitution] = useState<string>("");
    const [party, setParty] = useState<PartyInfo>({
                        name: "",
                        abbreviation: "",
                        address: "",
                        gender: "",
                        leaderName: "",
                        partySymbol: "",
                        mobile: "",
                        email: "",
                        manifesto: "",
                        constitution: "",
                        isVerified: false
    });
    const [viewingDocument, setViewingDocument] = useState<{
        type: 'manifesto' | 'constitution' | null;
        url: string | null;
      }>({ type: null, url: null });
    
      const handleViewDocument = (type: 'manifesto' | 'constitution') => {
        setViewingDocument({
          type,
          url: type === 'manifesto' ? manifesto : constitution
        });
      };
      useEffect(() => {
        const fetchPartyData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v2/partyDetails',{
                    withCredentials : true
                });
                if(response.status === 200){
                  const partyData = response.data.partyDetails;
                    setParty({
                        name: partyData.partyName,
                        abbreviation: partyData.partyAbbreviation,
                        address: partyData.address,
                        gender: partyData.gender,
                        leaderName: partyData.partyLeaderName,
                        partySymbol: partyData.symbolUrl,
                        mobile: partyData.mobile,
                        email: partyData.email,
                        manifesto: partyData.manifesto,
                        constitution: partyData.partyConstitution,
                        isVerified: partyData.verified
                    })
                }else{
                    alert("Party is not login")
                }
            } catch (error) {
                alert("Error in fetching party data");
            }
        }
        fetchPartyData();
      },[])

      useEffect(() => {
        if (!party.partySymbol) return;
        const getPublicUrl = async() => {
          try{
              const publicUrl = await axios.post("http://localhost:3000/api/v1/getPublicUrl",{
                file : party.partySymbol
              })
              const url = publicUrl.data.url
              if(publicUrl.status === 200){
                setPartySymbol(url)
              }
          } catch (error) {
            alert("Backend is down. Please try again later!")
            console.log("error" , error)
          }
        }
        getPublicUrl();
      },[party.partySymbol])
      useEffect(() => {
        if (!party.manifesto) return;
        const getPublicUrl = async() => {
          try{
              const publicUrl = await axios.post("http://localhost:3000/api/v1/getPublicUrl",{
                file : party.manifesto
              })
              const url = publicUrl.data.url
              if(publicUrl.status === 200){
                setManifesto(url)
              }
          } catch (error) {
            alert("Backend is down. Please try again later!")
            console.log("error" , error)
          }
        }
        getPublicUrl();
      },[party.manifesto])
      useEffect(() => {
        if (!party.constitution) return;
        const getPublicUrl = async() => {
          try{
              const publicUrl = await axios.post("http://localhost:3000/api/v1/getPublicUrl",{
                file : party.constitution
              })
              const url = publicUrl.data.url
              if(publicUrl.status === 200){
                setConstitution(url)
              }
          } catch (error) {
            alert("Backend is down. Please try again later!")
            console.log("error" , error)
          }
        }
        getPublicUrl();
      },[party.constitution])

      return (
        <div className="min-h-screen bg-gray-50">
          <PartyDetails 
            publicUrl = {partySymbol}
            party={party} 
            onViewDocument={handleViewDocument}
          />
          
          {viewingDocument.type && viewingDocument.url && (
            <PDFViewer
              url={viewingDocument.url}
              title={viewingDocument.type === 'manifesto' ? 'Party Manifesto' : 'Party Constitution'}
            />
          )}
        </div>
      );
}