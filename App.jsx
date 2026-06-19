import React, { useState, useMemo } from "react";
import { Plus, X, Zap, Fuel, ChevronDown, Trophy } from "lucide-react";

// ============================================================
// BANCO DE DADOS — carros eletrificados (mercado BR, 2026)
// Preços médios aproximados; specs de fabricante/INMETRO/WLTP.
// ============================================================
const CARROS = [
  // ---------- 100% ELÉTRICOS ----------
  {
    id: "dolphin-mini",
    marca: "BYD",
    modelo: "Dolphin Mini",
    tipo: "Elétrico",
    carroceria: "Hatch",
    preco: 119900,
    autonomia: 280,
    bateria: 38,
    potencia: 75,
    torque: 135,
    aceleracao: 12.3,
    portamalas: 230,
    recarga: 30,
    consumo: 4.9, // km/kWh
    garantia: 6,
    lugares: 5,
  },
  {
    id: "dolphin",
    marca: "BYD",
    modelo: "Dolphin",
    tipo: "Elétrico",
    carroceria: "Hatch",
    preco: 149900,
    autonomia: 291,
    bateria: 44.9,
    potencia: 95,
    torque: 180,
    aceleracao: 10.9,
    portamalas: 345,
    recarga: 37,
    consumo: 5.1,
    garantia: 6,
    lugares: 5,
  },
  {
    id: "yuan-plus",
    marca: "BYD",
    modelo: "Yuan Plus",
    tipo: "Elétrico",
    carroceria: "SUV",
    preco: 219900,
    autonomia: 350,
    bateria: 60.5,
    potencia: 204,
    torque: 310,
    aceleracao: 7.3,
    portamalas: 440,
    recarga: 30,
    consumo: 4.5,
    garantia: 6,
    lugares: 5,
  },
  {
    id: "ex30",
    marca: "Volvo",
    modelo: "EX30",
    tipo: "Elétrico",
    carroceria: "SUV",
    preco: 269950,
    autonomia: 480,
    bateria: 69,
    potencia: 272,
    torque: 343,
    aceleracao: 5.3,
    portamalas: 318,
    recarga: 27,
    consumo: 5.6,
    garantia: 5,
    lugares: 5,
  },
  {
    id: "kona-ev",
    marca: "Hyundai",
    modelo: "Kona Elétrico",
    tipo: "Elétrico",
    carroceria: "SUV",
    preco: 239990,
    autonomia: 484,
    bateria: 64.8,
    potencia: 204,
    torque: 255,
    aceleracao: 7.8,
    portamalas: 466,
    recarga: 41,
    consumo: 5.8,
    garantia: 5,
    lugares: 5,
  },
  {
    id: "model3",
    marca: "Tesla",
    modelo: "Model 3 RWD",
    tipo: "Elétrico",
    carroceria: "Sedã",
    preco: 229990,
    autonomia: 520,
    bateria: 60,
    potencia: 283,
    torque: 420,
    aceleracao: 6.1,
    portamalas: 594,
    recarga: 27,
    consumo: 6.3,
    garantia: 4,
    lugares: 5,
  },
  // ---------- HÍBRIDOS PLUG-IN ----------
  {
    id: "song-plus",
    marca: "BYD",
    modelo: "Song Plus DM-i",
    tipo: "Híbrido Plug-in",
    carroceria: "SUV",
    preco: 239900,
    autonomia: 1100,
    bateria: 18.3,
    potencia: 235,
    torque: 325,
    aceleracao: 8.5,
    portamalas: 450,
    recarga: 30,
    consumo: 21, // km/l equivalente
    garantia: 6,
    lugares: 5,
  },
  {
    id: "king",
    marca: "BYD",
    modelo: "King DM-i",
    tipo: "Híbrido Plug-in",
    carroceria: "Sedã",
    preco: 189900,
    autonomia: 1200,
    bateria: 18.3,
    potencia: 197,
    torque: 300,
    aceleracao: 7.9,
    portamalas: 450,
    recarga: 30,
    consumo: 23,
    garantia: 6,
    lugares: 5,
  },
  {
    id: "compass-phev",
    marca: "Jeep",
    modelo: "Compass 4xe",
    tipo: "Híbrido Plug-in",
    carroceria: "SUV",
    preco: 279990,
    autonomia: 700,
    bateria: 11.4,
    potencia: 240,
    torque: 520,
    aceleracao: 7.3,
    portamalas: 420,
    recarga: 100,
    consumo: 14,
    garantia: 3,
    lugares: 5,
  },
  // ---------- HÍBRIDOS (HEV) ----------
  {
    id: "corolla-hev",
    marca: "Toyota",
    modelo: "Corolla Altis Hybrid",
    tipo: "Híbrido",
    carroceria: "Sedã",
    preco: 184990,
    autonomia: 900,
    bateria: 1.3,
    potencia: 122,
    torque: 142,
    aceleracao: 11.1,
    portamalas: 470,
    recarga: 0,
    consumo: 17.6,
    garantia: 3,
    lugares: 5,
  },
  {
    id: "corolla-cross-hev",
    marca: "Toyota",
    modelo: "Corolla Cross Hybrid",
    tipo: "Híbrido",
    carroceria: "SUV",
    preco: 209990,
    autonomia: 850,
    bateria: 1.3,
    potencia: 122,
    torque: 142,
    aceleracao: 11.3,
    portamalas: 440,
    recarga: 0,
    consumo: 16.5,
    garantia: 3,
    lugares: 5,
  },
  {
    id: "civic-hev",
    marca: "Honda",
    modelo: "Civic e:HEV",
    tipo: "Híbrido",
    carroceria: "Sedã",
    preco: 239900,
    autonomia: 950,
    bateria: 1.05,
    potencia: 184,
    torque: 315,
    aceleracao: 7.8,
    portamalas: 410,
    recarga: 0,
    consumo: 18.2,
    garantia: 3,
    lugares: 5,
  },
  // ---------- GWM ----------
  {
    id: "ora-03",
    marca: "GWM",
    modelo: "Ora 03 BEV58",
    tipo: "Elétrico",
    carroceria: "Hatch",
    preco: 169000,
    autonomia: 320,
    bateria: 58,
    potencia: 171,
    torque: 250,
    aceleracao: 8.4,
    portamalas: 228,
    recarga: 38,
    consumo: 5.3,
    garantia: 5,
    lugares: 5,
  },
  {
    id: "haval-h6-hev",
    marca: "GWM",
    modelo: "Haval H6 HEV2",
    tipo: "Híbrido",
    carroceria: "SUV",
    preco: 223000,
    autonomia: 900,
    bateria: 1.6,
    potencia: 243,
    torque: 530,
    aceleracao: 7.5,
    portamalas: 560,
    recarga: 0,
    consumo: 15.4,
    garantia: 5,
    lugares: 5,
  },
  {
    id: "haval-h6-phev35",
    marca: "GWM",
    modelo: "Haval H6 PHEV35",
    tipo: "Híbrido Plug-in",
    carroceria: "SUV",
    preco: 259000,
    autonomia: 1000,
    bateria: 35,
    potencia: 393,
    torque: 772,
    aceleracao: 4.8,
    portamalas: 560,
    recarga: 45,
    consumo: 18,
    garantia: 5,
    lugares: 5,
  },
  // ---------- ZEEKR ----------
  {
    id: "zeekr-x",
    marca: "Zeekr",
    modelo: "X",
    tipo: "Elétrico",
    carroceria: "SUV",
    preco: 339000,
    autonomia: 430,
    bateria: 66,
    potencia: 428,
    torque: 543,
    aceleracao: 3.7,
    portamalas: 362,
    recarga: 30,
    consumo: 5.0,
    garantia: 5,
    lugares: 5,
  },
  {
    id: "zeekr-7x",
    marca: "Zeekr",
    modelo: "7X AWD",
    tipo: "Elétrico",
    carroceria: "SUV",
    preco: 459000,
    autonomia: 423,
    bateria: 100,
    potencia: 646,
    torque: 710,
    aceleracao: 3.8,
    portamalas: 539,
    recarga: 24,
    consumo: 4.6,
    garantia: 5,
    lugares: 5,
  },
  {
    id: "zeekr-001",
    marca: "Zeekr",
    modelo: "001 Flagship AWD",
    tipo: "Elétrico",
    carroceria: "Sedã",
    preco: 542000,
    autonomia: 426,
    bateria: 100,
    potencia: 544,
    torque: 686,
    aceleracao: 3.8,
    portamalas: 539,
    recarga: 30,
    consumo: 4.5,
    garantia: 5,
    lugares: 5,
  },
  // ---------- CAOA CHERY ----------
  {
    id: "tiggo7-phev",
    marca: "Caoa Chery",
    modelo: "Tiggo 7 Pro PHEV",
    tipo: "Híbrido Plug-in",
    carroceria: "SUV",
    preco: 239990,
    autonomia: 1000,
    bateria: 18.3,
    potencia: 326,
    torque: 545,
    aceleracao: 7.0,
    portamalas: 470,
    recarga: 40,
    consumo: 33,
    garantia: 7,
    lugares: 5,
  },
  {
    id: "tiggo8-phev",
    marca: "Caoa Chery",
    modelo: "Tiggo 8 Pro PHEV",
    tipo: "Híbrido Plug-in",
    carroceria: "SUV",
    preco: 229990,
    autonomia: 1100,
    bateria: 18.4,
    potencia: 279,
    torque: 365,
    aceleracao: 7.8,
    portamalas: 650,
    recarga: 40,
    consumo: 36,
    garantia: 7,
    lugares: 7,
  },
];

