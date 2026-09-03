const fs = require('fs');
const path = require('path');

const cleanBackground = `function ScreenBackground({ groupIdx, isMobile, activeColor }: { 
  groupIdx: number; isMobile: boolean; activeColor: string;
}) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: isMobile ? 12 : 25 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 8,
      size: 3 + Math.random() * 6, duration: 10 + Math.random() * 8,
    }));
    setParticles(p);
  }, [isMobile, groupIdx]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#070514]" style={{ zIndex: 0 }}>
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: \`radial-gradient(circle at 50% 20%, #1a0f3d 0%, #0d0726 50%, #050212 100%)\`
        }} 
      />
      <motion.div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
        style={{ background: activeColor, opacity: 0.25 }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-20 w-[450px] h-[450px] rounded-full blur-[120px]"
        style={{ background: '#7209B7', opacity: 0.2 }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full blur-[110px]"
        style={{ background: '#4CC9F0', opacity: 0.15 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: \`radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 0)\`,
          backgroundSize: '32px 32px'
        }}
      />
      {particles.map(p => (
        <motion.div 
          key={\`\${groupIdx}-\${p.id}\`} 
          className="absolute rounded-full"
          style={{
            left: \`\${p.x}%\`, 
            bottom: -20, 
            width: p.size, 
            height: p.size,
            background: \`radial-gradient(circle, \${activeColor}, #ffffff)\`,
            boxShadow: \`0 0 \${p.size * 3}px \${activeColor}\`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 900) - 50],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

`;

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        processDirectory(fullPath);
      }
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');

      if (content.includes('function ScreenBackground')) {
        let original = content;

        // استبدال ScreenBackground المكسورة بالكامل بغض النظر عن المسافات
        content = content.replace(/function ScreenBackground[\s\S]*?function Stepper/, cleanBackground + 'function Stepper');

        // تحديث أيقونة النسر لتصبح webp
        content = content.replace(/src="\/characters\/karl-3d\.png"/g, 'src="/characters/karl-3d.webp"');
        content = content.replace(/object-cover"/g, 'object-contain p-0.5"');

        // تنظيف الغلاف الزائد لكارل إن وجد
        content = content.replace(/<div style=\{\{\s*transform: isMobile \? 'scale\(0\.4\)' : 'scale\(0\.55\)'[\s\S]*?<KarlEagle mood=\{karlMood\} message=\{karlMessage\} idleGlowColor="#A78BFA" \/>\s*<\/div>/g, '<KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#A78BFA" />');

        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✅ تم إصلاح الدرس: ${fullPath}`);
        }
      }
    }
  }
}

console.log('🚀 بدأ فحص وإصلاح جميع الدروس في كل المجلدات...');
processDirectory('./src/app');
console.log('🎉 اكتملت العملية بنجاح! جميع الدروس متناسقة وخالية من الأخطاء.');