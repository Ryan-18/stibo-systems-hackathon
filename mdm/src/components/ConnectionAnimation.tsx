import React from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { ConnectionStatus } from '../types';

interface Props {
  status: ConnectionStatus;
}

export function ConnectionAnimation({ status }: Props) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {status.status === 'connecting' && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
            <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative z-10" />
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700">Establishing Secure Connection...</p>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}
      
      {status.status === 'connected' && (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
          </div>
          <p className="mt-6 text-xl font-medium text-green-700">Successfully Connected!</p>
          <p className="text-green-600 mt-2">Your system is now securely linked</p>
        </div>
      )}
      
      {status.status === 'error' && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
            <XCircle className="w-20 h-20 text-red-500 relative z-10" />
          </div>
          <p className="mt-6 text-xl font-medium text-red-700">{status.message || 'Connection Failed'}</p>
          <p className="text-red-600 mt-2">Please check your credentials and try again</p>
        </div>
      )}
    </div>
  );
}