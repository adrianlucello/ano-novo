import { useState, useEffect } from 'react'
import ReactConfetti from 'react-confetti'

// Função para salvar no localStorage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Erro ao salvar no localStorage:', e);
  }
};

// Função para recuperar do localStorage
const getFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Erro ao ler do localStorage:', e);
    return defaultValue;
  }
};

function TimeBlock({ value, label, fontSize, onClick }) {
  return (
    <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
         onClick={onClick}>
      <div className="bg-white shadow-xl rounded-2xl p-6 min-w-[160px] border border-gray-100 cursor-pointer">
        <span className="font-bold bg-gradient-to-r from-[#0857b3] to-[#54d2e0] bg-clip-text text-transparent"
             style={{ fontSize: `${fontSize}px` }}>
          {String(value).padStart(2, '0')}
        </span>
        <div className="mt-2 text-gray-600 font-medium tracking-wider text-sm">
          {label}
        </div>
      </div>
    </div>
  )
}

function TimeInput({ label, value, onChange, max }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val >= 0 && val <= max) {
            onChange(val);
          }
        }}
        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </div>
  )
}

function Countdown({ timeLeft, fontSize, isPaused, isManualMode, onTimeBlockClick }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewYear, setShowNewYear] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (Object.values(timeLeft).every(v => v === 0)) {
      setShowConfetti(true);
      setShowNewYear(true);
    }
  }, [timeLeft]);

  return (
    <div className="text-center">
      {!showNewYear ? (
        <>
          <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-[#0857b3] to-[#54d2e0] bg-clip-text text-transparent">
            Contagem para 2025
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <TimeBlock 
              value={timeLeft.days} 
              label="DIAS" 
              fontSize={fontSize}
              onClick={() => isManualMode && onTimeBlockClick('days')} 
            />
            <TimeBlock 
              value={timeLeft.hours} 
              label="HORAS" 
              fontSize={fontSize}
              onClick={() => isManualMode && onTimeBlockClick('hours')} 
            />
            <TimeBlock 
              value={timeLeft.minutes} 
              label="MINUTOS" 
              fontSize={fontSize}
              onClick={() => isManualMode && onTimeBlockClick('minutes')} 
            />
            <TimeBlock 
              value={timeLeft.seconds} 
              label="SEGUNDOS" 
              fontSize={fontSize}
              onClick={() => isManualMode && onTimeBlockClick('seconds')} 
            />
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <h1 className="text-8xl md:text-[150px] font-black mb-8 animate-bounce bg-gradient-to-r from-[#0857b3] to-[#54d2e0] bg-clip-text text-transparent tracking-tight leading-none">
            FELIZ 2025!
          </h1>
        </div>
      )}
      
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.15}
          wind={0.01}
          initialVelocityY={3}
          colors={['#0857b3', '#54d2e0', '#FFD700', '#FF69B4', '#00FF00', '#FFA500']}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}