// Linhas de atributos: como exibir, unidade, e se "maior é melhor"
const ATRIBUTOS = [
  { key: "tipo", label: "Tipo", fmt: (v) => v, melhor: null, grupo: "geral" },
  { key: "carroceria", label: "Carroceria", fmt: (v) => v, melhor: null, grupo: "geral" },
  { key: "lugares", label: "Lugares", fmt: (v) => `${v}`, melhor: null, grupo: "geral" },
  {
    key: "preco",
    label: "Preço médio",
    fmt: (v) => `R$ ${v.toLocaleString("pt-BR")}`,
    melhor: "menor",
    grupo: "geral",
  },
  {
    key: "autonomia",
    label: "Autonomia",
    fmt: (v) => `${v.toLocaleString("pt-BR")} km`,
    melhor: "maior",
    sub: (c) => (c.tipo === "Elétrico" ? "no modo elétrico" : "autonomia total"),
    grupo: "energia",
  },
  {
    key: "bateria",
    label: "Bateria",
    fmt: (v) => `${v} kWh`,
    melhor: "maior",
    grupo: "energia",
  },
  {
    key: "consumo",
    label: "Eficiência",
    fmt: (v, c) => (c.tipo === "Elétrico" ? `${v} km/kWh` : `${v} km/l`),
    melhor: "maior",
    grupo: "energia",
  },
  {
    key: "recarga",
    label: "Recarga rápida 30→80%",
    fmt: (v) => (v === 0 ? "Não recarrega na tomada" : `${v} min`),
    melhor: "menor",
    grupo: "energia",
  },
  {
    key: "potencia",
    label: "Potência do motor",
    fmt: (v) => `${v} cv`,
    melhor: "maior",
    grupo: "desempenho",
  },
  {
    key: "torque",
    label: "Torque",
    fmt: (v) => `${v} Nm`,
    melhor: "maior",
    grupo: "desempenho",
  },
  {
    key: "aceleracao",
    label: "0–100 km/h",
    fmt: (v) => `${v.toFixed(1)} s`,
    melhor: "menor",
    grupo: "desempenho",
  },
  {
    key: "portamalas",
    label: "Porta-malas",
    fmt: (v) => `${v} L`,
    melhor: "maior",
    grupo: "praticidade",
  },
  {
    key: "garantia",
    label: "Garantia",
    fmt: (v) => `${v} anos`,
    melhor: "maior",
    grupo: "praticidade",
  },
];

