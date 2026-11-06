import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Users,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useDemo } from './DemoContext';
import { formatarData } from './dados-demo';
import { cn } from '../lib/utils';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function DemoAgenda() {
  const { agenda } = useDemo();
  const [currentDate, setCurrentDate] = React.useState<Date>(() => new Date());

  const ano = currentDate.getFullYear();
  const mes = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(ano, mes - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(ano, mes + 1, 1));
  };

  // Cálculo da grade do calendário
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

  const calendarDays = React.useMemo(() => {
    const days: ({ dia: number; data: Date } | null)[] = [];
    // Espaços vazios no início
    for (let i = 0; i < primeiroDiaSemana; i++) {
      days.push(null);
    }
    // Dias do mês
    for (let d = 1; d <= totalDiasMes; d++) {
      days.push({ dia: d, data: new Date(ano, mes, d) });
    }
    return days;
  }, [ano, mes, primeiroDiaSemana, totalDiasMes]);

  // Encontra eventos do dia
  const getEventosDoDia = (date: Date) => {
    return agenda.filter((ev) => {
      const evDate = new Date(ev.data);
      return (
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate()
      );
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda e Prazos Judiciais"
        description="Gestão integrada de audiências, prazos processuais fatais e diligências externas."
        breadcrumbs={[{ label: 'Início', href: '/demo/processos' }, { label: 'Agenda' }]}
      />

      {/* Barra de Navegação do Mês */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-input)] bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-glow)]">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              {MESES[mes]} de {ano}
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Visualização mensal de audiências e prazos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrevMonth} aria-label="Mês anterior">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-xs"
          >
            Hoje
          </Button>
          <Button variant="secondary" size="sm" onClick={handleNextMonth} aria-label="Próximo mês">
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Grade do Calendário */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] overflow-hidden shadow-sm">
        {/* Cabeçalho dos Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-elevated)]/50 text-center">
          {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="py-2.5 text-xs font-semibold text-[var(--color-muted)]">
              {dia}
            </div>
          ))}
        </div>

        {/* Células dos Dias */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[var(--color-border)]">
          {calendarDays.map((item, idx) => {
            if (!item) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[90px] sm:min-h-[110px] bg-[var(--color-bg)]/40 p-2"
                />
              );
            }

            const eventos = getEventosDoDia(item.data);
            const isHoje =
              item.data.getDate() === new Date().getDate() &&
              item.data.getMonth() === new Date().getMonth() &&
              item.data.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={item.dia}
                className={cn(
                  'min-h-[90px] sm:min-h-[110px] p-2 flex flex-col justify-between transition-colors bg-[var(--color-surface)]',
                  isHoje && 'bg-[var(--color-elevated)]/60 border-t-2 border-t-[var(--color-primary)]'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-xs font-mono font-medium h-6 w-6 flex items-center justify-center rounded-full',
                      isHoje
                        ? 'bg-[var(--color-primary-hover)] text-[var(--color-text)] font-bold'
                        : 'text-[var(--color-muted)]'
                    )}
                  >
                    {item.dia}
                  </span>
                  {eventos.length > 0 && (
                    <span className="text-[10px] font-mono text-[var(--color-glow)] font-semibold">
                      {eventos.length} {eventos.length === 1 ? 'item' : 'itens'}
                    </span>
                  )}
                </div>

                {/* Lista de Eventos na Célula */}
                <div className="space-y-1 overflow-hidden">
                  {eventos.map((ev) => {
                    const isVencido = ev.status === 'vencido';
                    return (
                      <div
                        key={ev.id}
                        className={cn(
                          'w-full text-left p-1 rounded-[var(--radius-input)] text-[10px] sm:text-[11px] leading-tight truncate transition-colors border flex items-center gap-1',
                          isVencido
                            ? 'bg-[var(--color-danger)]/15 border-[var(--color-danger)]/40 text-[var(--color-danger)] font-semibold'
                            : ev.tipo === 'audiencia'
                              ? 'bg-[var(--color-elevated)] border-[var(--color-primary)]/40 text-[var(--color-glow)]'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]'
                        )}
                      >
                        {isVencido ? (
                          <>
                            <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">Prazo Vencido: {ev.titulo}</span>
                          </>
                        ) : ev.tipo === 'audiencia' ? (
                          <>
                            <Users className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{ev.hora} &bull; {ev.titulo}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{ev.titulo}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista e Detalhes dos Próximos Compromissos */}
      <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          Próximos Compromissos da Pauta
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agenda.map((ev) => {
            const isVencido = ev.status === 'vencido';
            return (
              <div
                key={ev.id}
                className={cn(
                  'p-3.5 rounded-[var(--radius-card)] border flex flex-col justify-between space-y-2',
                  isVencido
                    ? 'bg-[var(--color-surface)] border-[var(--color-danger)]/50'
                    : 'bg-[var(--color-bg)] border-[var(--color-border)]'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-xs text-[var(--color-text)] block">
                      {ev.titulo}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted)]">
                      {ev.cliente} &bull; {ev.cnj}
                    </span>
                  </div>
                  {isVencido ? (
                    <Badge variant="danger" className="gap-1 py-0.2 text-[10px] font-mono shrink-0">
                      <AlertTriangle className="h-3 w-3" />
                      Prazo Vencido
                    </Badge>
                  ) : (
                    <Badge variant="neutro" className="py-0.2 text-[10px] font-mono shrink-0">
                      {ev.tipo.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)] font-mono">
                  <span>Data: {formatarData(ev.data)} às {ev.hora}</span>
                  <span className={isVencido ? 'text-[var(--color-danger)] font-bold' : 'text-[var(--color-glow)]'}>
                    {isVencido ? 'EXPIRADO' : 'AGENDADO'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
