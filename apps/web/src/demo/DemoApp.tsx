import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './DemoContext';
import { DemoLayout } from './DemoLayout';
import { DemoProcessosLista } from './DemoProcessosLista';
import { DemoProcessoDetalhe } from './DemoProcessoDetalhe';
import { DemoPublicacoes } from './DemoPublicacoes';
import { DemoAgenda } from './DemoAgenda';
import { DemoPessoas } from './DemoPessoas';

export default function DemoApp() {
  return (
    <DemoProvider>
      <Routes>
        <Route element={<DemoLayout />}>
          <Route index element={<Navigate to="/demo/processos" replace />} />
          <Route path="processos" element={<DemoProcessosLista />} />
          <Route path="processos/:id" element={<DemoProcessoDetalhe />} />
          <Route path="publicacoes" element={<DemoPublicacoes />} />
          <Route path="agenda" element={<DemoAgenda />} />
          <Route path="pessoas" element={<DemoPessoas />} />
          <Route path="*" element={<Navigate to="/demo/processos" replace />} />
        </Route>
      </Routes>
    </DemoProvider>
  );
}

