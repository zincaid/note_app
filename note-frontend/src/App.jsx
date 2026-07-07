import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Currency States
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PHP");
  const [rate, setRate] = useState(null);
  const [displayRate, setDisplayRate] = useState(null);

  const API_URL = 'http://localhost:8080/api/notes';

  // --- MOVE FUNCTION DEFINITIONS TO THE TOP ---

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${KEY}/pair/${from}/${to}`);
      setRate(response.data.conversion_rate);
    } catch (error) {
      console.error("Failed to fetch exchange rate", error);
    }
  };

  // --- NOW THE useEffect CAN SAFELY CALL THEM ---

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleConvert = async () => {
    await fetchExchangeRate();
    if (rate) {
        setDisplayRate((amount * rate).toFixed(2));
    }
  };

  const swapCurrencies = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setDisplayRate(null);
  };

  const handleCreate = async (e) => { e.preventDefault(); await axios.post(API_URL, { title, content }); fetchNotes(); setTitle(''); setContent(''); };
  const handleUpdate = async (e) => { e.preventDefault(); await axios.put(`${API_URL}/${editingId}`, { title: editTitle, content: editContent }); closeModal(); fetchNotes(); };
  const openEditModal = (note) => { setEditingId(note.id); setEditTitle(note.title); setEditContent(note.content); setIsEditModalOpen(true); };
  const closeModal = () => { setIsEditModalOpen(false); setEditingId(null); setEditTitle(''); setEditContent(''); };
  const deleteNote = async (id) => { await axios.delete(`${API_URL}/${id}`); fetchNotes(); };

  return (
    <div className="min-h-screen bg-[#fdfaf3] p-4 lg:p-12 font-sans text-[#1a3428]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        <div className="w-full lg:flex-1 flex flex-col">
          <section className="w-full bg-[#1a3428] text-[#fdfaf3] rounded-[2rem] p-8 shadow-md">
            <h1 className="text-2xl font-serif font-bold mb-6">Notes</h1>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input className="bg-[#2a4539] text-white rounded-2xl px-5 py-4 outline-none" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea className="bg-[#2a4539] text-white rounded-2xl px-5 py-4 outline-none h-40 resize-none" placeholder="Write details..." value={content} onChange={(e) => setContent(e.target.value)} required />
              <button type="submit" className="bg-[#8fdcb4] text-[#1a3428] font-semibold py-4 rounded-2xl">Create note</button>
            </form>
          </section>
        </div>

        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
          <div className="bg-[#1a3428] rounded-[2rem] p-6 shadow-xl border border-[#437b67]">
            <h2 className="text-xl font-bold text-white mb-4">🗓️ Schedule</h2>
            <div className="bg-[#fdfaf3] rounded-xl overflow-hidden h-[300px]">
              <iframe src="https://calendar.google.com/calendar/embed?src=ZW4ucGhpbGlwcGluZXMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%231a3428" width="100%" height="100%" frameBorder="0"></iframe>
            </div>
          </div>

          <div className="bg-[#1a3428] rounded-[2rem] p-8 shadow-xl text-[#fdfaf3] border border-[#437b67]">
            <h2 className="text-xl font-serif font-bold mb-6">Convert your currency</h2>
            <input 
              type="number" 
              className="w-full bg-transparent text-5xl font-bold text-center mb-8 outline-none border-b-2 border-[#437b67] pb-2 placeholder-[#4a6358]"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex flex-col gap-2 relative">
              <div className="bg-[#2a4539] p-4 rounded-2xl flex justify-between items-center">
                <select className="bg-transparent font-bold outline-none cursor-pointer" value={from} onChange={(e) => setFrom(e.target.value)}>
                  {["USD", "PHP", "EUR", "GBP", "JPY"].map(c => <option key={c} value={c} className="text-[#1a3428]">{c}</option>)}
                </select>
                <span className="text-[#8fdcb4] font-medium">{amount}</span>
              </div>
              <button onClick={swapCurrencies} className="absolute left-1/2 -ml-5 top-[35px] bg-[#fdfaf3] text-[#1a3428] rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-10">⇅</button>
              <div className="bg-[#2a4539] p-4 rounded-2xl flex justify-between items-center">
                <select className="bg-transparent font-bold outline-none cursor-pointer" value={to} onChange={(e) => setTo(e.target.value)}>
                  {["USD", "PHP", "EUR", "GBP", "JPY"].map(c => <option key={c} value={c} className="text-[#1a3428]">{c}</option>)}
                </select>
                <span className="text-[#8fdcb4] font-bold text-lg">
                  {displayRate ? `+ ${displayRate}` : '---'}
                </span>
              </div>
            </div>
            <button onClick={handleConvert} className="w-full mt-8 bg-[#8fdcb4] text-[#1a3428] font-bold py-4 rounded-2xl hover:bg-[#7bc8a0] transition-colors">
              Convert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;