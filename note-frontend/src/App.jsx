import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:8080/api/notes';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get(API_URL);
    setNotes(response.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const noteData = { title, content }; 
    
    await axios.post(API_URL, noteData);
    fetchNotes(); 
    setTitle('');
    setContent('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const noteData = { title: editTitle, content: editContent };
    
    await axios.put(`${API_URL}/${editingId}`, noteData);
    closeModal();
    fetchNotes();
  };

  const openEditModal = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchNotes();
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Just now'; 
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#fdfaf3] p-4 lg:p-12 font-sans text-[#1a3428] relative">
      
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        <section className="w-full bg-[#1a3428] text-[#fdfaf3] rounded-[2rem] p-8 flex flex-col mb-12 shadow-md">
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#8fdcb4] text-[#1a3428] rounded-full w-10 h-10 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8fdcb4] font-semibold">Zincaid</p>
                <h1 className="text-2xl font-serif font-bold">Notes</h1>
              </div>
            </div>
            <div className="border border-[#437b67] rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              {notes.length}
            </div>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#e2dfd5]">Title</label>
              <input 
                className="bg-[#2a4539] text-white placeholder-[#85a396] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-[#8fdcb4] transition-all"
                placeholder="Input a title..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#e2dfd5]">Note</label>
              <textarea 
                className="bg-[#2a4539] text-white placeholder-[#85a396] rounded-2xl px-5 py-4 outline-none h-40 resize-none focus:ring-2 ring-[#8fdcb4] transition-all"
                placeholder="Write the detail..." 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required
              />
            </div>

            <div className="mt-4 w-full flex justify-center">
              <button 
                type="submit" 
                className="w-full bg-[#8fdcb4] hover:bg-[#7bc8a0] transition-colors text-[#1a3428] font-semibold text-lg py-4 rounded-2xl flex justify-center items-center gap-2"
              >
                <span>+ Create note</span>
              </button>
            </div>
          </form>
        </section>

        <hr className="w-full border-[#d8d3c5] border-t-2 mb-12 rounded-full" />

        <div className="mb-10 text-center">
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#437b67]">Notes Archive</h2>
        </div>

        <div className="w-full flex flex-col gap-6 pb-12">
          {notes.map(note => (
            <div key={note.id} className="border border-[#d8d3c5] bg-[#fdfaf3] rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="text-2xl font-sans font-medium text-[#1a3428] break-words flex-1">
                  {note.title}
                </h3>
                
                <div className="flex flex-col items-end shrink-0 text-right">
                  <span className="text-xs text-[#6b857a] font-semibold tracking-wide uppercase">
                    {/* If updatedAt exists and is different, show that. Otherwise, show createdAt */}
                    {note.updatedAt && note.updatedAt !== note.createdAt 
                      ? formatTime(note.updatedAt) 
                      : formatTime(note.createdAt)
                    }
                  </span>
                </div>
              </div>

              <p className="text-[#4a6358] text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                {note.content}
              </p>
              
              <div className="flex items-center gap-4 mt-auto w-full">
                <button 
                  onClick={() => openEditModal(note)}
                  className="flex-1 w-full bg-[#1a3428] hover:bg-[#2a4539] transition-colors text-white py-3 rounded-full font-medium flex justify-center items-center text-center"
                >
                  Edit
                </button>
                
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-[#d8d3c5] text-[#4a6358] hover:bg-[#f1dede] hover:text-[#c44343] hover:border-[#c44343] transition-colors"
                  aria-label="Delete note"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          
          <div className="bg-[#1a3428] w-full max-w-xl rounded-[2rem] p-8 shadow-2xl">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-white">Edit Note</h2>
              <button 
                onClick={closeModal}
                className="text-[#85a396] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#e2dfd5]">Title</label>
                <input 
                  className="bg-[#2a4539] text-white placeholder-[#85a396] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-[#8fdcb4] transition-all"
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#e2dfd5]">Note</label>
                <textarea 
                  className="bg-[#2a4539] text-white placeholder-[#85a396] rounded-2xl px-5 py-4 outline-none h-40 resize-none focus:ring-2 ring-[#8fdcb4] transition-all"
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)} 
                  required
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-transparent border-2 border-[#4a6358] hover:border-[#85a396] text-[#e2dfd5] font-medium py-3 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#8fdcb4] hover:bg-[#7bc8a0] transition-colors text-[#1a3428] font-bold py-3 rounded-2xl"
                >
                  ✓ Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;