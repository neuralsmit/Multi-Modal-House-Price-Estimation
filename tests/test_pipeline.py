import unittest
import numpy as np
import sys
import os

# Add src folder to import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from dataset_loader import generate_sample_tabular_data, preprocess_tabular_data, create_synthetic_images
from classical_models import train_linear_regression, train_ridge_regression
from advanced_models import extract_sift_features, train_random_forest
from multimodal_network import train_multimodal_network

class TestHousePricePipeline(unittest.TestCase):
    def test_dataset_generation(self):
        df = generate_sample_tabular_data(n_samples=50)
        self.assertEqual(len(df), 50)
        self.assertIn('bedrooms', df.columns)
        self.assertIn('price', df.columns)

        df_prep = preprocess_tabular_data(df)
        self.assertIn('total_rooms', df_prep.columns)
        self.assertIn('avg_room_area', df_prep.columns)

        imgs = create_synthetic_images(n_samples=50, img_size=64)
        self.assertEqual(imgs.shape, (50, 64, 64, 3))

    def test_classical_and_advanced_models(self):
        X = np.random.randn(40, 5)
        y = np.random.randn(40) * 100000 + 300000
        
        _, res_lr = train_linear_regression(X[:30], y[:30], X[30:], y[30:])
        self.assertIn('MAE', res_lr)
        self.assertIn('R2', res_lr)

        _, res_rf = train_random_forest(X[:30], y[:30], X[30:], y[30:], n_estimators=10)
        self.assertIn('MAE', res_rf)
        self.assertIn('R2', res_rf)

    def test_sift_feature_extraction(self):
        imgs = create_synthetic_images(n_samples=10, img_size=64)
        feats = extract_sift_features(imgs, num_features=16)
        self.assertEqual(feats.shape[0], 10)
        self.assertGreater(feats.shape[1], 0)

if __name__ == '__main__':
    unittest.main()
