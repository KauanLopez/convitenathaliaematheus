import { useEffect, useState, useMemo } from 'react';
import { supabase as _supabase } from '../../lib/supabase';
const supabase = _supabase as any;
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { Upload, Search, UserPlus, Trash2, Edit, CheckCircle, XCircle, Clock, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { Modal } from '../../components/ui/Modal';

type GuestRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  type: string | null;
  confirmation_status: string;
  group_name: string;
  group_id: string;
};

const columnHelper = createColumnHelper<GuestRow>();

export const Guests = () => {
  const [data, setData] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  const [viewMode, setViewMode] = useState<'guests' | 'families'>('guests');
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({});

  const toggleFamily = (groupId: string) => {
    setExpandedFamilies(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const fetchGuests = async () => {
    setLoading(true);
    const { data: guests, error } = await supabase
      .from('guests' as any)
      .select('*, group:groups(name)');
      
    if (error) {
      toast.error('Erro ao buscar convidados');
    } else {
      const formatted = guests.map((g: any) => ({
        id: g.id,
        first_name: g.first_name,
        last_name: g.last_name,
        phone: g.phone,
        type: g.type,
        confirmation_status: g.confirmation_status || 'pending',
        group_name: g.group?.name || 'Sem Família',
        group_id: g.group_id
      }));
      setData(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleQuickConfirm = async (guest: GuestRow) => {
    const newStatus = guest.confirmation_status === 'confirmed' ? 'pending' : 'confirmed';
    const { error } = await supabase
      .from('guests')
      .update({ confirmation_status: newStatus })
      .eq('id', guest.id);
      
    if (error) {
      toast.error('Erro ao atualizar confirmação.');
    } else {
      toast.success(newStatus === 'confirmed' ? 'Presença confirmada!' : 'Confirmação desfeita.');
      fetchGuests();
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'confirmed') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={14}/> Confirmado</span>;
    if (status === 'declined') return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle size={14}/> Recusado</span>;
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"><Clock size={14}/> Pendente</span>;
  };

  const columns = useMemo(() => [
    columnHelper.accessor(row => `${row.first_name} ${row.last_name || ''}`, {
      id: 'name',
      header: 'Nome Completo',
      cell: info => <span className="font-medium text-text-main">{info.getValue()}</span>,
    }),
    columnHelper.accessor('group_name', {
      header: 'Família / Grupo',
      cell: info => <span className="text-sm text-text-muted">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', {
      header: 'Tipo',
      cell: info => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('confirmation_status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleQuickConfirm(info.row.original)} className={`p-1.5 rounded-md transition-colors ${info.row.original.confirmation_status === 'confirmed' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`} title="Confirmação Rápida">
            <CheckCircle size={16} />
          </button>
          <button onClick={() => openEditModal(info.row.original)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Editar"><Edit size={16} /></button>
          <button onClick={() => openDeleteModal(info.row.original)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Excluir"><Trash2 size={16} /></button>
        </div>
      ),
    })
  ], []);

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return data;
    return data.filter(g => g.confirmation_status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        toast.success(`${results.data.length} registros lidos do CSV (Importação pendente de lógica).`);
        console.log(results.data);
      }
    });
  };

  // --- Add Family Flow ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [members, setMembers] = useState([{ name: '', type: 'Adulto' }]);
  const [isAdding, setIsAdding] = useState(false);

  // --- Add Single Guest Flow ---
  const [isAddSingleModalOpen, setIsAddSingleModalOpen] = useState(false);
  const [singleGuestName, setSingleGuestName] = useState('');
  const [singleGuestType, setSingleGuestType] = useState('Adulto');
  const [linkToFamily, setLinkToFamily] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [isAddingSingle, setIsAddingSingle] = useState(false);

  // Derive unique groups from current data
  const uniqueGroups = useMemo(() => {
    const groupsMap = new Map();
    filteredData.forEach(g => {
      if (g.group_id && g.group_name && g.group_name !== 'Sem Família') {
        groupsMap.set(g.group_id, g.group_name);
      }
    });
    return Array.from(groupsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [filteredData]);

  const addMemberField = () => setMembers([...members, { name: '', type: 'Adulto' }]);
  const removeMemberField = (index: number) => setMembers(members.filter((_, i) => i !== index));
  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleAddFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim() || members.some(m => !m.name.trim())) {
      toast.error('Preencha o nome da família e de todos os membros.');
      return;
    }
    setIsAdding(true);
    
    // 1. Create group
    const { data: groupData, error: groupError } = await supabase
      .from('groups' as any)
      .insert({ name: familyName, type: 'Família' })
      .select()
      .single();
      
    if (groupError || !groupData) {
      toast.error('Erro ao criar família.');
      setIsAdding(false);
      return;
    }
    
    // 2. Create guests
    const guestsToInsert = members.map(m => {
      const parts = m.name.trim().split(' ');
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      return {
        first_name: firstName,
        last_name: lastName,
        group_id: groupData.id,
        type: m.type
      };
    });

    const { error: guestError } = await supabase
      .from('guests' as any)
      .insert(guestsToInsert);
      
    if (guestError) {
      toast.error('Erro ao cadastrar convidados.');
    } else {
      toast.success('Família adicionada com sucesso!');
      setIsAddModalOpen(false);
      setFamilyName('');
      setMembers([{ name: '', type: 'Adulto' }]);
      fetchGuests();
    }
    setIsAdding(false);
  };

  const handleAddSingleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleGuestName.trim()) {
      toast.error('Preencha o nome do convidado.');
      return;
    }
    if (linkToFamily && !selectedGroupId) {
      toast.error('Selecione uma família para vincular.');
      return;
    }
    
    setIsAddingSingle(true);
    let targetGroupId = selectedGroupId;

    if (!linkToFamily) {
      // Create a new individual family
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({ name: singleGuestName, type: 'Individual' })
        .select()
        .single();
        
      if (groupError || !groupData) {
        toast.error('Erro ao criar registro individual.');
        setIsAddingSingle(false);
        return;
      }
      targetGroupId = groupData.id;
    }

    const parts = singleGuestName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    const { error: guestError } = await supabase
      .from('guests')
      .insert({
        first_name: firstName,
        last_name: lastName,
        group_id: targetGroupId,
        type: singleGuestType
      });
      
    if (guestError) {
      toast.error('Erro ao cadastrar convidado.');
    } else {
      toast.success('Convidado adicionado com sucesso!');
      setIsAddSingleModalOpen(false);
      setSingleGuestName('');
      setLinkToFamily(false);
      setSelectedGroupId('');
      fetchGuests();
    }
    setIsAddingSingle(false);
  };

  // --- Edit Flow ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestRow | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const openEditModal = (guest: GuestRow) => {
    setEditingGuest(guest);
    setEditFirstName(guest.first_name);
    setEditLastName(guest.last_name || '');
    setEditStatus(guest.confirmation_status);
    setIsEditModalOpen(true);
  };

  const handleEditGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;
    
    const { error } = await supabase
      .from('guests')
      .update({
        first_name: editFirstName,
        last_name: editLastName,
        confirmation_status: editStatus
      })
      .eq('id', editingGuest.id);

    if (error) {
      toast.error('Erro ao atualizar convidado.');
    } else {
      toast.success('Convidado atualizado!');
      setIsEditModalOpen(false);
      fetchGuests();
    }
  };

  // --- Delete Flow ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<GuestRow | null>(null);

  const openDeleteModal = (guest: GuestRow) => {
    setGuestToDelete(guest);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteGuest = async () => {
    if (!guestToDelete) return;
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestToDelete.id);
      
    if (error) {
      toast.error('Erro ao excluir convidado.');
    } else {
      toast.success('Convidado excluído.');
      setIsDeleteModalOpen(false);
      fetchGuests();
    }
  };

  return (
    <div className="animate-fade-in w-full pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-main flex items-center gap-3">
            Convidados
            {!loading && (
              <span className="bg-accent/10 text-accent text-sm px-3 py-1 rounded-full font-sans font-medium">
                {filteredData.length} total
              </span>
            )}
          </h1>
          <p className="text-text-muted mt-1 text-sm sm:text-base">Gerencie a lista e confirmações.</p>
        </div>
        
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <label className="flex-1 sm:flex-none cursor-pointer bg-white border border-border-light text-text-main px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-bg-secondary transition-colors shadow-sm">
            <Upload size={16} />
            <span className="hidden sm:inline">Importar CSV</span>
            <span className="sm:hidden">Importar</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => setIsAddSingleModalOpen(true)}
            className="flex-1 sm:flex-none bg-white border border-border-light text-text-main px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-bg-secondary transition-colors shadow-sm"
          >
            <UserPlus size={16} />
            Novo Convidado
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none bg-accent text-white px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={16} />
            Nova Família
          </button>
        </div>
      </div>

      <div className="bg-white sm:rounded-2xl sm:border border-border-light shadow-sm sm:overflow-hidden -mx-4 sm:mx-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-secondary/30">
          <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou família..." 
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-main"
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="declined">Não irão</option>
            </select>
          </div>
          <div className="flex bg-white rounded-lg border border-border-light p-1 w-full sm:w-auto">
            <button 
              onClick={() => setViewMode('guests')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'guests' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-bg-secondary'}`}
            >
              Convidados
            </button>
            <button 
              onClick={() => setViewMode('families')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'families' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-bg-secondary'}`}
            >
              Famílias
            </button>
          </div>
        </div>

        {viewMode === 'guests' ? (
          <>
            {/* Mobile View (Cards) */}
        <div className="sm:hidden divide-y divide-border-light">
          {loading ? (
            <div className="p-8 text-center text-text-muted">Carregando convidados...</div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="p-8 text-center text-text-muted">Nenhum convidado encontrado.</div>
          ) : (
            table.getRowModel().rows.map(row => {
              const guest = row.original;
              return (
                <div key={guest.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-text-main text-base">{guest.first_name} {guest.last_name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{guest.group_name} • {guest.type}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleQuickConfirm(guest)} className={`p-2 rounded-lg ${guest.confirmation_status === 'confirmed' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50 hover:bg-green-50 hover:text-green-600'}`}><CheckCircle size={16}/></button>
                      <button onClick={() => openEditModal(guest)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit size={16}/></button>
                      <button onClick={() => openDeleteModal(guest)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={guest.confirmation_status} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-bg-secondary border-b border-border-light">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-text-muted">Carregando convidados...</td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-text-muted">Nenhum convidado encontrado.</td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-4 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-light flex items-center justify-between bg-bg-secondary/30">
          <span className="text-sm text-text-muted">
            Pág {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border border-border-light rounded-md text-sm font-medium bg-white disabled:opacity-50 hover:bg-bg-secondary"
            >
              Anterior
            </button>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border border-border-light rounded-md text-sm font-medium bg-white disabled:opacity-50 hover:bg-bg-secondary"
            >
              Próxima
            </button>
          </div>
        </div>
        </>
        ) : (
          /* Families View */
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {uniqueGroups.map(group => {
              const familyMembers = filteredData.filter(g => g.group_id === group.id);
              const matchingMembers = familyMembers.filter(g => 
                !globalFilter || 
                `${g.first_name} ${g.last_name || ''}`.toLowerCase().includes(globalFilter.toLowerCase()) ||
                group.name.toLowerCase().includes(globalFilter.toLowerCase())
              );
              
              if (matchingMembers.length === 0) return null;

              return (
                <div key={group.id} className="border border-border-light rounded-xl p-4 bg-white shadow-sm flex flex-col">
                  <div 
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => toggleFamily(group.id)}
                  >
                    <h3 className="font-sans font-semibold text-lg text-accent">
                      {group.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-text-muted bg-bg-secondary px-2.5 py-1 rounded-full">
                        {familyMembers.length} {familyMembers.length === 1 ? 'membro' : 'membros'}
                      </span>
                      {expandedFamilies[group.id] ? (
                        <ChevronUp size={20} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={20} className="text-text-muted" />
                      )}
                    </div>
                  </div>
                  
                  {expandedFamilies[group.id] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-border-light mt-4">
                      {familyMembers.map(guest => (
                        <div key={guest.id} className="flex justify-between items-start sm:items-center bg-bg-secondary/30 p-3 rounded-lg border border-border-light">
                          <div>
                            <p className="font-medium text-text-main text-sm">{guest.first_name} {guest.last_name}</p>
                            <p className="text-xs text-text-muted mt-0.5 mb-2">{guest.type}</p>
                            <StatusBadge status={guest.confirmation_status} />
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleQuickConfirm(guest)} className={`p-1.5 rounded-lg transition-colors ${guest.confirmation_status === 'confirmed' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50 hover:bg-green-50 hover:text-green-600'}`}><CheckCircle size={16}/></button>
                            <button onClick={() => openEditModal(guest)} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><Edit size={16}/></button>
                            <button onClick={() => openDeleteModal(guest)} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {uniqueGroups.length === 0 && (
              <div className="p-8 text-center text-text-muted">Nenhuma família encontrada.</div>
            )}
          </div>
        )}
      </div>

      {/* Add Family Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h3 className="font-heading text-2xl text-accent mb-2">Nova Família</h3>
        <p className="text-text-muted text-sm mb-4">Cadastre uma família e seus membros.</p>
        
        <form onSubmit={handleAddFamily} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Nome da Família</label>
            <input 
              type="text" 
              required
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Ex: Família Silva"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-text-main">Membros</label>
            </div>
            
            {members.map((member, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input 
                    type="text" 
                    required
                    value={member.name}
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    className="w-full px-3 py-3 bg-bg-secondary/50 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Nome Completo"
                  />
                  <select
                    value={member.type}
                    onChange={(e) => updateMember(index, 'type', e.target.value)}
                    className="w-full px-3 py-3 bg-bg-secondary/50 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="Adulto">Adulto</option>
                    <option value="Criança">Criança</option>
                  </select>
                </div>
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMemberField(index)} className="p-3 mt-1 text-red-500 hover:bg-red-50 rounded-lg">
                    <X size={20}/>
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addMemberField} className="w-full mt-2 py-3 border-2 border-dashed border-accent text-accent rounded-xl font-medium text-sm hover:bg-accent/5 transition-colors flex items-center justify-center gap-2">
              <Plus size={18}/> Adicionar Membro
            </button>
          </div>

          <button 
            type="submit"
            disabled={isAdding}
            className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors mt-4"
          >
            {isAdding ? 'Cadastrando...' : 'Salvar Família'}
          </button>
        </form>
      </Modal>

      {/* Add Single Guest Modal */}
      <Modal isOpen={isAddSingleModalOpen} onClose={() => setIsAddSingleModalOpen(false)}>
        <h3 className="font-heading text-2xl text-accent mb-2">Novo Convidado</h3>
        <p className="text-text-muted text-sm mb-4">Cadastre um convidado isolado ou vincule a uma família.</p>
        
        <form onSubmit={handleAddSingleGuest} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={singleGuestName}
              onChange={(e) => setSingleGuestName(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Tipo</label>
            <select
              value={singleGuestType}
              onChange={(e) => setSingleGuestType(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="Adulto">Adulto</option>
              <option value="Criança">Criança</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input 
                type="checkbox"
                checked={linkToFamily}
                onChange={(e) => {
                  setLinkToFamily(e.target.checked);
                  if (!e.target.checked) setSelectedGroupId('');
                }}
                className="w-4 h-4 text-accent border-border-light rounded focus:ring-accent"
              />
              <span className="text-sm font-medium text-text-main">Vincular a uma família existente</span>
            </label>
            
            {linkToFamily && (
              <select
                required
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-4 py-2 mt-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="" disabled>Selecione a família...</option>
                {uniqueGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
            {!linkToFamily && (
              <p className="text-xs text-text-muted mt-1">Será criado de forma individual (sem família).</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isAddingSingle}
            className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors mt-4"
          >
            {isAddingSingle ? 'Cadastrando...' : 'Salvar Convidado'}
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h3 className="font-heading text-2xl text-accent mb-2">Editar Convidado</h3>
        <form onSubmit={handleEditGuest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Nome</label>
            <input 
              type="text" 
              required
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Sobrenome</label>
            <input 
              type="text" 
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary/50 border border-border-light rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="declined">Recusado</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90">Salvar Alterações</button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h3 className="font-heading text-2xl text-red-600 mb-2">Excluir Convidado</h3>
        <p className="text-text-main mb-6">
          Tem certeza que deseja excluir <strong>{guestToDelete?.first_name} {guestToDelete?.last_name}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 border border-border-light rounded-xl font-medium hover:bg-bg-secondary">Cancelar</button>
          <button onClick={handleDeleteGuest} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700">Sim, Excluir</button>
        </div>
      </Modal>
    </div>
  );
};
