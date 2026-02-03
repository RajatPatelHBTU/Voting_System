import React from 'react';
import { motion } from 'framer-motion';
import type { PersonalInfo } from './PersonalInfoStep';
import type { IdentityInfo } from './IdentityVerificationStep';
import type { SecurityInfo } from './SecuritySetupStep';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
interface Props {
  formData: PersonalInfo & IdentityInfo & SecurityInfo;
  onPrevious: () => void;
  updateFormData: (data: any) => void;
}

export const ReviewStep: React.FC<Props> = ({ formData, onPrevious }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !privacyAccepted) {
      alert('Please accept both the terms of service and privacy policy');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log(formData);
      const response = await axios.post('http://localhost:3000/api/v1/signup',{
        firstName : formData.firstName,
        lastName : formData.lastName,
        dateOfBirth : formData.dateOfBirth,
        address : formData.address,
        gender : formData.gender,
        idType : formData.idType,
        documentNumber : formData.documentNumber,
        selfieUrl : formData.selfieUrl,
        documentUrl : formData.documentUrl,
        mobile : formData.mobile,
        username : formData.username,
        password : formData.password,
        email : formData.email
      })
      if(response.status !== 200){
        console.log(response.data.message)
        alert(response.data.message);
        return;
      }
      const voterId = response.data.voterId;
      const token = response.data.token;
      Cookies.set('token',token, { expires: 2});
      alert('Registration successful!');
      navigate(`/voter/dashboard/${token}`);
    } catch (error) {
      console.log(error);
      alert('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="text-sm text-gray-900">
              {formData.firstName} {formData.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="text-sm text-gray-900">{formData.dateOfBirth}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="text-sm text-gray-900">{formData.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Gender</dt>
            <dd className="text-sm text-gray-900">{formData.gender}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Identity Information</h3>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID Type</dt>
            <dd className="text-sm text-gray-900">{formData.idType}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Document Number</dt>
            <dd className="text-sm text-gray-900">{formData.documentNumber}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Mobile Number</dt>
            <dd className="text-sm text-gray-900">{formData.mobile}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Username</dt>
            <dd className="text-sm text-gray-900">{formData.username}</dd>
          </div>
          {formData.email && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{formData.email}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition duration-300"
          />
          <span className="text-sm text-gray-700">
            I accept the{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800">
              terms of service
            </a>
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition duration-300"
          />
          <span className="text-sm text-gray-700">
            I accept the{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800">
              privacy policy
            </a>
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition duration-300"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !termsAccepted || !privacyAccepted}
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </motion.div>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </div>
  );
};