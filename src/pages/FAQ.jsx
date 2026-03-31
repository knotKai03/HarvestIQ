import { useState } from "react";
import { Link } from "react-router-dom";

function FAQ() {
  const [selectedRegion, setSelectedRegion] = useState("Northeast");
  const [openQuestion, setOpenQuestion] = useState(null);

  const regions = [
    "Northeast",
    "Northwest",
    "Southeast",
    "Southwest",
    "Central",
    "Kansas",
  ];

  const faqItems = [
    {
      question: "How much weather instability am I willing to tolerate?",
      answer:
        "This question helps users decide how comfortable they are with environmental uncertainty. Regions with higher weather-related risk may experience more disruption, so users who value stability may prefer regions with lower weather scores.",
    },
    {
      question: "Is land stability more important to me than market flexibility?",
      answer:
        "Some users may care more about long-term land consistency, while others may accept land-related uncertainty if market conditions are stronger. This question helps users decide what matters more to their strategy.",
    },
    {
      question: "Do I prefer lower total risk even if growth potential is smaller?",
      answer:
        "Lower-risk regions may provide greater stability, but some higher-risk regions may offer stronger upside depending on market and environmental conditions. This question helps users think about risk versus opportunity.",
    },
    {
      question: "Which risk factor matters most to my decision?",
      answer:
        "Not every user will value the same thing. Some may prioritize weather stability, others may focus on land consistency, while some may care most about market price movement. This question helps identify the user's top priority.",
    },
    {
      question: "Would I rather choose a balanced region or a region strong in only one category?",
      answer:
        "A balanced region may offer more overall stability, while another region may perform very well in one category but poorly in another. This question helps users think about whether they want consistency or a more specialized advantage.",
    },
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="page-section">
      <h1>Frequently Asked Questions</h1>
      <p className="page-intro">
        Select a region, then review the questions below to help determine which
        region may be the best fit based on your goals and risk preferences.
      </p>

      <div className="faq-region-picker">
        <label htmlFor="faq-region-select">Choose a Region:</label>
        <select
          id="faq-region-select"
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setOpenQuestion(null);
          }}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="card faq-selected-region">
        <h3>Selected Region: {selectedRegion}</h3>
        <p>
          These questions are the same for every region and are meant to guide
          users as they think through which region best matches their priorities.
        </p>
      </div>

      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div key={index} className="card faq-item">
            <button
              className="faq-question-button"
              onClick={() => toggleQuestion(index)}
            >
              <span>{item.question}</span>
              <span>{openQuestion === index ? "−" : "+"}</span>
            </button>

            {openQuestion === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="button-row">
        <Link to="/about" className="main-button">
          Next: About Us
        </Link>
      </div>
    </div>
  );
}

export default FAQ;