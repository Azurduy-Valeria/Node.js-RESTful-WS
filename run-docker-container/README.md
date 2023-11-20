# Running the Luxembourg's population app on Docker

Assuming you are in the same directory where you can find the dockerfile: 

1. Building docker image based on dockerfile:

    `docker build -t retrieve-lux-population-app . `

2. Running application:

    `docker run -dp 8000:8000 retrieve-lux-population-app`

## Example to access the application
As an example, to get the population data for November 31, 2011, you can access:

```
http://localhost:8000/LU-population-data/2011-11-31
```
This should get the following message in the browser:
{
  "previousEntry": {
    "date": "2011-02-01",
    "population": 512353
  },
  "nextEntry": {
    "date": "2011-12-31",
    "population": 524900
  }
}
