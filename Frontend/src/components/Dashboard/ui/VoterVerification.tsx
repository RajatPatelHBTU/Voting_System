import axios from "axios"
import { useEffect, useState } from "react"
import DetailItem from "./DetailItem";
import { Skelaton } from "./Skelaton";
export default function VoterVerification({setRender} : {setRender : (render : string) => void}) {
  const [loading, setLoading] = useState(false);
    const [voter, setVoter] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        gender: "",
        idType: "",
        documentNumber: "",
        mobile: "",
        email: "",
        username: "",
        voterId: "",
        selfie: "",
        documentUrl: ""
      });
      const getUrl = async (file: string) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/getPublicUrl",
            { file }
          );
          return response.data.url;
        } catch (error) {
          alert("Failed to fetch document URL. Please try again later.");
          return "";
        }
      };

    useEffect(() => {
        const fetchVoterDetails = async () => {
            try {
              const response = await axios.get(
                "http://localhost:3000/api/v1/getVoter",
                { withCredentials: true }
              );
        
              const voterData = response.data.voter;
              const selfieUrl = await getUrl(voterData.selfieUrl);
              const documentUrl = await getUrl(voterData.documentUrl);
              setVoter({
                firstName: voterData.firstName,
                lastName: voterData.lastName,
                dob: voterData.dateOfBirth,
                address: voterData.address,
                gender: voterData.gender,
                idType: voterData.idType,
                documentNumber: voterData.documentNumber,
                mobile: voterData.mobile,
                email: voterData.email,
                username: voterData.username,
                voterId: voterData.voterId,
                selfie: selfieUrl,
                documentUrl: documentUrl
              });
            } catch (error) {
              alert("Internal Server Error. Please try again later.");
            }
          };
          fetchVoterDetails();
    },[])
    const handleVerification = async () => {
        setLoading(true);
        try {
            const verification = await axios.post('http://localhost:3000/api/v1/verify', {
                voterId: voter.voterId,
                file : voter.documentUrl
            });
            if(verification.status !==200){
              alert("Credentials mis-match. Please check again!")
              setLoading(false);
              return;
            }
                const registerVoter = await axios.post('http://localhost:3000/api/v3/registerVoter',
                  {},
                  {withCredentials : true}
                )
                if(registerVoter.status !== 200){
                  alert(registerVoter.data.message)
                  setRender("VoterMain")
                  setLoading(false);
                  return;
                }
                alert("Congratulation! You have been verified");
                setRender("VoterMain");
        } catch (error : any) {
            const errorMsg = await error.response.data.message
            alert(errorMsg)
            setRender("VoterMain")
        } finally{
          setLoading(false);
        }
        

    }
  return (
    loading ? <Skelaton /> :
    <div className="min-h-screen bg-white">
        <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3 lg:pr-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem label="First Name" value={voter.firstName} />
                <DetailItem label="Last Name" value={voter.lastName} />
                <DetailItem label="Date of Birth" value={voter.dob} />
                <DetailItem label="Address" value={voter.address} />
                <DetailItem label="Gender" value={voter.gender} />
                <DetailItem label="ID Type" value={voter.idType} />
                <DetailItem label="Document Number" value={voter.documentNumber} />
                <DetailItem label="Mobile" value={voter.mobile} />
                <DetailItem label="Username" value={voter.username} />
                <DetailItem label="Email" value={voter.email} />
                <DetailItem label="Voter ID" value={voter.voterId} />
              </div>
            </div>
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <DetailItem label="Selfie" value={voter.selfie} type="image" className="mb-6" />
              <DetailItem label="Uploaded Document" value={voter.documentUrl} type="image" className="mb-6"  />
              <button className="relative overflow-hidden px-6 py-3 rounded-full
                                bg-gradient-to-r from-purple-500 to-purple-700
                                text-white font-semibold
                                transform transition-all duration-300 ease-in-out
                                hover:scale-105 hover:shadow-lg
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                                active:scale-95 cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleVerification()}>
                    <span className="relative z-10">Verify now</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"aria-hidden="true"/>
                </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
    )
}