import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Camera, X, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface CameraViewProps {
  onClose: () => void;
  onResult: (result: any) => void;
}

export function CameraView({ onClose, onResult }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera permission denied or not available.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    
    stopCamera();
    setIsAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze this image of food. Identify the dish and estimate the portion size.
Provide approximate nutritional values per 100g.
Return ONLY a valid JSON object with this exact structure, no markdown formatting, no backticks:
{
  "foodName": "Name of the dish",
  "estimatedPortion": "e.g., 1 bowl, 2 slices, 150g",
  "portionInGrams": 150,
  "nutritionPer100g": {
    "calories": 150,
    "protein": 5,
    "carbs": 20,
    "fat": 5,
    "fiber": 2,
    "sugar": 1
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg'
            }
          },
          { text: prompt }
        ]
      });

      let text = response.text || '';
      // Clean up markdown if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const result = JSON.parse(text);
      onResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <h3 className="text-white font-medium">Scan Food</h3>
        <button onClick={onClose} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-center p-6 text-white">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={startCamera} variant="outline" className="border-white text-white hover:bg-white/10">
              <RefreshCw size={16} className="inline mr-2" /> Retry Camera
            </Button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover ${isCapturing ? 'hidden' : 'block'}`}
            />
            <canvas ref={canvasRef} className={`w-full h-full object-cover ${!isCapturing ? 'hidden' : 'block'}`} />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none border-[2px] border-white/20 m-12 rounded-3xl">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-nature-400 rounded-tl-3xl -ml-1 -mt-1" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-nature-400 rounded-tr-3xl -mr-1 -mt-1" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-nature-400 rounded-bl-3xl -ml-1 -mb-1" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-nature-400 rounded-br-3xl -mr-1 -mb-1" />
            </div>
          </>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <Loader2 size={48} className="animate-spin text-nature-400 mb-4" />
            <p className="font-medium text-lg">Analyzing food...</p>
            <p className="text-nature-300 text-sm mt-2">Estimating portion and nutrition</p>
          </div>
        )}
      </div>

      {!isAnalyzing && !error && (
        <div className="p-8 pb-12 bg-black flex justify-center items-center">
          <button 
            onClick={captureAndAnalyze}
            className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center relative group"
          >
            <div className="w-16 h-16 bg-white rounded-full transition-transform group-active:scale-90" />
          </button>
        </div>
      )}
    </div>
  );
}
