import os
import glob
import numpy as np
import pandas as pd

def generate_sample_tabular_data(n_samples=500, random_state=42):
    """
    Generates synthetic house textual attribute data matching the Houses Dataset schema.
    Columns: bedrooms, bathrooms, area, zipcode, price
    """
    np.random.seed(random_state)
    bedrooms = np.random.randint(1, 6, size=n_samples)
    bathrooms = np.random.choice([1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], size=n_samples)
    area = np.random.randint(600, 6000, size=n_samples)
    zipcodes = np.random.choice([92262, 92264, 92270, 92276, 92562], size=n_samples)
    
    # Realistic base pricing formula with non-linear noise
    base_price = (
        bedrooms * 45000 +
        bathrooms * 55000 +
        area * 180 +
        (zipcodes == 92270) * 120000 +
        (zipcodes == 92264) * 80000 +
        np.random.normal(0, 45000, size=n_samples)
    )
    price = np.clip(base_price, 75000, 2500000).astype(float)

    df = pd.DataFrame({
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'area': area,
        'zipcode': zipcodes,
        'price': price
    })
    return df


def preprocess_tabular_data(df):
    """
    Applies feature engineering matching the notebook:
    - total rooms = bedrooms + bathrooms + 1 (kitchen)
    - avg_room_area = area // total_rooms
    - area category bins
    """
    data = df.copy()
    data['total_rooms'] = data['bedrooms'] + data['bathrooms'] + 1
    data['avg_room_area'] = data['area'] // data['total_rooms']
    
    bins = [0, 1500, 3000, 4500, 6000, float('inf')]
    labels = [1, 2, 3, 4, 5]
    data['area_category'] = pd.cut(data['area'], bins=bins, labels=labels).astype(int)
    return data


def create_synthetic_images(n_samples=500, img_size=64):
    """
    Creates synthetic composite 2x2 property image collages (64x64x3).
    Collage layout:
    - Top-Left: Bathroom representation
    - Top-Right: Bedroom representation
    - Bottom-Right: Frontal Exterior representation
    - Bottom-Left: Kitchen representation
    """
    images = []
    half = img_size // 2
    
    for i in range(n_samples):
        collage = np.zeros((img_size, img_size, 3), dtype=np.uint8)
        
        # Sub-image 1: Bathroom (bluish tint)
        bath_color = np.random.randint(150, 240, size=3)
        bath_color[0] = np.random.randint(180, 255) # blue channel high
        collage[0:half, 0:half] = bath_color
        
        # Sub-image 2: Bedroom (warm beige/brown)
        bed_color = np.array([120, 180, 220], dtype=np.uint8) + np.random.randint(-20, 20, size=3, dtype=np.int16).clip(0, 35)
        collage[0:half, half:img_size] = bed_color.astype(np.uint8)
        
        # Sub-image 3: Frontal Exterior (sky + grass greens)
        ext_color = np.array([50, 150, 80], dtype=np.uint8) + np.random.randint(-15, 15, size=3, dtype=np.int16).clip(0, 30)
        collage[half:img_size, half:img_size] = ext_color.astype(np.uint8)
        
        # Sub-image 4: Kitchen (sleek gray/white counters)
        kitch_color = np.random.randint(160, 230, size=3)
        collage[half:img_size, 0:half] = kitch_color
        
        # Add random geometric features/textures
        cx, cy = np.random.randint(5, img_size-5, size=2)
        collage[max(0, cx-4):min(img_size, cx+4), max(0, cy-4):min(img_size, cy+4)] = 255
        
        images.append(collage)
        
    return np.array(images)
