import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Search, MapPin, Building, Lock } from 'lucide-react';

export default function VitrineProdutos() {
  const { user } = useAuth();
  
  // Simulando estado de aprovação para mock da vitrine
  const isAprovado = false; 

  const [produtos] = useState([
    { id: 1, nome: 'Residencial Aurora', categoria: 'CASA', valor: 'R$ 180.000', parcela: 'A partir de R$ 540', local: 'São Paulo/SP', imagem: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80' },
    { id: 2, nome: 'Loteamento Sol Nascente', categoria: 'TERRENO', valor: 'R$ 45.000', parcela: 'A partir de R$ 299', local: 'Campinas/SP', imagem: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Produtos Disponíveis</h2>
          <p className="text-sm text-slate-500">Catálogo de soluções habitacionais aderentes ao seu perfil.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar produto..." 
            className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>

      {!isAprovado && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm mb-6">
          <div className="bg-amber-100 p-4 rounded-full">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Vitrine Bloqueada</h3>
            <p className="text-sm text-amber-800 max-w-lg mt-1">
              Os produtos são liberados e ajustados especificamente para o seu perfil financeiro 
              <strong> após a conclusão e validação da sua pré-análise de crédito</strong>. Complete seu cadastro na guia anterior.
            </p>
          </div>
        </div>
      )}

      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${!isAprovado ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        {produtos.map((p) => (
          <div key={p.id} className="group rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden">
              <img src={p.imagem} alt={p.nome} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700">
                {p.categoria}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{p.nome}</h3>
              <div className="flex items-center text-sm text-slate-500 mt-2 gap-1.5">
                <MapPin className="h-4 w-4" /> {p.local}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">Valor total estimado</p>
                <p className="text-xl font-bold text-slate-900">{p.valor}</p>
                <p className="text-sm text-emerald-600 font-medium mt-1">{p.parcela}</p>
              </div>
              <button className="mt-6 w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                Tenho Interesse
              </button>
            </div>
          </div>
        ))}
        
        {/* Card Solicitar Produto Específico */}
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 cursor-pointer transition-colors">
          <Building className="h-10 w-10 text-slate-400 mb-4" />
          <h3 className="font-bold text-slate-700 mb-2">Não encontrou o que procura?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Nós podemos buscar ou desenhar um plano específico para a sua necessidade.
          </p>
          <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Solicitar Produto Personalizado
          </button>
        </div>
      </div>
    </div>
  );
}
