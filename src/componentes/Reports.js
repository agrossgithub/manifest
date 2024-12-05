// src/componentes/ReportGenerator.js
import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contextos/AuthContext';
import { Form, Button, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Parser } from 'json2csv';
import './ReportGenerator.css';

const ReportGenerator = () => {
  const { currentUser, userRole } = useAuth();
  const [filters, setFilters] = useState({
    feira: '',
    metodoPagamento: '',
    status: '',
  });
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState('');
  const [feiras, setFeiras] = useState([]);

  // Fetch feiras from Firestore for the filter
  React.useEffect(() => {
    const fetchFeiras = async () => {
      try {
        const feirasSnapshot = await getDocs(collection(db, 'fairs'));
        const feirasData = feirasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeiras(feirasData);
      } catch (err) {
        console.error('Erro ao buscar feiras para filtros:', err);
        setError('Erro ao buscar feiras para filtros.');
      }
    };

    fetchFeiras();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const generateReport = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let q = collection(db, 'requests');
      const conditions = [];

      if (filters.feira) {
        conditions.push(where('feira', '==', filters.feira));
      }
      if (filters.metodoPagamento) {
        conditions.push(where('metodoPagamento', '==', filters.metodoPagamento));
      }
      if (filters.status) {
        conditions.push(where('status', '==', filters.status));
      }
      if (userRole !== 'Administrador') {
        conditions.push(where('userId', '==', currentUser.username));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReportData(data);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      setError('Erro ao gerar relatório.');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text('Relatório de Solicitações', 14, 16);
    const tableColumn = ["Título", "Categoria", "Feira", "Local", "Valor Gasto (R$)", "Método de Pagamento", "Descrição", "Número da Solicitação", "Status"];
    const tableRows = [];

    reportData.forEach(request => {
      const requestData = [
        request.title,
        request.categoria,
        request.feira,
        request.local,
        `R$ ${request.valorGasto}`,
        request.metodoPagamento,
        request.descricao,
        request.numeroSolicitacao,
        request.status,
      ];
      tableRows.push(requestData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('relatorio-solicitacoes.pdf');
  };

  const exportCSV = () => {
    try {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorio-solicitacoes.csv");
      link.click();
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
      setError('Erro ao exportar CSV.');
    }
  };

  return (
    <div className="report-generator">
      <Form onSubmit={generateReport}>
        <Form.Group controlId="filterFeira" className="mb-3">
          <Form.Label>Filtrar por Feira:</Form.Label>
          <Form.Control
            as="select"
            name="feira"
            value={filters.feira}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {feiras.map(fair => (
              <option key={fair.id} value={fair.name}>
                {fair.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterMetodoPagamento" className="mb-3">
          <Form.Label>Filtrar por Método de Pagamento:</Form.Label>
          <Form.Control
            as="select"
            name="metodoPagamento"
            value={filters.metodoPagamento}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterStatus" className="mb-3">
          <Form.Label>Filtrar por Status:</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Gerar Relatório
        </Button>
        <Button variant="secondary" onClick={exportPDF} className="me-2">
          Exportar PDF
        </Button>
        <Button variant="secondary" onClick={exportCSV}>
          Exportar CSV
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {reportData.length > 0 && (
        <div className="mt-4">
          <h3>Resultados do Relatório</h3>
          <table className="table table-striped table-bordered table-responsive">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Feira</th>
                <th>Local</th>
                <th>Valor Gasto (R$)</th>
                <th>Método de Pagamento</th>
                <th>Descrição</th>
                <th>Número da Solicitação</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(request => (
                <tr key={request.id}>
                  <td>{request.title}</td>
                  <td>{request.categoria}</td>
                  <td>{request.feira}</td>
                  <td>{request.local}</td>
                  <td>R$ {request.valorGasto}</td>
                  <td>{request.metodoPagamento}</td>
                  <td>{request.descricao}</td>
                  <td>{request.numeroSolicitacao}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
