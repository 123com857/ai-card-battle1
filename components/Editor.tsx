import React, { useState } from 'react';
import { ResumeData, Experience, Education, Skill, Project } from '../types';
import { Plus, Trash2, Wand2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import * as Gemini from '../services/gemini';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isPolishing, setIsPolishing] = useState<string | null>(null);

  const handleChange = (section: keyof ResumeData, value: any) => {
    onChange({ ...data, [section]: value });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange('profile', { ...data.profile, [e.target.name]: e.target.value });
  };

  // --- AI HANDLERS ---
  const handleAiPolish = async (fieldPath: string, text: string) => {
    if (!text) return;
    setIsPolishing(fieldPath);
    const polished = await Gemini.polishText(text);
    
    if (fieldPath === 'profile.summary') {
      handleChange('profile', { ...data.profile, summary: polished });
    } else if (fieldPath.startsWith('experience')) {
       const [_, index, field] = fieldPath.split('.');
       const newExp = [...data.experience];
       newExp[parseInt(index)] = { ...newExp[parseInt(index)], [field]: polished };
       handleChange('experience', newExp);
    }
    setIsPolishing(null);
  };

  const handleAiSummary = async () => {
     const role = data.experience[0]?.role;
     const expStr = data.experience.map(e => `${e.role} at ${e.company}`).join(', ');
     if (!role) return alert('Please add at least one experience first.');
     
     setIsPolishing('profile.summary');
     const summary = await Gemini.generateSummary(role, expStr);
     handleChange('profile', { ...data.profile, summary });
     setIsPolishing(null);
  };

  const handleAiBullets = async (index: number) => {
    const exp = data.experience[index];
    if (!exp.role || !exp.company) return alert('Please enter Role and Company first.');
    
    setIsPolishing(`experience.${index}.description`);
    const bullets = await Gemini.generateBulletPoints(exp.role, exp.company);
    
    const newExp = [...data.experience];
    // Append if exists, else replace
    const currentDesc = newExp[index].description;
    newExp[index].description = currentDesc ? currentDesc + '\n' + bullets : bullets;
    handleChange('experience', newExp);
    setIsPolishing(null);
  };

  // --- UI HELPERS ---
  const SectionHeader = ({ id, title, isOpen }: { id: string, title: string, isOpen: boolean }) => (
    <button 
      onClick={() => setActiveSection(isOpen ? '' : id)}
      className={`w-full flex justify-between items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${isOpen ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
    >
      <span>{title}</span>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  const AiButton = ({ onClick, loading, text = "Polish" }: { onClick: () => void, loading: boolean, text?: string }) => (
     <button 
       onClick={onClick}
       disabled={loading || !Gemini.isAiAvailable}
       className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border transition-all 
         ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'}
         ${!Gemini.isAiAvailable && 'opacity-50 cursor-not-allowed'}
       `}
       title={Gemini.isAiAvailable ? "Use AI to improve text" : "API Key missing"}
     >
        {loading ? <Sparkles size={12} className="animate-spin" /> : <Wand2 size={12} />}
        {loading ? 'Thinking...' : text}
     </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-gray-800">Resume Editor</h2>
        <p className="text-xs text-gray-500 mt-1">Fill in your details below.</p>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* PROFILE */}
        <SectionHeader id="profile" title="Personal Details" isOpen={activeSection === 'profile'} />
        {activeSection === 'profile' && (
          <div className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-500">Full Name</label>
                   <input name="fullName" value={data.profile.fullName} onChange={handleProfileChange} className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-500">Job Title (Target)</label>
                   <input name="title" value={data.experience[0]?.role || ''} disabled className="w-full p-2 border rounded-md text-sm bg-gray-50 cursor-not-allowed" placeholder="Inferred from exp..." />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-500">Email</label>
                   <input name="email" value={data.profile.email} onChange={handleProfileChange} className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-500">Phone</label>
                   <input name="phone" value={data.profile.phone} onChange={handleProfileChange} className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-500">Location</label>
                   <input name="location" value={data.profile.location} onChange={handleProfileChange} className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-500">LinkedIn / Website</label>
                   <input name="linkedin" value={data.profile.linkedin} onChange={handleProfileChange} className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
             </div>
             <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-gray-500">Professional Summary</label>
                    <div className="flex gap-2">
                        <AiButton onClick={handleAiSummary} loading={isPolishing === 'profile.summary'} text="Auto-Write" />
                        <AiButton onClick={() => handleAiPolish('profile.summary', data.profile.summary)} loading={isPolishing === 'profile.summary'} />
                    </div>
                </div>
                <textarea 
                    name="summary" 
                    value={data.profile.summary} 
                    onChange={handleProfileChange} 
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                    placeholder="Briefly describe your professional background..."
                />
             </div>
          </div>
        )}

        {/* EXPERIENCE */}
        <SectionHeader id="experience" title="Experience" isOpen={activeSection === 'experience'} />
        {activeSection === 'experience' && (
          <div className="p-5 space-y-6 bg-gray-50/50">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-white border rounded-lg shadow-sm relative group">
                <button 
                    onClick={() => {
                        const newExp = data.experience.filter((_, i) => i !== index);
                        handleChange('experience', newExp);
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={14}/>
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <input 
                        className="p-2 border rounded text-sm font-medium" 
                        placeholder="Job Title" 
                        value={exp.role}
                        onChange={(e) => {
                            const newExp = [...data.experience];
                            newExp[index].role = e.target.value;
                            handleChange('experience', newExp);
                        }}
                    />
                    <input 
                        className="p-2 border rounded text-sm" 
                        placeholder="Company" 
                        value={exp.company}
                        onChange={(e) => {
                            const newExp = [...data.experience];
                            newExp[index].company = e.target.value;
                            handleChange('experience', newExp);
                        }}
                    />
                    <div className="flex gap-2">
                        <input 
                            className="p-2 border rounded text-sm w-full" 
                            placeholder="Start Date" 
                            value={exp.startDate}
                            onChange={(e) => {
                                const newExp = [...data.experience];
                                newExp[index].startDate = e.target.value;
                                handleChange('experience', newExp);
                            }}
                        />
                         <input 
                            className="p-2 border rounded text-sm w-full" 
                            placeholder="End Date" 
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => {
                                const newExp = [...data.experience];
                                newExp[index].endDate = e.target.value;
                                handleChange('experience', newExp);
                            }}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={exp.current} 
                                onChange={(e) => {
                                    const newExp = [...data.experience];
                                    newExp[index].current = e.target.checked;
                                    handleChange('experience', newExp);
                                }}
                            />
                            I currently work here
                        </label>
                    </div>
                </div>
                <div className="space-y-1">
                     <div className="flex justify-between items-center">
                         <label className="text-xs font-medium text-gray-500">Description</label>
                         <div className="flex gap-2">
                             <AiButton onClick={() => handleAiBullets(index)} loading={isPolishing === `experience.${index}.description`} text="Generate Bullets" />
                             <AiButton onClick={() => handleAiPolish(`experience.${index}.description`, exp.description)} loading={isPolishing === `experience.${index}.description`} />
                         </div>
                     </div>
                     <textarea 
                        className="w-full p-2 border rounded text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="• Achieved X by doing Y..."
                        value={exp.description}
                        onChange={(e) => {
                            const newExp = [...data.experience];
                            newExp[index].description = e.target.value;
                            handleChange('experience', newExp);
                        }}
                     />
                </div>
              </div>
            ))}
            <button 
                onClick={() => handleChange('experience', [...data.experience, { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' }])}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={16} /> Add Experience
            </button>
          </div>
        )}

        {/* EDUCATION */}
        <SectionHeader id="education" title="Education" isOpen={activeSection === 'education'} />
        {activeSection === 'education' && (
            <div className="p-5 space-y-4">
                 {data.education.map((edu, index) => (
                     <div key={edu.id} className="p-4 border rounded bg-gray-50 relative">
                         <button 
                            onClick={() => {
                                const newEdu = data.education.filter((_, i) => i !== index);
                                handleChange('education', newEdu);
                            }}
                            className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500"
                        >
                            <Trash2 size={14}/>
                        </button>
                         <div className="grid grid-cols-2 gap-3">
                             <input className="p-2 border rounded text-sm" placeholder="School / University" value={edu.school} onChange={e => {const n = [...data.education]; n[index].school = e.target.value; handleChange('education', n)}} />
                             <input className="p-2 border rounded text-sm" placeholder="Degree" value={edu.degree} onChange={e => {const n = [...data.education]; n[index].degree = e.target.value; handleChange('education', n)}} />
                             <input className="p-2 border rounded text-sm" placeholder="Field of Study" value={edu.field} onChange={e => {const n = [...data.education]; n[index].field = e.target.value; handleChange('education', n)}} />
                             <input className="p-2 border rounded text-sm" placeholder="Graduation Year" value={edu.endDate} onChange={e => {const n = [...data.education]; n[index].endDate = e.target.value; handleChange('education', n)}} />
                         </div>
                     </div>
                 ))}
                  <button 
                    onClick={() => handleChange('education', [...data.education, { id: Date.now().toString(), school: '', degree: '', field: '', startDate: '', endDate: '', current: false }])}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Education
                </button>
            </div>
        )}

        {/* SKILLS */}
        <SectionHeader id="skills" title="Skills" isOpen={activeSection === 'skills'} />
        {activeSection === 'skills' && (
             <div className="p-5">
                 <div className="flex flex-wrap gap-2 mb-4">
                     {data.skills.map((skill, index) => (
                         <div key={skill.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-100">
                             {skill.name}
                             <button onClick={() => {
                                 const newSkills = data.skills.filter((_, i) => i !== index);
                                 handleChange('skills', newSkills);
                             }} className="hover:text-blue-900">×</button>
                         </div>
                     ))}
                 </div>
                 <div className="flex gap-2">
                     <input 
                        id="newSkillInput"
                        className="flex-1 p-2 border rounded text-sm" 
                        placeholder="Add a skill (e.g. React, Python)..." 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = e.currentTarget.value.trim();
                                if(val) {
                                    handleChange('skills', [...data.skills, { id: Date.now().toString(), name: val, level: 'Expert' }]);
                                    e.currentTarget.value = '';
                                }
                            }
                        }}
                    />
                    <button 
                        onClick={() => {
                            const input = document.getElementById('newSkillInput') as HTMLInputElement;
                            if(input.value.trim()) {
                                handleChange('skills', [...data.skills, { id: Date.now().toString(), name: input.value.trim(), level: 'Expert' }]);
                                input.value = '';
                            }
                        }}
                        className="px-4 bg-gray-800 text-white rounded text-sm font-medium"
                    >
                        Add
                    </button>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default Editor;