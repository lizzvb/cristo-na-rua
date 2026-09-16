import Link from 'next/link'

export default function Home() {
  return <>
    <header className="topbar"><div className="container nav">
      <Link href="/"><img className="logo" src="/logo.jpg" alt="Cristo da Rua"/></Link>
      <nav className="links"><a href="#sobre">Sobre</a><a href="#missao">Nossa missão</a><a href="#participar">Participar</a><a href="#apoiar">Apoie</a><Link className="btn" href="/login">Área dos membros</Link></nav>
    </div></header>

    <section className="hero"><div className="container heroInner">
      <div className="eyebrow">Cristo da Rua</div>
      <h1 className="serif">Levar Cristo onde Ele mais precisa ser <span>encontrado.</span></h1>
      <p>Uma missão de encontro, serviço, oração e comunidade nas ruas. Cada ação começa com a presença e continua no coração.</p>
      <div className="actions"><a className="btn gold" href="#sobre">Conheça a missão →</a><Link className="btn" href="/cadastro">Quero participar</Link></div>
    </div></section>

    <section className="pillars" id="missao"><div className="container grid4">
      {[['SERVIÇO','Acolher, servir e estar presente.'],['ORAÇÃO','Levar cada encontro ao coração de Deus.'],['COMUNIDADE','Caminhar juntos nessa missão.'],['MISSÃO','Sair ao encontro e colocar a fé em ação.']].map(([a,b])=><div className="pillar" key={a}><h3>{a}</h3><p>{b}</p></div>)}
    </div></section>

    <section className="section" id="sobre"><div className="container two"><div><div className="eyebrow">Sobre o Cristo da Rua</div><h2 className="serif">Uma missão que nasce do encontro.</h2><p>O Cristo da Rua busca levar amor, dignidade e presença às pessoas em situação de rua, por meio do serviço, da partilha, da escuta e da oração.</p><a className="btn darkBtn" href="#participar">Conheça nossa história →</a></div><div className="photo"/></div></section>

    <section className="section soft" id="participar"><div className="container"><div className="eyebrow">Faça parte</div><h2 className="serif">A missão continua depois da rua.</h2><div className="cards">
      <div className="card"><div className="eyebrow">Quero participar</div><h3>Faça parte da missão</h3><p>Solicite seu cadastro. Após a aprovação da equipe, você terá acesso à área exclusiva dos membros.</p><Link href="/cadastro" className="btn gold">Solicitar cadastro →</Link></div>
      <div className="card" id="apoiar"><div className="eyebrow">Quero ajudar</div><h3>Apoie uma ação</h3><p>Os membros poderão acompanhar a necessidade de cada ação e sua cota sugerida de contribuição.</p><Link href="/login" className="btn">Área dos membros →</Link></div>
      <div className="card"><div className="eyebrow">Comunidade</div><h3>Depois da rua, a oração</h3><p>Continue a missão em comunidade através das intenções de oração e dos encontros seguintes.</p><Link href="/login" className="btn">Entrar →</Link></div>
    </div></div></section>

    <footer className="footer"><div className="container footerGrid"><div><img className="logo" src="/logo.jpg" alt="Cristo da Rua"/><p className="muted">Mais que ação, encontro.</p></div><div className="muted">Cristo da Rua<br/>Serviço • Oração • Comunidade</div></div></footer>
  </>
}
