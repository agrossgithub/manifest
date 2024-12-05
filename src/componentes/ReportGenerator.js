// src/componentes/ReportGenerator.js
import React from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const ReportGenerator = ({ data, filter }) => {
  const generateCSV = () => {
    if (!data || data.length === 0) {
      alert('Nenhuma solicitação para gerar relatório.');
      return;
    }

    const csvData = data.map(req => ({
      Título: req.title,
      Categoria: req.categoria,
      Feira: req.feira,
      Local: req.local,
      'Valor Gasto (R$)': req.valorGasto,
      'Método de Pagamento': req.metodoPagamento,
      Descrição: req.descricao,
      'Número da Solicitação': req.numeroSolicitacao,
      Anexo: req.anexo,
      Status: req.status,
      'User ID': req.userId,
      'Criado em': req.createdAt ? req.createdAt.toDate().toLocaleString() : '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `relatorio_solicitacoes_${filter}.csv`);
  };

  return (
    <button onClick={generateCSV} className="btn btn-info">
      Gerar Relatório CSV
    </button>
  );
};

export default ReportGenerator;
