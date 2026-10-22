import { useSelector } from '@tanstack/react-store';
import { ThemeProvider } from 'baseui/styles';

import { Masthead } from './components/Masthead';
import { Rail } from './components/Rail';
import { Hero } from './sections/Hero';
import { Notices } from './sections/Notices';
import { Vitals } from './sections/Vitals';
import { Thinking } from './sections/Thinking';
import { Benchmarks } from './sections/Benchmarks';
import { Cost } from './sections/Cost';
import { Throughput } from './sections/Throughput';
import { Integration } from './sections/Integration';
import { Notes } from './sections/Notes';
import { DesignSystem } from './sections/DesignSystem';
import { Footer } from './sections/Footer';
import { SECTION_IDS } from './data/sections';
import { appStore } from './store/appStore';
import { THEMES } from './theme/minimaxTheme';
import { useActiveSection, useThemeAttribute } from './hooks/useActiveSection';
import { useLenis } from './hooks/useLenis';
import './sections/sections.css';
import './app.css';

export function App() {
  const theme = useSelector(appStore, (state) => state.theme);

  useThemeAttribute();
  useLenis();
  useActiveSection(SECTION_IDS);

  return (
    <ThemeProvider theme={THEMES[theme]}>
      <a className="mm-skip" href="#main">
        Skip to content
      </a>

      <Masthead />

      <div className="mm-shell mm-layout">
        <Rail />

        <main id="main" className="mm-main" tabIndex={-1}>
          <Hero />
          <Notices />
          <Vitals />
          <Thinking />
          <Benchmarks />
          <Cost />
          <Throughput />
          <Integration />
          <Notes />
          <DesignSystem />
        </main>
      </div>

      <Footer />
    </ThemeProvider>
  );
}
