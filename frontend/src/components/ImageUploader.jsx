import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Sparkles, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onImageSelected, disabled = false, className = '', children, title = '' }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Compress image to ~500px to ensure fast upload over 2G/3G mobile networks
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve({
                blob: blob || file,
                dataUrl: canvas.toDataURL('image/jpeg', 0.85)
              });
            },
            'image/jpeg',
            0.85
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { blob, dataUrl } = await compressImage(file);
      setSelectedFile(blob);
      setPreviewUrl(dataUrl);
    } catch (err) {
      console.error('Error reading image', err);
      // Fallback
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }

    // Reset input so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile && previewUrl) {
      onImageSelected(selectedFile, previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Camera / Attachment Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        title={title || "पत्ती की फोटो खींचें / अपलोड करें"}
        aria-label="Upload leaf photo"
        className={className || "w-10 h-10 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"}
      >
        {children || <Camera className="w-5 h-5" />}
      </button>

      {/* Photo Preview Modal before sending */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">पत्ती की जांच (Leaf Diagnosis)</h3>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-700 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Preview */}
            <div className="p-4 flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden border-2 border-emerald-300 w-full max-h-64 flex items-center justify-center bg-slate-900">
                <img
                  src={previewUrl}
                  alt="Selected Leaf"
                  className="w-full h-full object-contain max-h-64"
                />
              </div>

              <div className="mt-3 w-full bg-emerald-50 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-snug font-medium">
                  AI पत्ती के रोग की पहचान करेगा और तुरंत <strong>देसी व दवा उपचार</strong> बताएगा।
                </p>
              </div>

              {/* Action Buttons (Min 48px height) */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 w-full">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="min-h-[48px] px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 active:scale-98 transition-all text-sm"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpload}
                  className="min-h-[48px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>रोग जांचें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
