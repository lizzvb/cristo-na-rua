'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('E-mail ou senha incorretos. Verifique seus dados e tente novamente.')
      setCarregando(false)
      return
    }

    window.location.href = '/membros'
  }

  return (
    <main className="authPage">
      <div className="authCard">
        <img
          className="authLogo"
          src="/logo.jpg"
          alt="Cristo da Rua"
        />

        <div className="eyebrow">ÁREA DOS MEMBROS</div>

        <h1 className="serif">Bem-vindo de volta</h1>

        <p>
          Entre para acompanhar as próximas ações e continuar a missão.
        </p>

        <form className="form" onSubmit={entrar}>
          <label>
            E-mail
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {erro && (
            <p
              style={{
                color: '#9b5b50',
                fontSize: '14px',
                marginTop: '4px',
              }}
            >
              {erro}
            </p>
          )}

          <button
            className="btn gold"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p className="small">
          Ainda não é membro?{' '}
          <Link href="/cadastro">
            Solicite seu cadastro.
          </Link>
        </p>

        <Link className="back" href="/">
          ← Voltar para o site
        </Link>
      </div>
    </main>
  )
}