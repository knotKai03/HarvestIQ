function About() {
  const teamMembers = [
    {
      name: "Group Member A",
      role: "Team Lead",
      contribution:
        "Led the direction of the project, helped organize team priorities, coordinated work across phases, and made sure the group stayed aligned on the overall HarvestIQ vision and project goals.",
    },
    {
      name: "Group Member B",
      role: "Back-End Developer",
      contribution:
        "Worked on the back-end development, data flow, API integration, and the connection between the collected data and the platform so that real risk data can be delivered to the front end.",
    },
    {
      name: "Group Member C",
      role: "Systems Integrator / Documentor",
      contribution:
        "Helped with system organization, integration planning, project structure, documentation, and making sure the technical and written parts of the project remained consistent and presentation-ready.",
    },
    {
      name: "Group Member D",
      role: "Front-End Developer",
      contribution:
        "Designed and built the front-end website experience for HarvestIQ, including the home page, dashboard, comparison page, FAQ page, and about page, while focusing on layout, usability, and making the platform visually clear and interactive.",
    },
  ];

  return (
    <div className="page-section">
      <h1>About Us</h1>
      <p className="page-intro">
        We are The Encryptors, the creators of HarvestIQ. As a team, we combined
        our individual strengths to build a platform focused on agricultural risk
        analysis, regional comparison, and decision support.
      </p>

      <div className="about-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="card team-card">
            <h3>{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <p>{member.contribution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;