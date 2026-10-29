/* Project summaries and achievements transcribed from Somesh's resume. Add repository/media URLs when ready. */
window.PROJECTS = [
  {
    id: "smartsheti-ai-smart-farming",
    title: "SmartSheti — AI Farming Platform",
    category: "AI / ML · AGRICULTURE",
    problem: "Farmers need practical support across crop planning, cultivation, harvest, crop disease identification, fertilizer decisions, and access to government schemes.",
    solution: "Architected a Django platform for Maharashtra farmers, combining eight modules across the crop lifecycle with disease detection, fertilizer recommendations, weather data, a bilingual AI chatbot, and a government schemes portal.",
    technologies: ["Python", "Django", "SQLite", "PostgreSQL", "JavaScript", "HTML", "CSS", "Bootstrap", "Machine Learning", "Deep Learning", "TensorFlow/Keras", "EfficientNet-B0", "Decision Tree", "OpenRouter API", "Twilio SMS Verification", "Kaggle Dataset", "OpenWeatherMap API", "REST API"],
    image: "", screenshots: [], video: "", repositoryUrl: "https://github.com/SomeshThombare/Smart-Sheti", liveUrl: "",
    overview: "An AI-based smart farming support platform for farmers in Maharashtra. The project was published in HISET-2025 and IRJMETS (2026).",
    features: [
      "Organized support across three crop lifecycle stages: planning, cultivation, and harvest, with eight functional modules.",
      "Used an EfficientNet-B0 deep-learning model for crop leaf disease detection, reporting 94%+ classification accuracy across 15+ disease categories.",
      "Combined ICAR rule-based logic with machine-learning and decision-tree models for fertilizer recommendations using NPK, soil, and live weather inputs; the resume reports a 40% improvement over its rule-only baseline.",
      "Added an English, Hindi, and Marathi AI chatbot using OpenRouter and LLM API integration.",
      "Integrated Twilio SMS verification and used Kaggle datasets for model development.",
      "Created a government schemes portal; the resume reports a 60% reduction in information lookup time."
    ],
    contribution: "Architected the platform and developed its Django modules, REST API design, disease-detection integration, fertilizer recommendation workflow, chatbot, and schemes portal.",
    architectureImage: "", challenges: "", futureImprovements: ""
  },
  {
    id: "ai-multi-modal-trading-agent",
    title: "AI Multi-Model Trading Agent",
    category: "AI / ML · FINTECH",
    problem: "Analyzing Forex, cryptocurrency, gold, and silver markets and acting on opportunities can involve slow decisions and risk of uncontrolled losses.",
    solution: "Built an AI-assisted trading platform for real-time market analysis, manual AI-recommended trades, and autonomous bot execution with configurable loss controls.",
    technologies: ["Python", "Django", "TensorFlow", "Scikit-learn", "Binance API", "MT5 API", "Gemini 2.5 Lite API", "SQLite", "Chart.js", "REST API"],
    image: "", screenshots: [], video: "", repositoryUrl: "https://github.com/SomeshThombare/AI-Treading-Agent", liveUrl: "",
    overview: "An AI-driven trading platform that analyzes Forex, cryptocurrency, gold, and silver markets and processes 1,000+ market signals per session, according to the resume.",
    features: [
      "Supports manual, AI-recommended trade execution and fully autonomous bot trading.",
      "The resume reports reducing average trade decision time from 15 minutes to under 30 seconds.",
      "Includes stop-loss and take-profit controls, user-defined daily loss limits, and automatic bot suspension after three consecutive losses."
    ],
    contribution: "Built market signal processing, AI-assisted and autonomous trading workflows, market/API integrations, and risk-management controls.",
    architectureImage: "", challenges: "", futureImprovements: ""
  },
  {
    id: "ecommerce-product-price-comparison",
    title: "E-Commerce Product Price Comparison Web App",
    category: "WEB APP · E-COMMERCE",
    problem: "Comparing the same product across multiple online stores can take time and make it difficult to spot the lowest available price.",
    solution: "Built a responsive web application where users can search for a product and compare its current prices and basic details across multiple e-commerce sites.",
    technologies: ["Python", "Flask", "HTML", "CSS", "Bootstrap", "JavaScript", "SQLite"],
    image: "", screenshots: [], video: "", repositoryUrl: "https://github.com/SomeshThombare/Web-Application-for-Product-Price-Comparison-Across-E-Commerce-Sites", liveUrl: "",
    overview: "A web application that brings product prices from multiple e-commerce sites into one comparison view, helping users identify the cheapest option.",
    features: [
      "User registration and login.",
      "Product search with price comparison across multiple online stores.",
      "Basic product details shown alongside each price.",
      "Responsive interface for desktop and mobile screens.",
      "SQLite storage for application data."
    ],
    contribution: "Developed the frontend and backend, implemented signup/login authentication and product search and comparison logic, designed the responsive interface, and managed SQLite data storage.",
    architectureImage: "", challenges: "", futureImprovements: ""
  },
  {
    id: "jcep-alumni-network-tool",
    title: "JCEP Alumni Network Tool",
    category: "FULL-STACK · EDUCATION",
    problem: "JCEP alumni records were stored in CSV files, making structured organization, search, retrieval, and ongoing data management more difficult.",
    solution: "Developed a centralized alumni management web application with a Flask backend and PostgreSQL database to organize alumni records and support SQL-based retrieval.",
    technologies: ["Python", "Flask", "HTML", "CSS", "JavaScript", "PostgreSQL", "SQL", "Git", "GitHub"],
    image: "", screenshots: [], video: "", repositoryUrl: "https://github.com/SomeshThombare/Alumni-Network-Management-Tool/tree/main", liveUrl: "",
    overview: "A full-stack alumni management application developed for Jaywant College of Engineering & Polytechnic (JCEP). It replaces CSV-based record storage with PostgreSQL for structured data management and querying.",
    features: [
      "Organizes and maintains alumni records.",
      "Supports searching and filtering records using relevant criteria.",
      "Stores and queries structured alumni information with PostgreSQL and SQL.",
      "Uses Flask to handle application logic and connect the frontend to the database.",
      "Provides a responsive interface built with HTML, CSS, and JavaScript."
    ],
    contribution: "Developed the Python/Flask backend, integrated PostgreSQL to replace CSV storage, implemented structured database operations, and connected the frontend with backend functionality.",
    architectureImage: "",
    challenges: "Replaced file-based alumni record storage and made records easier to organize and retrieve as the dataset grows.",
    futureImprovements: "Add secure alumni registration and authentication, role-based access, networking and communication, analytics dashboards, job referrals, and mentorship features."
  }
];
