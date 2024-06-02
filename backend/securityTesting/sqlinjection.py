import requests

def sql_injection(url, payload):
    full_url = url + payload
    response = requests.get(full_url)
    return response.text



