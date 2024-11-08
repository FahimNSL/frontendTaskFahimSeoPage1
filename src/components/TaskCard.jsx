import { useState, useEffect } from 'react';
import axios from 'axios';
import AttachmentModal from './AttachmentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faUsers, faComments, faCalendarAlt, faCircle, faCheckCircle, faHourglass, faUser } from '@fortawesome/free-solid-svg-icons';



const API_URL = import.meta.env.VITE_API_URL;

export default function TaskCard({ task, title }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    fetchAttachments();
  }, [task.id]);

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attachments/${task.id}`);
      setAttachments(response.data);
    } catch (error) {
      console.error('Failed to fetch attachments:', error);
    }
  };

  const handleUpload = (newAttachments) => {
    setAttachments(prev => [...prev, ...newAttachments]);
    setIsModalOpen(false);
  };


  const getProgressIcon = () => {
    const progressMapping = {
      'incomplete': { icon: faHourglass, color: 'bg-red-500' },
      'to-do': { icon: faCircle, color: 'bg-blue-500' },
      'doing': { icon: faCircle, color: 'bg-yellow-500' },
      'under-review': { icon: faCircle, color: 'bg-purple-500' },
      'completed': { icon: faCheckCircle, color: 'bg-green-500' },
      'overdue': { icon: faCircle, color: 'bg-orange-500' },
    };
  
    const status = title.toLowerCase().replace(/\s+/g, '-'); 
    const progressData = progressMapping[status] || { icon: faCircle, color: 'bg-gray-500' }; 
  
    return <FontAwesomeIcon icon={progressData.icon} className={`${progressData.color} w-6 h-6`} />;
  };
  
  

  return (
    <>
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-md text-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
          <FontAwesomeIcon
              icon={faUser}
              className="w-6 h-6 text-blue-500"
            />
            <span className="text-sm font-medium">{task.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
          <FontAwesomeIcon
              icon={faUser}
              className="w-6 h-6 text-green-500" 
            />
            <span className="text-sm">{task.assignee}</span>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-3">
          {task.description}
          <span className="text-sm ml-20">{getProgressIcon()}</span> 
          <span className="text-sm text-gray-400 ml-2">{task.progress}</span>
        </p>


        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>
                <FontAwesomeIcon icon={faUsers} className="text-orange-400" />{task.members}+
              </span>
              <span>
                <FontAwesomeIcon icon={faComments} className="text-purple-400" />{task.comments}
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 hover:text-blue-400"
              >
                <span>
                  <FontAwesomeIcon icon={faPaperclip} className="text-yellow-400" />{attachments.length}
                </span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-red-400" />
            <span>{task.date}</span>
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-sm font-medium text-gray-300 mb-2">Attachments:</p>
            <div className="space-y-1">
              {attachments.map((file) => (
                <div key={file._id} className="text-sm text-gray-400 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPaperclip} className="text-yellow-400" />
                  <span>{file.originalName}</span>
                  <span className="text-gray-500">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AttachmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        taskId={task.id}
      />
    </>
  );
}
