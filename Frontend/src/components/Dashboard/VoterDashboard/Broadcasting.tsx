
import { useEffect, useState } from 'react';
import {useWebSocket} from '../../../utils/util'
import { BadgeCheck  } from 'lucide-react';
import axios from 'axios';
type MESSAGES = {
  name : string;
  party : string;
  hash : string;
  time : string;
}
export default function Broadcasting () {
    const [messages, setMessages] = useState<MESSAGES[]>([]);
    useEffect(() => {
      const getMessages = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/v4/getMessages");
          if (response.status === 200) {
            setMessages(response.data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      getMessages();
      console.log(messages)
    }, []);
    let newMessage = useWebSocket();
  
    useEffect(() => {
      if (newMessage) {
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    }, [newMessage]);
  
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Voting</h2>
          <div className="space-y-4 h-[30vw] overflow-y-scroll">
            {messages.map((message, i) => (
              <div key={i} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck  className="w-4 h-4 text-green-500" />
                </div>
                <div>
                    <div className='flex items-center justify-between w-full'>
                        <span className="text-gray-800 font-medium">{message.name} </span>
                        <span className="text-gray-800 font-medium border-2">{message.party}</span>
                    </div>
                  <p className="text-sm text-gray-500">{message.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    )
}