'use client'
import Link from 'next/link'
import { ChangeEvent, useMemo, useState } from 'react'
import JSZip from 'jszip'

type Photo = { id: number; name: string; url: string; file?: File }
type LogoPosition = 'top-left'|'top-center'|'top-right'|'middle-left'|'center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right'
type LogoSize = 'small'|'medium'|'large'

async function imageWithLogo(photo: Photo, addLogo: boolean, position: LogoPosition, size: LogoSize, opacity: number): Promise<Blob> {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = photo.url
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Não foi possível carregar a foto.')) })

  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth || 1600
  canvas.height = image.naturalHeight || 1000
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  if (addLogo) {
    const logo = new Image()
    logo.src = '/logo.jpg'
    await new Promise<void>((resolve, reject) => { logo.onload = () => resolve(); logo.onerror = () => reject(new Error('Não foi possível carregar o logo.')) })
    const sizeFactor = size === 'small' ? 0.11 : size === 'large' ? 0.23 : 0.16
    const maxW = Math.max(90, Math.round(canvas.width * sizeFactor))
    const maxH = Math.max(90, Math.round(canvas.height * sizeFactor))
    const scale = Math.min(maxW / logo.naturalWidth, maxH / logo.naturalHeight)
    const w = Math.round(logo.naturalWidth * scale)
    const h = Math.round(logo.naturalHeight * scale)
    const pad = Math.round(Math.min(canvas.width, canvas.height) * 0.025)
    const positions: Record<LogoPosition, [number, number]> = {
      'top-left': [pad, pad],
      'top-center': [(canvas.width - w) / 2, pad],
      'top-right': [canvas.width - w - pad, pad],
      'middle-left': [pad, (canvas.height - h) / 2],
      'center': [(canvas.width - w) / 2, (canvas.height - h) / 2],
      'middle-right': [canvas.width - w - pad, (canvas.height - h) / 2],
      'bottom-left': [pad, canvas.height - h - pad],
      'bottom-center': [(canvas.width - w) / 2, canvas.height - h - pad],
      'bottom-right': [canvas.width - w - pad, canvas.height - h - pad]
    }
    const [x, y] = positions[position]
    ctx.save()
    ctx.globalAlpha = opacity / 100
    ctx.drawImage(logo, x, y, w, h)
    ctx.restore()
  }

  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Falha ao gerar a imagem.')), 'image/jpeg', 0.92))
}

