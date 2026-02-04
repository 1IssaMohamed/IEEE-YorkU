import requests
import re
from urllib.parse import urljoin

targets = [
    # KPM - I need to find the specific wix image that is the logo
    "https://kpmpower.com/",
    # AlphaWave - specific file checking
    "https://awavesemi.com/"
]

def check_url(url):
    try:
        response = requests.head(url, timeout=5)
        return response.status_code == 200
    except:
        return False

def scan_page(url):
    print(f"Scanning {url}")
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
        r = requests.get(url, headers=headers, timeout=10)
        imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', r.text, re.IGNORECASE)
        for img in imgs:
            full = urljoin(url, img)
            # Filter for wix images that might be logos (often usually large or early in the document)
            if "wixstatic" in full or "logo" in full.lower() or "wp-content" in full:
                print(f"  Img: {full}")
    except Exception as e:
        print(e)

# Direct file guesses for AlphaWave
aw_guesses = [
    "https://awavesemi.com/wp-content/themes/alphawave/images/logo.svg",
    "https://awavesemi.com/wp-content/themes/alphawave-semi/images/logo.svg",
    "https://awavesemi.com/assets/img/logo.svg",
    "https://awavesemi.com/assets/images/logo.svg",
    "https://awavesemi.com/logo.svg",
    "https://awavesemi.com/logo.png"
]

if __name__ == "__main__":
    for t in targets:
        scan_page(t)
    
    print("Checking AlphaWave guesses...")
    for g in aw_guesses:
        if check_url(g):
            print(f"FOUND: {g}")
