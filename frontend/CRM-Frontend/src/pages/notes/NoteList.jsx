import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, StickyNote, User, Clock, Paperclip, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

const NoteList = ({ leadId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchNotes = async () => {
    if (!leadId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const res = await api.get('/notes', {
        params: { leadId },
        headers: { Authorization: `Bearer ${token}` }
      });

      const extracted = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.notes || []);
      setNotes(extracted);
    } catch (err) {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Optional client side extension validation
    const allowedExtensions = /(\.pdf|\.doc|\.docx|\.txt)$/i;
    if (!allowedExtensions.exec(selectedFile.name)) {
      toast.error("Please upload PDF, Word, or text documents only.");
      return;
    }
    setFile(selectedFile);
  };

  const addNote = async () => {
    if (!newNote.trim() && !file) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      
      // Setup Multipart form data for Multer pipeline processing
      const formData = new FormData();
      formData.append('content', newNote);
      formData.append('leadId', leadId);
      if (file) {
        formData.append('file', file);
      }

      await api.post('/notes', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Note and document added successfully");
      setNewNote('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/*  Header Title */}
      <div className="px-1">
        <h3 className="text-base font-bold flex items-center gap-2 text-[#004c4c]">
          <StickyNote className="h-4 w-4 text-[#008080]" />
          Notes & Logs
        </h3>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">Track interactions, attachments, and important observations.</p>
      </div>

      {/*  Add Note Textarea & File Module */}
      <div className="space-y-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="flex gap-2.5 items-end">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write operational updates or log attachments..."
            className="min-h-[76px] resize-none bg-white border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] rounded-xl text-xs font-medium placeholder:text-slate-400"
          />
          <div className="flex flex-col gap-2 shrink-0">
            {/* Hidden Input File Element */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.txt" 
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className={`h-[35px] w-[42px] p-0 border-slate-200 hover:bg-slate-100 rounded-xl transition-all ${file ? 'border-[#008080] bg-[#b2d8d8]/20 text-[#008080]' : 'text-slate-500'}`}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              onClick={addNote} 
              className="h-[35px] w-[42px] p-0 bg-[#008080] hover:bg-[#006666] text-white rounded-xl transition-all duration-200 shadow-sm active:scale-[0.97]"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </div>
        </div>

        {/*  Queued attachment indicator */}
        {file && (
          <div className="flex items-center justify-between bg-white border border-[#b2d8d8]/60 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 animate-in slide-in-from-top-1">
            <div className="flex items-center gap-1.5 truncate">
              <FileText className="h-3.5 w-3.5 text-[#008080] shrink-0" />
              <span className="truncate">{file.name}</span>
              <span className="text-slate-400 text-[10px] font-normal">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button 
              type="button" 
              onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/*  Notes List Stack */}
      <Card className="border border-slate-200/60 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-xs font-semibold text-[#006666]/70 tracking-wide">
              <div className="w-4 h-4 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
              <span>Syncing workspace notes...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-10 text-xs font-semibold text-slate-400 select-none">
              No log notes recorded. Add one above.
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-slate-50">
              {notes.map((note, index) => (
                <div 
                  key={note.id || index} 
                  className="pt-3 first:pt-0 border-l-3 border-[#008080] pl-4 py-1.5 bg-gradient-to-r from-[#b2d8d8]/5 to-transparent rounded-r-lg transition-colors duration-200 hover:from-[#b2d8d8]/10"
                >
                  <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="h-2.5 w-2.5" />
                      </div>
                      <span>{note.creator?.name || note.userName || "Team Member"}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="h-2.5 w-2.5 text-slate-300" />
                      <span>
                        {new Date(note.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteList;