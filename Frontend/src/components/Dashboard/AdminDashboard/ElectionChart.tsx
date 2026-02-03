import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-indigo-100">
          <p className="font-bold text-indigo-700">{`${label}`}</p>
          <p className="text-gray-700">
            <span className="font-semibold">Votes:</span> {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
};

type PartyData = {
    label : string;
    value : number;
    color : string;
}
const COLORS = [
  '#4C51BF', '#6B46C1', '#805AD5', '#B794F4', '#553C9A',
  '#2B6CB0', '#3182CE', '#4299E1', '#63B3ED', '#2C5282',
  '#2C7A7B', '#38B2AC', '#4FD1C5', '#81E6D9', '#234E52',
  '#2F855A', '#38A169', '#48BB78', '#9AE6B4', '#22543D',
  '#9C4221', '#C05621', '#DD6B20', '#ED8936', '#7B341E',
  '#742A2A', '#9B2C2C', '#C53030', '#E53E3E', '#742A2A'
];
export const ElectionChart = () => {
  const [ ids, setIds] = useState([]);
  const [ partyData, setPartyData] = useState<PartyData[]>([]);
  useEffect(() => {
      const getPartyIds = async () => {
          try {
            const response = await axios.get("http://localhost:3000/api/v2/getPartiesId");
            if (response.data?.partyIds) {
              setIds(response.data.partyIds);
            }
          } catch (error) {
            console.log(error);
          }
        };
        getPartyIds();
  },[]);

  const getFunction = async (partyId: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/v3/partyStatus", {
        params: { partyId },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching party ${partyId}:`, error);
      return null;
    }
  };

  
  useEffect(() => {
      if (ids.length === 0) return;

  const getPartyData = async () => {
    try {
      const requests = ids.map((party) => getFunction(party));
    const results = await Promise.all(requests);
    const validData = results
      .map((res, index) => ({
        label: res.name,
        value: res.voteCount,
        color: COLORS[index % COLORS.length],
      }));
    setPartyData(validData);
    } catch (error) {
      console.log(error);
    }
  };
  getPartyData();
  },[ids])

  return(
        
    <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 h-full">
  <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center">
    <BarChart2 size={20} className="mr-2" />
    Current Votes Stats
  </h2>
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={partyData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
        barSize={40}
        barGap={8}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="label" 
          angle={-45} 
          textAnchor="end" 
          height={60}
          interval={0}
          tick={{ fill: '#4B5563', fontSize: 12 }}
          axisLine={{ stroke: '#D1D5DB' }}
        />
        <YAxis 
          tick={{ fill: '#4B5563', fontSize: 12 }}
          axisLine={{ stroke: '#D1D5DB' }}
          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: 20 }}
          formatter={(value) => <span className="text-gray-700">{value}</span>}
        />
        <Bar 
          dataKey="value" 
          name="Value" 
          radius={[4, 4, 0, 0]}
        >
          {partyData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
            />
          ))}
        </Bar>
        <defs>
          <filter id="shadow" x="-2" y="0" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
          </filter>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
)
};
