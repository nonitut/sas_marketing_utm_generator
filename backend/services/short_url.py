import requests

def shorten_url(long_url):
    api_url = "https://cleanuri.com/api/v1/shorten"
    payload = {'url': long_url}
    
    try:
        response = requests.post(api_url, data=payload)
        response.raise_for_status()
        return response.json().get('result_url') 
    except requests.exceptions.RequestException as e:
        return False
    

