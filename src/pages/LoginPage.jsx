import { useState } from "react";
import { ShoppingCart } from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }
    if (onLogin(email, password)) {
      setError("");
    } else {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-2xl mb-4">
            <ShoppingCart size={32} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-medium text-zinc-900 tracking-tight">
            Supermercado Bom Preço
          </h1>
          <h4 className="text-2xl font-light text-zinc-900 tracking-tight">
            Sistema Administrativo
          </h4>
          <p className="text-zinc-500 mt-2 text-sm">
            Acesse sua conta para continuar
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              Entrar
            </button>
          </form>
        </div>

        <div className="mt-6 bg-zinc-100 rounded-xl p-4 border border-zinc-200">
          <p className="text-xs text-zinc-600 font-medium mb-2">
            Credencial de teste:
          </p>
          <p className="text-xs text-zinc-500">bruno@super.com • Senha@123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
