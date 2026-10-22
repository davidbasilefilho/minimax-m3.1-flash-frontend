import { useSelector } from '@tanstack/react-store';
import { ThemeProvider } from 'baseui/styles';

import { Masthead } from './components/Masthead';
import { Rail } from './components/Rail';
import { SECTION_IDS } from './data/sections';
import { useActiveSection, useThemeAttribute } from './hooks/useActiveSection';
import { useLenis } from './hooks/useLenis';
import { Benchmarks } from './sections/Benchmarks';
import { Cost } from './sections/Cost';
import { DesignSystem } from './sections/DesignSystem';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Integration } from './sections/Integration';
import { Notes } from './sections/Notes';
import { Notices } from './sections/Notices';
import { Thinking } from './sections/Thinking';
import { Throughput } from './sections/Throughput';
import { Vitals } from './sections/Vitals';
import { appStore } from './store/appStore';
import { THEMES } from './theme/minimaxTheme';

export function App() {
  const theme = useSelector(appStore, (state) => state.theme);

  useThemeAttribute();
  useLenis();
  useActiveSection(SECTION_IDS);

  return (
    <ThemeProvider theme={THEMES[theme]}>
      <a
        className='rounded-pill bg-ink text-canvas ease-out-expo fixed top-3 left-3 z-9999 -translate-y-[200%] px-5 py-3 font-semibold no-underline transition-transform duration-280 focus-visible:translate-y-0'
        href='#main'>
        Skip to content
      </a>

      <Masthead />

      <div className='max-w-shell px-gutter mx-auto grid grid-cols-[rail_minmax(0,1fr)] items-start gap-7 max-[1199px]:grid-cols-[minmax(0,1fr)] max-[1199px]:gap-0'>
        <Rail />

        <main id='main' className='min-w-0 outline-none' tabIndex={-1}>
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
