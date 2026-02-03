import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

type TEAM_MEMBERS = {
    id : string,
    name : string,
    role : string,
    avatar : string
}
type TEAM_DETAILS = {
    name : string,
    role:string,
    avatar :string
}

export default function TeamSection () {
    const [teamMembers,setTeamMembers] = useState<TEAM_MEMBERS[]>([]);
    const [teamDetails, setTeamDetails] = useState<TEAM_DETAILS>({ name: '', role: '', avatar: '' });
    const [selfiePreview, setSelfiePreview] = useState<string>('');
    const [active,setActive] = useState<boolean>(false);

    useEffect(() => {
        const getTeamMembers = async () => {
            try {
                const team = await axios.get('http://localhost:3000/api/v2/getTeamMembers',{
                    withCredentials : true
                })
                if(team.status === 200){
                    const memebers = team.data.teamMembers;
                    const updatedMembers : TEAM_MEMBERS[] = await Promise.all(memebers.map(async(member : TEAM_MEMBERS) =>{
                            try {
                                const avatarResponse = await axios.post('http://localhost:3000/api/v1/getPublicUrl',{
                                    file : member.avatar
                                })
                                return { ...member, avatar: avatarResponse.data.url };
                            } catch (error) {
                                return member;
                            }
                    }));        
                    setTeamMembers(updatedMembers);
                }
            } catch (error) {
                alert("Error in fetching team members. Please try again!")
            }
        }
        getTeamMembers();
    },[])
    const handleAddTeamMember = async () => {
        try {
            const teamMember = await axios.post('http://localhost:3000/api/v2/addTeamMember',{
                name : teamDetails?.name,
                role : teamDetails?.role,
                avatar : teamDetails?.avatar
            },{
                withCredentials : true
            })
            if(teamMember.status === 200){
                setTeamMembers([...teamMembers,teamMember.data.partyTeam]);
                alert("Team member added successfully!")
            }
            window.location.reload();
        } catch (error) {
            alert("Error in adding team member. Please try again!")
            console.log("error: ",error)
        }
    }
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should not exceed 5MB');
            return;
        }
      const localPreview = URL.createObjectURL(file);
      setSelfiePreview(localPreview);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const upload = await axios.post('http://localhost:3000/api/v1/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if(upload.status !== 200){
            alert("Error in file uploading. Please try again!")
            URL.revokeObjectURL(localPreview);
            setSelfiePreview('');
            return;
        }
        const fileUrl = upload.data.fileUrl;
        setTeamDetails({...teamDetails, avatar : fileUrl});
        URL.revokeObjectURL(localPreview);
      } catch (error) {
        alert("error to connect database")
        URL.revokeObjectURL(localPreview);
        setSelfiePreview('');
      }
    }
}
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 ">
          <h2 className="text-xl font-semibold mb-6">Party Team</h2>
          
          <div className="space-y-4 h-[35vh] overflow-y-scroll">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
    
          <motion.button
            whileHover={{ scale: 1.02 }}
            className=" cursor-pointer w-full mt-6 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => setActive(true)}
          >
            Add Team Member
          </motion.button>
           {active && <div className='absolute top-10 right-[10vw] w-[70vw] h-[90vh] bg-purple-300/50 backdrop-blur-3xl flex flex-col justify-center items-center gap-5 rounded-xl'>
                <h1 className='text-3xl font-bold bg-clip-text text-black'>Add Team Member</h1>
                <div className='w-[50vw] '>
                    <label id='name' className='block text-sm font-medium text-gray-700 mb-1'>Name:</label>
                    <input id='name' className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300' 
                    placeholder="Enter team memeber name"
                    onChange={e => setTeamDetails({...teamDetails, name:e.target.value})}
                     />
                </div>
                <div className='w-[50vw] '>
                    <label id='role' className='block text-sm font-medium text-gray-700 mb-1'>Role:</label>
                    <input id='role' className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300' 
                    placeholder="Enter team memeber role"
                    onChange={e => setTeamDetails({...teamDetails, role:e.target.value})}
                     />
                </div>
                <div className='w-[50vw]'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selfie Upload
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                        {selfiePreview ? (
                        <img
                            src={selfiePreview}
                            alt="Selfie preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>Upload a file</span>
                            <input
                            type="file"
                            className="sr-only"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={(e) => {
                                handleFileChange(e)
                            } }
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    </div>
                </div>
                <div className='flex justify-between items-center  w-[30vw]'>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    className='w-24 bg-blue-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 transition duration-300 cursor-pointer'
                    onClick={handleAddTeamMember}
                >
                    Add
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    className='w-24 bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition duration-300 cursor-pointer'
                    onClick={() => setActive(false)}
                >
                    Cancel
                </motion.button>
                </div>
                
           </div>
           }

        </div>
      );
}