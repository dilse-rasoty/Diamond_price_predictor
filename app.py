from flask import Flask, request, render_template
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

app = Flask(__name__, template_folder='.')

# Load data and train model
df = pd.read_csv('diamonds.csv')
df = df.drop(df.columns[0], axis=1)

label_encoders = {}
categorical_cols = ['cut', 'color', 'clarity']
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

X = df.drop('price', axis=1)
y = df['price']
model = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
model.fit(X, y)

# Model evaluation metrics
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

y_pred = model.predict(X)
mse = mean_squared_error(y, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y, y_pred)
r2 = r2_score(y, y_pred)
mape = np.mean(np.abs((y - y_pred) / y)) * 100

# For About Model section
model_metrics = {
    'mse': mse,
    'rmse': rmse,
    'mae': mae,
    'r2': r2,
    'mape': mape
}

cut_categories = ['Fair', 'Good', 'Very Good', 'Premium', 'Ideal']
color_categories = ['D', 'E', 'F', 'G', 'H', 'I', 'J']
clarity_categories = ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1']

def encode_category(encoder, category, categories):
    if category in encoder.classes_:
        return encoder.transform([category])[0]
    return encoder.transform([categories[0]])[0]

@app.route('/')
def home():
    return render_template('index.html', model_metrics=model_metrics)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        carat = float(request.form['carat'])
        cut = request.form['cut']
        color = request.form['color'].upper()
        clarity = request.form['clarity'].upper()
        depth = float(request.form['depth'])
        table = float(request.form['table'])
        x = float(request.form['x'])
        y = float(request.form['y'])
        z = float(request.form['z'])

        cut_encoded = encode_category(label_encoders['cut'], cut, cut_categories)
        color_encoded = encode_category(label_encoders['color'], color, color_categories)
        clarity_encoded = encode_category(label_encoders['clarity'], clarity, clarity_categories)

        features = [[carat, cut_encoded, color_encoded, clarity_encoded, depth, table, x, y, z]]
        predicted_price = model.predict(features)[0]
        predicted_price = f"${predicted_price:,.2f}"

        return render_template('index.html', prediction_text=f"Predicted Diamond Price: {predicted_price}", model_metrics=model_metrics)
    except Exception as e:
        return render_template('index.html', prediction_text=f"Error: {str(e)}", model_metrics=model_metrics)

if __name__ == "__main__":
    app.run(debug=True)
