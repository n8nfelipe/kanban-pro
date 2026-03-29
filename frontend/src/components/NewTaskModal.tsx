import React, { useState } from 'react';
import { X, Calendar, User, Flag, AlignLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useBoardStore } from '@/store/useBoardStore';
import { mockUsers } from '@/lib/mockData';

export default function NewTaskModal() {
  const { isNewTaskModalOpen, closeNewTaskModal, newTaskTargetColumnId, editTaskId } = useAppStore();
  const { board, addTask, updateTask } = useBoardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('none');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Load existing task data if we are in "Edit Mode"
  React.useEffect(() => {
    if (isNewTaskModalOpen && editTaskId && board) {
      // Find the card across all columns
      for (const col of board.columns) {
        const card = col.cards.find((c: any) => c.id === editTaskId);
        if (card) {
          setTitle(card.title || '');
          setDescription(card.description || '');
          setPriority(card.priority || 'medium');
          setStartDate(card.startDate ? new Date(card.startDate).toISOString().split('T')[0] : '');
          setDueDate(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
          
          // Reverse lookup the assigneeId from the mock user ID in the database
          if (card.assigneeId) {
            const objectKey = Object.keys(mockUsers).find(k => (mockUsers as any)[k].id === card.assigneeId);
            setAssigneeId(objectKey || 'none');
          } else {
            setAssigneeId('none');
          }
          break; // Found it
        }
      }
    } else if (isNewTaskModalOpen && !editTaskId) {
      // Clear data if we are opening a purely new task context
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssigneeId('none');
      setStartDate('');
      setDueDate('');
    }
  }, [isNewTaskModalOpen, editTaskId, board]);

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const realAssigneeId = assigneeId !== 'none' ? (mockUsers as any)[assigneeId].id : null;
    const taskPayload = {
      title,
      description,
      priority,
      assigneeId: realAssigneeId,
      startDate: startDate || null,
      dueDate: dueDate || null
    };

    if (editTaskId) {
      updateTask(editTaskId, taskPayload);
    } else {
      addTask(taskPayload, newTaskTargetColumnId);
    }

    // Reset and close
    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssigneeId('none');
    setStartDate('');
    setDueDate('');
    closeNewTaskModal();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(8, 12, 26, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%', maxWidth: '560px', background: 'rgba(15, 20, 35, 0.95)',
        border: '1px solid var(--border-subtle)', borderRadius: '24px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            {editTaskId ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={closeNewTaskModal} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-subtle)',
                fontSize: '24px', fontWeight: 600, color: 'white', padding: '8px 0', outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--neon-blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Priority */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Flag size={12}/> PRIORITY</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                  borderRadius: '10px', padding: '10px 12px', color: 'white', outline: 'none', fontSize: '13px', cursor: 'pointer', appearance: 'none'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={12}/> ASSIGNEE</label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                  borderRadius: '10px', padding: '10px 12px', color: 'white', outline: 'none', fontSize: '13px', cursor: 'pointer', appearance: 'none'
                }}
              >
                <option value="none">Unassigned</option>
                {Object.keys(mockUsers).map(key => (
                  <option key={key} value={key}>{(mockUsers as any)[key].name}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12}/> START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                  borderRadius: '10px', padding: '9px 12px', color: 'white', outline: 'none', fontSize: '13px'
                }}
              />
            </div>

            {/* Due Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12}/> DUE DATE</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                  borderRadius: '10px', padding: '9px 12px', color: 'white', outline: 'none', fontSize: '13px'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><AlignLeft size={12}/> DESCRIPTION</label>
            <textarea
              placeholder="Add more details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', padding: '12px', color: 'white', outline: 'none', fontSize: '13px', resize: 'vertical'
              }}
            />
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn-ghost" onClick={closeNewTaskModal}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              {editTaskId ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