const GRUPOS = [
  { id: "geral", label: "Geral" },
  { id: "energia", label: "Energia & Autonomia" },
  { id: "desempenho", label: "Desempenho" },
  { id: "praticidade", label: "Praticidade" },
];

const PALETA = ["#00E0A4", "#6C8BFF", "#FFB454", "#FF6B9D"];

function App() {
  // até 4 colunas; cada coluna guarda o id do carro escolhido (ou null)
  const [colunas, setColunas] = useState(["dolphin", "song-plus", null]);

  const escolhidos = colunas.map((id) => CARROS.find((c) => c.id === id) || null);
  const ativos = escolhidos.filter(Boolean);

  // calcula, por linha, qual coluna tem o "melhor" valor
  const melhores = useMemo(() => {
    const map = {};
    for (const attr of ATRIBUTOS) {
      if (!attr.melhor) continue;
      let bestIdx = -1;
      let bestVal = null;
      escolhidos.forEach((c, i) => {
        if (!c) return;
        const v = c[attr.key];
        if (attr.key === "recarga" && v === 0) return; // não compara "não recarrega"
        if (bestVal === null) {
          bestVal = v;
          bestIdx = i;
        } else if (attr.melhor === "maior" ? v > bestVal : v < bestVal) {
          bestVal = v;
          bestIdx = i;
        }
      });
      map[attr.key] = ativos.length > 1 ? bestIdx : -1;
    }
    return map;
  }, [colunas]);

  const setCarro = (colIdx, id) => {
    setColunas((prev) => prev.map((c, i) => (i === colIdx ? id : c)));
  };

  const addColuna = () => {
    if (colunas.length >= 4) return;
    setColunas((prev) => [...prev, null]);
  };

  const removeColuna = (colIdx) => {
    setColunas((prev) => prev.filter((_, i) => i !== colIdx));
  };

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <header style={S.header}>
        <div style={S.eyebrow}>Comparador · Elétricos & Híbridos</div>
        <h1 style={S.h1}>
          Escolha lado a lado.
          <br />
          <span style={S.h1accent}>Decida com os números.</span>
        </h1>
        <p style={S.lede}>
          Selecione um carro no topo de cada coluna. As linhas se preenchem com
          as especificações, e o melhor valor de cada característica fica
          destacado.
        </p>
      </header>

      <div style={S.scrollWrap}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `minmax(180px, 230px) repeat(${colunas.length}, minmax(200px, 1fr))`,
          }}
        >
          {/* ---- Linha de cabeçalho: seletores ---- */}
          <div style={{ ...S.cell, ...S.cornerCell }}>
            <span style={S.cornerText}>Característica</span>
          </div>

          {colunas.map((id, colIdx) => {
            const carro = escolhidos[colIdx];
            const cor = PALETA[colIdx % PALETA.length];
            return (
              <div key={colIdx} style={{ ...S.cell, ...S.headCell }}>
                {colunas.length > 2 && (
                  <button
                    className="icon-btn"
                    style={S.removeBtn}
                    onClick={() => removeColuna(colIdx)}
                    aria-label="Remover coluna"
                  >
                    <X size={14} />
                  </button>
                )}
                <Seletor
                  valor={id}
                  cor={cor}
                  onChange={(novo) => setCarro(colIdx, novo)}
                  usados={colunas}
                />
                {carro && (
                  <div style={S.badgeRow}>
                    <span
                      style={{
                        ...S.tipoBadge,
                        background: cor + "22",
                        color: cor,
                        border: `1px solid ${cor}55`,
                      }}
                    >
                      {carro.tipo === "Elétrico" ? (
                        <Zap size={12} />
                      ) : (
                        <Fuel size={12} />
                      )}
                      {carro.tipo}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* ---- Linhas de atributos, agrupadas ---- */}
          {GRUPOS.map((grupo) => {
            const attrsDoGrupo = ATRIBUTOS.filter((a) => a.grupo === grupo.id);
            return (
              <React.Fragment key={grupo.id}>
                <div style={S.groupRow}>
                  <span style={S.groupLabel}>{grupo.label}</span>
                </div>
                {attrsDoGrupo.map((attr) => (
                  <React.Fragment key={attr.key}>
                    <div style={{ ...S.cell, ...S.labelCell }}>
                      {attr.label}
                    </div>
                    {escolhidos.map((carro, colIdx) => {
                      const isBest =
                        melhores[attr.key] === colIdx && ativos.length > 1;
                      const cor = PALETA[colIdx % PALETA.length];
                      return (
                        <div
                          key={colIdx}
                          style={{
                            ...S.cell,
                            ...S.valueCell,
                            ...(isBest
                              ? {
                                  background: cor + "14",
                                  boxShadow: `inset 3px 0 0 ${cor}`,
                                }
                              : {}),
                          }}
                        >
                          {carro ? (
                            <span style={S.valueWrap}>
                              <span
                                style={{
                                  ...S.value,
                                  ...(isBest ? { color: cor, fontWeight: 700 } : {}),
                                }}
                              >
                                {attr.fmt(carro[attr.key], carro)}
                                {isBest && (
                                  <Trophy
                                    size={13}
                                    style={{ marginLeft: 6, verticalAlign: "-1px" }}
                                  />
                                )}
                              </span>
                              {attr.sub && (
                                <span style={S.sub}>{attr.sub(carro)}</span>
                              )}
                            </span>
                          ) : (
                            <span style={S.empty}>—</span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {colunas.length < 4 && (
        <button className="add-btn" style={S.addBtn} onClick={addColuna}>
          <Plus size={16} /> Adicionar carro
        </button>
      )}

      <footer style={S.footer}>
        Preços médios e especificações são aproximados (referência mercado
        brasileiro, 2026) e servem para comparação. Confirme valores e ficha
        técnica com a concessionária antes de comprar.
      </footer>
    </div>
  );
}

// ---- Dropdown de seleção (marca + modelo) ----
function Seletor({ valor, onChange, cor, usados }) {
  const [aberto, setAberto] = useState(false);
  const carro = CARROS.find((c) => c.id === valor);

  // agrupa por tipo para o menu
  const porTipo = {};
  for (const c of CARROS) {
    (porTipo[c.tipo] ||= []).push(c);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        className="select-trigger"
        style={{ ...S.trigger, borderColor: carro ? cor + "66" : "#2a2a32" }}
        onClick={() => setAberto((a) => !a)}
      >
        <span style={S.triggerText}>
          {carro ? (
            <>
              <span style={S.triggerMarca}>{carro.marca}</span>
              <span style={S.triggerModelo}>{carro.modelo}</span>
            </>
          ) : (
            <span style={S.triggerPlaceholder}>Selecionar carro…</span>
          )}
        </span>
        <ChevronDown
          size={16}
          style={{
            transform: aberto ? "rotate(180deg)" : "none",
            transition: "transform .2s",
            opacity: 0.6,
            flexShrink: 0,
          }}
        />
      </button>

      {aberto && (
        <>
          <div style={S.overlay} onClick={() => setAberto(false)} />
          <div className="menu" style={S.menu}>
            {Object.entries(porTipo).map(([tipo, lista]) => (
              <div key={tipo}>
                <div style={S.menuGroup}>{tipo}</div>
                {lista.map((c) => {
                  const jaUsado = usados.includes(c.id) && c.id !== valor;
                  return (
                    <button
                      key={c.id}
                      className="menu-item"
                      style={{
                        ...S.menuItem,
                        ...(c.id === valor ? { background: cor + "1f" } : {}),
                        ...(jaUsado ? { opacity: 0.35 } : {}),
                      }}
                      disabled={jaUsado}
                      onClick={() => {
                        onChange(c.id);
                        setAberto(false);
                      }}
                    >
                      <span style={S.menuMarca}>{c.marca}</span>
                      <span style={S.menuModelo}>{c.modelo}</span>
                      {jaUsado && <span style={S.menuTag}>em uso</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Estilos
// ============================================================
const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e8e8ee",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "clamp(20px, 5vw, 56px)",
    boxSizing: "border-box",
  },
  header: { maxWidth: 720, marginBottom: 40 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#00E0A4",
    fontWeight: 600,
    marginBottom: 16,
  },
  h1: {
    fontSize: "clamp(32px, 5.5vw, 56px)",
    lineHeight: 1.02,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    margin: "0 0 18px",
  },
  h1accent: { color: "#888894" },
  lede: { fontSize: 16, lineHeight: 1.6, color: "#a0a0ab", margin: 0 },
  scrollWrap: { overflowX: "auto", paddingBottom: 8, marginInline: -4 },
  cell: {
    padding: "14px 18px",
    borderBottom: "1px solid #1a1a22",
    display: "flex",
    alignItems: "center",
    minHeight: 56,
    boxSizing: "border-box",
  },
  cornerCell: {
    position: "sticky",
    left: 0,
    background: "#0a0a0f",
    zIndex: 3,
    alignItems: "flex-end",
    paddingBottom: 18,
  },
  cornerText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#55555f",
    fontWeight: 600,
  },
  headCell: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
    paddingTop: 16,
    paddingBottom: 18,
    position: "relative",
    verticalAlign: "top",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "transparent",
    border: "none",
    color: "#55555f",
    cursor: "pointer",
    padding: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  badgeRow: { display: "flex" },
  tipoBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 9px",
    borderRadius: 100,
  },
  groupRow: {
    gridColumn: "1 / -1",
    padding: "22px 18px 8px",
    position: "sticky",
    left: 0,
  },
  groupLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "#00E0A4",
    fontWeight: 700,
  },
  labelCell: {
    position: "sticky",
    left: 0,
    background: "#0a0a0f",
    zIndex: 2,
    fontSize: 13.5,
    color: "#b8b8c2",
    fontWeight: 500,
  },
  valueCell: { transition: "background .15s" },
  valueWrap: { display: "flex", flexDirection: "column", gap: 2 },
  value: { fontSize: 14.5, color: "#e8e8ee", fontVariantNumeric: "tabular-nums" },
  sub: { fontSize: 11, color: "#66666f" },
  empty: { color: "#3a3a44", fontSize: 18 },
  trigger: {
    width: "100%",
    background: "#13131a",
    border: "1px solid #2a2a32",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color .2s",
  },
  triggerText: { display: "flex", flexDirection: "column", overflow: "hidden" },
  triggerMarca: {
    fontSize: 11,
    color: "#8a8a95",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  triggerModelo: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  triggerPlaceholder: { fontSize: 14, color: "#6a6a75", fontWeight: 500 },
  overlay: { position: "fixed", inset: 0, zIndex: 10 },
  menu: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    background: "#15151c",
    border: "1px solid #2a2a32",
    borderRadius: 12,
    padding: 6,
    zIndex: 20,
    maxHeight: 340,
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,.6)",
  },
  menuGroup: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#66666f",
    fontWeight: 700,
    padding: "10px 10px 6px",
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    background: "transparent",
    border: "none",
    borderRadius: 8,
    padding: "9px 10px",
    cursor: "pointer",
    textAlign: "left",
    color: "#e8e8ee",
  },
  menuMarca: { fontSize: 11, color: "#8a8a95", flexShrink: 0 },
  menuModelo: { fontSize: 14, fontWeight: 600 },
  menuTag: {
    marginLeft: "auto",
    fontSize: 10,
    color: "#66666f",
    fontStyle: "italic",
  },
  addBtn: {
    marginTop: 24,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#13131a",
    border: "1px dashed #33333d",
    color: "#c8c8d2",
    borderRadius: 12,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  footer: {
    marginTop: 36,
    fontSize: 12,
    color: "#55555f",
    lineHeight: 1.6,
    maxWidth: 640,
  },
};

const CSS = `
  .grid { display: grid; align-items: stretch; min-width: min-content; }
  .grid > * { background-clip: padding-box; }
  .select-trigger:hover { background: #181820; }
  .menu-item:hover:not(:disabled) { background: #1f1f28 !important; }
  .add-btn:hover { background: #181820; border-color: #44444f; }
  .icon-btn:hover { background: #1f1f28 !important; color: #ff6b6b !important; }
  ::-webkit-scrollbar { height: 10px; width: 10px; }
  ::-webkit-scrollbar-track { background: #0a0a0f; }
  ::-webkit-scrollbar-thumb { background: #2a2a32; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #3a3a44; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  *:focus-visible { outline: 2px solid #00E0A4; outline-offset: 2px; border-radius: 6px; }
`;

export default App;
