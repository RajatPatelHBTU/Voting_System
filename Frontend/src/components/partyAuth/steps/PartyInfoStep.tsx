import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Calendar, MapPin } from 'lucide-react';

export interface PersonalInfo {
    partyName: string;
    partyAbbreviation: string;
    dateOfBirth: string;
    address: string;
    gender: 'Male' | 'Female' | 'Other';
  }

interface Props {
  onNext: () => void;
  updateFormData: (data: PersonalInfo) => void;
}

export const PartyInfoStep: React.FC<Props> = ({ onNext, updateFormData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PersonalInfo>();

  const onSubmit = (data: PersonalInfo) => {
    const dateObj = new Date(data.dateOfBirth);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();
     
    const formattedDate = `${day}/${month}/${year}`;
    data.dateOfBirth = formattedDate;
    updateFormData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('partyName', { required: 'Party name is required' })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              placeholder="Enter your party name"
            />
          </div>
          {errors.partyName && (
            <p className="mt-1 text-sm text-red-600">{errors.partyName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Party Abbreviation
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('partyAbbreviation', { required: 'Party Abbreviation is required' })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              placeholder="Enter your last name"
            />
          </div>
          {errors.partyAbbreviation && (
            <p className="mt-1 text-sm text-red-600">{errors.partyAbbreviation.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
              validate: value => {
                const age = new Date().getFullYear() - new Date(value).getFullYear();
                return age >= 18 || 'You must be at least 18 years old';
              }
            })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
          />
        </div>
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Party Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            {...register('address', { required: 'Address is required' })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            placeholder="Enter your full address"
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          {...register('gender', { required: 'Gender is required' })}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition duration-300"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};