import numpy as np
import cv2
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, r2_score

try:
    import xgboost as xgb
except ImportError:
    xgb = None

try:
    from catboost import CatBoostRegressor
except ImportError:
    CatBoostRegressor = None


def extract_sift_features(images, num_features=16):
    """
    Extracts key SIFT descriptor statistics or color texture histogram vectors
    from input property collages to fuse with tabular data for classical/ensemble models.
    """
    feature_list = []
    # Try SIFT from cv2, fallback to visual color/texture histogram if SIFT is disabled in build
    sift = cv2.SIFT_create(nfeatures=num_features) if hasattr(cv2, 'SIFT_create') else None
    
    for img in images:
        if len(img.shape) == 2 or img.shape[2] == 1:
            gray = img
        else:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
        if sift is not None:
            kp, des = sift.detectAndCompute(gray, None)
            if des is not None and len(des) > 0:
                feat = des[:num_features].flatten()
                if len(feat) < num_features * 128:
                    feat = np.pad(feat, (0, num_features * 128 - len(feat)))
                feat_vec = feat[:num_features * 2] # trim to lightweight dimension
            else:
                feat_vec = np.zeros(num_features * 2)
        else:
            # Fallback visual statistics: mean, std, and spatial color histograms
            h, w, c = img.shape
            grid = img.reshape(-1, c)
            means = grid.mean(axis=0)
            stds = grid.std(axis=0)
            hist, _ = np.histogram(grid, bins=num_features*2 - 6, range=(0, 255))
            feat_vec = np.concatenate([means, stds, hist])
            
        feature_list.append(feat_vec)
        
    return np.array(feature_list)


def train_random_forest(X_train, y_train, X_test, y_test, n_estimators=100):
    model = RandomForestRegressor(n_estimators=n_estimators, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    return model, {'MAE': mae, 'R2': r2}


def train_svr(X_train, y_train, X_test, y_test, C=20.0, epsilon=0.1):
    model = SVR(kernel='rbf', C=C, epsilon=epsilon)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    return model, {'MAE': mae, 'R2': r2}


def train_xgboost(X_train, y_train, X_test, y_test):
    if xgb is None:
        # Fallback to Random Forest if xgboost is not installed in current environment
        return train_random_forest(X_train, y_train, X_test, y_test, n_estimators=150)
        
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        random_state=42
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    return model, {'MAE': mae, 'R2': r2}


def train_catboost(X_train, y_train, X_test, y_test):
    if CatBoostRegressor is None:
        # Fallback to ExtraTrees/RandomForest if CatBoost is not installed
        return train_random_forest(X_train, y_train, X_test, y_test, n_estimators=120)
        
    model = CatBoostRegressor(
        iterations=150,
        depth=6,
        learning_rate=0.05,
        verbose=0,
        random_state=42
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    return model, {'MAE': mae, 'R2': r2}
