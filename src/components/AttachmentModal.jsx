import { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function AttachmentModal({ isOpen, onClose, onUpload, taskId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  // const handleUpload = async () => {
  //   try {
  //     console.log('Uploading to:', `${API_URL}/api/attachments/${taskId}`);
  //     files.forEach(file => console.log('File:', file.name));
  //     setUploading(true);
  //     const formData = new FormData();
  //     files.forEach(file => {
  //       formData.append('files', file);
  //     });

  //     const response = await axios.post(
  //       `${API_URL}/api/attachments/${taskId}`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     onUpload(response.data);
  //     setFiles([]);
  //     onClose();
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     alert('Failed to upload files');
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleUpload = async () => {
    try {
      if (!taskId) {
        alert('No task selected');
        return;
      }
  
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
  
      // Use the correct taskId for the specific card you are working on
      const response = await axios.post(
        `${API_URL}/api/attachments/${taskId}`,  // Make sure taskId is correctly passed here
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      onUpload(response.data);  // Handle the uploaded attachments
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files');
    }
  };
  
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out" style={{ opacity: isOpen ? 1 : 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl transform transition-transform duration-500 ease-in-out scale-95 md:scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Attachments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            disabled={uploading}
          >
            Add Files
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.name.split('.').pop())}</span>
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 text-xl transition duration-200"
                disabled={uploading}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition duration-300"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={files.length === 0 || uploading}
          >
            {uploading ? (
              <div className="flex items-center">
                <span className="spinner-border animate-spin w-5 h-5 mr-3"></span> Uploading...
              </div>
            ) : (
              `Upload ${files.length > 0 ? `(${files.length})` : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}