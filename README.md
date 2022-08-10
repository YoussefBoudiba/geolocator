# 2. Geolocator:

## Add a freestyle UI5 frontend

With our running service exposing the necessary data, it is now time to provide a frontend.

## UI5

To make our life easier I've provided a zip file containing the UI5 app we'll use as our frontend.

Extract the content of the **UI5.zip** and paste the **geolocator** folder and its content under the **app** directory.

Each file being self explaining with necessary comments, there will be no need to copy and past each line of code.

Our UI5 application consumes the CAP service and expose the **Users** entity data in a table format.
Clicking on a row wil show the city of the user on the map.

## Run the application

Make sure the CAP service is running

```cds
cds watch
```

Open following link in your web browser (the CAP framework will automatically pickup and expose any webapp under the app folder):
http://localhost:4004/geolocator/webapp/index.html
