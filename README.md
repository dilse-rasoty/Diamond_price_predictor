# Diamond Price Predictor

This web application predicts the price of diamonds based on their physical and categorical features using a machine learning model (Random Forest Regressor). The app also includes analysis of diamond characteristics and interactive visualizations.

## Website link
https://diamond-9f69.onrender.com


## Features

- **Diamond Price Prediction**: Enter key diamond features (carat, cut, color, clarity, depth, table, x, y, z) and get a predicted price.
- **Data Analysis**: Visual graphs showing relationships between price and various diamond characteristics.
- **3D Diamond Viewer**: Visualize a diamond model interactively on the homepage.
- **Model Overview**: Detailed explanation of the machine learning model, dataset, approach, and evaluation metrics.
- **Team Section**: Meet the development team.

## Demo

![Diamond Price Predictor Screenshot](static/screenshots/demo.png)

## Quick Start

### Requirements

- Python 3.10+
- Flask
- pandas, numpy, scikit-learn, joblib

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/<your-username>/diamond-price-predictor.git
    cd diamond-price-predictor
    ```

2. **Install Python Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

3. **Install JS Dependencies (for local development, optional)**

    ```bash
    npm install
    ```

4. **Add Dataset**

    - Place your `diamonds.csv` file (with columns: carat, cut, color, clarity, depth, table, x, y, z, price) in the root directory.

5. **Run the Application**

    ```bash
    python app.py
    ```
    The app will be available at `http://localhost:10000`.

### Deployment

This app is ready for deployment on [Render](https://render.com) using `render.yaml`. See the included file for configuration.

## Usage

1. **Home**: Learn about diamonds and their key characteristics.
2. **Analysis**: Explore visual graphs showing relationships and trends in diamond data.
3. **Price Predictor**: Enter diamond features and get a price estimate.
4. **About Model**: Read details about the machine learning model and dataset.
5. **About Us**: Meet the team members.

## File Structure

- `app.py` — Flask web server and ML model logic
- `index.html` — Main frontend (in template folder)
- `static/graphs/` — Data analysis images
- `static/js/Particles.js` — Particle background effect
- `static/js/DiamondViewer.js` — 3D diamond viewer (uses OGL)
- `static/models/diamond.glb` — 3D model of diamond (GLTF)
- `render.yaml` — Render deployment config
- `package.json`, `package-lock.json` — JS dependencies (OGL for 3D)
- `diamonds.csv` — Diamond dataset (must be provided)
- `requirements.txt` — Python dependencies

## Model Details

- **Algorithm**: Random Forest Regressor
- **Features Used**: carat, cut, color, clarity, depth, table, x, y, z
- **Categorical Encoding**: LabelEncoder for cut, color, clarity
- **Metrics**: MSE, RMSE, MAE, R², MAPE

See the [About Model](#model) section in the app for a full technical overview.

## Team

- **Rayudu Somi Setty** — Core Graphics & Full Stack, AI/ML
- **Aganti Bhuvana Karthik** — Asset Loading & Frontend, AI/ML
- **Marpu Raja** — Graphics Features & Project Management, AI/ML
- **Nagothi Madhumitha** — Graphics Features & Project Management, AI/ML

Contact emails are listed in the [About Us](#aboutus) section of the app.

## License

This project is for educational purposes.

---

**Note:** To use the price predictor, you must provide a suitable diamonds dataset (`diamonds.csv`). The model is trained on this data each time the app starts.
