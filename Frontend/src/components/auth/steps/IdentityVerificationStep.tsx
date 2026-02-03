import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Upload } from 'lucide-react';
import axios from 'axios'
export interface IdentityInfo {
    idType: 'Aadhar Card' | 'Voter Id';
    documentNumber: string;
    selfieUrl: string;
    documentUrl: string;
  }

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  updateFormData: (data: IdentityInfo) => void;
}

export const IdentityVerificationStep: React.FC<Props> = ({
  onNext,
  onPrevious,
  updateFormData
}) => {
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [documentPreview, setDocumentPreview] = useState<string>('');
  const[selfieUrl, setSelfieUrl] = useState<string>('');
  const[documentUrl, setDocumentUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IdentityInfo>();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "selfie" | "document"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      const localPreview = URL.createObjectURL(file);
    if (type === "selfie") {
      setSelfiePreview(localPreview);
    } else {
      setDocumentPreview(localPreview);
    }
      const formData = new FormData();
      formData.append('file', file);
      try {
        const upload = await axios.post('http://localhost:3000/api/v1/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if(upload.status !== 200){
            alert("Error in file uploading. Please try again!")
            URL.revokeObjectURL(localPreview);
            if (type === "selfie") setSelfiePreview('');
            else setDocumentPreview('');
            return;
        }
        const fileUrl = upload.data.fileUrl;
        if(type === "selfie"){
          setSelfieUrl(fileUrl);
        }else{
          setDocumentUrl(fileUrl);
        }
        URL.revokeObjectURL(localPreview);
      } catch (error) {
        alert("error to connect database")
        URL.revokeObjectURL(localPreview);
        if (type === "selfie") setSelfiePreview('');
        else setDocumentPreview('');
      }
      
  };
}
  const onSubmit = (data: IdentityInfo) => {
    updateFormData({ ...data, selfieUrl: selfieUrl, documentUrl: documentUrl });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID Type
        </label>
        <select
          {...register('idType', { required: 'ID type is required' })}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
        >
          <option value="">Select ID type</option>
          <option value="Aadhar Card">Aadhar Card</option>
          <option value="Voter Id">Voter ID</option>
        </select>
        {errors.idType && (
          <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Number
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            {...register('documentNumber', {
              required: 'Document number is required',
              pattern: {
                value: /^[0-9]{12}$/,
                message: 'Please enter a valid 12-digit number'
              }
            })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            placeholder="Enter your document number"
          />
        </div>
        {errors.documentNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.documentNumber.message}</p>
        )}
      </div>

      <div>
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
                    handleFileChange(e,"selfie")
                  } }
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID Document Upload
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {documentPreview ? (
              <img
                src={documentPreview}
                alt="Document preview"
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
                  accept="image/*"
                  onChange={(e) => {
                    handleFileChange(e,"document")
                  } }
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
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
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition duration-300"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}
