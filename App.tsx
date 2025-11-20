import React, { useState } from 'react';
import { ResumeData, TemplateId, TemplateConfig } from './types';
import Editor from './components/Editor';
import ResumePreview from './components/ResumePreview';
import { generateLatex } from './utils/latex';
import { Download, Printer, FileText, Layout, Check } from 'lucide-react';

const initialData: ResumeData = {
  profile: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    website: 'alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan',
    summary: 'Creative and detail-oriented Frontend Engineer with 5+ years of experience building scalable web applications. Expert in React, TypeScript, and UI/UX design. Proven track record of improving site performance by 40%.'
  },
  experience: [
    {
      id: '1',
      company: 'TechFlow Solutions',
      role: 'Senior Frontend Engineer',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      description: 'Led the migration of a legacy jQuery codebase to React 18, improving load times by 40%.\nMentored 3 junior developers and established code quality standards.\nImplemented a component library used across 5 different products.'
    },
    {
        id: '2',
        company: 'Creative Digital Agency',
        role: 'Web Developer',
        startDate: '2018',
        endDate: '2021',
        current: false,
        description: 'Developed responsive websites for 20+ clients including Fortune 500 companies.\nCollaborated with designers to implement pixel-perfect UIs using SCSS and Vanilla JS.'
      }
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      current: false
    }
  ],
  skills: [
    { id: '1', name: 'React', level: 'Expert' },
    { id: '2', name: 'TypeScript', level: 'Expert' },
    { id: '3', name: 'Tailwind CSS', level: 'Advanced' },
    { id: '4', name: 'Node.js', level: 'Intermediate' },
    { id: '5', name: 'UI/UX Design', level: 'Advanced' }
  ],
  projects: [
      {
          id: '1',
          name: 'E-Commerce Dashboard',
          description: 'Real-time analytics dashboard built with Next.js and D3.js.',
          link: ''
      }
  ]
};

const templates: TemplateConfig[] = [
  { id: 'classic', name: 'Classic', description: 'Timeless serif elegance', thumbnailColor: 'bg-slate-200' },
  { id: 'modern', name: 'Modern', description: 'Clean blue accents', thumbnailColor: 'bg-blue-100' },
  { id: 'minimal', name: 'Minimal', description: 'Clean grid layout', thumbnailColor: 'bg-white border' },
  { id: 'sidebar', name: 'Sidebar', description: 'Dark sidebar contrast', thumbnailColor: 'bg-slate-800' },
  { id: 'tech', name: 'Tech', description: 'Monospace & Code', thumbnailColor: 'bg-green-50' },
  { id: 'creative', name: 'Creative', description: 'Bold & Artistic', thumbnailColor: 'bg-yellow-100' },
  { id: 'elegant', name: 'Elegant', description: 'Bordered luxury', thumbnailColor: 'bg-rose-50' },
  { id: 'bold', name: 'Bold', description: 'High impact black', thumbnailColor: 'bg-black text-white' },
];

function App() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<TemplateId>('modern');
  const [scale, setScale] = useState(0.8);

  const handlePrint = () => {
    window.print();
  };

  const handleLatexExport = () => {
    const latex = generateLatex(data);
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-20 no-print">
        <div className="flex items-center gap-2 text-indigo-600">
           <Layout className="w-6 h-6" />
           <span className="font-bold text-xl tracking-tight text-slate-900">AI Resume<span className="text-indigo-600">Architect</span></span>
        </div>
        
        <div className="flex items-center gap-4">
             <button 
               onClick={handleLatexExport}
               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <FileText size={16} /> Export LaTeX
            </button>
            <button 
               onClick={handlePrint}
               className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
                <Download size={16} /> Download PDF
            </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden bg-slate-50">
        
        {/* Left Panel: Editor */}
        <div className="w-[450px] border-r border-gray-200 flex flex-col bg-white z-10 no-print shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
           <Editor data={data} onChange={setData} />
        </div>

        {/* Center Panel: Preview */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
             {/* Toolbar */}
             <div className="h-14 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center gap-6 px-4 no-print z-10">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    {templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTemplate(t.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${template === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                     <button onClick={() => setScale(s => Math.max(0.4, s - 0.1))} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">-</button>
                     <span className="text-xs font-medium text-gray-500 w-12 text-center">{Math.round(scale * 100)}%</span>
                     <button onClick={() => setScale(s => Math.min(1.5, s + 0.1))} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">+</button>
                </div>
             </div>

             {/* Preview Canvas */}
             <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-100 print-container">
                <div className="print-content">
                    <ResumePreview data={data} template={template} scale={scale} />
                </div>
             </div>
        </div>
      </main>
      
      {/* Styles for printing - Hides UI, Shows Resume full size */}
      <style>{`
        @media print {
            .no-print { display: none !important; }
            body, html { background: white; height: auto; overflow: visible; }
            .print-container { 
                display: block; 
                padding: 0; 
                margin: 0; 
                overflow: visible;
                background: white;
            }
            .print-content {
                transform: none !important;
                width: 100% !important;
            }
            /* Reset Tailwind transforms on the preview wrapper during print */
            .print-content > div {
                transform: none !important;
                box-shadow: none !important;
                margin: 0 !important;
                width: 100% !important;
                min-height: auto !important;
            }
        }
      `}</style>
    </div>
  );
}

export default App;