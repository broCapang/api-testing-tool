import requests
import yaml


def bola(url,payload):
    input = yaml.safe_load(payload)
    response = requests.get(url)
    if response.status_code >= input['validate']['response_code']['gte'] and response.status_code < input['validate']['response_code']['lt']:
        return True
    return False