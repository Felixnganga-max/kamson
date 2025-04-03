import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddVideos = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "video", // Default to video
    category: "Live Performance", // Default category
    file: null,
    isSubmitting: false,
  });

  // Preview state
  const [filePreview, setFilePreview] = useState(null);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      file: file,
    });

    // Create preview for videos or images
    if (file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setFilePreview(videoUrl);
    } else if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setFilePreview(imageUrl);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      type: "video",
      category: "Live Performance",
      file: null,
      isSubmitting: false,
    });
    setFilePreview(null);
    setUploadProgress(0);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.file) {
      toast.error(`Please select a ${formData.type} to upload`);
      return;
    }

    // Create FormData for file upload
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("type", formData.type);
    uploadData.append("category", formData.category);

    // Use "src" as the field name for the file as expected by MongoDB
    uploadData.append("src", formData.file);

    try {
      setFormData({ ...formData, isSubmitting: true });
      setUploadProgress(0);

      // Send request to backend
      const response = await axios.post(
        "http://localhost:5000/api/media/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(percentCompleted);
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      // Handle success
      toast.success(`${formData.type} uploaded successfully!`);
      resetForm();
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setFormData((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
        Add Media Content
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Media Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Media Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Live Performance">Live Performance</option>
              <option value="Behind the Scenes">Behind the Scenes</option>
            </select>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a descriptive title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            {formData.type === "video" ? "Upload Video" : "Upload Image"}
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-3 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  {formData.type === "video"
                    ? "MP4 (MAX. 20MB)"
                    : "PNG, JPG, GIF, WEBP (MAX. 5MB)"}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={formData.type === "video" ? "video/*" : "image/*"}
              />
            </label>
          </div>
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Preview
            </label>
            <div className="border rounded-lg p-2 bg-gray-50">
              {formData.type === "video" ? (
                <video
                  src={filePreview}
                  controls
                  className="w-full h-auto max-h-72 rounded"
                ></video>
              ) : (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full h-auto max-h-72 object-contain rounded"
                />
              )}
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {formData.isSubmitting && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Progress
            </label>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-right">
              {uploadProgress}% Complete
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={formData.isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={formData.isSubmitting}
          >
            {formData.isSubmitting ? (
              <div className="flex items-center space-x-2">
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
                <span>Uploading... {uploadProgress}%</span>
              </div>
            ) : (
              `Upload ${formData.type === "video" ? "Video" : "Image"}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVideos;
