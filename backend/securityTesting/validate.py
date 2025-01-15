import requests
import yaml


def validate_request(url, payload):
    """
    Validates requests against given criteria for different types of input.

    :param url: The base URL for the request.
    :param payload: The YAML payload containing validation criteria.
    :return: True if validation passes, False otherwise.
    """
    input = yaml.safe_load(payload)
    response_code_validation = input.get('validate', {}).get('response_code', {})
    response_payload_validation = input.get('validate', {}).get('response_payload', {})  # Defaults to empty dict
    print("Response Code Validation", response_code_validation)
    print("Response Payload Validation", response_payload_validation)
    word_lists = input.get('wordLists', {}).get('filePaths', [])

    if not url.endswith('/') and word_lists:
        print("here: ",url)
        url += '/'
    # If wordLists are provided, loop through them (SQL injection scenario)
    if word_lists:
        if '{' in url:
            for word in word_lists:
                formatted_url = url.format(username=word, book=word)
                full_url = formatted_url + word
                print(full_url)
                response = requests.get(full_url)
                if validate_response(response, response_code_validation, response_payload_validation):
                    print(f"Validation passed for: {formatted_url}")
                    return True
        else:
            for word in word_lists:
                full_url = url + word
                print(full_url)
                response = requests.get(full_url)
                if validate_response(response, response_code_validation, response_payload_validation):
                    print(f"Validation passed for: {full_url}")
                    return True

    else:
        # If URL has no placeholder, validate normally
        response = requests.get(url)
        if validate_response(response, response_code_validation, response_payload_validation):
            print(f"Validation passed for: {url}")
            return True

    return False


def validate_response(response, code_validation, payload_validation):
    """
    Helper function to validate a single response against criteria.
    """
    # Validate response code range
    if code_validation and not (code_validation.get('gte', 0) <= response.status_code < code_validation.get('lt', float('inf'))):
        return False

    # Validate response payload content (only if provided)
    if payload_validation:
        print("Response TEXTT: ",response.text)
        # Check for payload length
        if 'length' in payload_validation:
            payload_length = len(response.text)
            length_validation = payload_validation['length']
            if 'gt' in length_validation and not (payload_length > length_validation['gt']):
                return False
            if 'lt' in length_validation and not (payload_length < length_validation['lt']):
                return False
            if 'eq' in length_validation and not (payload_length == length_validation['eq']):
                return False

        # Validate response text content
        if 'contains_all' in payload_validation:
            if not all(keyword in response.text for keyword in payload_validation['contains_all']):
                return False
        if 'contains_either' in payload_validation:
            if not any(keyword in response.text for keyword in payload_validation['contains_either']):
                return False


    return True
