import { ResumeData } from '../types';

const escapeLatex = (str: string) => {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

export const generateLatex = (data: ResumeData): string => {
  const { profile, experience, education, skills, projects } = data;

  return `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\href{${escapeLatex(profile.website || '')}}{\\Large ${escapeLatex(profile.fullName)}}} & Email : \\href{mailto:${escapeLatex(profile.email)}}{${escapeLatex(profile.email)}}\\\\
  \\href{${escapeLatex(profile.website || '')}}{${escapeLatex(profile.website)}} & Mobile : ${escapeLatex(profile.phone)} \\\\
  \\href{${escapeLatex(profile.linkedin || '')}}{${escapeLatex(profile.linkedin)}} & ${escapeLatex(profile.location)} \\\\
\\end{tabular*}

%-----------SUMMARY-----------------
\\section{Summary}
${escapeLatex(profile.summary)}

%-----------EXPERIENCE-----------------
\\section{Experience}
  \\begin{itemize}[leftmargin=*]
    ${experience.map(exp => `
    \\item
      \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(exp.role)}} & ${escapeLatex(exp.startDate)} - ${exp.current ? 'Present' : escapeLatex(exp.endDate)} \\\\
        \\textit{${escapeLatex(exp.company)}} & \\\\
      \\end{tabular*}
      \\begin{itemize}
        \\item ${escapeLatex(exp.description).replace(/\n/g, '\n        \\item ')}
      \\end{itemize}
    `).join('')}
  \\end{itemize}

%-----------EDUCATION-----------------
\\section{Education}
  \\begin{itemize}[leftmargin=*]
    ${education.map(edu => `
    \\item
      \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{${escapeLatex(edu.school)}} & ${escapeLatex(edu.startDate)} - ${edu.current ? 'Present' : escapeLatex(edu.endDate)} \\\\
        \\textit{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}} & \\\\
      \\end{tabular*}
    `).join('')}
  \\end{itemize}

%-----------PROJECTS-----------------
\\section{Projects}
  \\begin{itemize}[leftmargin=*]
    ${projects.map(proj => `
    \\item
      \\textbf{${escapeLatex(proj.name)}}: ${escapeLatex(proj.description)}
    `).join('')}
  \\end{itemize}

%-----------SKILLS-----------------
\\section{Skills}
  \\textbf{Technical Skills}: ${skills.map(s => escapeLatex(s.name)).join(', ')}

\\end{document}
  `;
};