export default function Admin(){
  const [approved,setApproved]=useState(false)
  const [proof,setProof]=useState<'pending'|'approved'|'rejected'>('pending')
  const [photos,setPhotos]=useState<Photo[]>([
    {id:1,name:'acao-centro-01.jpg',url:'/logo.jpg'},
    {id:2,name:'acao-centro-02.jpg',url:'/logo.jpg'},
    {id:3,name:'acao-centro-03.jpg',url:'/logo.jpg'}
  ])
  const [selected,setSelected]=useState<number[]>([1,2,3])
  const [addLogo,setAddLogo]=useState(true)
  const [logoPosition,setLogoPosition]=useState<LogoPosition>('top-right')
  const [logoSize,setLogoSize]=useState<LogoSize>('small')
  const [logoOpacity,setLogoOpacity]=useState(80)
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')

  const allSelected = selected.length === photos.length && photos.length > 0
  const selectedPhotos = useMemo(()=>photos.filter(p=>selected.includes(p.id)),[photos,selected])

  function togglePhoto(id:number){setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])}
  function toggleAll(){setSelected(allSelected?[]:photos.map(p=>p.id))}

  function handleUpload(e:ChangeEvent<HTMLInputElement>){
    const files=Array.from(e.target.files||[])
    if(!files.length) return
    const added=files.map((file,i)=>({id:Date.now()+i,name:file.name,url:URL.createObjectURL(file),file}))
    setPhotos(p=>[...p,...added])
    setSelected(s=>[...s,...added.map(p=>p.id)])
    setMessage(`${files.length} foto(s) adicionada(s) à seleção.`)
    e.target.value=''
  }

  async function downloadPhotos(items:Photo[]){
    if(!items.length) { setMessage('Selecione pelo menos uma foto.'); return }
    setBusy(true); setMessage('Preparando arquivos…')
    try{
      const zip=new JSZip()
      for(const photo of items){
        const blob=await imageWithLogo(photo,addLogo,logoPosition,logoSize,logoOpacity)
        zip.file(photo.name.replace(/\.[^.]+$/,'')+(addLogo?'-cristo-na-rua':'')+'.jpg',blob)
      }
      const out=await zip.generateAsync({type:'blob'})
      const url=URL.createObjectURL(out)
      const a=document.createElement('a'); a.href=url; a.download=`fotos-cristo-na-rua${addLogo?'-com-logo':''}.zip`; a.click(); URL.revokeObjectURL(url)
      setMessage(`${items.length} foto(s) preparada(s) em um arquivo ZIP.`)
    }catch{setMessage('Não foi possível preparar as fotos. Tente novamente.')}
    finally{setBusy(false)}
  }

  return <div className="appShell"><aside className="sidebar"><img className="sideLogo" src="/logo.jpg" alt=""/><div className="memberLabel">PAINEL DA EQUIPE</div><nav className="sideNav"><Link href="/membros">Área dos membros</Link><Link className="active" href="/admin">Dashboard</Link><Link href="/acoes">Ações</Link><Link href="/fotos">Fotos</Link><Link href="/oracao">Orações</Link></nav></aside><main className="main">
    <div className="eyebrow">Coordenação</div><h1 className="pageTitle serif">Painel do Cristo da Rua</h1><p className="mutedDark">Central de aprovação de membros, ações, contribuições e registros das ações.</p>
    <div className="adminGrid">
      <div className="adminCard"><span>👥</span><h3>Solicitações pendentes</h3><strong>{approved?'3':'4'}</strong><button className="btn gold" onClick={()=>setApproved(true)}>{approved?'Aprovada ✓':'Aprovar próxima'}</button></div>
      <div className="adminCard"><span>📅</span><h3>Próxima ação</h3><strong>18 confirmados</strong><Link href="/acoes" className="btn">Abrir ação</Link></div>
      <div className="adminCard"><span>💰</span><h3>Contribuições</h3><strong>{proof==='pending'?'1 pendente':'0 pendentes'}</strong><a href="#financeiro" className="btn">Validar comprovante</a></div>
    </div>

    <section className="event" id="financeiro"><div className="eyebrow">Validação financeira</div><h2 className="serif">Comprovantes aguardando análise</h2><div className="reviewRow"><div><b>Liz · Ação Centro</b><p className="mutedDark">Cota sugerida: R$ 50,00 · arquivo privado</p></div>{proof==='pending'?<div className="reviewActions"><button className="btn gold" onClick={()=>setProof('approved')}>✓ Aprovar</button><button className="btn" onClick={()=>setProof('rejected')}>Rejeitar</button></div>:<span className={`adminStatus ${proof}`}>{proof==='approved'?'✓ Confirmado':'Comprovante rejeitado'}</span>}</div></section>

    <section className="event" id="fotos-admin">
      <div className="eyebrow">Gestão de fotos</div>
      <h2 className="serif">Baixar e preparar registros</h2>
      <p className="mutedDark">O administrador pode selecionar fotos específicas ou todas. Antes de baixar, escolha se quer aplicar automaticamente o logo do Cristo da Rua no canto superior direito.</p>
      <div className="photoToolbar">
        <label className="checkLine"><input type="checkbox" checked={allSelected} onChange={toggleAll}/> Selecionar todas</label>
        <label className="checkLine"><input type="checkbox" checked={addLogo} onChange={e=>setAddLogo(e.target.checked)}/> Colocar logo nas fotos</label>
        <label className="uploadButton btn">Adicionar fotos<input type="file" accept="image/*" multiple onChange={handleUpload} hidden/></label>
      </div>
      {addLogo && <div className="logoSettings">
        <div className="logoSettingBlock">
          <b>Posição do logo</b>
          <div className="positionGrid">
            {([['top-left','↖'],['top-center','↑'],['top-right','↗'],['middle-left','←'],['center','•'],['middle-right','→'],['bottom-left','↙'],['bottom-center','↓'],['bottom-right','↘']] as [LogoPosition,string][]).map(([value,icon]) => <button type="button" key={value} className={`positionBtn ${logoPosition===value?'active':''}`} aria-label={`Posição ${value}`} title={`Posição ${value}`} onClick={()=>setLogoPosition(value)}>{icon}</button>)}
          </div>
          <span className="settingHint">Escolha onde o logo será aplicado em todas as fotos selecionadas.</span>
        </div>
        <div className="logoSettingBlock">
          <b>Tamanho</b>
          <div className="choiceRow">
            {([['small','Pequeno'],['medium','Médio'],['large','Grande']] as [LogoSize,string][]).map(([value,label])=><label key={value}><input type="radio" name="logoSize" checked={logoSize===value} onChange={()=>setLogoSize(value)}/>{label}</label>)}
          </div>
        </div>
        <div className="logoSettingBlock">
          <b>Opacidade <span className="opacityValue">{logoOpacity}%</span></b>
          <input className="opacityRange" type="range" min="20" max="100" step="5" value={logoOpacity} onChange={e=>setLogoOpacity(Number(e.target.value))}/>
        </div>
      </div>}
      <div className="photoAdminGrid">
        {photos.map(photo=><label key={photo.id} className={`photoAdminCard ${selected.includes(photo.id)?'selected':''}`}>
          <input type="checkbox" checked={selected.includes(photo.id)} onChange={()=>togglePhoto(photo.id)}/>
          <img src={photo.url} alt={photo.name}/>
          <span>{photo.name}</span>
        </label>)}
      </div>
      <div className="photoDownloadBar">
        <div><b>{selectedPhotos.length}</b> foto(s) selecionada(s){addLogo?' · com logo':''}</div>
        <div className="reviewActions">
          <button className="btn" disabled={busy || !selectedPhotos.length} onClick={()=>downloadPhotos(selectedPhotos)}>{busy?'Preparando…':'Baixar selecionadas'}</button>
          <button className="btn gold" disabled={busy || !photos.length} onClick={()=>downloadPhotos(photos)}>{busy?'Preparando…':'Baixar todas'}</button>
        </div>
      </div>
      {message && <div className="success">{message}</div>}
      <p className="small mutedDark">No sistema conectado ao Supabase, esta área deve trabalhar com os arquivos armazenados no Storage e respeitar as permissões de administrador/coordenador. Os comprovantes financeiros continuam privados e não entram nos downloads de fotos.</p>
    </section>

    <section className="event"><div className="eyebrow">Acesso</div><h2 className="serif">Permissões da equipe</h2><p className="mutedDark">No sistema conectado, somente perfis de Coordenação e Administração poderão aprovar membros, visualizar comprovantes privados e alterar o link oficial do grupo de WhatsApp.</p><div className="roleGrid"><div><b>Membro</b><span>Participar, contribuir, orar e acessar o grupo após aprovação.</span></div><div><b>Coordenador</b><span>Gerenciar ações, membros, contribuições, fotos e orações.</span></div><div><b>Administrador</b><span>Controle completo da plataforma e permissões.</span></div></div></section>
  </main></div>
}
