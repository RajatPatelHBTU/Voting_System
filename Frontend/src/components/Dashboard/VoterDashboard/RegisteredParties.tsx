import { useEffect, useState } from "react";
import PartyList, { PartyListProps } from "../ui/PartyList"
import axios from 'axios'
export default function RegisteredParties () {
  const [partyList, setPartyList] = useState<PartyListProps[] | []>([]);
  useEffect(() => {
      const getParties = async () =>{
          try {
            const parties = await axios.get('http://localhost:3000/api/v2/parties');
            setPartyList(parties.data.parties);
          } catch (error) {
            setPartyList([]);
            console.log(error);
          }
      }
      getParties();
  },[])
    return (
        <main className="min-h-screen  text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-black bg-clip-text  ">
        Registered Parties
      </h1>
      <PartyList parties={partyList} />
    </main>
    )
}