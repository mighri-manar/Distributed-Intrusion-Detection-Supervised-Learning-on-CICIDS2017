# Distributed-Intrusion-Detection-Supervised-Learning-on-CICIDS2017


![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)


A machine learning project for detecting network intrusions and web attacks using the CICIDS2017 dataset. This project demonstrates data exploration, preprocessing, and classification using multiple ML algorithms.

## 📋 Project Overview

This project analyzes network traffic data to identify various types of cyber attacks including:
- Brute Force attacks
- Cross-Site Scripting (XSS)
- SQL Injection
- Benign (normal) traffic

### Dataset

**CICIDS2017** - A comprehensive intrusion detection dataset containing labeled network flows with realistic attack scenarios.
- **File used**: `Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv`
- **Total samples**: 170,346 network flows
- **Features**: 78 network traffic features
- **Classes**: 4 (Benign, Brute Force, XSS, SQL Injection)

**Dataset Distribution:**
- BENIGN: 98.72% (168,186 samples)
- Web Attack - Brute Force: 0.88% (1,507 samples)
- Web Attack - XSS: 0.38% (652 samples)
- Web Attack - SQL Injection: 0.01% (21 samples)

## 🎯 Objectives

1. Explore and understand the CICIDS2017 dataset
2. Preprocess network traffic data for machine learning
3. Train and evaluate multiple classification algorithms
4. Analyze model performance and feature importance
5. Prepare for big data processing with Apache Spark

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
git clone https://github.com/yourusername/network-intrusion-detection.git
cd network-intrusion-detection
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
jupyter notebook notebooks/network_attack_analysis.ipynb
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

### Session 2 - Apache Spark Integration
- Scale to full CICIDS2017 dataset (multiple days)
- Implement distributed ML with PySpark MLlib
- Compare single-machine vs distributed performance
- Handle larger datasets efficiently

### Potential Improvements
- Apply SMOTE or class weighting for imbalance
- Feature engineering for XSS-specific patterns
- Ensemble methods with custom thresholds
- Deep learning approaches (LSTM, CNN)
- Real-time detection pipeline

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
network-intrusion-detection/
├── data/                          # Dataset folder (not tracked)
├── notebooks/
│   └── network_attack_analysis.ipynb  # Main analysis notebook
├── requirements.txt               # Python dependencies
├── README.md                      # Project documentation
└── .gitignore                     # Git ignore rules
```

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