function AdminPanel({ 
  onFontSizeChange, 
  fontSize, 
  onPauseToggle, 
  isPaused, 
  onClose, 
  onReset,
  isManualMode,
  onModeToggle,
  timeLeft,
  onTimeChange
}) {
  const [editingTime, setEditingTime] = useState(null);
  const [tempTime, setTempTime] = useState(timeLeft);

  const handleTimeChange = (field, value) => {
    const newTime = { ...tempTime, [field]: value };
    setTempTime(newTime);
    onTimeChange(newTime);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#0857b3] to-[#54d2e0] bg-clip-text text-transparent">
          Painel de Controle
        </h2>
        
        {/* Modo de operação */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isManualMode}
              onChange={onModeToggle}
              className="w-4 h-4 text-[#0857b3]"
            />
            <span>Modo Manual</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            {isManualMode 
              ? "Você pode ajustar o tempo manualmente clicando nos blocos ou usando os controles abaixo" 
              : "O tempo é calculado automaticamente até 2025"}
          </p>
        </div>

        {/* Controles manuais do tempo */}
        {isManualMode && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Ajuste Manual do Tempo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TimeInput
                label="Dias"
                value={tempTime.days}
                onChange={(val) => handleTimeChange('days', val)}
                max={999}
              />
              <TimeInput
                label="Horas"
                value={tempTime.hours}
                onChange={(val) => handleTimeChange('hours', val)}
                max={23}
              />
              <TimeInput
                label="Minutos"
                value={tempTime.minutes}
                onChange={(val) => handleTimeChange('minutes', val)}
                max={59}
              />
              <TimeInput
                label="Segundos"
                value={tempTime.seconds}
                onChange={(val) => handleTimeChange('seconds', val)}
                max={59}
              />
            </div>
          </div>
        )}

        {/* Controle da fonte */}
        <div className="mb-6">
          <label className="block mb-3 text-gray-700">
            Tamanho da Fonte: {fontSize}px
          </label>
          <input
            type="range"
            min="20"
            max="200"
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Controles do cronômetro */}
        <div className="mb-6 space-y-4">
          <button
            onClick={onPauseToggle}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#0857b3] to-[#54d2e0] rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isPaused ? 'Retomar Contagem' : 'Pausar Contagem'}
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isManualMode ? 'Zerar Cronômetro' : 'Resetar para 2025'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [fontSize, setFontSize] = useState(() => 
    getFromLocalStorage('fontSize', 60)
  );
  const [isPaused, setIsPaused] = useState(() => 
    getFromLocalStorage('isPaused', false)
  );
  const [isManualMode, setIsManualMode] = useState(() =>
    getFromLocalStorage('isManualMode', false)
  );
  const [timeLeft, setTimeLeft] = useState(() =>
    getFromLocalStorage('timeLeft', {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
  );
  const [manualTimeSet, setManualTimeSet] = useState(() =>
    getFromLocalStorage('manualTimeSet', null)
  );

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        if (isManualMode && manualTimeSet) {
          // No modo manual, decrementar a partir do tempo definido
          const totalSeconds = timeLeft.days * 86400 + timeLeft.hours * 3600 + 
                             timeLeft.minutes * 60 + timeLeft.seconds;
          
          if (totalSeconds <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          let remaining = totalSeconds - 1;
          const newTime = {
            days: Math.floor(remaining / 86400),
            hours: Math.floor((remaining % 86400) / 3600),
            minutes: Math.floor((remaining % 3600) / 60),
            seconds: remaining % 60
          };
          
          setTimeLeft(newTime);
          saveToLocalStorage('timeLeft', newTime);
        } else {
          // Modo automático - calcula até 2025
          const difference = new Date('2025-01-01T00:00:00') - new Date();
          
          if (difference <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          const newTime = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
          
          setTimeLeft(newTime);
          saveToLocalStorage('timeLeft', newTime);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isManualMode, isPaused, timeLeft, manualTimeSet]);

  useEffect(() => {
    saveToLocalStorage('fontSize', fontSize);
    saveToLocalStorage('isPaused', isPaused);
    saveToLocalStorage('isManualMode', isManualMode);
    saveToLocalStorage('manualTimeSet', manualTimeSet);
  }, [fontSize, isPaused, isManualMode, manualTimeSet]);

  const handleTimeChange = (newTime) => {
    setTimeLeft(newTime);
    setManualTimeSet(true);
    saveToLocalStorage('timeLeft', newTime);
    saveToLocalStorage('manualTimeSet', true);
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar o cronômetro?')) {
      if (isManualMode) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        setManualTimeSet(false);
      } else {
        const difference = new Date('2025-01-01T00:00:00') - new Date();
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
      setIsPaused(false);
      saveToLocalStorage('manualTimeSet', false);
    }
  };

  const handleModeToggle = () => {
    const newMode = !isManualMode;
    setIsManualMode(newMode);
    if (!newMode) {
      // Ao voltar para o modo automático, reseta para o tempo até 2025
      const difference = new Date('2025-01-01T00:00:00') - new Date();
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
      setManualTimeSet(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center relative p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0ySDEweiIgZmlsbC1vcGFjaXR5PSIwLjAzIiBmaWxsPSIjMDAwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-40"></div>
      
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed top-4 left-4 w-8 h-8 bg-gradient-to-r from-[#0857b3] to-[#54d2e0] opacity-20 hover:opacity-100 rounded-full transition-all duration-300 flex items-center justify-center"
        title="Configurações"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="fixed top-4 right-4 flex gap-2">
        {isPaused && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Contagem Pausada
          </div>
        )}
        {isManualMode && (
          <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Modo Manual
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <img 
          src="/logo.webp" 
          alt="Logo da Igreja" 
          className="w-32 h-32 rounded-[50px] object-cover mb-8 shadow-lg"
        />
        <Countdown
          timeLeft={timeLeft}
          fontSize={fontSize}
          isPaused={isPaused}
          isManualMode={isManualMode}
        />
      </div>

      {showAdmin && (
        <AdminPanel
          onFontSizeChange={setFontSize}
          fontSize={fontSize}
          onPauseToggle={() => setIsPaused(!isPaused)}
          isPaused={isPaused}
          onReset={handleReset}
          onClose={() => setShowAdmin(false)}
          isManualMode={isManualMode}
          onModeToggle={handleModeToggle}
          timeLeft={timeLeft}
          onTimeChange={handleTimeChange}
        />
      )}
    </div>
  )
}

export default App
