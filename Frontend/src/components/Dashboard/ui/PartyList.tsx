import { useState } from "react"
import PartyCard from "./PartyCard"
import PartyModel from './PartyModel'
export type PartyListProps = {
    _id: number
    partyName: string
    partyAbbreviation: string
    address: string
    partyLeaderName: string
    symbolUrl: string
    manifesto : string
    partyConstitution : string
  }
  
export default function PartyList({ parties }: {parties : PartyListProps[]}) {
    const [selectedParty, setSelectedParty] = useState<PartyListProps | null>(null)
    return(
        <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parties.map((party) => (
          <PartyCard key={party._id} party={party} onClick={() => setSelectedParty(party)} />
        ))}
      </div>
      {selectedParty && <PartyModel party={selectedParty} onClose={() => setSelectedParty(null)} />}
    </div>
    )
}