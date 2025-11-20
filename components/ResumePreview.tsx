import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { MapPin, Phone, Mail, Linkedin, Globe, ExternalLink } from 'lucide-react';

interface Props {
  data: ResumeData;
  template: TemplateId;
  scale?: number;
}

const ResumePreview: React.FC<Props> = ({ data, template, scale = 1 }) => {
  const { profile, experience, education, skills, projects } = data;

  // --- Helper Components ---
  const ContactItem = ({ icon: Icon, text, link }: { icon: any, text: string, link?: string }) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-1.5 text-sm opacity-80">
        <Icon size={14} />
        {link ? <a href={link} target="_blank" rel="noreferrer" className="hover:underline">{text}</a> : <span>{text}</span>}
      </div>
    );
  };

  const SkillTag = ({ name, level }: { name: string, level: string }) => (
    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium mr-2 mb-2 inline-block print:bg-gray-100 print:text-black">
      {name}
    </span>
  );

  // --- Layout Engines ---

  // 1. CLASSIC: Serif, Centered Header, Traditional Line Breaks
  const renderClassic = () => (
    <div className="font-serif p-10 text-slate-900 h-full">
      <header className="text-center border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{profile.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <ContactItem icon={MapPin} text={profile.location} />
          <ContactItem icon={Phone} text={profile.phone} />
          <ContactItem icon={Mail} text={profile.email} />
          <ContactItem icon={Linkedin} text="LinkedIn" link={profile.linkedin} />
        </div>
      </header>

      {profile.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Experience</h2>
        {experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-base">{exp.role}</h3>
              <span className="text-sm italic">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <div className="text-sm font-semibold italic mb-1">{exp.company}</div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Education</h2>
        {education.map(edu => (
          <div key={edu.id} className="flex justify-between mb-2 text-sm">
            <div>
              <span className="font-bold">{edu.school}</span>, {edu.degree} in {edu.field}
            </div>
            <div className="italic">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3">Skills</h2>
        <div className="text-sm leading-relaxed">
            {skills.map(s => s.name).join(' • ')}
        </div>
      </section>
    </div>
  );

  // 2. MODERN: Sans-serif, Blue Accents, Clean
  const renderModern = () => (
    <div className="font-sans p-10 text-slate-800 h-full">
      <header className="flex justify-between items-start border-b-2 border-blue-500 pb-6 mb-8">
        <div>
          <h1 className="text-5xl font-light tracking-tight text-blue-600 mb-2">{profile.fullName}</h1>
          <p className="text-lg text-slate-500">{experience[0]?.role || 'Professional'}</p>
        </div>
        <div className="text-right space-y-1 text-sm">
            <div>{profile.email}</div>
            <div>{profile.phone}</div>
            <div>{profile.location}</div>
            {profile.linkedin && <div className="text-blue-500">{profile.linkedin}</div>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {profile.summary && (
             <div className="mb-8">
                <h3 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Profile</h3>
                <p className="text-sm leading-relaxed text-slate-600">{profile.summary}</p>
             </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4">Experience</h3>
            {experience.map(exp => (
              <div key={exp.id} className="mb-6 relative pl-4 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                <h4 className="font-bold text-slate-800">{exp.role}</h4>
                <div className="text-blue-500 text-sm font-medium mb-2">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 space-y-8">
          <div>
            <h3 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4">Education</h3>
            {education.map(edu => (
              <div key={edu.id} className="mb-4 text-sm">
                <div className="font-bold">{edu.school}</div>
                <div className="text-slate-500">{edu.degree}</div>
                <div className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>

          {projects.length > 0 && (
            <div>
               <h3 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4">Projects</h3>
               {projects.map(p => (
                 <div key={p.id} className="mb-3 text-sm">
                   <div className="font-bold">{p.name}</div>
                   <p className="text-xs text-slate-500">{p.description}</p>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 3. MINIMAL: Monochrome, Clean Grid, Helvetica-ish
  const renderMinimal = () => (
    <div className="font-sans p-12 text-black h-full">
        <header className="mb-12">
            <h1 className="text-5xl font-bold tracking-tighter mb-4">{profile.fullName}</h1>
            <div className="flex gap-6 text-sm font-medium text-gray-500">
                <span>{profile.email}</span>
                <span>{profile.phone}</span>
                <span>{profile.location}</span>
            </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar equivalent */}
            <div className="col-span-4 space-y-10">
                 <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-4">
                            <div className="font-bold text-sm">{edu.school}</div>
                            <div className="text-xs text-gray-600">{edu.degree}</div>
                            <div className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                        </div>
                    ))}
                 </section>

                 <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h2>
                    <ul className="text-sm font-medium space-y-2">
                        {skills.map(s => <li key={s.id}>{s.name}</li>)}
                    </ul>
                 </section>
            </div>

            {/* Main Content */}
            <div className="col-span-8 space-y-10">
                {profile.summary && (
                    <section>
                         <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">About</h2>
                         <p className="text-sm leading-relaxed font-medium text-gray-800">{profile.summary}</p>
                    </section>
                )}

                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Work Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-8">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-lg">{exp.role}</h3>
                                <span className="text-xs font-mono text-gray-400">{exp.startDate} — {exp.current ? 'Now' : exp.endDate}</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-600 mb-2">{exp.company}</div>
                            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    </div>
  );

  // 4. SIDEBAR: Dark Left Column
  const renderSidebar = () => (
    <div className="flex h-full bg-white font-sans">
        <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-8 print:bg-slate-900 print:text-white">
            <div className="mb-4">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 text-white">
                    {profile.fullName.charAt(0)}
                </div>
                <h1 className="text-2xl font-bold leading-tight mb-4">{profile.fullName}</h1>
                <div className="text-slate-400 text-xs space-y-2">
                    <div className="flex items-center gap-2"><Mail size={12}/> {profile.email}</div>
                    <div className="flex items-center gap-2"><Phone size={12}/> {profile.phone}</div>
                    <div className="flex items-center gap-2"><MapPin size={12}/> {profile.location}</div>
                </div>
            </div>

            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-700 pb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                        <span key={s.id} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded">{s.name}</span>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-700 pb-2">Education</h3>
                {education.map(edu => (
                    <div key={edu.id} className="mb-4 text-sm text-slate-300">
                        <div className="font-bold text-white">{edu.school}</div>
                        <div className="text-xs">{edu.degree}</div>
                    </div>
                ))}
            </section>
        </div>

        <div className="w-2/3 p-10 text-slate-800">
            {profile.summary && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-3">Profile</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.summary}</p>
                </section>
            )}

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-b-2 border-slate-100 pb-2">Professional Experience</h2>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-6">
                        <h3 className="font-bold text-lg">{exp.role}</h3>
                        <div className="flex justify-between text-sm text-blue-600 font-medium mb-2">
                            <span>{exp.company}</span>
                            <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                ))}
            </section>

            {projects.length > 0 && (
                <section>
                     <h2 className="text-xl font-bold text-slate-900 mb-6 border-b-2 border-slate-100 pb-2">Key Projects</h2>
                     {projects.map(p => (
                         <div key={p.id} className="mb-4">
                             <div className="font-bold text-sm">{p.name}</div>
                             <p className="text-xs text-slate-600">{p.description}</p>
                         </div>
                     ))}
                </section>
            )}
        </div>
    </div>
  );

  // 5. TECH: Monospace headers, terminal vibe
  const renderTech = () => (
    <div className="font-mono p-10 text-slate-900 bg-white h-full">
        <header className="border-b-4 border-black pb-6 mb-8">
            <h1 className="text-4xl font-bold mb-2 text-black">&lt;{profile.fullName} /&gt;</h1>
            <div className="flex flex-wrap gap-4 text-xs">
                 <span>const EMAIL = "{profile.email}";</span>
                 <span>const PHONE = "{profile.phone}";</span>
                 <span>const LOC = "{profile.location}";</span>
            </div>
        </header>
        
        {profile.summary && (
            <section className="mb-8">
                <h2 className="text-lg font-bold bg-slate-100 inline-block px-2 py-1 mb-3"> // SUMMARY</h2>
                <p className="text-xs leading-relaxed border-l-2 border-slate-300 pl-4">{profile.summary}</p>
            </section>
        )}

        <section className="mb-8">
            <h2 className="text-lg font-bold bg-slate-100 inline-block px-2 py-1 mb-3"> // EXPERIENCE</h2>
            {experience.map(exp => (
                <div key={exp.id} className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-sm text-blue-700">{exp.role} @ {exp.company}</h3>
                        <span className="text-xs text-slate-500">[{exp.startDate} .. {exp.current ? 'NOW' : exp.endDate}]</span>
                    </div>
                    <p className="text-xs whitespace-pre-wrap">{exp.description}</p>
                </div>
            ))}
        </section>

        <div className="grid grid-cols-2 gap-8">
            <section>
                 <h2 className="text-lg font-bold bg-slate-100 inline-block px-2 py-1 mb-3"> // SKILLS</h2>
                 <div className="text-xs">
                    [{skills.map(s => `"${s.name}"`).join(', ')}]
                 </div>
            </section>
             <section>
                 <h2 className="text-lg font-bold bg-slate-100 inline-block px-2 py-1 mb-3"> // EDUCATION</h2>
                 {education.map(edu => (
                     <div key={edu.id} className="text-xs mb-2">
                         <div className="font-bold">{edu.school}</div>
                         <div>{edu.degree}</div>
                     </div>
                 ))}
            </section>
        </div>
    </div>
  );

  // 6. CREATIVE: Bold Colors, Big Typography
  const renderCreative = () => (
    <div className="h-full bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-yellow-400 print:bg-yellow-400"></div>
        <div className="relative p-10 pt-16">
            <header className="mb-10">
                <h1 className="text-6xl font-display font-bold text-slate-900 mb-4 drop-shadow-sm">{profile.fullName}</h1>
                <div className="flex gap-4 font-bold text-sm">
                     <span className="bg-black text-white px-3 py-1">{profile.email}</span>
                     <span className="bg-black text-white px-3 py-1">{profile.phone}</span>
                </div>
            </header>

            <div className="flex gap-10">
                <div className="w-2/3">
                     {profile.summary && (
                        <div className="mb-8">
                            <p className="text-lg font-serif italic leading-relaxed border-l-4 border-yellow-400 pl-4">
                                {profile.summary}
                            </p>
                        </div>
                     )}

                     <section>
                        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-black"></span> Experience
                        </h2>
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-8 group">
                                <h3 className="text-xl font-bold group-hover:text-yellow-600 transition-colors">{exp.role}</h3>
                                <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                                <p className="text-sm leading-loose text-slate-700">{exp.description}</p>
                            </div>
                        ))}
                     </section>
                </div>

                <div className="w-1/3 space-y-10">
                    <section className="bg-slate-50 p-6 rounded-lg print:bg-slate-50">
                        <h2 className="text-xl font-display font-bold mb-4">Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span key={s.id} className="border-2 border-black px-2 py-1 text-xs font-bold hover:bg-black hover:text-white transition-colors">{s.name}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-display font-bold mb-4">Education</h2>
                         {education.map(edu => (
                             <div key={edu.id} className="mb-4">
                                 <div className="font-bold">{edu.school}</div>
                                 <div className="text-sm italic text-slate-500">{edu.degree}</div>
                             </div>
                         ))}
                    </section>
                </div>
            </div>
        </div>
    </div>
  );

  // 7. ELEGANT: Centered, borders, very fancy
  const renderElegant = () => (
      <div className="p-8 h-full font-serif border-8 border-double border-slate-200 m-4 h-[calc(100%-2rem)]">
          <header className="text-center mb-10">
              <h1 className="text-4xl italic font-bold text-slate-800 mb-2">{profile.fullName}</h1>
              <div className="w-24 h-1 bg-slate-800 mx-auto mb-4"></div>
              <div className="text-sm text-slate-600 italic flex justify-center gap-4">
                  <span>{profile.location}</span>
                  <span>•</span>
                  <span>{profile.email}</span>
                  <span>•</span>
                  <span>{profile.phone}</span>
              </div>
          </header>

          {profile.summary && (
              <section className="mb-8 text-center px-10">
                  <p className="text-sm leading-relaxed text-slate-700">{profile.summary}</p>
              </section>
          )}

          <section className="mb-8">
              <div className="flex items-center mb-6">
                  <div className="flex-grow h-px bg-slate-300"></div>
                  <h2 className="px-4 text-lg font-bold text-slate-800 uppercase tracking-widest">Experience</h2>
                  <div className="flex-grow h-px bg-slate-300"></div>
              </div>
              
              {experience.map(exp => (
                  <div key={exp.id} className="mb-6 text-center">
                      <h3 className="font-bold text-base">{exp.role}</h3>
                      <div className="text-sm italic text-slate-500 mb-2">{exp.company}, {exp.startDate}–{exp.current ? 'Present' : exp.endDate}</div>
                      <p className="text-sm text-slate-700 text-left mx-auto max-w-lg">{exp.description}</p>
                  </div>
              ))}
          </section>

          <div className="grid grid-cols-2 gap-8">
               <section>
                   <div className="flex items-center mb-4">
                       <div className="flex-grow h-px bg-slate-300"></div>
                       <h2 className="px-4 text-sm font-bold text-slate-800 uppercase">Education</h2>
                       <div className="flex-grow h-px bg-slate-300"></div>
                   </div>
                   {education.map(edu => (
                       <div key={edu.id} className="text-center mb-2">
                           <div className="font-bold text-sm">{edu.school}</div>
                           <div className="text-xs italic">{edu.degree}</div>
                       </div>
                   ))}
               </section>

               <section>
                    <div className="flex items-center mb-4">
                       <div className="flex-grow h-px bg-slate-300"></div>
                       <h2 className="px-4 text-sm font-bold text-slate-800 uppercase">Skills</h2>
                       <div className="flex-grow h-px bg-slate-300"></div>
                   </div>
                   <div className="text-center text-sm italic text-slate-700">
                       {skills.map(s => s.name).join(', ')}
                   </div>
               </section>
          </div>
      </div>
  );

  // 8. BOLD: High contrast, black header
  const renderBold = () => (
    <div className="h-full bg-white font-sans">
        <header className="bg-black text-white p-10 print:bg-black print:text-white">
            <h1 className="text-6xl font-extrabold tracking-tighter mb-4">{profile.fullName}</h1>
            <div className="text-lg font-medium text-gray-400 flex gap-6">
                <span>{profile.email}</span>
                <span>{profile.phone}</span>
            </div>
        </header>
        <div className="p-10 grid grid-cols-3 gap-10">
            <div className="col-span-2">
                <section className="mb-10">
                    <h2 className="text-4xl font-bold text-black mb-6">Experience.</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-8 border-l-4 border-black pl-6">
                            <h3 className="text-xl font-bold">{exp.role}</h3>
                            <div className="text-sm font-bold text-gray-500 mb-2 uppercase">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                            <p className="text-base text-gray-800 leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </section>
            </div>
            <div className="col-span-1 space-y-10">
                {profile.summary && (
                    <section>
                        <h2 className="text-2xl font-bold text-black mb-4">About.</h2>
                        <p className="text-sm font-medium text-gray-600 leading-relaxed">{profile.summary}</p>
                    </section>
                )}
                <section>
                     <h2 className="text-2xl font-bold text-black mb-4">Skills.</h2>
                     <div className="flex flex-col gap-2">
                         {skills.map(s => (
                             <div key={s.id} className="font-bold text-gray-800 text-sm border-b border-gray-200 pb-1">{s.name}</div>
                         ))}
                     </div>
                </section>
                <section>
                     <h2 className="text-2xl font-bold text-black mb-4">Education.</h2>
                     {education.map(edu => (
                         <div key={edu.id} className="mb-4">
                             <div className="font-bold text-lg">{edu.school}</div>
                             <div className="text-sm text-gray-500">{edu.degree}</div>
                         </div>
                     ))}
                </section>
            </div>
        </div>
    </div>
  );

  const renderers = {
    classic: renderClassic,
    modern: renderModern,
    minimal: renderMinimal,
    sidebar: renderSidebar,
    tech: renderTech,
    creative: renderCreative,
    elegant: renderElegant,
    bold: renderBold
  };

  // Scale wrapper for preview sizing
  return (
    <div 
      className="bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0"
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {renderers[template]()}
    </div>
  );
};

export default ResumePreview;