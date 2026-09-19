import Resume1 from "../assets/Resume1.png"
import Resume2 from "../assets/Resume2.png"
import Resume3 from "../assets/Resume3.png"

// SVG thumbnail mimicking the ATS template's layout (centered name, ruled
// section headings, text lines) — shown first in the picker.
const ATS_THUMBNAIL =
  "data:image/svg+xml," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>
  <rect width='300' height='400' fill='#ffffff'/>
  <text x='150' y='34' text-anchor='middle' font-family='Arial' font-size='17' font-weight='700' fill='#1f1f1f'>ABHISHEK UMESH HOSAMANI</text>
  <text x='150' y='50' text-anchor='middle' font-family='Arial' font-size='9' font-style='italic' fill='#333333'>Software Engineer • Backend Developer</text>
  <text x='150' y='64' text-anchor='middle' font-family='Arial' font-size='8' fill='#555555'>+91 8431406956 | email | LinkedIn | GitHub | Belagavi</text>
  ${[
    ['PROFESSIONAL SUMMARY', 92], ['TECHNICAL SKILLS', 138], ['EXPERIENCE', 184], ['PROJECTS', 258], ['EDUCATION', 332],
  ].map(([label, y]) => `
    <text x='24' y='${y}' font-family='Arial' font-size='9.5' font-weight='700' fill='#1f1f1f'>${label}</text>
    <line x1='24' y1='${y + 5}' x2='276' y2='${y + 5}' stroke='#444444' stroke-width='1.2'/>
    ${[y + 18, y + 30, y + 42].map((ly, i) => `<rect x='24' y='${ly}' width='${i === 2 ? 140 : 236}' height='5' rx='2.5' fill='#e3e3e3'/>`).join('')}
  `).join('')}
  <circle cx='152' cy='115' r='2.2' fill='#999999'/>
</svg>`)

export const resumeTemplates = [
    {
        id: "04",
        thumbnailImg: ATS_THUMBNAIL,
        colorPaletteCode: "themeATS"
    },
    {
        id: "01",
        thumbnailImg: Resume1,
        colorPaletteCode: "themeOne"
    },
    {
        id: "02",
        thumbnailImg: Resume2,
        colorPaletteCode: "themeTwo"
    },
    {
        id: "03",
        thumbnailImg: Resume3,
        colorPaletteCode: "themeThree"
    },
]

export const DUMMY_RESUME_DATA = {
    profileInfo: {
        previewUrl: "",
        fullName: "Alex Johnson",
        designation: "Senior Software Developer",
        summary: "Full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks. Specialized in React, Node.js, and cloud technologies with a strong focus on clean code architecture and performance optimization. Passionate about mentoring junior developers and implementing agile best practices.",
    },
    contactInfo: {
        email: "alex.johnson.dev@gmail.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/alexjohnson-dev",
        github: "https://github.com/alexjohnson-code",
        website: "https://alexjohnson.dev",
    },
    education: [
        {
            institution: "Stanford University",
            degree: "Master of Science",
            major: "Computer Science",
            minors: "Data Science",
            location: "Stanford, CA",
            graduationYear: "2018"
        },
        {
            institution: "University of California",
            degree: "Bachelor of Science",
            major: "Software Engineering",
            minors: "Mathematics",
            location: "Berkeley, CA",
            graduationYear: "2016"
        }
    ],
    workExperience: [
        {
            role: "Senior Software Engineer",
            company: "TechSolutions Inc.",
            location: "San Francisco, CA",
            startDate: "2020-06-01",
            endDate: "2023-12-31",
            description: "Led a team of 5 developers in building a SaaS platform serving 50,000+ users.\nArchitected microservices using Node.js and React that improved system performance by 40%.\nImplemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes.\nMentored junior developers through code reviews and pair programming sessions."
        },
        {
            role: "Software Developer",
            company: "InnovateSoft",
            location: "San Jose, CA",
            startDate: "2018-07-01",
            endDate: "2020-05-31",
            description: "Developed RESTful APIs handling 10,000+ requests per minute with 99.9% uptime.\nRedesigned legacy frontend using React, improving page load speed by 60%.\nCollaborated with UX team to implement responsive designs for mobile users.\nAutomated testing processes increasing test coverage from 65% to 95%."
        }
    ],
    projects: [
        {
            title: "E-commerce Analytics Dashboard",
            startDate: "2022-03-01",
            endDate: "2022-08-31",
            description: "Built a real-time analytics dashboard for e-commerce clients to track sales, inventory, and customer behavior.",
            technologies: ["React", "D3.js", "Node.js", "MongoDB"],
            github: "https://github.com/alexjohnson-code/ecommerce-analytics",
            liveDemo: "https://demo.alexjohnson.dev/analytics"
        },
        {
            title: "AI-Powered Code Review Tool",
            startDate: "2021-01-01",
            endDate: "2021-06-30",
            description: "Developed a machine learning tool that analyzes pull requests and suggests code improvements.",
            technologies: ["Python", "TensorFlow", "Flask", "GitHub API"],
            github: "https://github.com/alexjohnson-code/ai-code-review"
        }
    ],
    skills: [
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "React" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "AWS" },
        { name: "Docker" },
        { name: "Kubernetes" },
        { name: "GraphQL" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
        { name: "Git" },
        { name: "Agile" },
        { name: "Scrum" },
        { name: "JIRA" }
    ],
    certifications: [
        {
            title: "AWS Certified Solutions Architect",
            year: "2022"
        },
        {
            title: "Google Professional Cloud Architect",
            year: "2021"
        },
        {
            title: "Certified Scrum Master",
            year: "2020"
        }
    ],
    interests: [
        "Open Source Contributions",
        "Machine Learning",
        "Blockchain Technology",
        "Hiking",
        "Photography"
    ]
};