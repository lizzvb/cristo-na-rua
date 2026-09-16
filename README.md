# Cristo da Rua

Protótipo web do Cristo da Rua, preparado para publicação na Vercel e futura integração com Supabase.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## WhatsApp dos membros

Copie `.env.example` para `.env.local` e troque `NEXT_PUBLIC_WHATSAPP_GROUP_URL` pelo link real de convite do grupo de membros.

O botão do grupo aparece na área de membros e não na página pública.

## Próxima etapa

Integrar Supabase Auth + PostgreSQL + Storage e substituir os dados demonstrativos por dados reais. O protótipo não usa nomes ou dados reais de pessoas atendidas.
