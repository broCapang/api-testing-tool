import requests
import yaml

def sql_injection(url, payload):
    input = yaml.safe_load(payload)
    wordLists = input['wordLists']['filePaths']
    for x in wordLists:
        full_url = url + x
        response = requests.get(full_url)
        if response.status_code >= input['validate']['response_code']['gte']:
            return True
        if input['validate']['response_payload']['contains_either'] in response.text:
            return True
    return False



