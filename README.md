# Klemis Kitchen Admin Dashboard
`Klemis Kitchen Admin Dashboard` is a React web app allowing Klemis Kitchen administrators to handle different administrative tasks related to the `Klemis Kitchen App`.  
Created as part of Georgia Tech’s Junior Design class in collaboration with Klemis Kitchen.
<img src="screenshot.png" />

## 📝 Release Notes
Version 1.0  
New features: Home Screen, Members, Locations, Item Details, and Announcements pages  
Known Bugs: The Item Details table extends past the normal window size, and when uploading images, if the upload is canceled, the picture is uploaded to S3 but then lost forever, taking up unnecessary space  

## 🚀 Usage
The dashboard will soon be available at [dashboard.klemis-kitchen.com](dashboard.klemis-kitchen.com)
 for authorized users. Alternatively, this application can be run locally by cloning the project from GitHub, and installing both `node.js` and `yarn`. Then, by using the command line or an equivalent, use 
```
yarn install
yarn start
```
within the project directory. This will cause the application to open in the default browser.


## 🔧 Configuration
The default (production) configuration of the app points to `api.klemis-kitchen.com` to retrieve pantry information from. This server runs `Klemis Kitchen API` on a Georgia Tech-hosted platform.  
To change where to fetch data from, edit `APIFETCHLOCATION` in `constants.tsx`
