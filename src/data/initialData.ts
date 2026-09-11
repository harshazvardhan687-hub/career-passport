import { PassportProfile, JobOpportunity } from "../types";

export const initialStudents: PassportProfile[] = [
  {
    "id": "rahul-sharma",
    "passportNumber": "CP-IN-2024-8820",
    "fullName": "Rahul Sharma",
    "headline": "Aspiring Software Developer & Cloud Systems Builder",
    "personaType": "student",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    "location": "Bengaluru, India",
    "targetRole": "Software Developer",
    "careerScore": 820,
    "bio": "CS graduate focused on distributed systems and backend engineering. Lifelong learner who built verified credits through university coursework, open-source projects, a fintech internship, and competitive hackathons.",
    "verifiedAt": "2024-08-15",
    "achievements": [
      {
        "id": "ach-1",
        "category": "Degree",
        "title": "B.Tech in Computer Science",
        "organization": "National Institute of Technology",
        "credits": 200,
        "date": "2020 - 2024",
        "verified": true,
        "notes": "Accredited Tier-1 engineering program with official transcripts"
      },
      {
        "id": "ach-2",
        "category": "Internship",
        "title": "Backend Engineering Intern",
        "organization": "PayKwik Solutions (FinTech)",
        "credits": 150,
        "date": "May - Aug 2023",
        "verified": true,
        "notes": "Built high-throughput payment ingestion APIs handling 10k RPS"
      },
      {
        "id": "ach-3",
        "category": "Projects",
        "title": "Distributed Key-Value Store & Task Engine",
        "organization": "Open Source GitHub",
        "credits": 120,
        "date": "2023 - 2024",
        "verified": true,
        "notes": "Code reviewed by 4 industry mentors with 98% test coverage"
      },
      {
        "id": "ach-4",
        "category": "Verified skills",
        "title": "Core Algorithms & Systems Competency",
        "organization": "Career Passport Assessment",
        "credits": 100,
        "date": "2024",
        "verified": true,
        "notes": "Proctored algorithmic and systems evaluations"
      },
      {
        "id": "ach-5",
        "category": "Certifications",
        "title": "AWS Certified Cloud Practitioner",
        "organization": "Amazon Web Services",
        "credits": 80,
        "date": "Nov 2023",
        "verified": true,
        "notes": "Credential ID: AWS-78920194-CP"
      },
      {
        "id": "ach-6",
        "category": "Hackathon",
        "title": "1st Place — National FinTech Hackathon",
        "organization": "Fintech Alliance",
        "credits": 50,
        "date": "Feb 2024",
        "verified": true,
        "notes": "Built real-time fraud telemetry detection prototype"
      },
      {
        "id": "ach-7",
        "category": "Work experience",
        "title": "Junior Software Fellow",
        "organization": "TechBridge Incubator",
        "credits": 120,
        "date": "2023 - 2024",
        "verified": true,
        "notes": "Maintained production microservices and CI/CD pipelines"
      }
    ],
    "skills": [
      {
        "id": "sk-python",
        "name": "Python",
        "category": "Technical",
        "credits": 100,
        "level": "Advanced",
        "proofList": [
          {
            "id": "p-py-1",
            "type": "Project",
            "title": "Distributed Task Queue (Celery-style)",
            "issuerOrEntity": "GitHub Repository (240+ stars)",
            "date": "2023",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:4b91f09d3e8a",
            "evidenceUrl": "https://github.com/rahul/async-task-engine",
            "details": "Engineered asynchronous broker-agnostic task queue with retry backoffs and Redis backend in Python."
          },
          {
            "id": "p-py-2",
            "type": "Assessment",
            "title": "Advanced Python Concurrency & Memory Profiling",
            "issuerOrEntity": "Career Passport Proctored Benchmark",
            "date": "Jan 2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:7c18a22e89d1",
            "details": "Score: 94th percentile across memory management, GIL workarounds, and async I/O."
          },
          {
            "id": "p-py-3",
            "type": "Certificate",
            "title": "Professional Python Software Engineering",
            "issuerOrEntity": "Python Institute (PCAP)",
            "date": "2023",
            "verificationStatus": "Institutional Seal",
            "verificationHash": "sha256:88fa2b109e34",
            "details": "Verified certification in object-oriented design, modules, and packaging standards."
          },
          {
            "id": "p-py-4",
            "type": "Internship",
            "title": "Production Data Pipeline & API Engineering",
            "issuerOrEntity": "PayKwik Solutions",
            "date": "Summer 2023",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:91df7a0014b2",
            "details": "Deployed Python FastAPI microservices into Kubernetes with automated regression testing."
          }
        ]
      },
      {
        "id": "sk-java",
        "name": "Java",
        "category": "Technical",
        "credits": 90,
        "level": "Proficient",
        "proofList": [
          {
            "id": "p-java-1",
            "type": "Project",
            "title": "Enterprise Banking Transaction Simulator",
            "issuerOrEntity": "NIT Final Year Capstone",
            "date": "2024",
            "verificationStatus": "Institutional Seal",
            "verificationHash": "sha256:1a2b3c4d5e6f",
            "details": "Multithreaded transaction simulator with ACID compliance and HikariCP connection pooling."
          },
          {
            "id": "p-java-2",
            "type": "Assessment",
            "title": "Core Java OOP & JVM Internals Evaluation",
            "issuerOrEntity": "Career Passport Code Engine",
            "date": "Mar 2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:9f8e7d6c5b4a",
            "details": "Tested on garbage collection tuning, memory leaks, and concurrent collections."
          }
        ]
      },
      {
        "id": "sk-sql",
        "name": "SQL & Database Optimization",
        "category": "Technical",
        "credits": 85,
        "level": "Proficient",
        "proofList": [
          {
            "id": "p-sql-1",
            "type": "Work Experience",
            "title": "Query Indexing & Schema Refactoring",
            "issuerOrEntity": "TechBridge Incubator",
            "date": "2023",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:aa11bb22cc33",
            "details": "Reduced p99 database response times by 42% through B-Tree indexing and EXPLAIN ANALYZE."
          }
        ]
      },
      {
        "id": "sk-git",
        "name": "Git & DevOps Workflows",
        "category": "Technical",
        "credits": 75,
        "level": "Proficient",
        "proofList": [
          {
            "id": "p-git-1",
            "type": "Project",
            "title": "Automated GitHub Actions CI/CD Pipeline",
            "issuerOrEntity": "GitHub Actions",
            "date": "2023",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:ee55ff66aa77",
            "details": "Linting, unit testing, container build, and deployment automation with branch protection."
          }
        ]
      }
    ],
    "studentProgression": [
      {
        "year": "1st Year",
        "credits": 150,
        "title": "Foundations & Exploration",
        "achievements": [
          "Intro to CS & Data Structures (CS101)",
          "First Python Terminal Utility",
          "University Code Camp Participation"
        ]
      },
      {
        "year": "2nd Year",
        "credits": 350,
        "title": "Projects & Practical Engineering",
        "achievements": [
          "Web App Architecture Course",
          "Open Source Contributor",
          "Database Design Certification",
          "First Hackathon Semi-Finalist"
        ]
      },
      {
        "year": "3rd Year",
        "credits": 600,
        "title": "Internships & Production Systems",
        "achievements": [
          "FinTech Summer Internship (PayKwik)",
          "AWS Cloud Certification",
          "Distributed Systems Capstone Lead"
        ]
      },
      {
        "year": "Graduation",
        "credits": 820,
        "title": "Verified Professional Readiness",
        "achievements": [
          "Degree Complete with Distinction",
          "National Hackathon Winner",
          "100+ Verified Python & Java Skill Credits",
          "Verified Career Passport Issued"
        ]
      }
    ]
  },
  {
    "id": "amara-okafor",
    "passportNumber": "CP-NG-2024-7014",
    "fullName": "Amara Okafor, RN",
    "headline": "Senior Clinical Care & Emergency Triage Specialist",
    "personaType": "international",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    "location": "Lagos, Nigeria ➔ Relocating to Manchester, United Kingdom",
    "countryOfOrigin": "Nigeria",
    "targetCountry": "United Kingdom",
    "targetRole": "NHS Registered General Nurse (Band 5/6)",
    "careerScore": 700,
    "bio": "6 years of intensive acute clinical care, emergency triage, and surgical ward nursing at Lagos University Teaching Hospital. Seeking international recognition via Career Passport standardized skill representation.",
    "verifiedAt": "2024-07-20",
    "achievements": [
      {
        "id": "ach-am-1",
        "category": "Degree",
        "title": "B.Sc in Nursing Science",
        "organization": "University of Ibadan",
        "credits": 200,
        "date": "2013 - 2018",
        "verified": true,
        "notes": "Recognized 5-year bachelor degree with honors"
      },
      {
        "id": "ach-am-2",
        "category": "Work experience",
        "title": "Senior Staff Nurse (Emergency & Acute Care)",
        "organization": "Lagos University Teaching Hospital",
        "credits": 250,
        "date": "2018 - 2024 (6 yrs)",
        "verified": true,
        "notes": "Over 12,000 clinical care hours logged with chief matron verification"
      },
      {
        "id": "ach-am-3",
        "category": "Foreign Qualification",
        "title": "Licensed Registered Nurse & Midwife",
        "organization": "Nursing & Midwifery Council of Nigeria (NMCN)",
        "credits": 150,
        "date": "2018 - Present",
        "verified": true,
        "notes": "NMCN License verification seal #NMC-981240-NG"
      },
      {
        "id": "ach-am-4",
        "category": "Certifications",
        "title": "Advanced Cardiac Life Support (ACLS & BLS)",
        "organization": "American Heart Association / Red Cross",
        "credits": 60,
        "date": "2023",
        "verified": true,
        "notes": "Valid international resuscitation certification"
      },
      {
        "id": "ach-am-5",
        "category": "Verified skills",
        "title": "Infection Control & Patient Safety Leadership",
        "organization": "Federal Ministry of Health",
        "credits": 40,
        "date": "2022",
        "verified": true,
        "notes": "Ward lead during epidemic prevention surge response"
      }
    ],
    "skills": [
      {
        "id": "sk-am-clinical",
        "name": "Clinical Care & Emergency Triage",
        "category": "Clinical",
        "credits": 300,
        "level": "Expert",
        "proofList": [
          {
            "id": "p-am-1",
            "type": "Work Experience",
            "title": "6 Years Acute Emergency Ward Rotation",
            "issuerOrEntity": "Lagos University Teaching Hospital",
            "date": "2018 - 2024",
            "verificationStatus": "Institutional Seal",
            "verificationHash": "sha256:990a1b2c3d4e",
            "details": "Managed high-acuity patient resuscitation, intravenous cannulation, and critical vital stabilization."
          },
          {
            "id": "p-am-2",
            "type": "Supervisor Sign-off",
            "title": "Clinical Competency Verification Letter",
            "issuerOrEntity": "Chief Medical Director, LUTH",
            "date": "2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:778899aabbcc",
            "details": "Verified exemplary clinical decision making in high-volume trauma ward."
          }
        ]
      },
      {
        "id": "sk-am-healthcare",
        "name": "Healthcare Experience & Patient Safety",
        "category": "Clinical",
        "credits": 250,
        "level": "Advanced",
        "proofList": [
          {
            "id": "p-am-3",
            "type": "Institutional Seal",
            "title": "Official NMCN Clinical Service Record",
            "issuerOrEntity": "Nursing & Midwifery Council of Nigeria",
            "date": "2024",
            "verificationStatus": "Institutional Seal",
            "verificationHash": "sha256:445566778899",
            "details": "Authenticated logbook covering pediatric, adult surgical, and obstetric care rotations."
          }
        ]
      },
      {
        "id": "sk-am-comm",
        "name": "Patient Communication & Care Delivery",
        "category": "Soft",
        "credits": 150,
        "level": "Advanced",
        "proofList": [
          {
            "id": "p-am-4",
            "type": "Assessment",
            "title": "OET (Occupational English Test) Medicine & Healthcare",
            "issuerOrEntity": "Cambridge Boxhill Language Assessment",
            "date": "2023",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:1234567890ab",
            "details": "Grade A across all clinical empathy, patient counseling, and medical team handover modules."
          }
        ]
      }
    ],
    "foreignRecognition": {
      "originCountry": "Nigeria",
      "targetCountry": "United Kingdom",
      "originQualification": "B.Sc Nursing Science & NMCN Registered Nurse (6 Years)",
      "yearsOfExperience": 6,
      "targetEquivalentRole": "NHS Band 5 Registered General Nurse (Adult)",
      "overallEquivalencePercentage": 86,
      "standardizedCreditTotal": 700,
      "creditBreakdown": [
        {
          "skill": "Clinical Care & Emergency Triage",
          "originCredits": 300,
          "targetEquivalentRequirement": 300,
          "status": "Recognized"
        },
        {
          "skill": "Healthcare Systems & Patient Safety",
          "originCredits": 250,
          "targetEquivalentRequirement": 250,
          "status": "Recognized"
        },
        {
          "skill": "Patient Communication & Clinical Handover",
          "originCredits": 150,
          "targetEquivalentRequirement": 150,
          "status": "Recognized"
        },
        {
          "skill": "NMC Professional Code, Safeguarding & UK Medicines Management",
          "originCredits": 0,
          "targetEquivalentRequirement": 80,
          "status": "Missing Bridging Requirement"
        }
      ],
      "missingBridgingRequirements": [
        {
          "code": "BRIDGE-UK-01",
          "requirement": "NMC Test of Competence: Computer-Based Test (CBT Adult Nursing)",
          "estimatedHours": 40,
          "passportAction": "Complete proctored NMC CBT mock assessment on Career Passport to unlock 40 credits"
        },
        {
          "code": "BRIDGE-UK-02",
          "requirement": "NHS Safeguarding Adults & Medicines Act Orientation",
          "estimatedHours": 25,
          "passportAction": "Complete certified UK statutory and mandatory clinical compliance training module"
        }
      ],
      "pathwaySteps": [
        {
          "step": 1,
          "title": "Credential Authentication & Digitization",
          "status": "Completed",
          "note": "NMCN license and University of Ibadan transcripts verified with cryptographic tamper-proof stamp."
        },
        {
          "step": 2,
          "title": "Equivalency Skill Credit Translation",
          "status": "Completed",
          "note": "700 Career Credits translated into UK National Occupational Standards (NOS)."
        },
        {
          "step": 3,
          "title": "Bridge Jurisdiction Gap (NMC CBT)",
          "status": "In Progress",
          "note": "Preparing for Part 1 CBT test; 85% ready on clinical theory."
        },
        {
          "step": 4,
          "title": "Fast-Track Trust Sponsorship Matching",
          "status": "Next",
          "note": "Direct matching with NHS Foundation Trusts pre-accepting Career Passport credits."
        }
      ],
      "standardizedRepresentationStatement": "Our goal is to create a standardized, portable representation of verified skills that can be understood across employers, institutions and countries."
    }
  },
  {
    "id": "marcus-vance",
    "passportNumber": "CP-US-2024-5412",
    "fullName": "Marcus Vance",
    "headline": "Master Automotive Diagnostician & Drivetrain Technician",
    "personaType": "informal",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    "location": "Detroit, Michigan, USA",
    "targetRole": "Lead Diagnostic Technician / Fleet Service Specialist",
    "careerScore": 640,
    "bio": "5 years of hands-on automotive repair in independent repair shops. No 4-year college degree, but over 8,500 hours of verified diagnostics, engine overhauls, and electrical troubleshooting converted into verified Career Credits.",
    "verifiedAt": "2024-06-12",
    "achievements": [
      {
        "id": "ach-mv-1",
        "category": "Work experience",
        "title": "Automotive Technician (5 Years Hands-On)",
        "organization": "Apex Independent Auto Center",
        "credits": 280,
        "date": "2019 - 2024",
        "verified": true,
        "notes": "Over 8,500 billable service hours with verified repair orders and customer satisfaction score 98%"
      },
      {
        "id": "ach-mv-2",
        "category": "Verified skills",
        "title": "Advanced Engine Overhaul & Timing Systems",
        "organization": "Automotive Skill Guild Audit",
        "credits": 160,
        "date": "2023",
        "verified": true,
        "notes": "Practical assessment with video audit and master technician sign-off"
      },
      {
        "id": "ach-mv-3",
        "category": "Certifications",
        "title": "ASE A1 Engine Repair & A6 Electrical Systems",
        "organization": "National Institute for Automotive Service Excellence",
        "credits": 120,
        "date": "2022",
        "verified": true,
        "notes": "ASE Credential #ASE-9912048"
      },
      {
        "id": "ach-mv-4",
        "category": "Informal / Gig",
        "title": "Mobile Roadside Diagnostics & ECU Flashing",
        "organization": "Independent Specialist Services",
        "credits": 80,
        "date": "2021 - 2024",
        "verified": true,
        "notes": "Resolved 340+ complex electrical and CAN bus diagnostic tickets"
      }
    ],
    "skills": [
      {
        "id": "sk-mv-engine",
        "name": "Engine Repair & Mechanical Overhaul",
        "category": "Vocational",
        "credits": 220,
        "level": "Expert",
        "proofList": [
          {
            "id": "p-mv-1",
            "type": "Work Log",
            "title": "450+ Verified Engine & Drivetrain Rebuilds",
            "issuerOrEntity": "Apex Auto Repair Management System",
            "date": "2019 - 2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:332211aabbcc",
            "details": "Replaced cylinder heads, timing belts, pistons, and turbochargers with 0 warranty recalls."
          },
          {
            "id": "p-mv-2",
            "type": "Supervisor Sign-off",
            "title": "Master Shop Foreman Verification Sign-Off",
            "issuerOrEntity": "Apex Auto Services (Signed by Master Tech R. Harris)",
            "date": "2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:776655443322",
            "details": "Endorsed top-tier competence in complex mechanical teardowns and precision machining tolerances."
          }
        ]
      },
      {
        "id": "sk-mv-diag",
        "name": "OBD-II, CAN-Bus & Electrical Troubleshooting",
        "category": "Technical",
        "credits": 200,
        "level": "Expert",
        "proofList": [
          {
            "id": "p-mv-3",
            "type": "Assessment",
            "title": "Digital Oscilloscope & Sensor Waveform Diagnostics",
            "issuerOrEntity": "Career Passport Practical Diagnostic Challenge",
            "date": "May 2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:554433221100",
            "details": "Proved rapid fault isolation across faulty CAN high/low lines, oxygen sensor degradation, and short-to-grounds."
          }
        ]
      },
      {
        "id": "sk-mv-maintenance",
        "name": "Preventative Maintenance & Brake Hydraulics",
        "category": "Vocational",
        "credits": 140,
        "level": "Proficient",
        "proofList": [
          {
            "id": "p-mv-4",
            "type": "Work Log",
            "title": "Brake Caliper, ABS Module & Rotor Precision Calibration",
            "issuerOrEntity": "Apex Auto Center Work Orders",
            "date": "2020 - 2024",
            "verificationStatus": "Verified",
            "verificationHash": "sha256:8899aabbccdd",
            "details": "Over 1,200 brake jobs completed with zero safety incident reports."
          }
        ]
      },
      {
        "id": "sk-mv-safety",
        "name": "Workshop Safety & OSHA Compliance",
        "category": "Domain",
        "credits": 80,
        "level": "Proficient",
        "proofList": [
          {
            "id": "p-mv-5",
            "type": "Certificate",
            "title": "OSHA 10-Hour General Industry Safety Certification",
            "issuerOrEntity": "OSHA Training Institute",
            "date": "2022",
            "verificationStatus": "Institutional Seal",
            "verificationHash": "sha256:112233445566",
            "details": "Trained in chemical hazard handling, lift operation safety, and personal protective equipment standards."
          }
        ]
      }
    ]
  }
];

