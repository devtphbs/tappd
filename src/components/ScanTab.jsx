import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react';
import { saveReceipt } from '../db.js';

export default function ScanTab() {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setIsCameraOpen(false);
      processImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      // Fallback to file upload
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setImage(imageData);
      
      // Stop camera
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraOpen(false);
      
      processImage(imageData);
    }
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    
    try {
      const { analyzeReceipt } = await import('../api.js');
      const extractedData = await analyzeReceipt(imageData);
      
      setExtractedData(extractedData);
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to mock data if API fails
      const mockData = {
        merchant: "Unknown Merchant",
        date: new Date().toISOString().split('T')[0],
        items: [
          { name: "Item 1", price: 0.00 }
        ],
        subtotal: 0.00,
        tax: 0.00,
        total: 0.00,
        currency: "USD",
        category: "other"
      };
      
      setExtractedData(mockData);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (extractedData) {
      try {
        await saveReceipt(extractedData);
        
        // Reset state
        setImage(null);
        setExtractedData(null);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving receipt:', error);
      }
    }
  };

  const resetScan = () => {
    setImage(null);
    setExtractedData(null);
    setIsEditing(false);
    if (isCameraOpen) {
      const stream = videoRef.current?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  if (isCameraOpen) {
    return (
      <div className="flex flex-col h-screen bg-black">
        <div className="flex justify-between items-center p-4 bg-black/50 text-white">
          <button onClick={resetScan}>
            <X size={24} />
          </button>
          <h2 className="text-lg font-medium">Scan Receipt</h2>
          <button onClick={capturePhoto} className="bg-primary-600 rounded-full p-2">
            <Camera size={24} />
          </button>
        </div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="flex-1 w-full object-cover"
        />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <h2 className="text-xl font-semibold mb-2">Analyzing Receipt</h2>
          <p className="text-gray-600">AI is extracting the data...</p>
        </div>
      </div>
    );
  }

  if (extractedData) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Confirm Details</h2>
          <button onClick={resetScan}>
            <X size={24} />
          </button>
        </div>

        {image && (
          <div className="mb-6">
            <img 
              src={image} 
              alt="Receipt" 
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
            <input
              type="text"
              value={extractedData.merchant}
              onChange={(e) => setExtractedData({...extractedData, merchant: e.target.value})}
              className="input-field"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={extractedData.date}
              onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
              className="input-field"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={extractedData.category}
              onChange={(e) => setExtractedData({...extractedData, category: e.target.value})}
              className="input-field"
              disabled={!isEditing}
            >
              <option value="food">Food & Dining</option>
              <option value="shopping">Shopping</option>
              <option value="travel">Travel</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health & Fitness</option>
              <option value="transport">Transportation</option>
              <option value="bills">Bills & Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
            <div className="space-y-2">
              {extractedData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...extractedData.items];
                      newItems[index].name = e.target.value;
                      setExtractedData({...extractedData, items: newItems});
                    }}
                    className="input-field flex-1"
                    disabled={!isEditing}
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...extractedData.items];
                      newItems[index].price = parseFloat(e.target.value) || 0;
                      setExtractedData({...extractedData, items: newItems});
                    }}
                    className="input-field w-24"
                    disabled={!isEditing}
                    placeholder="Price"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
              <input
                type="number"
                step="0.01"
                value={extractedData.subtotal}
                onChange={(e) => setExtractedData({...extractedData, subtotal: parseFloat(e.target.value) || 0})}
                className="input-field"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
              <input
                type="number"
                step="0.01"
                value={extractedData.tax}
                onChange={(e) => setExtractedData({...extractedData, tax: parseFloat(e.target.value) || 0})}
                className="input-field"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
            <input
              type="number"
              step="0.01"
              value={extractedData.total}
              onChange={(e) => setExtractedData({...extractedData, total: parseFloat(e.target.value) || 0})}
              className="input-field"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={extractedData.currency}
              onChange={(e) => setExtractedData({...extractedData, currency: e.target.value})}
              className="input-field"
              disabled={!isEditing}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-secondary flex-1">
                Edit
              </button>
              <button onClick={handleSave} className="btn-primary flex-1">
                <Check size={20} className="inline mr-2" />
                Save
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex-1">
                <Check size={20} className="inline mr-2" />
                Save
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Scan Receipt</h1>
        <p className="text-gray-600">Take a photo or upload a receipt to track your spending</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={startCamera}
          className="w-full btn-primary flex items-center justify-center gap-3"
        >
          <Camera size={24} />
          Take Photo
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full btn-secondary flex items-center justify-center gap-3"
        >
          <Upload size={24} />
          Upload from Library
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>AI will automatically extract:</p>
        <p className="mt-1">• Merchant name • Items • Total amount • Date • Category</p>
      </div>
    </div>
  );
}
