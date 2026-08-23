import { useQuery } from "@tanstack/react-query";
import { supabase as typedSupabase } from "@/lib/supabase";
import fluxMark from "@/assets/brand/flux-mark.webp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

type Tenant = {
  razao_social: string | null;
  nome_fantasia: string | null;
  cnpj: string | null;
  logo_url: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  telefone: string | null;
  email: string | null;
};

/**
 * Cabeçalho institucional exclusivo de impressão (window.print() → PDF).
 * Layout executivo com faixa de marca, dados do tenant, identificação do
 * documento e rodapé assinatura FLUX. Renderiza somente em @media print.
 */
export function PrintHeader({
  documento,
  numero,
  data,
}: {
  documento: string;
  numero: string | number;
  data?: string;
}) {
  const { data: tenant } = useQuery({
    queryKey: ["tenant-print-header"],
    queryFn: async (): Promise<Tenant | null> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.user.id)
        .maybeSingle();
      if (!profile?.tenant_id) return null;
      const { data: t } = await supabase
        .from("tenants")
        .select(
          "razao_social, nome_fantasia, cnpj, logo_url, endereco, cidade, estado, cep, telefone, email",
        )
        .eq("id", profile.tenant_id)
        .maybeSingle();
      return (t as Tenant) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: logoSrc } = useQuery({
    queryKey: ["tenant-logo-src", tenant?.logo_url],
    enabled: !!tenant?.logo_url,
    queryFn: async () => {
      const raw = tenant?.logo_url ?? "";
      if (!raw) return null;
      if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) {
        return raw;
      }
      const { data } = await supabase.storage.from("logos").createSignedUrl(raw, 300);
      return data?.signedUrl ?? null;
    },
    staleTime: 4 * 60 * 1000,
  });

  const nome = tenant?.nome_fantasia || tenant?.razao_social || "Empresa";
  const enderecoLinha = [tenant?.endereco, tenant?.cidade, tenant?.estado, tenant?.cep]
    .filter(Boolean)
    .join(" · ");
  const contatoLinha = [tenant?.telefone, tenant?.email].filter(Boolean).join(" · ");

  return (
    <div className="print-header hidden print:block" aria-hidden>
      {/* Faixa de marca */}
      <div className="print-header__bar" />
      <div className="print-header__grid">
        <div className="print-header__tenant">
          {logoSrc ? <img src={logoSrc} alt={nome} className="print-header__logo" /> : null}
          <div>
            <div className="print-header__nome">{nome}</div>
            {tenant?.razao_social && tenant?.nome_fantasia ? (
              <div className="print-header__meta">{tenant.razao_social}</div>
            ) : null}
            {tenant?.cnpj ? <div className="print-header__meta">CNPJ: {tenant.cnpj}</div> : null}
            {enderecoLinha ? <div className="print-header__meta">{enderecoLinha}</div> : null}
            {contatoLinha ? <div className="print-header__meta">{contatoLinha}</div> : null}
          </div>
        </div>
        <div className="print-header__doc">
          <div className="print-header__doc-kind">{documento}</div>
          <div className="print-header__doc-num">Nº {numero}</div>
          {data ? <div className="print-header__meta">Emitido em {data}</div> : null}
          <div className="print-header__brand">
            <img src={fluxMark} alt="FLUX" className="print-header__brand-mark" />
            <span>
              Gerado via <strong>FLUX</strong> · Industrial Intelligence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
