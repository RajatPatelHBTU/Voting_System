import sys
import face_recognition
import numpy as np
import requests
from PIL import Image
import io

def verify_faces(stored_image_url, given_image_url):
    print("Fetching stored image...")
    stored_response = requests.get(stored_image_url)
    given_response = requests.get(given_image_url)

    if stored_response.status_code != 200 or given_response.status_code != 200:
        print("Failed to fetch one or both images.")
        return {"error": "Image fetch failed"}

    stored_image = np.array(Image.open(io.BytesIO(stored_response.content)).convert("RGB"))
    given_image = np.array(Image.open(io.BytesIO(given_response.content)).convert("RGB"))

    print("Extracting face encodings...")
    stored_encodings = face_recognition.face_encodings(stored_image)
    given_encodings = face_recognition.face_encodings(given_image)

    if not stored_encodings or not given_encodings:
        print("No face detected in one or both images.")
        return {"error": "No face detected"}

    distance = face_recognition.face_distance([stored_encodings[0]], given_encodings[0])[0]
    match = distance < 0.6  # Lower distance = better match

    result = {
        "match": match,
        "confidence": round((1 - distance) * 100, 2)
    }
    print("Verification Result:", result)
    return result

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python voterVerification.py <stored_image_url> <given_image_url>")
        sys.exit(1)

    stored_image_url = sys.argv[1]
    given_image_url = sys.argv[2]
    print(verify_faces(stored_image_url, given_image_url))

    #http://127.0.0.1:5000/verify
#//copy src\\voterVerification.py dist\\ && 