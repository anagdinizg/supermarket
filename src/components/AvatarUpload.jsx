import { useState, useRef } from "react";
import { Camera, User, X, Upload, CheckCircle } from "lucide-react";

const AvatarUpload = ({
  currentAvatar,
  onAvatarChange,
  userName,
  isView = false,
}) => {
  const [preview, setPreview] = useState(currentAvatar);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSave = () => {
    onAvatarChange(preview);
    setShowModal(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onAvatarChange(null);
    setShowModal(false);
  };

  const openModal = () => {
    if (isView) return;
    setPreview(currentAvatar);
    setShowModal(true);
  };

  return (
    <>
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={32} className="text-zinc-400" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {!isView && (
          <button
            type="button"
            onClick={openModal}
            className="absolute bottom-0 right-0 w-7 h-7 bg-zinc-900 hover:bg-zinc-800 rounded-full flex items-center justify-center transition shadow-lg"
            title="Alterar foto"
          >
            <Camera size={14} className="text-white" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-zinc-200">
            <div className="p-6 border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-900">
                  Alterar Foto de Perfil
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User
                        size={48}
                        className="text-zinc-400"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>

                {!isView && (
                  <>
                    <div
                      className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition ${
                        isDragging
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-300 hover:border-zinc-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload
                        size={32}
                        className="mx-auto text-zinc-400 mb-2"
                        strokeWidth={1.5}
                      />
                      <p className="text-sm text-zinc-600 mb-2">
                        Arraste uma imagem ou clique para selecionar
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-zinc-900 font-medium hover:underline"
                      >
                        Procurar arquivo
                      </button>
                    </div>

                    <p className="text-xs text-zinc-500 text-center">
                      Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {!isView && (
              <div className="flex space-x-3 p-6 pt-0">
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-xl transition text-sm border border-red-200"
                  >
                    Remover Foto
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!preview}
                  className={`flex-1 font-medium py-3 rounded-xl transition text-sm flex items-center justify-center space-x-2 ${
                    preview
                      ? "bg-zinc-900 hover:bg-zinc-800 text-white"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle size={16} strokeWidth={1.5} />
                  <span>Salvar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUpload;
