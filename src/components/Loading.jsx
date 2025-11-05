import { Loader2 } from "lucide-react";

const Loading = ({ message = "Carregando..." }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100] transition">
      <Loader2
        size={48}
        className="text-zinc-900 animate-spin mb-4"
        strokeWidth={1.5}
      />
      <p className="text-zinc-700 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;
