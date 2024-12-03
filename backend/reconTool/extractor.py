from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright
import requests
import asyncio
import os
import time
from tqdm import tqdm


# Function to normalize URLs
def normalize_url(url):
    parsed = urlparse(url)
    return parsed.scheme + "://" + parsed.netloc + parsed.path.rstrip("/")


# Function to determine if a URL has no extension
def has_no_extension(url):
    path = urlparse(url).path
    if path.endswith("/"):
        path = path[:-1]
    return os.path.splitext(path)[1] == ""


# Function to crawl websites
def crawl_website(base_url):
    visited_urls = set()
    failed_urls = set()
    urls_to_crawl = [base_url]

    start_time = time.time()
    print("Starting crawl...")
    with tqdm(desc="Crawling") as pbar:
        while urls_to_crawl:
            current_url = urls_to_crawl.pop()
            normalized_url = normalize_url(current_url)

            if normalized_url in visited_urls:
                continue

            try:
                response = requests.get(current_url, timeout=10)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")
                visited_urls.add(normalized_url)

                # Find and add new URLs to crawl
                for link in soup.find_all("a", href=True):
                    full_url = urljoin(current_url, link["href"])
                    if not full_url.startswith("http"):
                        continue

                    normalized_full_url = normalize_url(full_url)
                    if (
                        normalized_full_url not in visited_urls
                        and normalized_full_url not in failed_urls
                        and normalized_full_url.startswith(base_url)
                        and has_no_extension(normalized_full_url)
                    ):
                        urls_to_crawl.append(full_url)

                time.sleep(1)  # Respectful delay
            except requests.RequestException as e:
                failed_urls.add(normalized_url)
                # print(f"Failed to fetch {current_url}: {e}")

            pbar.update(1)

    # print(f"Crawled {len(visited_urls)} URLs in {time.time() - start_time:.2f} seconds.")
    return list(visited_urls)


# Function to extract API calls using Playwright
async def extract_api_calls(urls):
    api_calls = {}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for url in urls:
            try:
                requests_list = []
                responses_list = []

                # Set up Playwright request and response event listeners
                page.on(
                    "request",
                    lambda request: requests_list.append(request.url)
                    if request.resource_type in ["xhr", "fetch"]
                    else None,
                )
                page.on(
                    "response",
                    lambda response: responses_list.append(response.url)
                    if response.request.resource_type in ["xhr", "fetch"]
                    else None,
                )

                # Navigate to the URL
                # print(f"Visiting: {url}")
                await page.goto(url)
                await page.wait_for_load_state("networkidle")

                # Combine and filter API calls
                api_calls[url] = {
                    "requests": list(set(requests_list)),
                    "responses": list(set(responses_list)),
                }
            except Exception as e:
                print(f"Error processing {url}: {e}")

        await browser.close()

    return api_calls


# Function to filter and combine responses under a given domain
def filter_and_combine_responses(data, domain):
    filtered_responses = set()  # Use a set to ensure uniqueness

    for url, calls in data.items():
        for response in calls["responses"]:
            if response.startswith(domain):  # Filter by domain
                filtered_responses.add(response)

    return sorted(filtered_responses)  # Return as a sorted list


# Main function to orchestrate the process
async def run_crawler(domain):
    """
    Orchestrates the crawling and API extraction process.

    Args:
        domain (str): The domain to crawl and analyze.

    Returns:
        dict: A dictionary containing the crawled URLs and filtered API call responses.
    """
    if not domain.startswith("http"):
        raise ValueError("Invalid domain. Please include the protocol (http/https).")

    # Crawl the domain
    crawled_urls = crawl_website(domain)

    # Extract API calls from crawled URLs
    print("Extracting API calls from crawled URLs...")
    api_call_data = await extract_api_calls(crawled_urls)

    # Filter and combine responses
    api_endpoints = filter_and_combine_responses(api_call_data, domain)
    api_endpoints = api_endpoints[1:]


    return {
        "crawled_urls": crawled_urls,
        "api_endpoints": api_endpoints,
    }

