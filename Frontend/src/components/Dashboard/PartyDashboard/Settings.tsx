import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Image, FileText, User, Users, Building, AtSign,Bell, Settings as SettingsIcon, Award} from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export interface PartyDetails {
    name: string;
    abbreviation: string;
    address: string;
    symbol: string;
    username: string;
    leaderName: string;
    manifesto: string;
    constitution: string;
  }

export default function Settings () {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [partyDetails, setPartyDetails] = useState<PartyDetails>({
        name: '',
        abbreviation: '',
        address: '',
        symbol: '',
        username: '',
        leaderName: '',
        manifesto: '',
        constitution: '',
      });
      const [symbolPreview, setSymbolPreview] = useState<string | null>(null);
      const [manifestoPreview, setManifestoPreview] = useState<boolean>(false);
      const [constitutionPreview, setConstitutionPreview] = useState<boolean>(false);
      useEffect(() => {
        const getPartyDetails = async () => {
            try {
                const details = await axios.get('http://localhost:3000/api/v2/partyDetails',{
                    withCredentials : true
                })
                if(details.status === 200){
                    console.log("details",details.data.partyDetails);
                    setPartyDetails( {
                        name: details.data.partyDetails.partyName,
                        abbreviation: details.data.partyDetails.partyAbbreviation,
                        address: details.data.partyDetails.address,
                        symbol: details.data.partyDetails.symbolUrl || '',
                        username: details.data.partyDetails.username,
                        leaderName: details.data.partyDetails.partyLeaderName,
                        manifesto: details.data.partyDetails.manifesto || '',
                        constitution: details.data.partyDetails.partyConstitution || '',

                });

                }else{
                    setPartyDetails({
                        name: '',
                        abbreviation: '',
                        address: '',
                        symbol: '',
                        username: '',
                        leaderName: '',
                        manifesto: '',
                        constitution: '',
                    })
                }
                console.log("partyDetails", partyDetails)
            } catch (error) {
                alert("Error in fetching details. Please try again!")
                setPartyDetails({
                    name: '',
                    abbreviation: '',
                    address: '',
                    symbol: '',
                    username: '',
                    leaderName: '',
                    manifesto: '',
                    constitution: '',
                })
            }
        }
        getPartyDetails();
    },[]);
    
    const handleFileUpload = async (e : React.ChangeEvent<HTMLInputElement>, type : string) => {
        const file = e.target.files?.[0];
        if(file) {
            if(type === 'symbol' && file.size > 5 * 1024 * 1024){
                alert('Symbol size should not exceed 5MB');
                return;
            }
            if(type === 'manifesto' && file.size > 30 * 1024 * 1024){
                alert('Manifesto size should not exceed 30MB');
                return;
            }
            if(type === 'constitution' && file.size > 30 * 1024 * 1024){
                alert('Constitution size should not exceed 30MB');
                return;
            }
            const localPreview = URL.createObjectURL(file);
            if(type === 'symbol'){
                setSymbolPreview(localPreview);
            }else if(type === 'manifesto'){
                setManifestoPreview(true);
            }else if(type === 'constitution'){
                setConstitutionPreview(true)
            }
            const formData = new FormData();
            formData.append('file', file);
            try {
                const upload = await axios.post('http://localhost:3000/api/v1/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                if(upload.status !== 200){
                    alert("Error in file uploading. Please try again!")
                    if(type === 'symbol'){
                        URL.revokeObjectURL(localPreview);
                    }
                    if(type === 'symbol'){
                        setSymbolPreview(null);
                    }else if(type === 'manifesto'){
                        setManifestoPreview(false);
                    }else if(type === 'constitution'){
                        setConstitutionPreview(false)
                    }
                    return
                }
                if(type === 'manifesto'){
                    setPartyDetails({...partyDetails, manifesto : upload.data.url});
                  setManifestoPreview(true);
                }else if(type === 'constitution'){
                    setPartyDetails({...partyDetails, constitution : upload.data.url})
                    setConstitutionPreview(true)
                }else if( type === 'symbol'){
                    setPartyDetails({...partyDetails, symbol : upload.data.url})
                }
              } catch (error) {
                alert("error to connect database")
              }finally {
                URL.revokeObjectURL(localPreview);
              }
            
        }
    }
    const handleSubmit = async () => {
        
        try {
            const update = await axios.put('http://localhost:3000/api/v2/updateProfile',{
                    name: partyDetails.name,
                    abbreviation: partyDetails.abbreviation,
                    address: partyDetails.address,
                    symbol: partyDetails.symbol,
                    username: partyDetails.username,
                    leaderName: partyDetails.leaderName,
                    manifesto: partyDetails.manifesto,
                    constitution: partyDetails.constitution
            },{
                withCredentials : true
            })
            if(update.status === 200){
                alert("Profile updated successfully!");
                navigate(`/party/dashboard/${token}`)
            }
        } catch (error) {
            alert("Error in updating profile. Please try again!")
            navigate(`/party/dashboard/${token}`)
        }
    }
      return (
        <div className="min-h-screen bg-white p-8">
            
            <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b border-purple-100 p-4 mb-11"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to={`/party/dashboard/${token}`}>
                  <div className="flex items-center space-x-4">
                    <Award className="w-8 h-8 text-purple-600" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                      ElectCode
                    </h1>
                  </div>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <Bell className="w-6 h-6 text-purple-600" />
                </button>
                <Link to={`/party/dashboard/${token}/settings`}><button className="p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <SettingsIcon className="w-6 h-6 text-purple-600" />
                </button></Link>
                
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-200"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6">
              <h1 className="text-3xl font-bold text-white">Party Details</h1>
            </div>
    
            <div className="p-8 grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Party Name */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Party Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={partyDetails.name}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, name : e.target.value})}}
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all "
                    placeholder={partyDetails.name || 'Enter party name'}
                  />
                </motion.div>
    
                {/* Abbreviation */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <AtSign className="w-4 h-4 mr-2 text-purple-500" />
                    Party Abbreviation
                  </label>
                  <input
                    type="text"
                    name="abbreviation"
                    value={partyDetails.abbreviation}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, abbreviation : e.target.value})}}
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={partyDetails.abbreviation ||"Enter abbreviation"}
                  />
                </motion.div>
              </div>
    
              {/* Address */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 mr-2 text-purple-500" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={partyDetails.address}
                  onChange={(e) => {setPartyDetails({ ...partyDetails, address : e.target.value})}}
                  className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder={partyDetails.address ||"Enter party address"}
                />
              </motion.div>
    
              {/* Symbol Upload */}
              {symbolPreview ? <div className='flex flex-col justify-center items-center'>
                <img
                src={symbolPreview}
                alt="Selfie preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                <span>Upload a symbol</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'symbol')}
                />
              </label>
              </div> : 
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Image className="w-4 h-4 mr-2 text-purple-500" />
                  Party Symbol
                </label>
                <div
                  
                  className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                >
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                <span>Upload a symbol</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'symbol')}
                />
              </label>
                  
                    <Upload className="w-12 h-12 mx-auto text-purple-500 mb-2" />
                  
                  <p className="text-sm text-gray-500">Drop your party symbol here or click to upload</p>
                </div>
              </motion.div>
                }
              <div className="grid md:grid-cols-2 gap-6">
                {/* Username */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2 text-purple-500" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={partyDetails.username}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, username : e.target.value} ) }}
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={partyDetails.username || "Enter username"}
                  />
                </motion.div>
    
                {/* Party Leader */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2 text-purple-500" />
                    Party Leader Name
                  </label>
                  <input
                    type="text"
                    name="leaderName"
                    value={partyDetails.leaderName}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, leaderName : e.target.value})}}
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={partyDetails.leaderName || "Enter party leader name"}
                  />
                </motion.div>
              </div>
    
              {/* Document Uploads */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Manifesto Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2 text-purple-500" />
                    Party Manifesto (PDF)
                  </label>
                  <div
                    className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  >
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                <span>Upload a maifesto</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'manifesto')}
                />
              </label>
                    {manifestoPreview ? <div>Manifesto file uploaded</div> :
                    <div>
                    
                    <Upload className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                    <p className="text-sm text-gray-500">
                      Upload Manifesto (PDF)
                    </p>
                    </div>
                    
                    }
                  </div>
                </motion.div>
    
                {/* Constitution Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2 text-purple-500" />
                    Party Constitution (PDF)
                  </label>
                  <div
                    className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  >
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                <span>Upload a constitution</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'constitution')}
                />
              </label>
                    {constitutionPreview ? <div>Constitution file uploaded</div> :
                    <div>
                    
                    <Upload className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                    <p className="text-sm text-gray-500">
                      Upload Constitution (PDF)
                    </p>
                    </div>
                    }
                  </div>
                </motion.div>
              </div>
    
              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Party Details
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
}