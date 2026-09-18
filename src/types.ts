export interface Persona {
  id: string;
  name: string;
  role: string;
  bias: string;
  color: string;
}

export interface SimulationResult extends Persona {
  emotion: string;
  conviction: number;
  stance: string;
  reasoning: string;
}

export interface SentimentData {
  timestamp: string;
  ticker: string;
  sentimentIndex: number;
  avgConviction: number;
  simulations: SimulationResult[];
  stats: {
    long: number;
    hold: number;
    panic: number;
  };
}

export interface LogEntry {
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'consensus';
}
