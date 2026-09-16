import io
import json
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict

import numpy as np
from PIL import Image, UnidentifiedImageError
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.models import load_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("brain-tumor-backend")

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "brain_tumor_model.h5"
CLASS_INDICES_PATH = BASE_DIR / "model" / "class_indices.json"

model: Any = None
idx_to_class: Dict[int, str] = {}


def load_model_and_labels():
    global model, idx_to_class

    # Verify model file existence
    if not MODEL_PATH.exists():
        err_msg = f"Model file not found at expected path: {MODEL_PATH}"
        logger.error(err_msg)
        raise FileNotFoundError(err_msg)

    # Verify class indices file existence
    if not CLASS_INDICES_PATH.exists():
        err_msg = f"Class indices file not found at expected path: {CLASS_INDICES_PATH}"
        logger.error(err_msg)
        raise FileNotFoundError(err_msg)

    # Load class indices and create reverse mapping
    try:
        with open(CLASS_INDICES_PATH, "r") as f:
            class_indices = json.load(f)
        idx_to_class = {int(v): k for k, v in class_indices.items()}
        logger.info(f"Loaded class mapping: {idx_to_class}")
    except Exception as e:
        logger.error(f"Failed to load class_indices.json: {e}")
        raise RuntimeError(f"Error loading class indices: {e}") from e

    # Load Keras model
    try:
        logger.info(f"Loading Keras model from {MODEL_PATH}...")
        model = load_model(str(MODEL_PATH))
        print("==================================================")
        print(" Brain Tumor Detection Model Loaded Successfully! ")
        print(f" Model path: {MODEL_PATH}")
        print(f" Classes: {list(idx_to_class.values())}")
        print("==================================================")
    except Exception as e:
        logger.error(f"Failed to load Keras model: {e}")
        raise RuntimeError(f"Error loading model: {e}") from e


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_model_and_labels()
    yield
    # Shutdown


app = FastAPI(
    title="Brain Tumor Classification API",
    description="FastAPI backend for Brain Tumor Detection using deep learning",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
default_origins = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
frontend_origin = os.getenv("FRONTEND_ORIGIN", default_origins)
allowed_origins = [origin.strip() for origin in frontend_origin.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate file presence
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided.",
        )

    # Validate model is loaded
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded or unavailable.",
        )

    # Read uploaded file contents
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}",
        )

    # Process image with PIL
    try:
        image = Image.open(io.BytesIO(contents))
        image = image.convert("RGB")
        image = image.resize((224, 224))
    except (UnidentifiedImageError, OSError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image file: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing image: {str(e)}",
        )

    # Prepare image array for prediction
    # EfficientNet has built-in Rescaling(1./255) and Normalization layers.
    # Passing raw [0, 255] float32 values is required to prevent near-zero double normalization.
    try:
        img_array = np.array(image, dtype=np.float32)
        input_batch = np.expand_dims(img_array, axis=0)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error preparing image tensor: {str(e)}",
        )

    # Perform model inference
    try:
        raw_predictions = model.predict(input_batch, verbose=0)
        probabilities = raw_predictions[0]
        predicted_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_idx])
        predicted_class = idx_to_class.get(predicted_idx, f"unknown_{predicted_idx}")

        all_probabilities: Dict[str, float] = {}
        for idx in range(len(probabilities)):
            class_name = idx_to_class.get(idx, f"class_{idx}")
            all_probabilities[class_name] = round(float(probabilities[idx]), 4)

        return {
            "class": predicted_class,
            "confidence": round(confidence, 4),
            "all_probabilities": all_probabilities,
        }
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model prediction failed: {str(e)}",
        )
