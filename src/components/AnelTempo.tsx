import type { CSSProperties, ReactNode } from "react";

type Props = {
  progresso: number;
  cor: string;
  children: ReactNode;
  compacto?: boolean;
};

export function AnelTempo({
  progresso,
  cor,
  children,
  compacto = false,
}: Props) {
  const raio = compacto ? 40 : 42;
  const circunferencia = 2 * Math.PI * raio;
  const traco = compacto ? 5.5 : 5;
  const preenchido = circunferencia * progresso;
  const angulo = (-90 + progresso * 360) * (Math.PI / 180);
  const pontoX = 50 + raio * Math.cos(angulo);
  const pontoY = 50 + raio * Math.sin(angulo);
  const classe = compacto ? "anel anel-flutuante" : "anel";

  return (
    <div className={classe} style={{ "--anel-cor": cor } as CSSProperties}>
      <svg className="anel-svg" viewBox="0 0 100 100" aria-hidden="true">
        {!compacto ? (
          <defs>
            <filter id="anel-brilho" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        ) : (
          <circle
            className="anel-fundo"
            cx="50"
            cy="50"
            r={raio - traco / 2}
            fill="rgba(16, 20, 28, 0.5)"
          />
        )}
        <circle
          className="anel-trilha"
          cx="50"
          cy="50"
          r={raio}
          fill="none"
          strokeWidth={traco}
        />
        <circle
          className="anel-arco"
          cx="50"
          cy="50"
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth={traco}
          strokeLinecap="round"
          strokeDasharray={`${preenchido} ${circunferencia}`}
          transform="rotate(-90 50 50)"
          filter={compacto ? undefined : "url(#anel-brilho)"}
        />
        {progresso > 0.02 ? (
          <circle
            className="anel-ponto"
            cx={pontoX}
            cy={pontoY}
            r={compacto ? 2.6 : 3.2}
            fill={cor}
          />
        ) : null}
      </svg>
      <div className="anel-centro">{children}</div>
    </div>
  );
}
