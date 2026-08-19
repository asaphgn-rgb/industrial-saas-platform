import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { supabase } from '../../lib/supabase';
import { FileText, MessageSquare, MoreVertical, ShieldCheck, Upload } from 'lucide-react';
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
    try {
      const [colsResponse, cardsResponse] = await Promise.all([
        supabase.from('kanban_columns').select('*').eq('board_id', boardId).order('order_index'),
        supabase.from('kanban_cards').select('*').eq('board_id', boardId).order('order_index')
      ]);

      if (colsResponse.error) throw colsResponse.error;
      if (cardsResponse.error) throw cardsResponse.error;

      setColumns((colsResponse.data as KanbanColumn[]) || []);
      setCards((cardsResponse.data as KanbanCard[]) || []);
    } catch (err) {
      console.error('Error fetching Kanban data:', err);
    } finally {
      setLoading(false);
    }
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

    // Persistir no backend
    try {
      // Usando cast explicito the query method
      const query = supabase.from('kanban_cards');
      const updateMethod = query.update as SafeAny;
      await updateMethod({ column_id: destination.droppableId }).eq('id', draggableId);
    } catch (err) {
      console.error('Failed to save drag and drop state:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando Pipeline Restrita...</div>;

  return (
    <div className="h-full w-full bg-slate-50 p-6 overflow-x-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
             Pipeline de Negociação (Restrita) <ShieldCheck className="w-5 h-5 ml-2 text-emerald-600" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">Gestão de Documentos Agrupados (Laudos, CAR, CCIR) e Trâmites em Ambiente Seguro</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition">
           <Upload className="w-4 h-4 mr-2"/> Novo Documento
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 h-[calc(100vh-200px)] min-h-[500px]">
          {columns.map((column) => (
            <div key={column.id} className="bg-slate-200/50 rounded-xl p-4 w-80 flex flex-col flex-shrink-0 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-4 px-1">{column.name}</h3>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[200px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-slate-200' : ''}`}
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
                              className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 group hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-emerald-500' : ''
                              }`}
                            >
                               <div className="flex justify-between items-start">
                                 <h4 className="font-medium text-slate-800 text-sm leading-tight">{card.title}</h4>
                                 <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition">
                                   <MoreVertical className="w-4 h-4" />
                                 </button>
                               </div>
                               {card.description && (
                                 <p className="text-xs text-slate-500 mt-2 line-clamp-2">{card.description}</p>
                               )}
                               
                               <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                 <div className="flex items-center space-x-2">
                                    <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded" title="Documentos Anexados (Agrupamento Contextual)">
                                      <FileText className="w-3 h-3 mr-1" />
                                      2 Docs
                                    </div>
                                    <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded cursor-pointer hover:bg-emerald-100 transition" title="Abrir Chat Restrito desta Etapa">
                                      <MessageSquare className="w-3 h-3 mr-1" />
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
