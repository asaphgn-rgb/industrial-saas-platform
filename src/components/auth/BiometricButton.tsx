import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BiometricButtonProps {
  onSuccess: () => void;
  email: string;
}

export function BiometricButton({ onSuccess, email }: BiometricButtonProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  const handleBiometricAuth = async () => {
    if (!email) {
      alert("Digite seu email primeiro para identificar a biometria correspondente.");
      return;
    }

    setStatus('scanning');

    try {
      // Verifica se a API WebAuthn (Web Authentication API) está disponível no browser/celular
      if (window.PublicKeyCredential) {
        // Simulamos a requisição biométrica (FaceID/TouchID)
        // Em um app PWA mobile, isso invocaria a biometria nativa. Como estamos em web simulado:
        
        const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (isAvailable) {
           // O dispositivo possui leitor de impressão digital ou FaceID nativo
           // Na Vercel real isso faria navigator.credentials.get({...})
           // Para fins de demonstração, simulamos a UI da biometria:
           setTimeout(() => {
              setStatus('success');
              setTimeout(() => {
                 onSuccess();
              }, 800);
           }, 2000);
        } else {
           // Fallback se não tiver hardware (ex: PC sem leitor biométrico)
           setTimeout(() => {
             setStatus('success');
             setTimeout(() => onSuccess(), 800);
           }, 1500);
        }
      } else {
        // Fallback para simulador visual
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => onSuccess(), 800);
        }, 1500);
      }
    } catch (e) {
      setStatus('failed');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBiometricAuth}
      className={`w-full flex items-center justify-center px-4 py-3 mt-3 border border-fbsb-border text-sm font-bold rounded-xl shadow-premium uppercase tracking-widest transition-all ${
        status === 'idle' ? 'bg-fbsb-surface-200 text-fbsb-text-primary hover:bg-fbsb-surface-100 hover:border-fbsb-cyan' :
        status === 'scanning' ? 'bg-fbsb-primary text-white border-fbsb-primary' :
        status === 'success' ? 'bg-fbsb-success/20 text-fbsb-success border-fbsb-success' :
        'bg-fbsb-danger/20 text-fbsb-danger border-fbsb-danger'
      }`}
    >
      {status === 'idle' && (
        <>
          <Fingerprint className="w-5 h-5 mr-2 text-fbsb-cyan" />
          Acesso Biométrico
        </>
      )}
      {status === 'scanning' && (
        <>
          <Fingerprint className="w-5 h-5 mr-2 text-fbsb-cyan animate-pulse" />
          Lendo Biometria...
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Autenticado
        </>
      )}
      {status === 'failed' && (
        <>
          <AlertTriangle className="w-5 h-5 mr-2" />
          Falha Biométrica
        </>
      )}
    </button>
  );
}
