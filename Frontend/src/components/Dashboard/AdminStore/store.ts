import { create } from 'zustand';
import { ElectionState } from '../AdminDashboard/AdminDash'


export const useElectionStore = create<ElectionState>((set) => ({
  isActive: false,
  totalVoters: 1000,
  parties: [
    { id: '1', name: 'Progressive Party', votes: 350, color: '#8B5CF6' },
    { id: '2', name: 'Democratic Alliance', votes: 280, color: '#EC4899' },
    { id: '3', name: 'Future Coalition', votes: 220, color: '#3B82F6' },
  ],
  voters: Array.from({ length: 10 }, (_, i) => ({
    id: `v${i}`,
    name: `Voter ${i + 1}`,
    isBlocked: false,
    hasVoted: Math.random() > 0.5,
  })),
  startElection: () => set({ isActive: true }),
  endElection: () => set({ isActive: false }),
  resetElection: () => set((state) => ({
    isActive: false,
    parties: state.parties.map(party => ({ ...party, votes: 0 })),
    voters: state.voters.map(voter => ({ ...voter, hasVoted: false })),
  })),
  removeParty: (id) => set((state) => ({
    parties: state.parties.filter(party => party.id !== id),
  })),
  toggleVoterBlock: (id) => set((state) => ({
    voters: state.voters.map(voter =>
      voter.id === id ? { ...voter, isBlocked: !voter.isBlocked } : voter
    ),
  })),
}));