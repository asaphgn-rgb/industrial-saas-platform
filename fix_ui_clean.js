import fs from 'fs';
let content = fs.readFileSync('src/components/secure-chat/SecureChat.tsx', 'utf8');

const oldAttachUI = `                {msg.attachment_url && (
                   <div className={\`mt-3 flex items-center p-3 rounded-xl cursor-pointer transition-colors \${
                     isMine ? 'bg-fbsb-surface-200/50 hover:bg-fbsb-surface-200' : 'bg-fbsb-bg-main hover:bg-fbsb-text-secondary/20'
                   }\`}>
                      <FileText className={\`w-5 h-5 mr-3 \${isMine ? 'text-fbsb-cyan' : 'text-fbsb-text-primary'}\`}/>
                      <div>
                        <span className="text-xs font-bold block">Documento Anexado</span>
                        <span className="text-[10px] opacity-70 uppercase tracking-wider">Auditado pelo RLS</span>
                      </div>
                   </div>
                )}`;

const newAttachUI = `                {msg.attachment_url && msg.attachment_type === 'image' && (
                   <div className="mt-3 relative rounded-lg overflow-hidden border border-fbsb-border/30">
                      <img src={msg.attachment_url} alt="Anexo Seguro" className="max-w-full max-h-48 object-cover" />
                   </div>
                )}
                {msg.attachment_url && msg.attachment_type === 'pdf' && (
                   <div className={\`mt-3 flex items-center p-3 rounded-xl cursor-pointer transition-colors \${
                     isMine ? 'bg-fbsb-surface-200/50 hover:bg-fbsb-surface-200' : 'bg-fbsb-bg-main hover:bg-fbsb-text-secondary/20'
                   }\`} onClick={() => {
                      const w = window.open("");
                      w?.document.write("<iframe width='100%' height='100%' src='" + msg.attachment_url + "'></iframe>");
                   }}>
                      <FileText className={\`w-5 h-5 mr-3 \${isMine ? 'text-fbsb-cyan' : 'text-fbsb-text-primary'}\`}/>
                      <div>
                        <span className="text-xs font-bold block">Documento Seguro.pdf</span>
                        <span className="text-[10px] opacity-70 uppercase tracking-wider">Clique para visualizar</span>
                      </div>
                   </div>
                )}
                {msg.audio_data && (
                   <div className="mt-3 w-48 md:w-64">
                     <audio src={msg.audio_data} controls className="w-full h-8" />
                   </div>
                )}`;

content = content.replace(oldAttachUI, newAttachUI);


const oldForm = `      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-4 bg-fbsb-surface-100 border-t border-fbsb-border flex items-end space-x-3">
        <button
          type="button"
          className="p-3 text-fbsb-text-secondary hover:text-fbsb-text-primary hover:bg-fbsb-bg-main rounded-xl transition-colors"
          title="Anexar Documento Sigiloso"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Comunicação segura E2E..."
          className="flex-1 max-h-32 min-h-[52px] bg-fbsb-bg-main/50 rounded-xl border border-transparent hover:border-fbsb-border focus:bg-fbsb-surface-100 focus:border-fbsb-cyan focus:ring-1 focus:ring-fbsb-cyan p-4 text-sm resize-none transition-all outline-none text-fbsb-text-primary"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-4 bg-fbsb-primary text-fbsb-cyan rounded-xl hover:bg-fbsb-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md shadow-fbsb-primary/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>`;

const newForm = `      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-4 bg-fbsb-surface-100 border-t border-fbsb-border flex items-end space-x-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-fbsb-text-secondary hover:text-fbsb-text-primary hover:bg-fbsb-bg-main rounded-xl transition-colors"
          title="Anexar Arquivo ou Foto"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*,application/pdf" 
        />

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Comunicação segura E2E..."
          className="flex-1 max-h-32 min-h-[52px] bg-fbsb-bg-main/50 rounded-xl border border-transparent hover:border-fbsb-border focus:bg-fbsb-surface-100 focus:border-fbsb-cyan focus:ring-1 focus:ring-fbsb-cyan p-4 text-sm resize-none transition-all outline-none text-fbsb-text-primary"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />

        {newMessage.trim() === '' ? (
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={\`p-4 rounded-xl transition-all flex items-center justify-center shadow-md \${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-fbsb-primary text-fbsb-cyan hover:bg-fbsb-surface-200'}\`}
          >
            <Mic className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            className="p-4 bg-fbsb-primary text-fbsb-cyan rounded-xl hover:bg-fbsb-surface-200 transition-all flex items-center justify-center shadow-md shadow-fbsb-primary/20"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </form>`;

content = content.replace(oldForm, newForm);

fs.writeFileSync('src/components/secure-chat/SecureChat.tsx', content);
