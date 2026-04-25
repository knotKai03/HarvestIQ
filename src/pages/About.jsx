import "./About.css";

function About() {
  const teamMembers = [
    {
      name: "Michelle Amanfo",
      role: "Project Manager / Team Lead",
      linkedin: "https://www.linkedin.com/in/michelleamanfo",
      details:
        "As the Project Manager, Michelle Amanfo led the coordination and execution of the project by organizing team roles, managing deadlines, and ensuring consistent progress. She handled communication with mentors, contributed to data collection, and developed the CI/CD pipeline. She also assisted with presentation development, helping ensure the final deliverables were clear, polished, and complete.",
    },
    {
      name: "Deonte’ Terrell",
      role: "Front-End Developer",
      linkedin: "https://www.linkedin.com/in/deonte-v-terrell",
      details:
        "As the Front-End Developer, Deonte’ Terrell was responsible for designing and building the entire user interface of the platform. He developed all core pages including the dashboard, comparative analysis, FAQ, and About sections, ensuring a clean, professional, and user-friendly experience. He implemented interactive features such as region selection, data visualization, and responsive layouts. In addition, he played a key role in sprint planning and reporting, helping keep the team aligned, on schedule, and focused throughout the development process.",
    },
    {
      name: "Avin Keith",
      role: "Machine Learning Engineer / Data Specialist",
      linkedin: "https://www.linkedin.com/in/avin-keith-999b53265/",
      details:
        "As the Machine Learning Engineer, Avin Keith led the development of the backend data processing and risk modeling components. He collected and curated datasets from government sources, ensuring accuracy and relevance across market, weather, and land factors. He designed and implemented the machine learning logic used to generate agricultural risk scores, as well as structured the data pipelines within Snowflake. His work formed the foundation of the platform’s analytical capabilities and predictive insights.",
    },
    {
      name: "Kai Ilela",
      role: "Systems Integrator / API Developer",
      linkedin: "https://www.linkedin.com/in/kai-ilela/",
      details:
        "As the Systems Integrator, Kai Ilela was responsible for building and managing the API Gateway that connected the backend data to the front-end interface. He ensured seamless data flow between systems so that real-time and processed data could be accurately displayed on the platform. In addition to integration work, he contributed to data collection efforts and collaborated closely with the backend to ensure consistency and reliability in the datasets. His role was critical in bringing together all components into a fully functional system.",
    },
  ];

  return (
    <div className="page-container">

      {/* ───── ABOUT PROJECT (OWN WHITE BOX) ───── */}
      <section className="about-project-card">
        <h2>About the Project</h2>
        <p>
          HarvestIQ was developed as an AI-driven agricultural risk intelligence
          platform focused on regional analysis within Midwestern States. The
          platform was designed to turn agricultural data into a more readable,
          structured, and professional dashboard experience.
        </p>
      </section>

      {/* ───── ENCRYPTORS (SEPARATE WHITE BOX) ───── */}
      <section className="content-section">
        <div className="about-highlight">
          <h4>The Encryptors</h4>
          <p>
            Our team collaborated across front-end development, back-end logic,
            system design, documentation, and project coordination to build a
            platform that communicates agricultural risk in a more accessible
            way.
          </p>
        </div>
      </section>

      {/* ───── TEAM GRID (SEPARATE SECTION) ───── */}
      <section className="content-section">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <h4>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-link"
                >
                  {member.name}
                </a>
              </h4>

              <h5>{member.role}</h5>

              <p>{member.details}</p>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-button"
              >
                View LinkedIn
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default About;
