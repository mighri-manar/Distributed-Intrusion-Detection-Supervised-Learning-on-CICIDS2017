# Distributed-Intrusion-Detection-Supervised-Learning-on-CICIDS2017


![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)


> **📍 Current Status: Phase 1 - Single CSV Exploration** 
> 
> This is the initial phase working with a single CSV file for data exploration and ML prototyping. Full dataset processing with Apache Spark coming in Phase 2.

A machine learning project for detecting network intrusions and web attacks using the CICIDS2017 dataset. This project demonstrates data exploration, preprocessing, and classification using multiple ML algorithms.

## 📋 Project Overview

This project analyzes network traffic data to identify various types of cyber attacks including:
- Brute Force attacks
- Cross-Site Scripting (XSS)
- SQL Injection
- Benign (normal) traffic

### Dataset

**CICIDS2017** - A comprehensive intrusion detection dataset containing labeled network flows with realistic attack scenarios.

**Phase 1 - Single File Analysis:**
- **File used**: `Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv`
- **Reason**: Smallest file in the dataset, ideal for initial exploration and prototyping
- **Total samples**: 170,346 network flows
- **Features**: 78 network traffic features
- **Classes**: 4 (Benign, Brute Force, XSS, SQL Injection)

> **Note**: The full CICIDS2017 dataset contains multiple CSV files covering different days and attack types. This phase focuses on understanding the data structure and testing ML algorithms on a manageable subset.

**Dataset Distribution:**
- BENIGN: 98.72% (168,186 samples)
- Web Attack - Brute Force: 0.88% (1,507 samples)
- Web Attack - XSS: 0.38% (652 samples)
- Web Attack - SQL Injection: 0.01% (21 samples)

## 🎯 Objectives

**Phase 1 Goals:**
1. ✅ Explore and understand the CICIDS2017 dataset structure
2. ✅ Preprocess network traffic data for machine learning
3. ✅ Train and evaluate multiple classification algorithms on single CSV
4. ✅ Analyze model performance and feature importance
5. ✅ Identify challenges (class imbalance, XSS detection)

**Phase 2 Goals (Upcoming):**
- Scale to full CICIDS2017 dataset (all CSV files)
- Implement distributed processing with Apache Spark
- Compare single-machine vs distributed performance
- Optimize for big data workflows

## 🛠️ Technologies Used

- **Python 3.x**
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning algorithms
- **Matplotlib & Seaborn** - Data visualization
- **Jupyter Notebook** - Interactive development

## 📊 Machine Learning Models

Three algorithms were trained and evaluated:

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| **Logistic Regression** | 99.18% | 99.26% | 99.18% | 99.08% |
| **Decision Tree** | **99.58%** | 99.50% | 99.58% | 99.49% |
| **Random Forest** | 99.57% | 99.47% | 99.57% | 99.48% |

### Key Findings

✅ **Strengths:**
- Excellent detection of benign traffic (99.98% recall)
- Strong Brute Force attack detection (93% recall)
- Fast training and inference times

⚠️ **Challenges:**
- Poor XSS detection (11.5% recall)
- 87% of XSS attacks misclassified as Brute Force
- Severe class imbalance affects minority class performance

### Feature Importance

Top 5 most important features for detection:
1. **Fwd IAT Min** (Forward Inter-Arrival Time Minimum) - 12.0%
2. **Init_Win_bytes_backward** - 8.0%
3. **Flow IAT Min** - 7.5%
4. **Fwd Packets/s** - 5.4%
5. **Flow IAT Mean** - 3.8%

*Timing-based features (Inter-Arrival Time) are crucial for attack detection.*

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.8+
pip
Jupyter Notebook or VS Code with Jupyter extension
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Distributed-Intrusion-Detection-Supervised-Learning-on-CICIDS2017.git
cd Distributed-Intrusion-Detection-Supervised-Learning-on-CICIDS2017
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Download the CICIDS2017 dataset:
   - Visit: [CICIDS2017 Dataset](https://www.unb.ca/cic/datasets/ids-2017.html)
   - Download `MachineLearningCSV.zip`
   - Extract and place `Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv` in the `data/` folder

### Running the Analysis

1. Open the Jupyter notebook:
```bash
jupyter notebook notebooks/test1.ipynb
```

2. Run all cells sequentially (or use "Run All")

3. View results, visualizations, and model performance metrics

## 📈 Results & Visualizations

The project includes:
- **Label distribution** analysis and visualization
- **Confusion matrix** for model predictions
- **Feature importance** ranking
- **Model comparison** charts
- **Performance metrics** (accuracy, precision, recall, F1-score)

## 🔮 Future Work

### Phase 2 - Apache Spark Integration (Next Session)
- [ ] Load full CICIDS2017 dataset (all CSV files)
- [ ] Implement distributed data processing with PySpark
- [ ] Train ML models using PySpark MLlib
- [ ] Compare single-machine vs distributed performance
- [ ] Optimize for large-scale data

### Phase 3 - Advanced Techniques (Potential)
- [ ] Apply SMOTE or class weighting for imbalance
- [ ] Feature engineering for XSS-specific patterns
- [ ] Ensemble methods with custom thresholds
- [ ] Deep learning approaches (LSTM, CNN)
- [ ] Real-time detection pipeline

## 📌 Project Roadmap

```
✅ Phase 1: Single CSV Exploration (CURRENT)
   └─ Data exploration, ML prototyping, baseline models

⏳ Phase 2: Spark Integration
   └─ Distributed processing, scalability testing

🔮 Phase 3: Production-Ready System
   └─ Advanced ML, deployment, monitoring
```

## 🎓 Project Context

This project is part of a Big Data course focusing on:
- Cloud Computing
- Cybersecurity
- Distributed Machine Learning
- Apache Spark

**Academic Year**: 2024-2025  
**Institution**: ENIT (École Nationale d'Ingénieurs de Tunis)

## 📝 Project Structure

```
Distributed-Intrusion-Detection-Supervised-Learning-on-CICIDS2017/
├── data/                          # Dataset folder (not tracked)
│   └── Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv
├── notebooks/
│   └── test1.ipynb  # Phase 1: Single CSV analysis
├── requirements.txt               # Python dependencies
├── README.md                      # Project documentation
└── .gitignore                     # Git ignore rules
```

**Note**: Only working with single CSV file in Phase 1. Full dataset integration in Phase 2.

## 🤝 Contributing

This is an academic project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes. The CICIDS2017 dataset has its own terms of use.

## 🙏 Acknowledgments

- **Canadian Institute for Cybersecurity (CIC)** for the CICIDS2017 dataset
- **University of New Brunswick** for dataset hosting and documentation
- Course instructors and teaching assistants

## 📧 Contact

For questions or collaboration:
- GitHub: [@mighri-manar](https://github.com/mighri-manar)

---

**Note**: The dataset file is not included in this repository due to size constraints. Please download it from the official source.
