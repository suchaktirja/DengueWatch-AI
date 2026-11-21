import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]

threshold_path = BASE_DIR / "models" / "risk_thresholds.json"

with open(threshold_path, "r") as file:
    thresholds = json.load(file)


def classify_risk(predicted_cases, horizon):

    limit = thresholds[f"{horizon}w"]

    if predicted_cases <= 0:
        return "Low"

    elif predicted_cases <= limit["medium_max"]:
        return "Medium"

    elif predicted_cases <= limit["high_max"]:
        return "High"

    else:
        return "Critical"


if __name__ == "__main__":

    test_values = [0, 5, 12, 20]

    for value in test_values:
        risk = classify_risk(value, 2)
        print(f"Predicted Cases: {value} | Risk: {risk}")