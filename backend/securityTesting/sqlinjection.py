import requests

def sql_injection(url, payload):
    full_payload = url + payload
    response = requests.get(full_payload)
    return response.text


