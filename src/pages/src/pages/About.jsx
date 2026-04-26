function About() {
  const teamMembers = [
    {
      name: "Team Lead",
      role: "Project Coordination and Oversight",
      details:
        "Managed project planning, team alignment, deliverables, and communication to ensure the platform stayed organized and on track.",
    },
    {
      name: "Back-End Developer",
      role: "Data Processing and Risk Logic",
      details:
        "Worked on data handling, risk model logic, and system-side processes that support the platform’s agricultural intelligence outputs.",
    },
    {
      name: "Systems Integrator / Documentation",
      role: "Architecture and Reporting",
      details:
        "Supported integration planning, system documentation, sprint reporting, and written project materials.",
    },
    {
      name: "Front-End Developer",
      role: "User Interface and Visualization",
      details:
        "Designed the website experience, including the dashboard, comparative analysis, FAQ layout, content presentation, and styling.",
    },
  ];

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading">
          <h3>About the Project</h3>
          <p>
            HarvestIQ was developed as an AI-driven agricultural risk intelligence
            platform focused on regional analysis within Kansas. The platform was
            designed to turn agricultural data into a more readable, structured,
            and professional dashboard experience.
          </p>
        </div>

        <div className="about-highlight">
          <h4>The Encryptors</h4>
          <p>
            Our team collaborated across front-end development, back-end logic,
            system design, documentation, and project coordination to build a
            platform that communicates agricultural risk in a more accessible way.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <h4>{member.name}</h4>
              <h5>{member.role}</h5>
              <p>{member.details}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;