## Wireshark Data Visualisation using React with Mapbox, DeckGL and Bootstrap

![logo (2)](https://user-images.githubusercontent.com/63835313/211465737-5b7700bd-4542-4011-ae18-d9c05e43f89a.png)

#### Contributors

- Maxim Abdulkhalikov (Frontend)
- Andrea Abellera (Frontend)
- Ethan Ducharme (Backend)
- Daniel Debassige (Backend)

#### Tech stack

- Frontend:
  - React
  - Mapbox
  - DeckGL
  - Bootstrap
- Backend:
  - Python Flask
  - RESTFUL
  - UUID
  - Scapy
  - python-pcapng
  - matplotlib
  - json
  - traceback
- Testing:
  - rest.http
  
 #### Launch tutorial:
 
 - Download the repository on your machine
 - Run `npm install` to install all dependancies needed for React
 - Run `npm run lauch` to lauch React part of the application
 - Run `python3 server.py` to lauch the server side of the application
  - Please make sure that all appropriate python libraries are installed:
    -  `pip install scapy`
    -  `pip install ipaddress`
    -  `pip install python-pcapng`
 - Import the ".pcapng" file into the react application using a specialised button on top of the screen
 - Press Launch button located at the bottom left of the screen
 
---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run launch`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To run the same application with legacy options, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
