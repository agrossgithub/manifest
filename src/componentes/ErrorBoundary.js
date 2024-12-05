// src/componentes/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para exibir a UI de fallback
    return { hasError: true, errorInfo: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    // Pode logar o erro em serviços externos
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza UI de fallback
      return <h2>Algo deu errado: {this.state.errorInfo}</h2>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
