
import { useEffect } from 'react';
import VoterLayout from './VoterLayout.tsx';
import VoterMain from './VoterMain.tsx';
import axios from 'axios';
import { useState } from 'react';
import VoterVerification from '../ui/VoterVerification.tsx';
import RegisteredParties from './RegisteredParties.tsx';
import VoterSettings from './VoterSettings.tsx';
import DynamicChart from './DynamicChart.tsx';
import Votenow from './Votenow.tsx';
function VoterDash() {
  const [ render , setRender] = useState<string>("VoterMain")
  const [firstName, setFirstName] = useState<string>("Unknown");
  const [lastName, setLastName] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try {
      const getVoter = async() => {
        const response = await axios.get('http://localhost:3000/api/v1/getVoter', {withCredentials : true});
        if(response.status !== 200){
           alert(response.data.message);
           return;
        }
        setFirstName(response.data.voter.firstName)
        setLastName(response.data.voter.lastName)
        setVerified(response.data.voter.verified)
      }
      getVoter();
    } catch (error) {
      alert(error);
      return;
    }
   setRender("VoterMain");
  },[]);
  const renderComponent = () => {
    switch (render) {
      case "VoterVerification":
        return <VoterVerification setRender={setRender}  />;
      case "VoterMain":
        return <VoterMain verified={verified} firstName={firstName} lastName={lastName} setRender={setRender} />;
      case "Registered Parties":
        return <RegisteredParties />;
      case "Settings" :
        return <VoterSettings/>;
      case "Voting Analytics":
        return <DynamicChart/>;
      case "Vote now" :
        return <Votenow />;
      default:
        return <VoterMain verified={verified} firstName={firstName} lastName={lastName} setRender={setRender} />;
    }
  };
  return (
    <VoterLayout firstName={firstName} lastName={lastName} setRender ={setRender}>
        {renderComponent()}
     </VoterLayout>
  );
}

export default VoterDash;