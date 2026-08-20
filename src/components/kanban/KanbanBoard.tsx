import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { supabase } from '../../lib/supabase';
import { FileText, MessageSquare, MoreVertical, ShieldCheck, Upload, Layers } from 'lucide-react';
import { SafeAny } from '../../types/supabase-override';

interface KanbanColumn {
  id: string;
  name: string;
  order_index: number;
}

interface KanbanCard {
  id: string;
  column_id: string;
  title: string;
  description: string;
  order_index: number;
}

interface KanbanBoardProps {
  boardId: string;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    // Pipeline configurada sem cards no início para simulação do zero
    setColumns([
      { id: "col1", name: "Novos Documentos (Triagem)", order_index: 0 },
      { id: "col2", name: "Análise Jurídica / Ambiental", order_index: 1 },
      { id: "col3", name: "Aprovados (Cofre)", order_index: 2 }
    ]);
    setCards([]);
    setLoading(false);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Otimista UI Update
    const draggedCard = cards.find(c => c.id === draggableId);
    if (!draggedCard) return;

    const newCards = Array.from(cards);

    // Inserindo no novo index (mesmo se for outra coluna)
    draggedCard.column_id = destination.droppableId;

    // Atualizando o estado visual
    setCards(prev => prev.map(c => c.id === draggableId ? draggedCard : c));

    // Persistir no backend mockado - não chamamos db aqui para demonstração offline
  };

  if (loading) return <div className="p-8 text-center text-fbsb-text-secondary font-serif">Acessando Cofre Restrito...</div>;

  return (
    <div className="h-full w-full bg-fbsb-bg-main p-6 md:p-10 overflow-x-auto custom-scrollbar">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-fbsb-text-primary flex items-center font-serif">
             Due Diligence Pipeline <ShieldCheck className="w-6 h-6 ml-3 text-fbsb-cyan" />
          </h2>
          <p className="text-sm text-fbsb-text-secondary mt-2 font-medium">Gestão Estratégica de Documentos (Ambiental, Fundiário, Legal) em Ambiente Criptografado E2E</p>
        </div>
        <button className="hidden md:flex items-center px-6 py-2.5 bg-fbsb-primary text-white text-sm font-bold tracking-wide rounded-lg shadow-premium hover:bg-fbsb-surface-200 transition-all border border-fbsb-primary/10">
           <Upload className="w-4 h-4 mr-2 text-fbsb-cyan"/> Novo Dossiê
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 h-[calc(100vh-220px)] min-h-[500px] pb-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-fbsb-surface-100/60 backdrop-blur-sm rounded-2xl p-5 w-[340px] flex flex-col flex-shrink-0 border border-fbsb-border shadow-[0_4px_20px_rgba(34,67,102,0.03)]">

              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-bold text-fbsb-text-primary uppercase tracking-wider text-xs">{column.name}</h3>
                <span className="text-[10px] font-bold bg-fbsb-text-secondary/20 text-fbsb-text-primary px-2 py-0.5 rounded-full">
                  {cards.filter(c => c.column_id === column.id).length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[200px] transition-all duration-300 rounded-xl ${snapshot.isDraggingOver ? 'bg-fbsb-text-secondary/10 border-dashed border-2 border-fbsb-cyan/50' : 'border-2 border-transparent'}`}
                  >
                    {cards
                      .filter((card) => card.column_id === column.id)
                      .map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-fbsb-surface-100 p-5 rounded-xl shadow-sm border border-fbsb-border mb-4 group hover:shadow-premium transition-all duration-200 cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? 'shadow-premium ring-1 ring-fbsb-cyan scale-105 z-50 rotate-1' : ''
                              }`}
                            >
                               <div className="flex justify-between items-start">
                                 <h4 className="font-bold text-fbsb-text-primary text-sm leading-snug">{card.title}</h4>
                                 <button className="text-fbsb-text-secondary hover:text-fbsb-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                   <MoreVertical className="w-4 h-4" />
                                 </button>
                               </div>

                               {card.description && (
                                 <p className="text-[11px] text-fbsb-text-secondary mt-2 line-clamp-2 leading-relaxed">{card.description}</p>
                               )}

                               <div className="mt-5 flex items-center justify-between border-t border-fbsb-border pt-4">
                                 <div className="flex items-center space-x-2">
                                    <div className="flex items-center text-[10px] text-fbsb-text-secondary font-bold bg-fbsb-bg-main px-2.5 py-1 rounded-md border border-fbsb-border" title="Documentos Anexados (Agrupamento Contextual)">
                                      <Layers className="w-3 h-3 mr-1.5 text-fbsb-text-secondary" />
                                      2 Docs
                                    </div>
                                    <div className="flex items-center text-[10px] font-bold text-white bg-fbsb-primary px-2.5 py-1 rounded-md cursor-pointer hover:bg-fbsb-surface-200 transition-colors shadow-inner-gold" title="Abrir Chat Restrito desta Etapa">
                                      <MessageSquare className="w-3 h-3 mr-1.5 text-fbsb-cyan" />
                                      Chat Seguro
                                    </div>
                                 </div>
                               </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}