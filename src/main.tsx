import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

import { App } from './App';
// The stylesheet is imported for its side effect — it carries the Tailwind
// entry point and the design tokens.
// oxlint-disable-next-line import/no-unassigned-import
import './styles/global.css';

const styletron = new Styletron();

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root was not found in the document.');

createRoot(container).render(
  <StrictMode>
    <StyletronProvider value={styletron}>
      <App />
    </StyletronProvider>
  </StrictMode>,
);
