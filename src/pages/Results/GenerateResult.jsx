import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Download, Upload } from 'lucide-react';

const GenerateResult = () => {
  const [formData, setFormData] = useState({
    grade: 'Grade 8',
    section: 'Section A',
    examType: 'Mid Term',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const downloadTemplate = async () => {
    try {
      setTemplateLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/results/template?grade=${formData.grade}&section=${formData.section}`,
        { responseType: 'blob' }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Result_Template_${formData.grade}_${formData.section}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download template');
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const fileFormData = new FormData();
      fileFormData.append('file', formData.file);
      fileFormData.append('grade', formData.grade);
      fileFormData.append('section', formData.section);
      fileFormData.append('type', formData.examType);

      await axios.post('http://localhost:5000/api/results', fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Results uploaded successfully');
      setFormData(prev => ({
        ...prev,
        file: null
      }));
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Generate Results</h1>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Download Result Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Grade 8</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Section A</option>
                  <option>Section B</option>
                  <option>Section C</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={downloadTemplate}
                  disabled={templateLoading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {templateLoading ? 'Downloading...' : 'Download Template'}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold">Upload Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Mid Term</option>
                  <option>Final Term</option>
                  <option>Unit Test</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result File</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                {loading ? 'Uploading...' : 'Upload Results'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Instructions</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Download the result template for your selected grade and section</li>
                <li>Fill in the marks for each student in the downloaded Excel template</li>
                <li>Do not modify the structure or remove any columns from the template</li>
                <li>Save the file and upload it using the form above</li>
                <li>Select the appropriate exam type before uploading</li>
                <li>After uploading, verify the results in the Results section</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateResult;