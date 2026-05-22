'use client';
import React from 'react';
import { Activity, Server, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function SectionMonitoring() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> Monitoring & Santé Système</h2>
          <p className="text-sm text-slate-400 mt-1">Surveillance des serveurs, logs API et sécurité (Style Sentry/Grafana).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Cluster Compute (AWS)</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">24% <span className="text-xs text-slate-500 font-normal">CPU Moyen</span></div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-1/4 h-full bg-emerald-500 rounded-full"></div></div>
          <p className="text-[10px] text-slate-400 mt-2">Uptime: 99.99% • 8 instances actives</p>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Base de données (PostgreSQL)</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">450 <span className="text-xs text-slate-500 font-normal">QPS</span></div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-1/3 h-full bg-indigo-500 rounded-full"></div></div>
          <p className="text-[10px] text-slate-400 mt-2">Latence read: 12ms • Write: 24ms</p>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Sécurité & Erreurs</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-2">12 <span className="text-xs text-slate-500 font-normal">Alertes (1h)</span></div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-[5%] h-full bg-amber-500 rounded-full"></div></div>
          <p className="text-[10px] text-slate-400 mt-2">0 incident critique signalé</p>
        </div>
      </div>

      {/* Logs API */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5">
        <h3 className="font-bold text-white text-sm mb-4">Derniers Logs Système</h3>
        <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2 h-64 overflow-y-auto border border-slate-800">
          <p><span className="text-emerald-400">[20:45:12] INFO</span>: (WebSocket) Client connecté [USR-8821]</p>
          <p><span className="text-indigo-400">[20:45:10] REQ </span>: POST /api/v1/payments/webhook - 200 OK (24ms)</p>
          <p><span className="text-indigo-400">[20:45:08] REQ </span>: GET /api/v1/fleet/location - 200 OK (15ms)</p>
          <p><span className="text-amber-400">[20:45:01] WARN</span>: Rate limit approché pour IP 192.168.1.1 (Tenant: TNT-005)</p>
          <p><span className="text-emerald-400">[20:44:59] INFO</span>: PaymentSettlementEngine batch complété (3 settlements)</p>
          <p><span className="text-indigo-400">[20:44:50] REQ </span>: POST /api/v1/auth/login - 200 OK (80ms)</p>
        </div>
      </div>
    </div>
  );
}