export const initialJobs: JobOpportunity[] = [
  {
    "id": "job-1",
    "title": "Software Developer (Backend & Distributed Systems)",
    "company": "FinFlow Global Technologies",
    "location": "Bengaluru / Hybrid / Remote Friendly",
    "type": "Full-time",
    "minCareerCredits": 700,
    "requiredSkills": [
      "Java",
      "Python",
      "SQL",
      "Git",
      "Spring Boot"
    ],
    "preferredSkills": [
      "Docker",
      "Kafka",
      "AWS"
    ],
    "description": "Looking for a disciplined engineer with verified proof of systems design, database optimization, and high-throughput microservices.",
    "salaryRange": "$65,000 - $85,000 (₹18L - ₹26L)"
  },
  {
    "id": "job-2",
    "title": "Junior Cloud Infrastructure Associate",
    "company": "Nebula Scale Systems",
    "location": "Remote",
    "type": "Internship",
    "minCareerCredits": 500,
    "requiredSkills": [
      "Python",
      "Git",
      "Linux"
    ],
    "preferredSkills": [
      "AWS",
      "Kubernetes"
    ],
    "description": "Entry-level cloud platform role for candidates with proven project-based skills and verified continuous learning records.",
    "salaryRange": "$40,000 - $55,000"
  },
  {
    "id": "job-3",
    "title": "Registered General Nurse (Band 5/6 Adult Inpatient)",
    "company": "Manchester University NHS Foundation Trust",
    "location": "Manchester, UK (Visa Sponsorship Available)",
    "type": "Full-time",
    "minCareerCredits": 650,
    "requiredSkills": [
      "Clinical Care & Emergency Triage",
      "Healthcare Experience & Patient Safety",
      "Patient Communication & Care Delivery"
    ],
    "preferredSkills": [
      "ACLS",
      "Wound Management"
    ],
    "description": "Prestigious NHS acute medical wards welcoming international nursing candidates through Career Passport verified credential representation.",
    "salaryRange": "£30,400 - £39,000 / year"
  },
  {
    "id": "job-4",
    "title": "Lead EV & Mechanical Diagnostic Technician",
    "company": "VoltFleet Commercial Services",
    "location": "Detroit, MI",
    "type": "Full-time",
    "minCareerCredits": 600,
    "requiredSkills": [
      "Engine Repair & Mechanical Overhaul",
      "OBD-II, CAN-Bus & Electrical Troubleshooting",
      "Workshop Safety & OSHA Compliance"
    ],
    "preferredSkills": [
      "High Voltage Safety",
      "Hybrid Drivetrains"
    ],
    "description": "Seeking seasoned diagnosticians who can solve complex electrical and mechanical anomalies. Real shop floor proof prioritized over academic degrees.",
    "salaryRange": "$75,000 - $95,000 / year"
  }
];

