import { useLotteryStore } from './hooks/useLotteryStore';
import { Header } from './components/Layout/Header';
import { SetupPage } from './components/Setup/SetupPage';
import { LotteryPage } from './components/Lottery/LotteryPage';
import { WinnersPage } from './components/Winners/WinnersPage';
import { AnimatePresence, motion } from 'motion/react';

function App() {
  const currentPage = useLotteryStore((s) => s.currentPage);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {currentPage === 'setup' && <SetupPage />}
            {currentPage === 'lottery' && <LotteryPage />}
            {currentPage === 'winners' && <WinnersPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
