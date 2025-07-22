import { useState, useEffect } from 'react';
import { Card } from './Card';
import { supabase } from '../../lib/supabase';

interface AccountUsersProps {
  groupId?: string;
  isOwner?: boolean;
}

export function AccountUsers({ groupId, isOwner }: AccountUsersProps) {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch members on mount or when groupId changes
  useEffect(() => {
    if (groupId) {
      supabase
        .from('family_members')
        .select('id, invited_email, role, status')
        .eq('group_id', groupId)
        .then(({ data }) => setMembers(data || []));
    }
  }, [groupId]);

  const handleInvite = async () => {
    setLoading(true);
    await supabase.from('family_members').insert([
      {
        group_id: groupId,
        invited_email: inviteEmail,
        status: 'pending',
        role: 'member',
      },
    ]);
    setInviteEmail('');
    setShowModal(false);
    // Refresh members
    const { data } = await supabase
      .from('family_members')
      .select('id, invited_email, role, status')
      .eq('group_id', groupId);
    setMembers(data || []);
    setLoading(false);
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-700 text-2xl">👤</span>
        <h2 className="text-lg font-semibold text-gray-800">Usuários do Sistema</h2>
      </div>
      <div className="mb-4 text-gray-500">
        Nenhum usuário cadastrado. Adicione usuários para separar as movimentações financeiras.
      </div>
      <button
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-3 rounded-md shadow transition"
        onClick={() => setShowModal(true)}
      >
        + Adicionar Usuário
      </button>
      <ul className="mt-4">
        {members.map(member => (
          <li key={member.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span>
              {member.invited_email}
              <span className="ml-2 text-xs text-gray-400">{member.role}</span>
              <span className={`ml-2 text-xs ${member.status === 'active' ? 'text-green-600' : 'text-yellow-500'}`}>
                {member.status === 'active' ? 'Ativo' : 'Pendente'}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Convidar Membro</h3>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4"
              placeholder="Email do membro"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-md bg-pink-500 text-white font-semibold"
                onClick={handleInvite}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Convidar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 