export const sampleResumes = {
  software: `Dhana Laxmi
Full-Stack Software Engineer | CS Graduate
San Francisco, CA | dhanalaxmi@example.com | github.com/dhanalaxmi

PROFESSIONAL SUMMARY:
Results-driven Software Engineer with strong hands-on foundation in modern web frameworks, distributed architectures, and relational database systems. Proven track record building production-grade React dashboards, Node.js REST APIs, and microservices.

EDUCATION:
Bachelor of Technology in Computer Science and Engineering
Accredited University of Engineering & Technology
2020 – 2024 | GPA: 3.85 / 4.0
Relevant Coursework: Data Structures & Algorithms, Distributed Operating Systems, Database Management Systems, Computer Networks.

PROFESSIONAL EXPERIENCE:
Software Engineer Intern | Acme Cloud Technologies
June 2023 – December 2023 | San Francisco, CA
• Designed and shipped responsive React and TypeScript frontend modules with Tailwind CSS used by 12,000+ daily active users.
• Developed scalable Node.js microservices and optimized PostgreSQL SQL queries reducing API response times by 32%.
• Collaborated in bi-weekly Agile sprints, writing automated integration tests and managing GitHub pull requests.

KEY PROJECTS:
Distributed Real-Time Collaborative Canvas
• Built real-time collaborative workspace utilizing React, TypeScript, WebSockets, and Redis pub/sub.
• Containerized backend services with Docker and set up automated GitHub Actions CI/CD pipelines.

TECHNICAL SKILLS:
• Languages & Frameworks: React, TypeScript, JavaScript (ES6+), Node.js, Express, Python, HTML5/CSS3
• Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git / GitHub
• Core Competencies: RESTful APIs, System Design, Unit Testing, Agile/Scrum Methodologies

CERTIFICATIONS:
• AWS Certified Solutions Architect – Associate (2024)
• Meta Certified Frontend Developer Specialization (Coursera, 2023)`,

  nurse: `Amara Okafor, RN
Registered General Nurse (Adult) | Clinical Care Specialist
London, UK | amara.okafor@nhs.example.net

PROFESSIONAL SUMMARY:
Compassionate, certified Registered Nurse with 6+ years of acute clinical experience in emergency triage, patient stabilization, and multidisciplinary healthcare teams.

EDUCATION:
Bachelor of Science in Nursing (B.Sc Nursing)
University of Ibadan College of Medicine
2014 – 2018 | Graduated with First Class Honours

WORK EXPERIENCE:
Senior Staff Nurse | Lagos University Teaching Hospital
2018 – 2024
• Spearheaded daily ward triage, medication administration, and vital signs monitoring for 40+ acute medical patients.
• Trained 15 junior nursing interns on sterile surgical protocols and digital patient record documentation.
• Coordinated patient care plans alongside attending physicians, physical therapists, and pharmacy teams.

CORE CLINICAL SKILLS:
• Emergency Triage & Acute Patient Assessment
• Medication Administration & IV Cannulation
• Infection Prevention & Clinical Safety Protocols
• Patient & Family Advocacy and Communication

CERTIFICATIONS & LICENSES:
• Registered Nurse License (Nursing and Midwifery Council of Nigeria)
• Basic Life Support (BLS) & Advanced Cardiac Life Support (ACLS)`,

  trade: `Marcus Vance
Certified Automotive Diagnostic Technician
Austin, TX | marcus.vance@techauto.example.com

PROFESSIONAL SUMMARY:
ASE-certified technician with 7 years of hands-on experience in computer-assisted vehicle diagnostics, hybrid drivetrain troubleshooting, and preventive maintenance.

EDUCATION & APPRENTICESHIP:
Associate of Applied Science in Automotive Technology
Texas State Technical Institute
2016 – 2018 | ASE Student Excellence Award

WORK EXPERIENCE:
Lead Service Technician | Lone Star Motors
2019 – Present
• Diagnosed and repaired 450+ electrical, engine control, and transmission issues using OBD-II scan tools and oscilloscopes.
• Logged digital work orders adhering strictly to OSHA and manufacturer warranty standards.

SKILLS:
• Engine Diagnostics & ECU Tuning
• High-Voltage Hybrid / EV Battery Servicing
• Brake, Suspension, & Alignment Systems
• Customer Service & Technical Documentation

CERTIFICATIONS:
• ASE Master Automobile Technician (A1 - A8 Certified)
• EPA Section 609 Refrigerant Handling Certification`
};

export const INITIAL_PASSPORTS = initialStudents;
export const INITIAL_JOBS = initialJobs;
