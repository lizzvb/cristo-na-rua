'use client'
import Link from 'next/link'
import { ChangeEvent, useState } from 'react'

export default function Contribuicoes(){
  const [file,setFile]=useState<File|null>(null)
  const [status,setStatus]=useState<'aguardando'|'em_analise'|'confirmada'>('aguardando')
  function handleFile(e:ChangeEvent<HTMLInputElement>){setFile(e.target.files?.[0]||null)}
  function enviar(){if(file)setStatus('em_analise')}
  return <main className="main" style={{maxWidth:800,margin:'auto'}}>
    <Link href="/membros">← Área dos membros</Link>
    <div className="pageTitle"><div className="eyebrow">Apoie a missão</div><h1 className="serif" style={{fontSize:48}}>Contribuição da ação</h1><p className="mutedDark">Sua contribuição é voluntária e ajuda a dividir o custo da ação entre quem escolheu participar.</p></div>
    <div className="event">
      <p>Custo estimado da ação</p><h2>R$ 1.000,00</h2>
      <p>20 voluntários escolheram contribuir</p><hr/>
      <p>Sua cota sugerida</p><h2>R$ 50,00</h2>
      <div className="pixBox"><div className="eyebrow">PIX</div><strong>cristonarua@exemplo.org</strong><small>Chave demonstrativa — substituir pela chave oficial.</small></div>
      <div className="proofBox"><label className="uploadLabel">Comprovante do PIX<input type="file" accept="image/*,.pdf" onChange={handleFile}/></label>{file&&<p className="fileName">📎 {file.name}</p>}<button className="btn gold" style={{width:'100%',marginTop:15}} onClick={enviar} disabled={!file || status==='em_analise' || status==='confirmada'}>{status==='em_analise'?'Comprovante enviado':'Enviar comprovante'}</button></div>
      <div className={`statusCard ${status}`}><span className="statusIcon">{status==='aguardando'?'○':status==='em_analise'?'⏳':'✓'}</span><div><strong>{status==='aguardando'?'Aguardando comprovante':status==='em_analise'?'Em análise':'Confirmada'}</strong><p>{status==='aguardando'?'Faça o PIX e envie o comprovante para a equipe.':status==='em_analise'?'A equipe está conferindo seu comprovante. Apenas a coordenação pode visualizar o arquivo.':'A equipe confirmou sua contribuição para esta ação.'}</p></div></div>
      <p className="muted" style={{fontSize:13}}>O comprovante é privado e não fica visível para os outros membros.</p>
    </div>
  </main>
}
