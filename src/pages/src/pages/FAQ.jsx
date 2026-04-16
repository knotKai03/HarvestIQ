import { useState } from "react";

const faqItems = [
  {
    question: "What does this risk score mean?",
    answer:
      "The risk score is a simplified indicator of agricultural pressure within a selected region. A higher score suggests that the region may be facing greater overall risk based on the combined influence of market conditions, weather patterns, and land-related factors.",
  },
  {
    question: "How is the risk score calculated?",
    answer:
      "The total score is calculated using a weighted model that combines 40% market risk, 35% weather risk, and 25% land risk. These three categories are evaluated together to produce a final score on a 0–99 scale.",
  },
  {
    question: "What data sources does the system use?",
    answer:
      "The historical dashboard is based on external agricultural, weather, and land-related data sources used to support the platform’s 2014–2024 analysis. The predictive section for 2025–2030 represents projected model expectations rather than historical records.",
  },
  {
    question: "How often is the data updated?",
    answer:
      "The historical dashboard is intended to reflect the available historical data range currently loaded into the platform. Future production versions of the system can be connected to automated update pipelines so the platform can refresh as new source data becomes available.",
  },
  {
    question: "What states and regions are currently included?",
    answer:
      "The current version of the platform includes Kansas and Iowa. Each state is organized into five regional views: Northwest, Northeast, Central, Southwest, and Southeast. The structure of the platform allows additional states to be added later.",
  },
  {
    question: "How accurate are the predictions of the model?",
    answer:
      "The predictive results are estimates based on the platform’s weighted risk model and projected assumptions for future conditions. Prediction quality depends on the reliability of the input factors, the consistency of the model’s weighting structure, the availability of future data, and how closely real-world events match forecasted trends.",
  },
  {
    question: "What does each risk level category mean?",
    answer:
      "Market risk reflects commodity price movement and economic pressure. Weather risk reflects environmental instability such as drought or climate variability. Land risk reflects land value pressure and related property conditions. Together, these categories provide a more complete picture of agricultural risk.",
  },
  {
    question: "How can I use this tool in real life?",
    answer:
      "This tool can be used to review regional agricultural conditions, compare one region against another, identify where risk is increasing over time, and support planning discussions based on both historical patterns and projected future trends.",
  },
  {
    question: "Why are some regions riskier than others?",
    answer:
      "Some regions score higher because they experience stronger pressure in one or more of the three major categories. For example, one area may be more affected by weather instability, while another may experience stronger market or land-related pressure.",
  },
  {
    question: "Can I compare multiple regions at once?",
    answer:
      "The current comparative analysis page is designed for side-by-side comparison between two regions at a time. This allows users to review projected differences more clearly without overcrowding the page.",
  },
  {
    question: "How do I navigate the pages of the tool?",
    answer:
      "The Home page introduces the platform and explains its purpose. The Dashboard page presents historical data from 2014–2024. The Comparative Analysis page focuses on projected 2025–2030 outcomes. The FAQ page explains common questions, and the About page introduces the project and team roles.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-container">
      <section className="content-section">
        <div className="section-heading">
          <h3>Frequently Asked Questions</h3>
          <p>
            This section provides a professional overview of the platform, the
            scoring model, the predictive analysis approach, and the overall
            navigation of the tool.
          </p>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{item.question}</span>
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FAQ;