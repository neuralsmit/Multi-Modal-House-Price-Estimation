import sys
import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Ensure src folder is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dataset_loader import generate_sample_tabular_data, preprocess_tabular_data, create_synthetic_images
from classical_models import train_linear_regression, train_polynomial_regression, train_ridge_regression, train_decision_tree
from advanced_models import extract_sift_features, train_random_forest, train_svr, train_xgboost, train_catboost
from multimodal_network import train_multimodal_network


def run_full_pipeline(n_samples=500, save_results=True, output_dir="results"):
    print("1. Generating & Preprocessing Synthetic Tabular and Visual Dataset...")
    df_raw = generate_sample_tabular_data(n_samples=n_samples)
    df_prep = preprocess_tabular_data(df_raw)
    images = create_synthetic_images(n_samples=n_samples, img_size=64)

    # Feature scaling & log transform for regression
    X_num = df_prep[['bedrooms', 'bathrooms', 'area', 'total_rooms', 'avg_room_area']].values
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_num)

    y_price = df_prep['price'].values
    max_price = y_price.max()
    y_norm = y_price / max_price

    # Split dataset
    (X_tr, X_te, 
     y_tr, y_te, 
     img_tr, img_te,
     price_tr, price_te) = train_test_split(
        X_scaled, y_norm, images, y_price, test_size=0.2, random_state=42
    )

    results = {}

    print("2. Training Classical Machine Learning Models...")
    _, res_lr = train_linear_regression(X_tr, y_tr * max_price, X_te, price_te)
    results['Linear Regression'] = res_lr

    _, res_poly = train_polynomial_regression(X_tr, y_tr * max_price, X_te, price_te, degree=2)
    results['Polynomial Regression'] = res_poly

    _, res_ridge = train_ridge_regression(X_tr, y_tr * max_price, X_te, price_te, alpha=1.0)
    results['Ridge Regression'] = res_ridge

    _, res_dt = train_decision_tree(X_tr, y_tr * max_price, X_te, price_te, max_depth=5)
    results['Decision Tree'] = res_dt

    print("3. Extracting Visual SIFT/Histogram Features & Training Advanced Models...")
    sift_tr = extract_sift_features(img_tr)
    sift_te = extract_sift_features(img_te)

    X_adv_tr = np.hstack([X_tr, sift_tr])
    X_adv_te = np.hstack([X_te, sift_te])

    _, res_rf = train_random_forest(X_adv_tr, y_tr * max_price, X_adv_te, price_te)
    results['Random Forest'] = res_rf

    _, res_svr = train_svr(X_adv_tr, y_tr * max_price, X_adv_te, price_te)
    results['Support Vector Regressor (SVR)'] = res_svr

    _, res_xgb = train_xgboost(X_adv_tr, y_tr * max_price, X_adv_te, price_te)
    results['XGBoost Regressor'] = res_xgb

    _, res_cat = train_catboost(X_adv_tr, y_tr * max_price, X_adv_te, price_te)
    results['CatBoost Regressor'] = res_cat

    print("4. Training Dual-Branch Multi-Modal Neural Network (CNN + MLP Fusion)...")
    # For NN, tabular input uses (bedrooms, bathrooms, area) scaled
    X_tab_tr = X_tr[:, :3]
    X_tab_te = X_te[:, :3]

    _, res_nn, nn_hist = train_multimodal_network(
        X_tab_tr, img_tr, y_tr,
        X_tab_te, img_te, y_te,
        epochs=15
    )
    # Scale NN MAE metric back to raw price ($USD)
    res_nn['MAE'] = res_nn['MAE'] * max_price
    results['Multi-Modal CNN + MLP Neural Net'] = res_nn

    print("\n================ FINAL MODEL BENCHMARK RESULTS ================")
    for model_name, metrics in results.items():
        print(f"{model_name:<38} | MAE: ${metrics['MAE']:>10,.2f} | R2 Score: {metrics['R2']:>6.4f}")
    print("=================================================================\n")

    if save_results:
        os.makedirs(output_dir, exist_ok=True)
        with open(os.path.join(output_dir, "benchmark_metrics.json"), "w") as f:
            json.dump(results, f, indent=2)
        print(f"Results saved to {output_dir}/benchmark_metrics.json")

    return results

if __name__ == "__main__":
    run_full_pipeline()
