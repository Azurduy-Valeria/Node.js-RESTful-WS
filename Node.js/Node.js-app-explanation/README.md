### Title: Luxembourg's population app 

### Description:
This RESTful web service is designed to return the total population of Luxembourg on a specified date. It retrieves data from a locally stored CSV file, which contains historical population data as provided by Statec.

### How to Use:
It can be used by making a GET request to the endpoint with a specified date in the format `YYYY-MM-DD`. The service will return the population data for the exact date if available, or the closest two dates with their respective population counts.

### Endpoint:
`GET /LU-population-data/:date`

### Example Request:
`http://localhost:8000/LU-population-data/2021-12-31`

### Example Response:

{
  "date": "2021-12-31",
  "population": 645397
}

### Specified date does not match:
If the specified date does not match any entry in the CSV, the service will return the nearest available dates before and after the specified date, along with the population data.

### Example Request:
`http://localhost:8000/LU-population-data/2020-04-31`

### Example Response:
{
  "previousEntry": {
    "date": "2019-12-31",
    "population": 626108
  },
  "nextEntry": {
    "date": "2020-12-31",
    "population": 634730
  }
}