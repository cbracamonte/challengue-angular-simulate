export interface LiveCodingBrief {
  id: string;
  title: string;
  clientPrompt: string;
  hiddenExpectations: string[];
  timeLimitMinutes: number;
}

export const LIVE_CODING_BRIEFS: LiveCodingBrief[] = [
  {
    id: 'filter-signals',
    title: 'Agregar filtro de estado a la lista de pólizas',
    clientPrompt:
      'El equipo de negocio pide poder filtrar la lista de pólizas por estado (activa/pendiente/cancelada) sin recargar la página. Tenemos poco tiempo, ¿podés mostrarnos cómo lo harías ahora mismo?',
    hiddenExpectations: [
      'Preguntar si el filtro debe combinarse con otros filtros existentes antes de codear (clarificar alcance)',
      'Elegir signal/computed para el estado del filtro en vez de una variable + detectChanges manual',
      'Mencionar en voz alta el trade-off de filtrar client-side (dataset ya cargado) vs pedir al backend',
      'No romper el test existente de la lista — correrlo antes y después del cambio',
      'Nombrar la variable/función con intención de negocio (ej. selectedStatus), no genérica (ej. filter1)',
    ],
    timeLimitMinutes: 15,
  },
  {
    id: 'fix-flaky-test',
    title: 'Un test E2E de emisión de póliza falla de forma intermitente en CI',
    clientPrompt:
      'Este test de Cypress/Playwright pasa en local pero falla 1 de cada 5 corridas en CI. Bloquea el pipeline. ¿Cómo lo investigás en vivo?',
    hiddenExpectations: [
      'Primera pregunta: ¿el fallo es por timing (assertion antes de que resuelva el request) o por estado compartido entre tests?',
      'Proponer un wait explícito sobre una condición (ej. esperar que aparezca el elemento) en vez de un sleep fijo',
      'Revisar si el test depende de datos de un test anterior (orden no garantizado en CI paralelo)',
      'Explicar el impacto de negocio: un pipeline bloqueado retrasa releases, no es "solo un test roto"',
    ],
    timeLimitMinutes: 15,
  },
  {
    id: 'explain-tradeoff',
    title: 'El cliente pregunta por qué el refactor tarda más de lo esperado',
    clientPrompt:
      'Vamos dos días atrás del estimado en el refactor del módulo de emisión. El Product Owner (no técnico) pregunta qué está pasando. Explicáselo.',
    hiddenExpectations: [
      'Sin jerga: no decir "había mucho acoplamiento y falta de cobertura de tests" sin traducirlo',
      'Traducir a impacto: "el código actual no tiene red de seguridad — cambiar algo sin tests puede romper producción, por eso primero escribimos tests de lo que YA existe"',
      'Dar un nuevo estimado concreto, no vago ("un par de días más")',
      'Ofrecer una opción intermedia (shippear una parte ahora, seguir el resto después) si es viable',
    ],
    timeLimitMinutes: 10,
  },
];
