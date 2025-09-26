"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Button from "./Button";

interface ImageUploadProps {
  value?: string | File;
  onChange: (file: File | null) => void;
  onUrlChange?: (url: string) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
  showUrlInput?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function ImageUpload({
  value,
  onChange,
  onUrlChange,
  className = "",
  disabled = false,
  error,
  showUrlInput = true,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif"],
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Initialize preview when value changes
  React.useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string" && value) {
      setPreview(value);
    } else {
      setPreview("");
    }
  }, [value]);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${acceptedTypes
        .map((type) => type.split("/")[1])
        .join(", ")}`;
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size too large. Maximum size is ${maxSize}MB`;
    }

    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setDragActive(false);

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        return;
      }

      setUploading(true);
      
      // Simulate upload progress
      setTimeout(() => {
        onChange(file);
        setUploading(false);
      }, 500);
    },
    [onChange, maxSize, acceptedTypes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    disabled: disabled || uploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleRemove = () => {
    onChange(null);
    setPreview("");
    setUrlInput("");
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim() && onUrlChange) {
      onUrlChange(urlInput.trim());
      setPreview(urlInput.trim());
    }
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      {showUrlInput && (
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === "file"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("url")}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === "url"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Image URL
          </button>
        </div>
      )}

      {uploadMode === "file" ? (
        /* File Upload Mode */
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${
                isDragActive || dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${error ? "border-red-300 bg-red-50" : ""}
            `}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Uploading...</p>
                  <p className="text-sm text-gray-600">Please wait while we process your image</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`w-12 h-12 mx-auto ${
                  isDragActive || dragActive ? "text-blue-500" : "text-gray-400"
                }`}>
                  <Upload className="w-full h-full" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive || dragActive
                      ? "Drop your image here"
                      : "Upload an image"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: JPG, PNG, GIF • Max size: {maxSize}MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      ) : (
        /* URL Input Mode */
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || !isValidUrl(urlInput) || disabled}
              variant="primary"
              size="sm"
            >
              Load Image
            </Button>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={() => {
                setPreview("");
                if (uploadMode === "url") {
                  setUrlInput("");
                }
              }}
            />
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Image loaded</span>
            </div>
          </div>

          {/* Image Info */}
          {value instanceof File && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">File name:</span> {value.name}
                </div>
                <div>
                  <span className="font-medium">Size:</span>{" "}
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}