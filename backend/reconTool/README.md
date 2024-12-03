Install the required libraries using pip:

```
pip install requests beautifulsoup4 tqdm playwright
```

Additionally, install the necessary browser binaries for Playwright:

```
playwright install
```


Using the module

```

import asyncio
from domain_crawler import run_crawler

async def main():
    domain = <domain>
    try:
        result = await run_crawler(domain)
        print("\nCrawled URLs:")
        for url in result["crawled_urls"]:
            print(url)

        print("\nFiltered and Combined Responses:")
        for response in result["filtered_responses"]:
            print(response)
    except Exception as e:
        print(f"Error: {e}")

# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
```
