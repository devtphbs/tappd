import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Save, DollarSign } from 'lucide-react';
import { getUserSettings, saveReceipt } from '../supabase.js';
import { haptics } from '../utils/haptics.js';

export default function ScanTab({ user }) {
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [originalCurrency, setOriginalCurrency] = useState('USD');
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserSettings();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const loadUserSettings = async () => {
    try {
      const { data: settings } = await getUserSettings(user.id);
      if (settings?.home_currency) {
        setHomeCurrency(settings.home_currency);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const startCamera = async () => {
    try {
      haptics.cameraFocus();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1920, height: 1080 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setImagePreview(imageData);
      stopCamera();
      haptics.cameraShutter();
      processImage(imageData);
    }
  };

  const handleLibraryUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        haptics.selection();
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    try {
      // Simulate API call to Claude Vision
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = {
        merchant: 'Coffee Shop',
        date: new Date().toISOString().split('T')[0],
        total: 12.50,
        currency: 'USD',
        category: 'Food & Dining',
        items: [
          { name: 'Latte', price: 4.50 },
          { name: 'Croissant', price: 3.50 },
          { name: 'Sandwich', price: 4.50 }
        ]
      };
      
      setExtractedData(mockData);
      setOriginalCurrency(mockData.currency);
      haptics.scanComplete();
    } catch (error) {
      console.error('Error processing image:', error);
      haptics.scanError();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData) return;

    try {
      haptics.save();
      
      const receiptData = {
        user_id: user.id,
        merchant: extractedData.merchant,
        date: extractedData.date,
        total: extractedData.total,
        currency: extractedData.currency,
        home_currency: homeCurrency,
        category: extractedData.category,
        items: extractedData.items,
        image_url: imagePreview,
        created_at: new Date().toISOString()
      };

      await saveReceipt(receiptData);
      
      // Reset form
      setExtractedData(null);
      setImagePreview(null);
      setConvertedAmounts({});
      
      alert('Receipt saved successfully!');
    } catch (error) {
      console.error('Error saving receipt:', error);
      alert('Error saving receipt. Please try again.');
    }
  };

  const handleCancel = () => {
    setExtractedData(null);
    setImagePreview(null);
    setConvertedAmounts({});
    haptics.buttonPress();
  };

  return (
    <div className="p-6">
      <div className="glass-card mb-6">
        <h2 className="text-2xl font-bold mb-2">Scan Receipt</h2>
        <p className="text-white/80">Take a photo or upload a receipt to track your expenses</p>
      </div>

      {!imagePreview && !isCameraActive && (
        <div className="space-y-4">
          <button
            onClick={startCamera}
            className="glass-button w-full flex items-center justify-center gap-3 py-6"
          >
            <Camera size={24} />
            <span className="text-lg">Take Photo</span>
          </button>

          <div className="text-center text-white/60">or</div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-button w-full flex items-center justify-center gap-3 py-6"
          >
            <Upload size={24} />
            <span className="text-lg">Upload from Library</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLibraryUpload}
            className="hidden"
          />
        </div>
      )}

      {isCameraActive && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={capturePhoto}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {imagePreview && isProcessing && (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/80">Analyzing receipt...</p>
        </div>
      )}

      {imagePreview && !isProcessing && extractedData && (
        <div className="space-y-4">
          <div className="glass-card">
            <img
              src={imagePreview}
              alt="Receipt"
              className="w-full h-auto rounded-xl mb-4"
            />
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Merchant</label>
                <input
                  type="text"
                  value={extractedData.merchant}
                  onChange={(e) => setExtractedData({...extractedData, merchant: e.target.value})}
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Date</label>
                <input
                  type="date"
                  value={extractedData.date}
                  onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
                <select
                  value={extractedData.category}
                  onChange={(e) => setExtractedData({...extractedData, category: e.target.value})}
                  className="glass-input"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Original Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                      {extractedData.currency}
                    </span>
                    <input
                      type="number"
                      value={extractedData.total}
                      onChange={(e) => setExtractedData({...extractedData, total: parseFloat(e.target.value)})}
                      className="glass-input pl-12"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Your Currency</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                      {homeCurrency}
                    </span>
                    <input
                      type="number"
                      value={convertedAmounts[homeCurrency] || extractedData.total}
                      readOnly
                      className="glass-input pl-12 bg-white/5"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Items</label>
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
                        className="glass-input flex-1"
                        placeholder="Item name"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                          $
                        </span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...extractedData.items];
                            newItems[index].price = parseFloat(e.target.value);
                            setExtractedData({...extractedData, items: newItems});
                          }}
                          className="glass-input pl-8 w-24"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Receipt
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
