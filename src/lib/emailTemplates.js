export function generateEmailTemplates(profile, recipient) {
  const {
    fullName,
    location,
    skills,
    totalExperience,
    linkedinUrl,
    githubUrl,
  } = profile;

//   const skillsFormatted = skills?.split(',').map(s => s.trim()).join(', ');
const skillsFormatted = Array.isArray(skills) ? skills.map(s => s.trim()).join(', ') : '';

  const templates = [
    `Dear ${recipient},

I hope this email finds you well. My name is ${fullName}, a developer based in ${location} with ${totalExperience} years of experience in ${skillsFormatted}. I came across your company and was very impressed by the work you're doing.

You can find more about my work on [LinkedIn](${linkedinUrl}) and [GitHub](${githubUrl}). Please find my resume attached.

Looking forward to hearing from you.

Best regards,  
${fullName}
`,

    `Hello ${recipient},

This is ${fullName}. I'm reaching out from ${location} with ${totalExperience} years of hands-on experience in ${skillsFormatted}. I'm actively looking for exciting opportunities and believe I can contribute effectively to your team.

Feel free to view my profiles here:  
LinkedIn: ${linkedinUrl}  
GitHub: ${githubUrl}

Resume is attached for your reference.

Thanks and regards,  
${fullName}
`,

    `Hi ${recipient},

Hope you're doing great. I'm ${fullName} from ${location}, experienced in ${skillsFormatted} with ${totalExperience} years of industry experience.

I’d love to connect regarding any relevant openings. Please check my LinkedIn (${linkedinUrl}) and GitHub (${githubUrl}). Resume is attached as well.

Warm regards,  
${fullName}
`,

    `Respected ${recipient},

I’m writing to express my interest in suitable roles at your organization. I’m ${fullName}, currently in ${location}, with a background in ${skillsFormatted} and ${totalExperience} years of experience.

I've attached my resume and added my LinkedIn (${linkedinUrl}) and GitHub (${githubUrl}) links for reference.

Thank you for your time.  
Sincerely,  
${fullName}
`,

    `Dear ${recipient},

I’m ${fullName}, a software developer from ${location}, skilled in ${skillsFormatted}. With over ${totalExperience} years of experience, I’m exploring challenging opportunities where I can make a meaningful impact.

Check out my resume (attached), and feel free to explore my work at:
LinkedIn: ${linkedinUrl}  
GitHub: ${githubUrl}

Thank you!  
${fullName}
`
  ];

  return templates;
}
