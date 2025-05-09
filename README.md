/README.md:
--------------------------------------------------------------------------------
1 | # uspsservice


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/.dockerignore:
--------------------------------------------------------------------------------
1 | .dockerignore
2 | docker-compose.yml
3 | Dockerfile
4 | build/
5 | node_modules
6 | .env
7 | .gitignore
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/.env:
--------------------------------------------------------------------------------
1 | PORT=3001
2 | REACT_APP_SERVER_URL=http://localhost:3000


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/.gitignore:
--------------------------------------------------------------------------------
 1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2 |  
 3 | # dependencies
 4 | /node_modules
 5 | /.pnp
 6 | .pnp.js
 7 |  
 8 | # testing
 9 | /coverage
10 |  
11 | # production
12 | /build
13 |  
14 | # misc
15 | .DS_Store
16 | .env.local
17 | .env.development.local
18 | .env.test.local
19 | .env.production.local
20 |  
21 | npm-debug.log*
22 | yarn-debug.log*
23 | yarn-error.log*
24 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/Dockerfile:
--------------------------------------------------------------------------------
 1 | # multi-stage: base (build)
 2 | FROM node:18.13.0-slim AS base
 3 | 
 4 | # instantiate environment variable
 5 | ARG REACT_APP_SERVER_URL=http://localhost:3000
 6 | 
 7 | # set the environment variable that points to the server
 8 | ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
 9 | 
10 | # create directory where the application will be built
11 | WORKDIR /app
12 | 
13 | # copy over the dependency manifests, both the package.json 
14 | # and the package-lock.json are copied over
15 | COPY package*.json ./
16 | 
17 | # installs packages and their dependencies
18 | RUN npm install
19 | 
20 | # copy over the code base
21 | COPY . .
22 | 
23 | # create the bundle of the application
24 | RUN npm run build
25 | 
26 | # multi-stage: production (runtime)
27 | FROM nginx:1.22-alpine AS production
28 | 
29 | # copy over the bundled code from the build stage
30 | COPY --from=base /app/build /usr/share/nginx/html
31 | COPY --from=base /app/configuration/nginx.conf /etc/nginx/conf.d/default.conf
32 | 
33 | # create a new process indication file
34 | RUN touch /var/run/nginx.pid
35 | 
36 | # change ownership of nginx related directories and files
37 | RUN chown -R nginx:nginx /var/run/nginx.pid \
38 |         /usr/share/nginx/html \
39 |         /var/cache/nginx \
40 |         /var/log/nginx \
41 |         /etc/nginx/conf.d
42 | 
43 | # set user to the created non-privileged user
44 | USER nginx
45 | 
46 | # expose a specific port on the docker container
47 | ENV PORT=3001
48 | EXPOSE ${PORT}
49 | 
50 | # start the server using the previously build application
51 | ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
52 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/configuration/nginx.conf:
--------------------------------------------------------------------------------
 1 | server_tokens off;
 2 | 
 3 | server {
 4 |     listen       3001;
 5 |     server_name  localhost;
 6 |     location / {
 7 |         root   /usr/share/nginx/html;
 8 |         index  index.html index.htm;
 9 |         try_files $uri /index.html;
10 |     }
11 | }


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "@delivery-tracking/admin",
 3 |   "private": true,
 4 |   "dependencies": {
 5 |     "@apollo/client": "3.6.9",
 6 |     "@material-ui/core": "4.12.4",
 7 |     "graphql": "15.6.1",
 8 |     "lodash": "4.17.21",
 9 |     "pluralize": "8.0.0",
10 |     "ra-data-graphql-amplication": "0.0.14",
11 |     "react": "16.14.0",
12 |     "react-admin": "3.19.12",
13 |     "react-dom": "16.14.0",
14 |     "react-scripts": "5.0.0",
15 |     "sass": "^1.39.0",
16 |     "web-vitals": "1.1.2"
17 |   },
18 |   "overrides": {
19 |     "react-scripts": {
20 |       "@svgr/webpack": "6.5.1"
21 |     }
22 |   },
23 |   "scripts": {
24 |     "start": "react-scripts start",
25 |     "build": "react-scripts build",
26 |     "test": "react-scripts test",
27 |     "eject": "react-scripts eject",
28 |     "package:container": "docker build ."
29 |   },
30 |   "eslintConfig": {
31 |     "extends": [
32 |       "react-app",
33 |       "react-app/jest"
34 |     ]
35 |   },
36 |   "browserslist": {
37 |     "production": [
38 |       ">0.2%",
39 |       "not dead",
40 |       "not op_mini all"
41 |     ],
42 |     "development": [
43 |       "last 1 chrome version",
44 |       "last 1 firefox version",
45 |       "last 1 safari version"
46 |     ]
47 |   },
48 |   "devDependencies": {
49 |     "@testing-library/jest-dom": "5.14.1",
50 |     "@testing-library/react": "11.2.7",
51 |     "@testing-library/user-event": "13.2.0",
52 |     "@types/jest": "26.0.16",
53 |     "@types/lodash": "4.14.178",
54 |     "@types/node": "12.20.16",
55 |     "@types/react": "16.14.11",
56 |     "@types/react-dom": "17.0.0",
57 |     "type-fest": "0.13.1",
58 |     "typescript": "4.3.5"
59 |   }
60 | }


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/public/index.html:
--------------------------------------------------------------------------------
 1 | <!DOCTYPE html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="utf-8" />
 5 |     <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
 6 |     <meta name="viewport" content="width=device-width, initial-scale=1" />
 7 |     <meta name="theme-color" content="#000000" />
 8 |     <meta name="description" content="" />
 9 |     <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
10 |     <!--
11 |       manifest.json provides metadata used when your web app is installed on a
12 |       user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
13 |     -->
14 |     <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
15 |     <!--
16 |       Notice the use of %PUBLIC_URL% in the tags above.
17 |       It will be replaced with the URL of the `public` folder during the build.
18 |       Only files inside the `public` folder can be referenced from the HTML.
19 | 
20 |       Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
21 |       work correctly both with client-side routing and a non-root public URL.
22 |       Learn how to configure a non-root public URL by running `npm run build`.
23 |     -->
24 |     <title>DeliveryTracking</title>
25 |   </head>
26 |   <body>
27 |     <noscript>You need to enable JavaScript to run this app.</noscript>
28 |     <div id="root"></div>
29 |     <!--
30 |       This HTML file is a template.
31 |       If you open it directly in the browser, you will see an empty page.
32 | 
33 |       You can add webfonts, meta tags, or analytics to this file.
34 |       The build step will place the bundled scripts into the <body> tag.
35 | 
36 |       To begin the development, run `npm start` or `yarn start`.
37 |       To create a production bundle, use `npm run build` or `yarn build`.
38 |     -->
39 |   </body>
40 | </html>
41 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/public/manifest.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "short_name": "DeliveryTracking",
 3 |   "name": "DeliveryTracking",
 4 |   "icons": [
 5 |     {
 6 |       "src": "favicon.ico",
 7 |       "sizes": "64x64 32x32 24x24 16x16",
 8 |       "type": "image/x-icon"
 9 |     },
10 |     {
11 |       "src": "logo192.png",
12 |       "type": "image/png",
13 |       "sizes": "192x192"
14 |     },
15 |     {
16 |       "src": "logo512.png",
17 |       "type": "image/png",
18 |       "sizes": "512x512"
19 |     }
20 |   ],
21 |   "start_url": ".",
22 |   "display": "standalone",
23 |   "theme_color": "#000000",
24 |   "background_color": "#ffffff"
25 | }


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/public/robots.txt:
--------------------------------------------------------------------------------
1 | # https://www.robotstxt.org/robotstxt.html
2 | User-agent: *
3 | Disallow:
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/App.scss:
--------------------------------------------------------------------------------
 1 | // .App {
 2 | //   .MuiAppBar-colorSecondary {
 3 | //     background-color: black;
 4 | 
 5 | //     .RaAppBar-menuButton-13 {
 6 | //       background-color: yellow;
 7 | //     }
 8 | //   }
 9 | 
10 | //   .MuiDrawer-paper {
11 | //     background-color: red;
12 | 
13 | //     .MuiListItemIcon-root {
14 | //       color: white;
15 | //     }
16 | //   }
17 | 
18 | //   .MuiButton-textPrimary {
19 | //     background-color: purple;
20 | //     margin: 0 0.5rem;
21 | //     color: white;
22 | //     padding: 0.5rem 1rem;
23 | 
24 | //     &:hover {
25 | //       background-color: blue;
26 | //     }
27 | //   }
28 | 
29 | //   .MuiTableRow-head {
30 | //     .MuiTableCell-head {
31 | //       background-color: black;
32 | //       color: white;
33 | //     }
34 | 
35 | //     .MuiTableSortLabel-root {
36 | //       &:hover {
37 | //         color: red;
38 | 
39 | //         .MuiTableSortLabel-icon {
40 | //           color: red !important;
41 | //         }
42 | //       }
43 | //       .MuiTableSortLabel-icon {
44 | //         color: white !important;
45 | //       }
46 | //     }
47 | //     .MuiTableSortLabel-active {
48 | //       color: green;
49 | 
50 | //       .MuiTableSortLabel-icon {
51 | //         color: green !important;
52 | //       }
53 | //     }
54 | //   }
55 | 
56 | //   .MuiFormLabel-root {
57 | //     color: magenta;
58 | //   }
59 | // }
60 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/Components/Pagination.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import { Pagination as RAPagination, PaginationProps } from "react-admin";
 3 | 
 4 | const PAGINATION_OPTIONS = [10, 25, 50, 100, 200];
 5 | 
 6 | const Pagination = (props: PaginationProps) => (
 7 |   <RAPagination rowsPerPageOptions={PAGINATION_OPTIONS} {...props} />
 8 | );
 9 | 
10 | export default Pagination;
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfo.ts:
--------------------------------------------------------------------------------
1 | export type ContactInfo = {
2 |   createdAt: Date;
3 |   id: string;
4 |   phoneNumber: string | null;
5 |   updatedAt: Date;
6 | };
7 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoCountArgs.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
2 | 
3 | export type ContactInfoCountArgs = {
4 |   where?: ContactInfoWhereInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoCreateInput.ts:
--------------------------------------------------------------------------------
1 | export type ContactInfoCreateInput = {
2 |   phoneNumber?: string | null;
3 | };
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
 2 | import { ContactInfoOrderByInput } from "./ContactInfoOrderByInput";
 3 | 
 4 | export type ContactInfoFindManyArgs = {
 5 |   where?: ContactInfoWhereInput;
 6 |   orderBy?: Array<ContactInfoOrderByInput>;
 7 |   skip?: number;
 8 |   take?: number;
 9 | };
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoFindUniqueArgs.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfoWhereUniqueInput } from "./ContactInfoWhereUniqueInput";
2 | 
3 | export type ContactInfoFindUniqueArgs = {
4 |   where: ContactInfoWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoListRelationFilter.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
2 | 
3 | export type ContactInfoListRelationFilter = {
4 |   every?: ContactInfoWhereInput;
5 |   some?: ContactInfoWhereInput;
6 |   none?: ContactInfoWhereInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoOrderByInput.ts:
--------------------------------------------------------------------------------
1 | import { SortOrder } from "../../util/SortOrder";
2 | 
3 | export type ContactInfoOrderByInput = {
4 |   createdAt?: SortOrder;
5 |   id?: SortOrder;
6 |   phoneNumber?: SortOrder;
7 |   updatedAt?: SortOrder;
8 | };
9 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoUpdateInput.ts:
--------------------------------------------------------------------------------
1 | export type ContactInfoUpdateInput = {
2 |   phoneNumber?: string | null;
3 | };
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoWhereInput.ts:
--------------------------------------------------------------------------------
1 | import { StringFilter } from "../../util/StringFilter";
2 | import { StringNullableFilter } from "../../util/StringNullableFilter";
3 | 
4 | export type ContactInfoWhereInput = {
5 |   id?: StringFilter;
6 |   phoneNumber?: StringNullableFilter;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/ContactInfoWhereUniqueInput.ts:
--------------------------------------------------------------------------------
1 | export type ContactInfoWhereUniqueInput = {
2 |   id: string;
3 | };
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/CreateContactInfoArgs.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfoCreateInput } from "./ContactInfoCreateInput";
2 | 
3 | export type CreateContactInfoArgs = {
4 |   data: ContactInfoCreateInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/DeleteContactInfoArgs.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfoWhereUniqueInput } from "./ContactInfoWhereUniqueInput";
2 | 
3 | export type DeleteContactInfoArgs = {
4 |   where: ContactInfoWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/contactInfo/UpdateContactInfoArgs.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfoWhereUniqueInput } from "./ContactInfoWhereUniqueInput";
2 | import { ContactInfoUpdateInput } from "./ContactInfoUpdateInput";
3 | 
4 | export type UpdateContactInfoArgs = {
5 |   where: ContactInfoWhereUniqueInput;
6 |   data: ContactInfoUpdateInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/CreateDeliveryArgs.ts:
--------------------------------------------------------------------------------
1 | import { DeliveryCreateInput } from "./DeliveryCreateInput";
2 | 
3 | export type CreateDeliveryArgs = {
4 |   data: DeliveryCreateInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeleteDeliveryArgs.ts:
--------------------------------------------------------------------------------
1 | import { DeliveryWhereUniqueInput } from "./DeliveryWhereUniqueInput";
2 | 
3 | export type DeleteDeliveryArgs = {
4 |   where: DeliveryWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/Delivery.ts:
--------------------------------------------------------------------------------
1 | export type Delivery = {
2 |   createdAt: Date;
3 |   id: string;
4 |   status: string | null;
5 |   trackingId: string | null;
6 |   updatedAt: Date;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryCountArgs.ts:
--------------------------------------------------------------------------------
1 | import { DeliveryWhereInput } from "./DeliveryWhereInput";
2 | 
3 | export type DeliveryCountArgs = {
4 |   where?: DeliveryWhereInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryCreateInput.ts:
--------------------------------------------------------------------------------
1 | export type DeliveryCreateInput = {
2 |   status?: string | null;
3 |   trackingId?: string | null;
4 | };
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | import { DeliveryWhereInput } from "./DeliveryWhereInput";
 2 | import { DeliveryOrderByInput } from "./DeliveryOrderByInput";
 3 | 
 4 | export type DeliveryFindManyArgs = {
 5 |   where?: DeliveryWhereInput;
 6 |   orderBy?: Array<DeliveryOrderByInput>;
 7 |   skip?: number;
 8 |   take?: number;
 9 | };
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryFindUniqueArgs.ts:
--------------------------------------------------------------------------------
1 | import { DeliveryWhereUniqueInput } from "./DeliveryWhereUniqueInput";
2 | 
3 | export type DeliveryFindUniqueArgs = {
4 |   where: DeliveryWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryListRelationFilter.ts:
--------------------------------------------------------------------------------
1 | import { DeliveryWhereInput } from "./DeliveryWhereInput";
2 | 
3 | export type DeliveryListRelationFilter = {
4 |   every?: DeliveryWhereInput;
5 |   some?: DeliveryWhereInput;
6 |   none?: DeliveryWhereInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryOrderByInput.ts:
--------------------------------------------------------------------------------
 1 | import { SortOrder } from "../../util/SortOrder";
 2 | 
 3 | export type DeliveryOrderByInput = {
 4 |   createdAt?: SortOrder;
 5 |   id?: SortOrder;
 6 |   status?: SortOrder;
 7 |   trackingId?: SortOrder;
 8 |   updatedAt?: SortOrder;
 9 | };
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryUpdateInput.ts:
--------------------------------------------------------------------------------
1 | export type DeliveryUpdateInput = {
2 |   status?: string | null;
3 |   trackingId?: string | null;
4 | };
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryWhereInput.ts:
--------------------------------------------------------------------------------
1 | import { StringFilter } from "../../util/StringFilter";
2 | import { StringNullableFilter } from "../../util/StringNullableFilter";
3 | 
4 | export type DeliveryWhereInput = {
5 |   id?: StringFilter;
6 |   status?: StringNullableFilter;
7 |   trackingId?: StringNullableFilter;
8 | };
9 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/DeliveryWhereUniqueInput.ts:
--------------------------------------------------------------------------------
1 | export type DeliveryWhereUniqueInput = {
2 |   id: string;
3 | };
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/delivery/UpdateDeliveryArgs.ts:
--------------------------------------------------------------------------------
1 | import { DeliveryWhereUniqueInput } from "./DeliveryWhereUniqueInput";
2 | import { DeliveryUpdateInput } from "./DeliveryUpdateInput";
3 | 
4 | export type UpdateDeliveryArgs = {
5 |   where: DeliveryWhereUniqueInput;
6 |   data: DeliveryUpdateInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/CreateTrackingArgs.ts:
--------------------------------------------------------------------------------
1 | import { TrackingCreateInput } from "./TrackingCreateInput";
2 | 
3 | export type CreateTrackingArgs = {
4 |   data: TrackingCreateInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/DeleteTrackingArgs.ts:
--------------------------------------------------------------------------------
1 | import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
2 | 
3 | export type DeleteTrackingArgs = {
4 |   where: TrackingWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/Tracking.ts:
--------------------------------------------------------------------------------
1 | export type Tracking = {
2 |   createdAt: Date;
3 |   id: string;
4 |   location: string | null;
5 |   trackingId: string | null;
6 |   updatedAt: Date;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingCountArgs.ts:
--------------------------------------------------------------------------------
1 | import { TrackingWhereInput } from "./TrackingWhereInput";
2 | 
3 | export type TrackingCountArgs = {
4 |   where?: TrackingWhereInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingCreateInput.ts:
--------------------------------------------------------------------------------
1 | export type TrackingCreateInput = {
2 |   location?: string | null;
3 |   trackingId?: string | null;
4 | };
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | import { TrackingWhereInput } from "./TrackingWhereInput";
 2 | import { TrackingOrderByInput } from "./TrackingOrderByInput";
 3 | 
 4 | export type TrackingFindManyArgs = {
 5 |   where?: TrackingWhereInput;
 6 |   orderBy?: Array<TrackingOrderByInput>;
 7 |   skip?: number;
 8 |   take?: number;
 9 | };
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingFindUniqueArgs.ts:
--------------------------------------------------------------------------------
1 | import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
2 | 
3 | export type TrackingFindUniqueArgs = {
4 |   where: TrackingWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingListRelationFilter.ts:
--------------------------------------------------------------------------------
1 | import { TrackingWhereInput } from "./TrackingWhereInput";
2 | 
3 | export type TrackingListRelationFilter = {
4 |   every?: TrackingWhereInput;
5 |   some?: TrackingWhereInput;
6 |   none?: TrackingWhereInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingOrderByInput.ts:
--------------------------------------------------------------------------------
 1 | import { SortOrder } from "../../util/SortOrder";
 2 | 
 3 | export type TrackingOrderByInput = {
 4 |   createdAt?: SortOrder;
 5 |   id?: SortOrder;
 6 |   location?: SortOrder;
 7 |   trackingId?: SortOrder;
 8 |   updatedAt?: SortOrder;
 9 | };
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingUpdateInput.ts:
--------------------------------------------------------------------------------
1 | export type TrackingUpdateInput = {
2 |   location?: string | null;
3 |   trackingId?: string | null;
4 | };
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingWhereInput.ts:
--------------------------------------------------------------------------------
1 | import { StringFilter } from "../../util/StringFilter";
2 | import { StringNullableFilter } from "../../util/StringNullableFilter";
3 | 
4 | export type TrackingWhereInput = {
5 |   id?: StringFilter;
6 |   location?: StringNullableFilter;
7 |   trackingId?: StringNullableFilter;
8 | };
9 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/TrackingWhereUniqueInput.ts:
--------------------------------------------------------------------------------
1 | export type TrackingWhereUniqueInput = {
2 |   id: string;
3 | };
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/tracking/UpdateTrackingArgs.ts:
--------------------------------------------------------------------------------
1 | import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
2 | import { TrackingUpdateInput } from "./TrackingUpdateInput";
3 | 
4 | export type UpdateTrackingArgs = {
5 |   where: TrackingWhereUniqueInput;
6 |   data: TrackingUpdateInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/CreateUserArgs.ts:
--------------------------------------------------------------------------------
1 | import { UserCreateInput } from "./UserCreateInput";
2 | 
3 | export type CreateUserArgs = {
4 |   data: UserCreateInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/DeleteUserArgs.ts:
--------------------------------------------------------------------------------
1 | import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
2 | 
3 | export type DeleteUserArgs = {
4 |   where: UserWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UpdateUserArgs.ts:
--------------------------------------------------------------------------------
1 | import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
2 | import { UserUpdateInput } from "./UserUpdateInput";
3 | 
4 | export type UpdateUserArgs = {
5 |   where: UserWhereUniqueInput;
6 |   data: UserUpdateInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/User.ts:
--------------------------------------------------------------------------------
 1 | import { JsonValue } from "type-fest";
 2 | 
 3 | export type User = {
 4 |   createdAt: Date;
 5 |   email: string | null;
 6 |   firstName: string | null;
 7 |   id: string;
 8 |   lastName: string | null;
 9 |   roles: JsonValue;
10 |   updatedAt: Date;
11 |   username: string;
12 | };
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserCountArgs.ts:
--------------------------------------------------------------------------------
1 | import { UserWhereInput } from "./UserWhereInput";
2 | 
3 | export type UserCountArgs = {
4 |   where?: UserWhereInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserCreateInput.ts:
--------------------------------------------------------------------------------
 1 | import { InputJsonValue } from "../../types";
 2 | 
 3 | export type UserCreateInput = {
 4 |   email?: string | null;
 5 |   firstName?: string | null;
 6 |   lastName?: string | null;
 7 |   password: string;
 8 |   roles: InputJsonValue;
 9 |   username: string;
10 | };
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | import { UserWhereInput } from "./UserWhereInput";
 2 | import { UserOrderByInput } from "./UserOrderByInput";
 3 | 
 4 | export type UserFindManyArgs = {
 5 |   where?: UserWhereInput;
 6 |   orderBy?: Array<UserOrderByInput>;
 7 |   skip?: number;
 8 |   take?: number;
 9 | };
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserFindUniqueArgs.ts:
--------------------------------------------------------------------------------
1 | import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
2 | 
3 | export type UserFindUniqueArgs = {
4 |   where: UserWhereUniqueInput;
5 | };
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserListRelationFilter.ts:
--------------------------------------------------------------------------------
1 | import { UserWhereInput } from "./UserWhereInput";
2 | 
3 | export type UserListRelationFilter = {
4 |   every?: UserWhereInput;
5 |   some?: UserWhereInput;
6 |   none?: UserWhereInput;
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserOrderByInput.ts:
--------------------------------------------------------------------------------
 1 | import { SortOrder } from "../../util/SortOrder";
 2 | 
 3 | export type UserOrderByInput = {
 4 |   createdAt?: SortOrder;
 5 |   email?: SortOrder;
 6 |   firstName?: SortOrder;
 7 |   id?: SortOrder;
 8 |   lastName?: SortOrder;
 9 |   password?: SortOrder;
10 |   roles?: SortOrder;
11 |   updatedAt?: SortOrder;
12 |   username?: SortOrder;
13 | };
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserUpdateInput.ts:
--------------------------------------------------------------------------------
 1 | import { InputJsonValue } from "../../types";
 2 | 
 3 | export type UserUpdateInput = {
 4 |   email?: string | null;
 5 |   firstName?: string | null;
 6 |   lastName?: string | null;
 7 |   password?: string;
 8 |   roles?: InputJsonValue;
 9 |   username?: string;
10 | };
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserWhereInput.ts:
--------------------------------------------------------------------------------
 1 | import { StringNullableFilter } from "../../util/StringNullableFilter";
 2 | import { StringFilter } from "../../util/StringFilter";
 3 | 
 4 | export type UserWhereInput = {
 5 |   email?: StringNullableFilter;
 6 |   firstName?: StringNullableFilter;
 7 |   id?: StringFilter;
 8 |   lastName?: StringNullableFilter;
 9 |   username?: StringFilter;
10 | };
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/api/user/UserWhereUniqueInput.ts:
--------------------------------------------------------------------------------
1 | export type UserWhereUniqueInput = {
2 |   id: string;
3 | };
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/auth-provider/ra-auth-http.ts:
--------------------------------------------------------------------------------
 1 | import { gql } from "@apollo/client/core";
 2 | import { AuthProvider } from "react-admin";
 3 | import {
 4 |   CREDENTIALS_LOCAL_STORAGE_ITEM,
 5 |   USER_DATA_LOCAL_STORAGE_ITEM,
 6 | } from "../constants";
 7 | import { Credentials, LoginMutateResult } from "../types";
 8 | import { apolloClient } from "../data-provider/graphqlDataProvider";
 9 | 
10 | const LOGIN = gql`
11 |   mutation login($username: String!, $password: String!) {
12 |     login(credentials: { username: $username, password: $password }) {
13 |       username
14 |       roles
15 |     }
16 |   }
17 | `;
18 | 
19 | export const httpAuthProvider: AuthProvider = {
20 |   login: async (credentials: Credentials) => {
21 |     const userData = await apolloClient.mutate<LoginMutateResult>({
22 |       mutation: LOGIN,
23 |       variables: {
24 |         ...credentials,
25 |       },
26 |     });
27 | 
28 |     if (userData && userData.data?.login.username) {
29 |       localStorage.setItem(
30 |         CREDENTIALS_LOCAL_STORAGE_ITEM,
31 |         createBasicAuthorizationHeader(
32 |           credentials.username,
33 |           credentials.password
34 |         )
35 |       );
36 |       localStorage.setItem(
37 |         USER_DATA_LOCAL_STORAGE_ITEM,
38 |         JSON.stringify(userData.data)
39 |       );
40 |       return Promise.resolve();
41 |     }
42 |     return Promise.reject();
43 |   },
44 |   logout: () => {
45 |     localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
46 |     return Promise.resolve();
47 |   },
48 |   checkError: ({ status }: any) => {
49 |     if (status === 401 || status === 403) {
50 |       localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
51 |       return Promise.reject();
52 |     }
53 |     return Promise.resolve();
54 |   },
55 |   checkAuth: () => {
56 |     return localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM)
57 |       ? Promise.resolve()
58 |       : Promise.reject();
59 |   },
60 |   getPermissions: () => Promise.reject("Unknown method"),
61 |   getIdentity: () => {
62 |     const str = localStorage.getItem(USER_DATA_LOCAL_STORAGE_ITEM);
63 |     const userData: LoginMutateResult = JSON.parse(str || "");
64 | 
65 |     return Promise.resolve({
66 |       id: userData.login.username,
67 |       fullName: userData.login.username,
68 |       avatar: undefined,
69 |     });
70 |   },
71 | };
72 | 
73 | function createBasicAuthorizationHeader(
74 |   username: string,
75 |   password: string
76 | ): string {
77 |   return `Basic ${btoa(`${username}:${password}`)}`;
78 | }
79 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/auth-provider/ra-auth-jwt.ts:
--------------------------------------------------------------------------------
 1 | import { gql } from "@apollo/client/core";
 2 | import { AuthProvider } from "react-admin";
 3 | import {
 4 |   CREDENTIALS_LOCAL_STORAGE_ITEM,
 5 |   USER_DATA_LOCAL_STORAGE_ITEM,
 6 | } from "../constants";
 7 | import { Credentials, LoginMutateResult } from "../types";
 8 | import { apolloClient } from "../data-provider/graphqlDataProvider";
 9 | 
10 | const LOGIN = gql`
11 |   mutation login($username: String!, $password: String!) {
12 |     login(credentials: { username: $username, password: $password }) {
13 |       username
14 |       accessToken
15 |     }
16 |   }
17 | `;
18 | 
19 | export const jwtAuthProvider: AuthProvider = {
20 |   login: async (credentials: Credentials) => {
21 |     const userData = await apolloClient.mutate<LoginMutateResult>({
22 |       mutation: LOGIN,
23 |       variables: {
24 |         ...credentials,
25 |       },
26 |     });
27 | 
28 |     if (userData && userData.data?.login.username) {
29 |       localStorage.setItem(
30 |         CREDENTIALS_LOCAL_STORAGE_ITEM,
31 |         createBearerAuthorizationHeader(userData.data.login?.accessToken)
32 |       );
33 |       localStorage.setItem(
34 |         USER_DATA_LOCAL_STORAGE_ITEM,
35 |         JSON.stringify(userData.data)
36 |       );
37 |       return Promise.resolve();
38 |     }
39 |     return Promise.reject();
40 |   },
41 |   logout: () => {
42 |     localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
43 |     return Promise.resolve();
44 |   },
45 |   checkError: ({ status }: any) => {
46 |     if (status === 401 || status === 403) {
47 |       localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
48 |       return Promise.reject();
49 |     }
50 |     return Promise.resolve();
51 |   },
52 |   checkAuth: () => {
53 |     return localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM)
54 |       ? Promise.resolve()
55 |       : Promise.reject();
56 |   },
57 |   getPermissions: () => Promise.reject("Unknown method"),
58 |   getIdentity: () => {
59 |     const str = localStorage.getItem(USER_DATA_LOCAL_STORAGE_ITEM);
60 |     const userData: LoginMutateResult = JSON.parse(str || "");
61 | 
62 |     return Promise.resolve({
63 |       id: userData.login.username,
64 |       fullName: userData.login.username,
65 |       avatar: undefined,
66 |     });
67 |   },
68 | };
69 | 
70 | export function createBearerAuthorizationHeader(accessToken: string) {
71 |   return `Bearer ${accessToken}`;
72 | }
73 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/auth.ts:
--------------------------------------------------------------------------------
 1 | import { EventEmitter } from "events";
 2 | import { CREDENTIALS_LOCAL_STORAGE_ITEM } from "./constants";
 3 | import { Credentials } from "./types";
 4 | 
 5 | const eventEmitter = new EventEmitter();
 6 | 
 7 | export function isAuthenticated(): boolean {
 8 |   return Boolean(getCredentials());
 9 | }
10 | 
11 | export function listen(listener: (authenticated: boolean) => void): void {
12 |   eventEmitter.on("change", () => {
13 |     listener(isAuthenticated());
14 |   });
15 | }
16 | 
17 | export function setCredentials(credentials: Credentials) {
18 |   localStorage.setItem(
19 |     CREDENTIALS_LOCAL_STORAGE_ITEM,
20 |     JSON.stringify(credentials)
21 |   );
22 | }
23 | 
24 | export function getCredentials(): Credentials | null {
25 |   const raw = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
26 |   if (raw === null) {
27 |     return null;
28 |   }
29 |   return JSON.parse(raw);
30 | }
31 | 
32 | export function removeCredentials(): void {
33 |   localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
34 | }
35 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/constants.ts:
--------------------------------------------------------------------------------
1 | export const CREDENTIALS_LOCAL_STORAGE_ITEM = "credentials";
2 | export const USER_DATA_LOCAL_STORAGE_ITEM = "userData";
3 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/contactInfo/ContactInfoCreate.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Create, SimpleForm, CreateProps, TextInput } from "react-admin";
 3 | 
 4 | export const ContactInfoCreate = (props: CreateProps): React.ReactElement => {
 5 |   return (
 6 |     <Create {...props}>
 7 |       <SimpleForm>
 8 |         <TextInput label="phoneNumber" source="phoneNumber" />
 9 |       </SimpleForm>
10 |     </Create>
11 |   );
12 | };
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/contactInfo/ContactInfoEdit.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Edit, SimpleForm, EditProps, TextInput } from "react-admin";
 3 | 
 4 | export const ContactInfoEdit = (props: EditProps): React.ReactElement => {
 5 |   return (
 6 |     <Edit {...props}>
 7 |       <SimpleForm>
 8 |         <TextInput label="phoneNumber" source="phoneNumber" />
 9 |       </SimpleForm>
10 |     </Edit>
11 |   );
12 | };
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/contactInfo/ContactInfoList.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { List, Datagrid, ListProps, DateField, TextField } from "react-admin";
 3 | import Pagination from "../Components/Pagination";
 4 | 
 5 | export const ContactInfoList = (props: ListProps): React.ReactElement => {
 6 |   return (
 7 |     <List
 8 |       {...props}
 9 |       bulkActionButtons={false}
10 |       title={"ContactInfos"}
11 |       perPage={50}
12 |       pagination={<Pagination />}
13 |     >
14 |       <Datagrid rowClick="show">
15 |         <DateField source="createdAt" label="Created At" />
16 |         <TextField label="ID" source="id" />
17 |         <TextField label="phoneNumber" source="phoneNumber" />
18 |         <DateField source="updatedAt" label="Updated At" />
19 |       </Datagrid>
20 |     </List>
21 |   );
22 | };
23 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/contactInfo/ContactInfoShow.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import {
 3 |   Show,
 4 |   SimpleShowLayout,
 5 |   ShowProps,
 6 |   DateField,
 7 |   TextField,
 8 | } from "react-admin";
 9 | 
10 | export const ContactInfoShow = (props: ShowProps): React.ReactElement => {
11 |   return (
12 |     <Show {...props}>
13 |       <SimpleShowLayout>
14 |         <DateField source="createdAt" label="Created At" />
15 |         <TextField label="ID" source="id" />
16 |         <TextField label="phoneNumber" source="phoneNumber" />
17 |         <DateField source="updatedAt" label="Updated At" />
18 |       </SimpleShowLayout>
19 |     </Show>
20 |   );
21 | };
22 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/contactInfo/ContactInfoTitle.ts:
--------------------------------------------------------------------------------
1 | import { ContactInfo as TContactInfo } from "../api/contactInfo/ContactInfo";
2 | 
3 | export const CONTACTINFO_TITLE_FIELD = "phoneNumber";
4 | 
5 | export const ContactInfoTitle = (record: TContactInfo): string => {
6 |   return record.phoneNumber?.toString() || String(record.id);
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/data-provider/graphqlDataProvider.ts:
--------------------------------------------------------------------------------
 1 | import buildGraphQLProvider from "ra-data-graphql-amplication";
 2 | import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
 3 | import { setContext } from "@apollo/client/link/context";
 4 | import { CREDENTIALS_LOCAL_STORAGE_ITEM } from "../constants";
 5 | 
 6 | const httpLink = createHttpLink({
 7 |   uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
 8 | });
 9 | 
10 | // eslint-disable-next-line @typescript-eslint/naming-convention
11 | const authLink = setContext((_, { headers }) => {
12 |   const token = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
13 |   return {
14 |     headers: {
15 |       ...headers,
16 |       authorization: token ? token : "",
17 |     },
18 |   };
19 | });
20 | 
21 | export const apolloClient = new ApolloClient({
22 |   cache: new InMemoryCache(),
23 |   link: authLink.concat(httpLink),
24 | });
25 | 
26 | export default buildGraphQLProvider({
27 |   client: apolloClient,
28 | });
29 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/delivery/DeliveryCreate.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Create, SimpleForm, CreateProps, TextInput } from "react-admin";
 3 | 
 4 | export const DeliveryCreate = (props: CreateProps): React.ReactElement => {
 5 |   return (
 6 |     <Create {...props}>
 7 |       <SimpleForm>
 8 |         <TextInput label="status" source="status" />
 9 |         <TextInput label="trackingId" source="trackingId" />
10 |       </SimpleForm>
11 |     </Create>
12 |   );
13 | };
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/delivery/DeliveryEdit.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Edit, SimpleForm, EditProps, TextInput } from "react-admin";
 3 | 
 4 | export const DeliveryEdit = (props: EditProps): React.ReactElement => {
 5 |   return (
 6 |     <Edit {...props}>
 7 |       <SimpleForm>
 8 |         <TextInput label="status" source="status" />
 9 |         <TextInput label="trackingId" source="trackingId" />
10 |       </SimpleForm>
11 |     </Edit>
12 |   );
13 | };
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/delivery/DeliveryList.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { List, Datagrid, ListProps, DateField, TextField } from "react-admin";
 3 | import Pagination from "../Components/Pagination";
 4 | 
 5 | export const DeliveryList = (props: ListProps): React.ReactElement => {
 6 |   return (
 7 |     <List
 8 |       {...props}
 9 |       bulkActionButtons={false}
10 |       title={"Deliveries"}
11 |       perPage={50}
12 |       pagination={<Pagination />}
13 |     >
14 |       <Datagrid rowClick="show">
15 |         <DateField source="createdAt" label="Created At" />
16 |         <TextField label="ID" source="id" />
17 |         <TextField label="status" source="status" />
18 |         <TextField label="trackingId" source="trackingId" />
19 |         <DateField source="updatedAt" label="Updated At" />
20 |       </Datagrid>
21 |     </List>
22 |   );
23 | };
24 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/delivery/DeliveryShow.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import {
 3 |   Show,
 4 |   SimpleShowLayout,
 5 |   ShowProps,
 6 |   DateField,
 7 |   TextField,
 8 | } from "react-admin";
 9 | 
10 | export const DeliveryShow = (props: ShowProps): React.ReactElement => {
11 |   return (
12 |     <Show {...props}>
13 |       <SimpleShowLayout>
14 |         <DateField source="createdAt" label="Created At" />
15 |         <TextField label="ID" source="id" />
16 |         <TextField label="status" source="status" />
17 |         <TextField label="trackingId" source="trackingId" />
18 |         <DateField source="updatedAt" label="Updated At" />
19 |       </SimpleShowLayout>
20 |     </Show>
21 |   );
22 | };
23 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/delivery/DeliveryTitle.ts:
--------------------------------------------------------------------------------
1 | import { Delivery as TDelivery } from "../api/delivery/Delivery";
2 | 
3 | export const DELIVERY_TITLE_FIELD = "status";
4 | 
5 | export const DeliveryTitle = (record: TDelivery): string => {
6 |   return record.status?.toString() || String(record.id);
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/index.css:
--------------------------------------------------------------------------------
 1 | body {
 2 |   margin: 0;
 3 |   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
 4 |     "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
 5 |     sans-serif;
 6 |   -webkit-font-smoothing: antialiased;
 7 |   -moz-osx-font-smoothing: grayscale;
 8 | }
 9 | 
10 | #root {
11 |   height: 100vh;
12 | }
13 | 
14 | code {
15 |   font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
16 |     monospace;
17 | }
18 | 
19 | .amp-breadcrumbs {
20 |   padding: var(--default-spacing);
21 | }
22 | 
23 | .entity-id {
24 |   color: var(--primary);
25 |   text-decoration: underline;
26 | }
27 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/index.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import ReactDOM from "react-dom";
 3 | import "./index.css";
 4 | 
 5 | import App from "./App";
 6 | import reportWebVitals from "./reportWebVitals";
 7 | 
 8 | ReactDOM.render(
 9 |   <React.StrictMode>
10 |     <App />
11 |   </React.StrictMode>,
12 |   document.getElementById("root")
13 | );
14 | 
15 | // If you want to start measuring performance in your app, pass a function
16 | // to log results (for example: reportWebVitals(console.log))
17 | // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
18 | reportWebVitals();
19 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/pages/Dashboard.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import Card from "@material-ui/core/Card";
 3 | import CardContent from "@material-ui/core/CardContent";
 4 | import { Title } from "react-admin";
 5 | const Dashboard = () => (
 6 |   <Card>
 7 |     <Title title="Welcome to the administration" />
 8 |     <CardContent>Welcome</CardContent>
 9 |   </Card>
10 | );
11 | 
12 | export default Dashboard;
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/reportWebVitals.ts:
--------------------------------------------------------------------------------
 1 | import { ReportHandler } from "web-vitals";
 2 | 
 3 | const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
 4 |   if (onPerfEntry && onPerfEntry instanceof Function) {
 5 |     void import("web-vitals").then(
 6 |       ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
 7 |         getCLS(onPerfEntry);
 8 |         getFID(onPerfEntry);
 9 |         getFCP(onPerfEntry);
10 |         getLCP(onPerfEntry);
11 |         getTTFB(onPerfEntry);
12 |       }
13 |     );
14 |   }
15 | };
16 | 
17 | export default reportWebVitals;
18 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/setupTests.ts:
--------------------------------------------------------------------------------
1 | // jest-dom adds custom jest matchers for asserting on DOM nodes.
2 | // allows you to do things like:
3 | // expect(element).toHaveTextContent(/react/i)
4 | // learn more: https://github.com/testing-library/jest-dom
5 | import "@testing-library/jest-dom";
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/theme/theme.ts:
--------------------------------------------------------------------------------
 1 | import { defaultTheme } from "react-admin";
 2 | import { createTheme, ThemeOptions } from "@material-ui/core/styles";
 3 | import { merge } from "lodash";
 4 | import createPalette from "@material-ui/core/styles/createPalette";
 5 | 
 6 | const palette = createPalette(
 7 |   merge({}, defaultTheme.palette, {
 8 |     primary: {
 9 |       main: "#20a4f3",
10 |     },
11 |     secondary: {
12 |       main: "#7950ed",
13 |     },
14 |     error: {
15 |       main: "#e93c51",
16 |     },
17 |     warning: {
18 |       main: "#f6aa50",
19 |     },
20 |     info: {
21 |       main: "#144bc1",
22 |     },
23 |     success: {
24 |       main: "#31c587",
25 |     },
26 |   })
27 | );
28 | 
29 | const themeOptions: ThemeOptions = {
30 |   palette,
31 | };
32 | 
33 | export const theme = createTheme(merge({}, defaultTheme, themeOptions));
34 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/tracking/TrackingCreate.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Create, SimpleForm, CreateProps, TextInput } from "react-admin";
 3 | 
 4 | export const TrackingCreate = (props: CreateProps): React.ReactElement => {
 5 |   return (
 6 |     <Create {...props}>
 7 |       <SimpleForm>
 8 |         <TextInput label="location" source="location" />
 9 |         <TextInput label="trackingId" source="trackingId" />
10 |       </SimpleForm>
11 |     </Create>
12 |   );
13 | };
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/tracking/TrackingEdit.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { Edit, SimpleForm, EditProps, TextInput } from "react-admin";
 3 | 
 4 | export const TrackingEdit = (props: EditProps): React.ReactElement => {
 5 |   return (
 6 |     <Edit {...props}>
 7 |       <SimpleForm>
 8 |         <TextInput label="location" source="location" />
 9 |         <TextInput label="trackingId" source="trackingId" />
10 |       </SimpleForm>
11 |     </Edit>
12 |   );
13 | };
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/tracking/TrackingList.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { List, Datagrid, ListProps, DateField, TextField } from "react-admin";
 3 | import Pagination from "../Components/Pagination";
 4 | 
 5 | export const TrackingList = (props: ListProps): React.ReactElement => {
 6 |   return (
 7 |     <List
 8 |       {...props}
 9 |       bulkActionButtons={false}
10 |       title={"Trackings"}
11 |       perPage={50}
12 |       pagination={<Pagination />}
13 |     >
14 |       <Datagrid rowClick="show">
15 |         <DateField source="createdAt" label="Created At" />
16 |         <TextField label="ID" source="id" />
17 |         <TextField label="location" source="location" />
18 |         <TextField label="trackingId" source="trackingId" />
19 |         <DateField source="updatedAt" label="Updated At" />
20 |       </Datagrid>
21 |     </List>
22 |   );
23 | };
24 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/tracking/TrackingShow.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import {
 3 |   Show,
 4 |   SimpleShowLayout,
 5 |   ShowProps,
 6 |   DateField,
 7 |   TextField,
 8 | } from "react-admin";
 9 | 
10 | export const TrackingShow = (props: ShowProps): React.ReactElement => {
11 |   return (
12 |     <Show {...props}>
13 |       <SimpleShowLayout>
14 |         <DateField source="createdAt" label="Created At" />
15 |         <TextField label="ID" source="id" />
16 |         <TextField label="location" source="location" />
17 |         <TextField label="trackingId" source="trackingId" />
18 |         <DateField source="updatedAt" label="Updated At" />
19 |       </SimpleShowLayout>
20 |     </Show>
21 |   );
22 | };
23 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/tracking/TrackingTitle.ts:
--------------------------------------------------------------------------------
1 | import { Tracking as TTracking } from "../api/tracking/Tracking";
2 | 
3 | export const TRACKING_TITLE_FIELD = "location";
4 | 
5 | export const TrackingTitle = (record: TTracking): string => {
6 |   return record.location?.toString() || String(record.id);
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/types.ts:
--------------------------------------------------------------------------------
 1 | import { JsonValue } from "type-fest";
 2 | 
 3 | export type Credentials = {
 4 |   username: string;
 5 |   password: string;
 6 | };
 7 | export type LoginMutateResult = {
 8 |   login: {
 9 |     username: string;
10 |     accessToken: string;
11 |   };
12 | };
13 | export type InputJsonValue = Omit<JsonValue, "null">;
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/EnumRoles.ts:
--------------------------------------------------------------------------------
1 | export enum EnumRoles {
2 |   User = "user",
3 | }
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/RolesOptions.ts:
--------------------------------------------------------------------------------
 1 | import { ROLES } from "./roles";
 2 | 
 3 | declare interface Role {
 4 |   name: string;
 5 |   displayName: string;
 6 | }
 7 | 
 8 | export const ROLES_OPTIONS = ROLES.map((role: Role) => ({
 9 |   value: role.name,
10 |   label: role.displayName,
11 | }));
12 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/UserCreate.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | 
 3 | import {
 4 |   Create,
 5 |   SimpleForm,
 6 |   CreateProps,
 7 |   TextInput,
 8 |   PasswordInput,
 9 |   SelectArrayInput,
10 | } from "react-admin";
11 | 
12 | import { ROLES_OPTIONS } from "../user/RolesOptions";
13 | 
14 | export const UserCreate = (props: CreateProps): React.ReactElement => {
15 |   return (
16 |     <Create {...props}>
17 |       <SimpleForm>
18 |         <TextInput label="Email" source="email" type="email" />
19 |         <TextInput label="First Name" source="firstName" />
20 |         <TextInput label="Last Name" source="lastName" />
21 |         <PasswordInput label="Password" source="password" />
22 |         <SelectArrayInput
23 |           source="roles"
24 |           choices={ROLES_OPTIONS}
25 |           optionText="label"
26 |           optionValue="value"
27 |         />
28 |         <TextInput label="Username" source="username" />
29 |       </SimpleForm>
30 |     </Create>
31 |   );
32 | };
33 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/UserEdit.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import {
 3 |   Edit,
 4 |   SimpleForm,
 5 |   EditProps,
 6 |   TextInput,
 7 |   PasswordInput,
 8 |   SelectArrayInput,
 9 | } from "react-admin";
10 | import { ROLES_OPTIONS } from "../user/RolesOptions";
11 | 
12 | export const UserEdit = (props: EditProps): React.ReactElement => {
13 |   return (
14 |     <Edit {...props}>
15 |       <SimpleForm>
16 |         <TextInput label="Email" source="email" type="email" />
17 |         <TextInput label="First Name" source="firstName" />
18 |         <TextInput label="Last Name" source="lastName" />
19 |         <PasswordInput label="Password" source="password" />
20 |         <SelectArrayInput
21 |           source="roles"
22 |           choices={ROLES_OPTIONS}
23 |           optionText="label"
24 |           optionValue="value"
25 |         />
26 |         <TextInput label="Username" source="username" />
27 |       </SimpleForm>
28 |     </Edit>
29 |   );
30 | };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/UserList.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import { List, Datagrid, ListProps, DateField, TextField } from "react-admin";
 3 | import Pagination from "../Components/Pagination";
 4 | 
 5 | export const UserList = (props: ListProps): React.ReactElement => {
 6 |   return (
 7 |     <List
 8 |       {...props}
 9 |       bulkActionButtons={false}
10 |       title={"Users"}
11 |       perPage={50}
12 |       pagination={<Pagination />}
13 |     >
14 |       <Datagrid rowClick="show">
15 |         <DateField source="createdAt" label="Created At" />
16 |         <TextField label="Email" source="email" />
17 |         <TextField label="First Name" source="firstName" />
18 |         <TextField label="ID" source="id" />
19 |         <TextField label="Last Name" source="lastName" />
20 |         <TextField label="Roles" source="roles" />
21 |         <DateField source="updatedAt" label="Updated At" />
22 |         <TextField label="Username" source="username" />
23 |       </Datagrid>
24 |     </List>
25 |   );
26 | };
27 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/UserShow.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | import {
 3 |   Show,
 4 |   SimpleShowLayout,
 5 |   ShowProps,
 6 |   DateField,
 7 |   TextField,
 8 | } from "react-admin";
 9 | 
10 | export const UserShow = (props: ShowProps): React.ReactElement => {
11 |   return (
12 |     <Show {...props}>
13 |       <SimpleShowLayout>
14 |         <DateField source="createdAt" label="Created At" />
15 |         <TextField label="Email" source="email" />
16 |         <TextField label="First Name" source="firstName" />
17 |         <TextField label="ID" source="id" />
18 |         <TextField label="Last Name" source="lastName" />
19 |         <TextField label="Roles" source="roles" />
20 |         <DateField source="updatedAt" label="Updated At" />
21 |         <TextField label="Username" source="username" />
22 |       </SimpleShowLayout>
23 |     </Show>
24 |   );
25 | };
26 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/UserTitle.ts:
--------------------------------------------------------------------------------
1 | import { User as TUser } from "../api/user/User";
2 | 
3 | export const USER_TITLE_FIELD = "firstName";
4 | 
5 | export const UserTitle = (record: TUser): string => {
6 |   return record.firstName?.toString() || String(record.id);
7 | };
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/user/roles.ts:
--------------------------------------------------------------------------------
1 | export const ROLES = [
2 |   {
3 |     name: "user",
4 |     displayName: "User",
5 |   },
6 | ];
7 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/BooleanFilter.ts:
--------------------------------------------------------------------------------
1 | export class BooleanFilter {
2 |   equals?: boolean;
3 |   not?: boolean;
4 | }
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/BooleanNullableFilter.ts:
--------------------------------------------------------------------------------
1 | export class BooleanNullableFilter {
2 |   equals?: boolean | null;
3 |   not?: boolean | null;
4 | }
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/DateTimeFilter.ts:
--------------------------------------------------------------------------------
 1 | export class DateTimeFilter {
 2 |   equals?: Date;
 3 |   not?: Date;
 4 |   in?: Date[];
 5 |   notIn?: Date[];
 6 |   lt?: Date;
 7 |   lte?: Date;
 8 |   gt?: Date;
 9 |   gte?: Date;
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/DateTimeNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | export class DateTimeNullableFilter {
 2 |   equals?: Date | null;
 3 |   in?: Date[] | null;
 4 |   notIn?: Date[] | null;
 5 |   lt?: Date;
 6 |   lte?: Date;
 7 |   gt?: Date;
 8 |   gte?: Date;
 9 |   not?: Date;
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/FloatFilter.ts:
--------------------------------------------------------------------------------
 1 | export class FloatFilter {
 2 |   equals?: number;
 3 |   in?: number[];
 4 |   notIn?: number[];
 5 |   lt?: number;
 6 |   lte?: number;
 7 |   gt?: number;
 8 |   gte?: number;
 9 |   not?: number;
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/FloatNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | export class FloatNullableFilter {
 2 |   equals?: number | null;
 3 |   in?: number[] | null;
 4 |   notIn?: number[] | null;
 5 |   lt?: number;
 6 |   lte?: number;
 7 |   gt?: number;
 8 |   gte?: number;
 9 |   not?: number;
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/IntFilter.ts:
--------------------------------------------------------------------------------
 1 | export class IntFilter {
 2 |   equals?: number;
 3 |   in?: number[];
 4 |   notIn?: number[];
 5 |   lt?: number;
 6 |   lte?: number;
 7 |   gt?: number;
 8 |   gte?: number;
 9 |   not?: number;
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/IntNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | export class IntNullableFilter {
 2 |   equals?: number | null;
 3 |   in?: number[] | null;
 4 |   notIn?: number[] | null;
 5 |   lt?: number;
 6 |   lte?: number;
 7 |   gt?: number;
 8 |   gte?: number;
 9 |   not?: number;
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/JsonFilter.ts:
--------------------------------------------------------------------------------
1 | import { InputJsonValue } from "../types";
2 | export class JsonFilter {
3 |   equals?: InputJsonValue;
4 |   not?: InputJsonValue;
5 | }
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/JsonNullableFilter.ts:
--------------------------------------------------------------------------------
1 | import { JsonValue } from "type-fest";
2 | export class JsonNullableFilter {
3 |   equals?: JsonValue | null;
4 |   not?: JsonValue | null;
5 | }
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/MetaQueryPayload.ts:
--------------------------------------------------------------------------------
1 | export class MetaQueryPayload {
2 |   count!: number;
3 | }
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/QueryMode.ts:
--------------------------------------------------------------------------------
1 | export enum QueryMode {
2 |   Default = "default",
3 |   Insensitive = "insensitive",
4 | }
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/SortOrder.ts:
--------------------------------------------------------------------------------
1 | export enum SortOrder {
2 |   Asc = "asc",
3 |   Desc = "desc",
4 | }
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/StringFilter.ts:
--------------------------------------------------------------------------------
 1 | import { QueryMode } from "./QueryMode";
 2 | 
 3 | export class StringFilter {
 4 |   equals?: string;
 5 |   in?: string[];
 6 |   notIn?: string[];
 7 |   lt?: string;
 8 |   lte?: string;
 9 |   gt?: string;
10 |   gte?: string;
11 |   contains?: string;
12 |   startsWith?: string;
13 |   endsWith?: string;
14 |   mode?: QueryMode;
15 |   not?: string;
16 | }
17 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/src/util/StringNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | import { QueryMode } from "./QueryMode";
 2 | export class StringNullableFilter {
 3 |   equals?: string | null;
 4 |   in?: string[] | null;
 5 |   notIn?: string[] | null;
 6 |   lt?: string;
 7 |   lte?: string;
 8 |   gt?: string;
 9 |   gte?: string;
10 |   contains?: string;
11 |   startsWith?: string;
12 |   endsWith?: string;
13 |   mode?: QueryMode;
14 |   not?: string;
15 | }
16 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-admin/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "es5",
 4 |     "lib": ["dom", "dom.iterable", "esnext"],
 5 |     "allowJs": true,
 6 |     "skipLibCheck": true,
 7 |     "esModuleInterop": true,
 8 |     "allowSyntheticDefaultImports": true,
 9 |     "forceConsistentCasingInFileNames": true,
10 |     "noFallthroughCasesInSwitch": true,
11 |     "module": "esnext",
12 |     "moduleResolution": "node",
13 |     "resolveJsonModule": true,
14 |     "isolatedModules": true,
15 |     "noEmit": true,
16 |     "jsx": "react-jsx",
17 |     "strict": true
18 |   },
19 |   "include": ["src"],
20 |   "exclude": ["./node_modules"]
21 | }
22 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/.dockerignore:
--------------------------------------------------------------------------------
1 | .dockerignore
2 | docker-compose.yml
3 | Dockerfile
4 | dist/
5 | node_modules
6 | .env
7 | .gitignore
8 | .prettierignore


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/.env:
--------------------------------------------------------------------------------
1 | BCRYPT_SALT=10
2 | COMPOSE_PROJECT_NAME=amp_clxjyfzwo078l4ksi1gheibj3
3 | DB_NAME=my-db
4 | DB_PASSWORD=admin
5 | DB_PORT=27017
6 | DB_URL=mongodb://admin:admin@localhost:27017/my-db?authSource=admin
7 | DB_USER=admin
8 | PORT=3000


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/.gitignore:
--------------------------------------------------------------------------------
1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
2 |  
3 | /node_modules
4 | /dist
5 | .DS_Store
6 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/.prettierignore:
--------------------------------------------------------------------------------
1 | node_modules/
2 | dist/
3 | prisma/migrations/
4 | package-lock.json
5 | coverage/


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/Dockerfile:
--------------------------------------------------------------------------------
 1 | # multi-stage: base (build)
 2 | FROM node:18.13.0 AS base
 3 | 
 4 | # create directory where the application will be built
 5 | WORKDIR /app
 6 | 
 7 | # copy over the dependency manifests, both the package.json 
 8 | # and the package-lock.json are copied over
 9 | COPY package*.json ./
10 | 
11 | # installs packages and their dependencies
12 | RUN npm install
13 | 
14 | # copy over the prisma schema
15 | COPY prisma/schema.prisma ./prisma/
16 | 
17 | # generate the prisma client based on the schema
18 | RUN npm run prisma:generate
19 | 
20 | # copy over the code base
21 | COPY . .
22 | 
23 | # create the bundle of the application
24 | RUN npm run build
25 | 
26 | # multi-stage: production (runtime)
27 | FROM node:18.13.0-slim AS production
28 | 
29 | # create arguments of builds time variables
30 | ARG user=amplication
31 | ARG group=${user}
32 | ARG uid=1001
33 | ARG gid=$uid
34 | 
35 | # [temporary] work around to be able to run prisma
36 | RUN apt-get update -y && apt-get install -y openssl
37 | 
38 | # create directory where the application will be executed from
39 | WORKDIR /app
40 | 
41 | # add the user and group
42 | RUN groupadd --gid ${gid} ${user}
43 | RUN useradd --uid ${uid} --gid ${gid} -m ${user}
44 | 
45 | # copy over the bundled code from the build stage
46 | COPY --from=base /app/node_modules/ ./node_modules
47 | COPY --from=base /app/package.json ./package.json
48 | COPY --from=base /app/dist ./dist
49 | COPY --from=base /app/prisma ./prisma
50 | COPY --from=base /app/scripts ./scripts
51 | COPY --from=base /app/src ./src
52 | COPY --from=base /app/tsconfig* ./
53 | 
54 | # change ownership of the workspace directory
55 | RUN chown -R ${uid}:${gid} /app/
56 | 
57 | # get rid of the development dependencies
58 | RUN npm install --production
59 | 
60 | # set user to the created non-privileged user
61 | USER ${user}
62 | 
63 | # expose a specific port on the docker container
64 | ENV PORT=3000
65 | EXPOSE ${PORT}
66 | 
67 | # start the server using the previously build application
68 | CMD [ "node", "./dist/main.js" ]
69 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/docker-compose.dev.yml:
--------------------------------------------------------------------------------
 1 | version: "3"
 2 | services:
 3 |   db:
 4 |     image: mongo
 5 |     ports:
 6 |       - ${DB_PORT}:27017
 7 |     environment:
 8 |       POSTGRES_USER: ${DB_USER}
 9 |       POSTGRES_PASSWORD: ${DB_PASSWORD}
10 |       MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
11 |       MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
12 |       MONGO_INITDB_DATABASE: ${DB_NAME}
13 |       MONGO_REPLICA_SET_NAME: rs0
14 |     volumes:
15 |       - mongo:/var/lib/mongosql/data
16 |     restart: always
17 |     entrypoint:
18 |       - /bin/bash
19 |       - -c
20 |       - openssl rand -base64 741 > /data/cert.crt; chmod 400 /data/cert.crt &&
21 |         chown 999 /data/cert.crt; /usr/local/bin/docker-entrypoint.sh mongod
22 |         --bind_ip_all --keyFile /data/cert.crt --replSet rs0
23 |     healthcheck:
24 |       test: "test $(mongosh --quiet -u  ${MONGO_INITDB_ROOT_USERNAME} -p
25 |         ${MONGO_INITDB_ROOT_PASSWORD} --eval \"try { rs.initiate({ _id:
26 |         '\"rs0\"',members: [{ _id: 0, host: '\"localhost\"' }] }).ok } catch (_)
27 |         { rs.status().ok}\") -eq 1"
28 |       start_period: 5s
29 |       interval: 10s
30 |       timeout: 10s
31 | volumes:
32 |   postgres: ~
33 |   mongo: ~
34 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/docker-compose.yml:
--------------------------------------------------------------------------------
 1 | version: "3"
 2 | services:
 3 |   server:
 4 |     build:
 5 |       context: .
 6 |       args:
 7 |         NPM_LOG_LEVEL: notice
 8 |     ports:
 9 |       - ${PORT}:3000
10 |     environment:
11 |       BCRYPT_SALT: ${BCRYPT_SALT}
12 |       DB_URL: mongodb://${DB_USER}:${DB_PASSWORD}@db:27017/${DB_NAME}?authSource=admin
13 |     depends_on:
14 |       - migrate
15 |     restart: on-failure
16 |   migrate:
17 |     build:
18 |       context: .
19 |       args:
20 |         NPM_LOG_LEVEL: notice
21 |     command: npm run db:init
22 |     working_dir: /app/server
23 |     environment:
24 |       BCRYPT_SALT: ${BCRYPT_SALT}
25 |       DB_URL: mongodb://${DB_USER}:${DB_PASSWORD}@db:27017/${DB_NAME}?authSource=admin
26 |     depends_on:
27 |       db:
28 |         condition: service_healthy
29 |   db:
30 |     image: mongo
31 |     ports:
32 |       - ${DB_PORT}:27017
33 |     environment:
34 |       POSTGRES_USER: ${DB_USER}
35 |       POSTGRES_PASSWORD: ${DB_PASSWORD}
36 |       POSTGRES_DB: ${DB_NAME}
37 |       MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
38 |       MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
39 |       MONGO_INITDB_DATABASE: ${DB_NAME}
40 |       MONGO_REPLICA_SET_NAME: rs0
41 |     volumes:
42 |       - mongo:/var/lib/mongosql/data
43 |     healthcheck:
44 |       test: "test $(mongosh --quiet -u  ${MONGO_INITDB_ROOT_USERNAME} -p
45 |         ${MONGO_INITDB_ROOT_PASSWORD} --eval \"try { rs.initiate({ _id:
46 |         'rs0',members: [{ _id: 0, host: 'db' }] }).ok } catch (_) {
47 |         rs.status().ok}\") -eq 1"
48 |       timeout: 10s
49 |       interval: 10s
50 |       retries: 10
51 |       start_period: 5s
52 |     restart: always
53 |     entrypoint:
54 |       - /bin/bash
55 |       - -c
56 |       - openssl rand -base64 741 > /data/cert.crt; chmod 400 /data/cert.crt &&
57 |         chown 999 /data/cert.crt; /usr/local/bin/docker-entrypoint.sh mongod
58 |         --bind_ip_all --keyFile /data/cert.crt --replSet rs0
59 | volumes:
60 |   postgres: ~
61 |   mongo: ~
62 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/nest-cli.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "sourceRoot": "src",
 3 |   "compilerOptions": {
 4 |     "assets": [
 5 |       {
 6 |         "include": "swagger/**/*"
 7 |       }
 8 |     ]
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "@delivery-tracking/server",
 3 |   "private": true,
 4 |   "scripts": {
 5 |     "start": "nest start",
 6 |     "start:watch": "nest start --watch",
 7 |     "start:debug": "nest start --debug --watch",
 8 |     "build": "nest build",
 9 |     "test": "jest",
10 |     "seed": "ts-node scripts/seed.ts",
11 |     "db:migrate-save": "prisma migrate dev",
12 |     "db:migrate-up": "prisma migrate deploy",
13 |     "db:clean": "prisma migrate reset",
14 |     "db:init": "run-s seed",
15 |     "prisma:generate": "prisma generate",
16 |     "docker:dev": "docker-compose -f docker-compose.dev.yml up -d",
17 |     "package:container": "docker build .",
18 |     "compose:up": "docker-compose up -d",
19 |     "compose:down": "docker-compose down --volumes",
20 |     "prisma:pull": "prisma db pull",
21 |     "prisma:push": " prisma db push"
22 |   },
23 |   "dependencies": {
24 |     "@apollo/server": "^4.9.4",
25 |     "@nestjs/apollo": "12.0.9",
26 |     "@nestjs/common": "10.2.7",
27 |     "@nestjs/config": "3.1.1",
28 |     "@nestjs/core": "10.2.7",
29 |     "@nestjs/graphql": "12.0.9",
30 |     "@nestjs/jwt": "^10.1.1",
31 |     "@nestjs/passport": "^10.0.2",
32 |     "@nestjs/platform-express": "10.2.7",
33 |     "@nestjs/serve-static": "4.0.0",
34 |     "@nestjs/swagger": "7.1.13",
35 |     "@prisma/client": "^5.4.2",
36 |     "@types/bcrypt": "5.0.0",
37 |     "bcrypt": "5.1.1",
38 |     "class-transformer": "0.5.1",
39 |     "class-validator": "0.14.0",
40 |     "dotenv": "16.3.1",
41 |     "graphql": "^16.8.1",
42 |     "graphql-type-json": "0.3.2",
43 |     "npm-run-all": "4.1.5",
44 |     "passport": "0.6.0",
45 |     "passport-http": "0.3.0",
46 |     "passport-jwt": "4.0.1",
47 |     "reflect-metadata": "0.1.13",
48 |     "ts-node": "10.9.2",
49 |     "type-fest": "2.19.0",
50 |     "validator": "13.11.0"
51 |   },
52 |   "devDependencies": {
53 |     "@nestjs/cli": "^10.1.18",
54 |     "@nestjs/testing": "^10.2.7",
55 |     "@types/express": "^4.17.19",
56 |     "@types/graphql-type-json": "0.3.3",
57 |     "@types/jest": "^29.5.5",
58 |     "@types/normalize-path": "3.0.0",
59 |     "@types/passport-http": "0.3.9",
60 |     "@types/passport-jwt": "3.0.10",
61 |     "@types/supertest": "^2.0.14",
62 |     "@types/validator": "^13.11.2",
63 |     "jest": "^29.7.0",
64 |     "jest-mock-extended": "^3.0.5",
65 |     "prisma": "^5.4.2",
66 |     "supertest": "^6.3.3",
67 |     "ts-jest": "^29.1.1",
68 |     "typescript": "^5.4.3"
69 |   },
70 |   "jest": {
71 |     "preset": "ts-jest",
72 |     "testEnvironment": "node",
73 |     "modulePathIgnorePatterns": ["<rootDir>/dist/"]
74 |   }
75 | }
76 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/prisma/schema.prisma:
--------------------------------------------------------------------------------
 1 | datasource db {
 2 |   provider = "mongodb"
 3 |   url      = env("DB_URL")
 4 | }
 5 | 
 6 | generator client {
 7 |   provider = "prisma-client-js"
 8 | }
 9 | 
10 | model Delivery {
11 |   createdAt  DateTime @default(now())
12 |   id         String   @id @default(auto()) @map("_id") @db.ObjectId
13 |   status     String?
14 |   trackingId String?
15 |   updatedAt  DateTime @updatedAt
16 | }
17 | 
18 | model Tracking {
19 |   createdAt  DateTime @default(now())
20 |   id         String   @id @default(auto()) @map("_id") @db.ObjectId
21 |   location   String?
22 |   trackingId String?
23 |   updatedAt  DateTime @updatedAt
24 | }
25 | 
26 | model ContactInfo {
27 |   createdAt   DateTime @default(now())
28 |   id          String   @id @default(auto()) @map("_id") @db.ObjectId
29 |   phoneNumber String?
30 |   updatedAt   DateTime @updatedAt
31 | }
32 | 
33 | model User {
34 |   createdAt DateTime @default(now())
35 |   email     String?  @unique
36 |   firstName String?
37 |   id        String   @id @default(auto()) @map("_id") @db.ObjectId
38 |   lastName  String?
39 |   password  String
40 |   roles     Json
41 |   updatedAt DateTime @updatedAt
42 |   username  String   @unique
43 | }
44 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/scripts/customSeed.ts:
--------------------------------------------------------------------------------
1 | import { PrismaClient } from "@prisma/client";
2 | 
3 | export async function customSeed() {
4 |   const client = new PrismaClient();
5 | 
6 |   client.$disconnect();
7 | }
8 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/scripts/seed.ts:
--------------------------------------------------------------------------------
 1 | import * as dotenv from "dotenv";
 2 | import { PrismaClient } from "@prisma/client";
 3 | import { customSeed } from "./customSeed";
 4 | 
 5 | if (require.main === module) {
 6 |   dotenv.config();
 7 | 
 8 |   const { BCRYPT_SALT } = process.env;
 9 | 
10 |   if (!BCRYPT_SALT) {
11 |     throw new Error("BCRYPT_SALT environment variable must be defined");
12 |   }
13 | }
14 | 
15 | async function seed() {
16 |   console.info("Seeding database...");
17 | 
18 |   const client = new PrismaClient();
19 |   void client.$disconnect();
20 | 
21 |   console.info("Seeding database with custom seed...");
22 |   customSeed();
23 | 
24 |   console.info("Seeded database successfully");
25 | }
26 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/TrackingModule/trackingmodule.controller.ts:
--------------------------------------------------------------------------------
 1 | import * as common from "@nestjs/common";
 2 | import * as swagger from "@nestjs/swagger";
 3 | import * as errors from "../errors";
 4 | import { TrackingModuleService } from "./trackingmodule.service";
 5 | 
 6 | @swagger.ApiTags("trackingModules")
 7 | @common.Controller("trackingModules")
 8 | export class TrackingModuleController {
 9 |   constructor(protected readonly service: TrackingModuleService) {}
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/TrackingModule/trackingmodule.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { TrackingModuleService } from "./trackingmodule.service";
 3 | import { TrackingModuleController } from "./trackingmodule.controller";
 4 | import { TrackingModuleResolver } from "./trackingmodule.resolver";
 5 | 
 6 | @Module({
 7 |   controllers: [TrackingModuleController],
 8 |   providers: [TrackingModuleService, TrackingModuleResolver],
 9 |   exports: [TrackingModuleService],
10 | })
11 | export class TrackingModuleModule {}
12 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/TrackingModule/trackingmodule.resolver.ts:
--------------------------------------------------------------------------------
1 | import * as graphql from "@nestjs/graphql";
2 | import { TrackingModuleService } from "./trackingmodule.service";
3 | 
4 | export class TrackingModuleResolver {
5 |   constructor(protected readonly service: TrackingModuleService) {}
6 | }
7 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/TrackingModule/trackingmodule.service.ts:
--------------------------------------------------------------------------------
1 | import { Injectable } from "@nestjs/common";
2 | 
3 | @Injectable()
4 | export class TrackingModuleService {
5 |   constructor() {}
6 | }
7 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/app.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { DeliveryModule } from "./delivery/delivery.module";
 3 | import { TrackingModule } from "./tracking/tracking.module";
 4 | import { ContactInfoModule } from "./contactInfo/contactInfo.module";
 5 | import { UserModule } from "./user/user.module";
 6 | import { TrackingModuleModule } from "./TrackingModule/trackingmodule.module";
 7 | import { HealthModule } from "./health/health.module";
 8 | import { PrismaModule } from "./prisma/prisma.module";
 9 | import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
10 | import { ServeStaticModule } from "@nestjs/serve-static";
11 | import { ServeStaticOptionsService } from "./serveStaticOptions.service";
12 | import { ConfigModule, ConfigService } from "@nestjs/config";
13 | import { GraphQLModule } from "@nestjs/graphql";
14 | import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
15 | 
16 | @Module({
17 |   controllers: [],
18 |   imports: [
19 |     DeliveryModule,
20 |     TrackingModule,
21 |     ContactInfoModule,
22 |     UserModule,
23 |     TrackingModuleModule,
24 |     HealthModule,
25 |     PrismaModule,
26 |     SecretsManagerModule,
27 |     ConfigModule.forRoot({ isGlobal: true }),
28 |     ServeStaticModule.forRootAsync({
29 |       useClass: ServeStaticOptionsService,
30 |     }),
31 |     GraphQLModule.forRootAsync<ApolloDriverConfig>({
32 |       driver: ApolloDriver,
33 |       useFactory: (configService: ConfigService) => {
34 |         const playground = configService.get("GRAPHQL_PLAYGROUND");
35 |         const introspection = configService.get("GRAPHQL_INTROSPECTION");
36 |         return {
37 |           autoSchemaFile: "schema.graphql",
38 |           sortSchema: true,
39 |           playground,
40 |           introspection: playground || introspection,
41 |         };
42 |       },
43 |       inject: [ConfigService],
44 |       imports: [ConfigModule],
45 |     }),
46 |   ],
47 |   providers: [],
48 | })
49 | export class AppModule {}
50 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/connectMicroservices.ts:
--------------------------------------------------------------------------------
1 | import { INestApplication } from "@nestjs/common";
2 | import { ConfigService } from "@nestjs/config";
3 | 
4 | export async function connectMicroservices(app: INestApplication) {
5 |   const configService = app.get(ConfigService);
6 | }
7 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfo.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ObjectType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsDate, IsString, IsOptional } from "class-validator";
15 | import { Type } from "class-transformer";
16 | 
17 | @ObjectType()
18 | class ContactInfo {
19 |   @ApiProperty({
20 |     required: true,
21 |   })
22 |   @IsDate()
23 |   @Type(() => Date)
24 |   @Field(() => Date)
25 |   createdAt!: Date;
26 | 
27 |   @ApiProperty({
28 |     required: true,
29 |     type: String,
30 |   })
31 |   @IsString()
32 |   @Field(() => String)
33 |   id!: string;
34 | 
35 |   @ApiProperty({
36 |     required: false,
37 |     type: String,
38 |   })
39 |   @IsString()
40 |   @IsOptional()
41 |   @Field(() => String, {
42 |     nullable: true,
43 |   })
44 |   phoneNumber!: string | null;
45 | 
46 |   @ApiProperty({
47 |     required: true,
48 |   })
49 |   @IsDate()
50 |   @Type(() => Date)
51 |   @Field(() => Date)
52 |   updatedAt!: Date;
53 | }
54 | 
55 | export { ContactInfo as ContactInfo };
56 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoCountArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
15 | import { Type } from "class-transformer";
16 | 
17 | @ArgsType()
18 | class ContactInfoCountArgs {
19 |   @ApiProperty({
20 |     required: false,
21 |     type: () => ContactInfoWhereInput,
22 |   })
23 |   @Field(() => ContactInfoWhereInput, { nullable: true })
24 |   @Type(() => ContactInfoWhereInput)
25 |   where?: ContactInfoWhereInput;
26 | }
27 | 
28 | export { ContactInfoCountArgs as ContactInfoCountArgs };
29 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoCreateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | 
16 | @InputType()
17 | class ContactInfoCreateInput {
18 |   @ApiProperty({
19 |     required: false,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @IsOptional()
24 |   @Field(() => String, {
25 |     nullable: true,
26 |   })
27 |   phoneNumber?: string | null;
28 | }
29 | 
30 | export { ContactInfoCreateInput as ContactInfoCreateInput };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
15 | import { IsOptional, ValidateNested, IsInt } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { ContactInfoOrderByInput } from "./ContactInfoOrderByInput";
18 | 
19 | @ArgsType()
20 | class ContactInfoFindManyArgs {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: () => ContactInfoWhereInput,
24 |   })
25 |   @IsOptional()
26 |   @ValidateNested()
27 |   @Field(() => ContactInfoWhereInput, { nullable: true })
28 |   @Type(() => ContactInfoWhereInput)
29 |   where?: ContactInfoWhereInput;
30 | 
31 |   @ApiProperty({
32 |     required: false,
33 |     type: [ContactInfoOrderByInput],
34 |   })
35 |   @IsOptional()
36 |   @ValidateNested({ each: true })
37 |   @Field(() => [ContactInfoOrderByInput], { nullable: true })
38 |   @Type(() => ContactInfoOrderByInput)
39 |   orderBy?: Array<ContactInfoOrderByInput>;
40 | 
41 |   @ApiProperty({
42 |     required: false,
43 |     type: Number,
44 |   })
45 |   @IsOptional()
46 |   @IsInt()
47 |   @Field(() => Number, { nullable: true })
48 |   @Type(() => Number)
49 |   skip?: number;
50 | 
51 |   @ApiProperty({
52 |     required: false,
53 |     type: Number,
54 |   })
55 |   @IsOptional()
56 |   @IsInt()
57 |   @Field(() => Number, { nullable: true })
58 |   @Type(() => Number)
59 |   take?: number;
60 | }
61 | 
62 | export { ContactInfoFindManyArgs as ContactInfoFindManyArgs };
63 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoFindUniqueArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoWhereUniqueInput } from "./ContactInfoWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class ContactInfoFindUniqueArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => ContactInfoWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => ContactInfoWhereUniqueInput)
26 |   @Field(() => ContactInfoWhereUniqueInput, { nullable: false })
27 |   where!: ContactInfoWhereUniqueInput;
28 | }
29 | 
30 | export { ContactInfoFindUniqueArgs as ContactInfoFindUniqueArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoListRelationFilter.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoWhereInput } from "./ContactInfoWhereInput";
15 | import { ValidateNested, IsOptional } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @InputType()
19 | class ContactInfoListRelationFilter {
20 |   @ApiProperty({
21 |     required: false,
22 |     type: () => ContactInfoWhereInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => ContactInfoWhereInput)
26 |   @IsOptional()
27 |   @Field(() => ContactInfoWhereInput, {
28 |     nullable: true,
29 |   })
30 |   every?: ContactInfoWhereInput;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: () => ContactInfoWhereInput,
35 |   })
36 |   @ValidateNested()
37 |   @Type(() => ContactInfoWhereInput)
38 |   @IsOptional()
39 |   @Field(() => ContactInfoWhereInput, {
40 |     nullable: true,
41 |   })
42 |   some?: ContactInfoWhereInput;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: () => ContactInfoWhereInput,
47 |   })
48 |   @ValidateNested()
49 |   @Type(() => ContactInfoWhereInput)
50 |   @IsOptional()
51 |   @Field(() => ContactInfoWhereInput, {
52 |     nullable: true,
53 |   })
54 |   none?: ContactInfoWhereInput;
55 | }
56 | export { ContactInfoListRelationFilter as ContactInfoListRelationFilter };
57 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoOrderByInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsOptional, IsEnum } from "class-validator";
15 | import { SortOrder } from "../../util/SortOrder";
16 | 
17 | @InputType({
18 |   isAbstract: true,
19 |   description: undefined,
20 | })
21 | class ContactInfoOrderByInput {
22 |   @ApiProperty({
23 |     required: false,
24 |     enum: ["asc", "desc"],
25 |   })
26 |   @IsOptional()
27 |   @IsEnum(SortOrder)
28 |   @Field(() => SortOrder, {
29 |     nullable: true,
30 |   })
31 |   createdAt?: SortOrder;
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     enum: ["asc", "desc"],
36 |   })
37 |   @IsOptional()
38 |   @IsEnum(SortOrder)
39 |   @Field(() => SortOrder, {
40 |     nullable: true,
41 |   })
42 |   id?: SortOrder;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     enum: ["asc", "desc"],
47 |   })
48 |   @IsOptional()
49 |   @IsEnum(SortOrder)
50 |   @Field(() => SortOrder, {
51 |     nullable: true,
52 |   })
53 |   phoneNumber?: SortOrder;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     enum: ["asc", "desc"],
58 |   })
59 |   @IsOptional()
60 |   @IsEnum(SortOrder)
61 |   @Field(() => SortOrder, {
62 |     nullable: true,
63 |   })
64 |   updatedAt?: SortOrder;
65 | }
66 | 
67 | export { ContactInfoOrderByInput as ContactInfoOrderByInput };
68 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoUpdateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | 
16 | @InputType()
17 | class ContactInfoUpdateInput {
18 |   @ApiProperty({
19 |     required: false,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @IsOptional()
24 |   @Field(() => String, {
25 |     nullable: true,
26 |   })
27 |   phoneNumber?: string | null;
28 | }
29 | 
30 | export { ContactInfoUpdateInput as ContactInfoUpdateInput };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoWhereInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { StringFilter } from "../../util/StringFilter";
15 | import { Type } from "class-transformer";
16 | import { IsOptional } from "class-validator";
17 | import { StringNullableFilter } from "../../util/StringNullableFilter";
18 | 
19 | @InputType()
20 | class ContactInfoWhereInput {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: StringFilter,
24 |   })
25 |   @Type(() => StringFilter)
26 |   @IsOptional()
27 |   @Field(() => StringFilter, {
28 |     nullable: true,
29 |   })
30 |   id?: StringFilter;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: StringNullableFilter,
35 |   })
36 |   @Type(() => StringNullableFilter)
37 |   @IsOptional()
38 |   @Field(() => StringNullableFilter, {
39 |     nullable: true,
40 |   })
41 |   phoneNumber?: StringNullableFilter;
42 | }
43 | 
44 | export { ContactInfoWhereInput as ContactInfoWhereInput };
45 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/ContactInfoWhereUniqueInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString } from "class-validator";
15 | 
16 | @InputType()
17 | class ContactInfoWhereUniqueInput {
18 |   @ApiProperty({
19 |     required: true,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @Field(() => String)
24 |   id!: string;
25 | }
26 | 
27 | export { ContactInfoWhereUniqueInput as ContactInfoWhereUniqueInput };
28 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/CreateContactInfoArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoCreateInput } from "./ContactInfoCreateInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class CreateContactInfoArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => ContactInfoCreateInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => ContactInfoCreateInput)
26 |   @Field(() => ContactInfoCreateInput, { nullable: false })
27 |   data!: ContactInfoCreateInput;
28 | }
29 | 
30 | export { CreateContactInfoArgs as CreateContactInfoArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/DeleteContactInfoArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoWhereUniqueInput } from "./ContactInfoWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class DeleteContactInfoArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => ContactInfoWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => ContactInfoWhereUniqueInput)
26 |   @Field(() => ContactInfoWhereUniqueInput, { nullable: false })
27 |   where!: ContactInfoWhereUniqueInput;
28 | }
29 | 
30 | export { DeleteContactInfoArgs as DeleteContactInfoArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/UpdateContactInfoArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { ContactInfoWhereUniqueInput } from "./ContactInfoWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { ContactInfoUpdateInput } from "./ContactInfoUpdateInput";
18 | 
19 | @ArgsType()
20 | class UpdateContactInfoArgs {
21 |   @ApiProperty({
22 |     required: true,
23 |     type: () => ContactInfoWhereUniqueInput,
24 |   })
25 |   @ValidateNested()
26 |   @Type(() => ContactInfoWhereUniqueInput)
27 |   @Field(() => ContactInfoWhereUniqueInput, { nullable: false })
28 |   where!: ContactInfoWhereUniqueInput;
29 | 
30 |   @ApiProperty({
31 |     required: true,
32 |     type: () => ContactInfoUpdateInput,
33 |   })
34 |   @ValidateNested()
35 |   @Type(() => ContactInfoUpdateInput)
36 |   @Field(() => ContactInfoUpdateInput, { nullable: false })
37 |   data!: ContactInfoUpdateInput;
38 | }
39 | 
40 | export { UpdateContactInfoArgs as UpdateContactInfoArgs };
41 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/contactInfo.module.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { Module } from "@nestjs/common";
13 | 
14 | @Module({
15 |   imports: [],
16 |   exports: [],
17 | })
18 | export class ContactInfoModuleBase {}
19 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/base/contactInfo.service.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { PrismaService } from "../../prisma/prisma.service";
13 | import { Prisma, ContactInfo as PrismaContactInfo } from "@prisma/client";
14 | 
15 | export class ContactInfoServiceBase {
16 |   constructor(protected readonly prisma: PrismaService) {}
17 | 
18 |   async count(
19 |     args: Omit<Prisma.ContactInfoCountArgs, "select">
20 |   ): Promise<number> {
21 |     return this.prisma.contactInfo.count(args);
22 |   }
23 | 
24 |   async contactInfos(
25 |     args: Prisma.ContactInfoFindManyArgs
26 |   ): Promise<PrismaContactInfo[]> {
27 |     return this.prisma.contactInfo.findMany(args);
28 |   }
29 |   async contactInfo(
30 |     args: Prisma.ContactInfoFindUniqueArgs
31 |   ): Promise<PrismaContactInfo | null> {
32 |     return this.prisma.contactInfo.findUnique(args);
33 |   }
34 |   async createContactInfo(
35 |     args: Prisma.ContactInfoCreateArgs
36 |   ): Promise<PrismaContactInfo> {
37 |     return this.prisma.contactInfo.create(args);
38 |   }
39 |   async updateContactInfo(
40 |     args: Prisma.ContactInfoUpdateArgs
41 |   ): Promise<PrismaContactInfo> {
42 |     return this.prisma.contactInfo.update(args);
43 |   }
44 |   async deleteContactInfo(
45 |     args: Prisma.ContactInfoDeleteArgs
46 |   ): Promise<PrismaContactInfo> {
47 |     return this.prisma.contactInfo.delete(args);
48 |   }
49 | }
50 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/contactInfo.controller.ts:
--------------------------------------------------------------------------------
 1 | import * as common from "@nestjs/common";
 2 | import * as swagger from "@nestjs/swagger";
 3 | import { ContactInfoService } from "./contactInfo.service";
 4 | import { ContactInfoControllerBase } from "./base/contactInfo.controller.base";
 5 | 
 6 | @swagger.ApiTags("contactInfos")
 7 | @common.Controller("contactInfos")
 8 | export class ContactInfoController extends ContactInfoControllerBase {
 9 |   constructor(protected readonly service: ContactInfoService) {
10 |     super(service);
11 |   }
12 | }
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/contactInfo.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { ContactInfoModuleBase } from "./base/contactInfo.module.base";
 3 | import { ContactInfoService } from "./contactInfo.service";
 4 | import { ContactInfoController } from "./contactInfo.controller";
 5 | import { ContactInfoResolver } from "./contactInfo.resolver";
 6 | 
 7 | @Module({
 8 |   imports: [ContactInfoModuleBase],
 9 |   controllers: [ContactInfoController],
10 |   providers: [ContactInfoService, ContactInfoResolver],
11 |   exports: [ContactInfoService],
12 | })
13 | export class ContactInfoModule {}
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/contactInfo.resolver.ts:
--------------------------------------------------------------------------------
 1 | import * as graphql from "@nestjs/graphql";
 2 | import { ContactInfoResolverBase } from "./base/contactInfo.resolver.base";
 3 | import { ContactInfo } from "./base/ContactInfo";
 4 | import { ContactInfoService } from "./contactInfo.service";
 5 | 
 6 | @graphql.Resolver(() => ContactInfo)
 7 | export class ContactInfoResolver extends ContactInfoResolverBase {
 8 |   constructor(protected readonly service: ContactInfoService) {
 9 |     super(service);
10 |   }
11 | }
12 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/contactInfo/contactInfo.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { PrismaService } from "../prisma/prisma.service";
 3 | import { ContactInfoServiceBase } from "./base/contactInfo.service.base";
 4 | 
 5 | @Injectable()
 6 | export class ContactInfoService extends ContactInfoServiceBase {
 7 |   constructor(protected readonly prisma: PrismaService) {
 8 |     super(prisma);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/decorators/api-nested-query.decorator.ts:
--------------------------------------------------------------------------------
 1 | import { applyDecorators } from "@nestjs/common";
 2 | import {
 3 |   ApiExtraModels,
 4 |   ApiQuery,
 5 |   ApiQueryOptions,
 6 |   getSchemaPath,
 7 | } from "@nestjs/swagger";
 8 | import "reflect-metadata";
 9 | 
10 | const generateApiQueryObject = (
11 |   prop: any,
12 |   propType: any,
13 |   required: boolean,
14 |   isArray: boolean
15 | ): ApiQueryOptions => {
16 |   if (propType === Number) {
17 |     return {
18 |       required,
19 |       name: prop,
20 |       style: "deepObject",
21 |       explode: true,
22 |       type: "number",
23 |       isArray,
24 |     };
25 |   } else if (propType === String) {
26 |     return {
27 |       required,
28 |       name: prop,
29 |       style: "deepObject",
30 |       explode: true,
31 |       type: "string",
32 |       isArray,
33 |     };
34 |   } else {
35 |     return {
36 |       required,
37 |       name: prop,
38 |       style: "deepObject",
39 |       explode: true,
40 |       type: "object",
41 |       isArray,
42 |       schema: {
43 |         $ref: getSchemaPath(propType),
44 |       },
45 |     };
46 |   }
47 | };
48 | 
49 | // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/naming-convention
50 | export function ApiNestedQuery(query: Function) {
51 |   const constructor = query.prototype;
52 |   const properties = Reflect.getMetadata(
53 |     "swagger/apiModelPropertiesArray",
54 |     constructor
55 |   ).map((prop: any) => prop.slice(1));
56 | 
57 |   const decorators = properties
58 |     .map((property: any) => {
59 |       const { required, isArray } = Reflect.getMetadata(
60 |         "swagger/apiModelProperties",
61 |         constructor,
62 |         property
63 |       );
64 |       const propertyType = Reflect.getMetadata(
65 |         "design:type",
66 |         constructor,
67 |         property
68 |       );
69 |       const typedQuery = generateApiQueryObject(
70 |         property,
71 |         propertyType,
72 |         required,
73 |         isArray
74 |       );
75 |       return [ApiExtraModels(propertyType), ApiQuery(typedQuery)];
76 |     })
77 |     .flat();
78 | 
79 |   return applyDecorators(...decorators);
80 | }
81 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/decorators/public.decorator.ts:
--------------------------------------------------------------------------------
 1 | import { applyDecorators, SetMetadata } from "@nestjs/common";
 2 | 
 3 | export const IS_PUBLIC_KEY = "isPublic";
 4 | 
 5 | const PublicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
 6 | const PublicAuthSwagger = SetMetadata("swagger/apiSecurity", ["isPublic"]);
 7 | 
 8 | // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 9 | export const Public = () =>
10 |   applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/CreateDeliveryArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryCreateInput } from "./DeliveryCreateInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class CreateDeliveryArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => DeliveryCreateInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => DeliveryCreateInput)
26 |   @Field(() => DeliveryCreateInput, { nullable: false })
27 |   data!: DeliveryCreateInput;
28 | }
29 | 
30 | export { CreateDeliveryArgs as CreateDeliveryArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeleteDeliveryArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryWhereUniqueInput } from "./DeliveryWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class DeleteDeliveryArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => DeliveryWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => DeliveryWhereUniqueInput)
26 |   @Field(() => DeliveryWhereUniqueInput, { nullable: false })
27 |   where!: DeliveryWhereUniqueInput;
28 | }
29 | 
30 | export { DeleteDeliveryArgs as DeleteDeliveryArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/Delivery.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ObjectType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsDate, IsString, IsOptional } from "class-validator";
15 | import { Type } from "class-transformer";
16 | 
17 | @ObjectType()
18 | class Delivery {
19 |   @ApiProperty({
20 |     required: true,
21 |   })
22 |   @IsDate()
23 |   @Type(() => Date)
24 |   @Field(() => Date)
25 |   createdAt!: Date;
26 | 
27 |   @ApiProperty({
28 |     required: true,
29 |     type: String,
30 |   })
31 |   @IsString()
32 |   @Field(() => String)
33 |   id!: string;
34 | 
35 |   @ApiProperty({
36 |     required: false,
37 |     type: String,
38 |   })
39 |   @IsString()
40 |   @IsOptional()
41 |   @Field(() => String, {
42 |     nullable: true,
43 |   })
44 |   status!: string | null;
45 | 
46 |   @ApiProperty({
47 |     required: false,
48 |     type: String,
49 |   })
50 |   @IsString()
51 |   @IsOptional()
52 |   @Field(() => String, {
53 |     nullable: true,
54 |   })
55 |   trackingId!: string | null;
56 | 
57 |   @ApiProperty({
58 |     required: true,
59 |   })
60 |   @IsDate()
61 |   @Type(() => Date)
62 |   @Field(() => Date)
63 |   updatedAt!: Date;
64 | }
65 | 
66 | export { Delivery as Delivery };
67 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryCountArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryWhereInput } from "./DeliveryWhereInput";
15 | import { Type } from "class-transformer";
16 | 
17 | @ArgsType()
18 | class DeliveryCountArgs {
19 |   @ApiProperty({
20 |     required: false,
21 |     type: () => DeliveryWhereInput,
22 |   })
23 |   @Field(() => DeliveryWhereInput, { nullable: true })
24 |   @Type(() => DeliveryWhereInput)
25 |   where?: DeliveryWhereInput;
26 | }
27 | 
28 | export { DeliveryCountArgs as DeliveryCountArgs };
29 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryCreateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | 
16 | @InputType()
17 | class DeliveryCreateInput {
18 |   @ApiProperty({
19 |     required: false,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @IsOptional()
24 |   @Field(() => String, {
25 |     nullable: true,
26 |   })
27 |   status?: string | null;
28 | 
29 |   @ApiProperty({
30 |     required: false,
31 |     type: String,
32 |   })
33 |   @IsString()
34 |   @IsOptional()
35 |   @Field(() => String, {
36 |     nullable: true,
37 |   })
38 |   trackingId?: string | null;
39 | }
40 | 
41 | export { DeliveryCreateInput as DeliveryCreateInput };
42 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryWhereInput } from "./DeliveryWhereInput";
15 | import { IsOptional, ValidateNested, IsInt } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { DeliveryOrderByInput } from "./DeliveryOrderByInput";
18 | 
19 | @ArgsType()
20 | class DeliveryFindManyArgs {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: () => DeliveryWhereInput,
24 |   })
25 |   @IsOptional()
26 |   @ValidateNested()
27 |   @Field(() => DeliveryWhereInput, { nullable: true })
28 |   @Type(() => DeliveryWhereInput)
29 |   where?: DeliveryWhereInput;
30 | 
31 |   @ApiProperty({
32 |     required: false,
33 |     type: [DeliveryOrderByInput],
34 |   })
35 |   @IsOptional()
36 |   @ValidateNested({ each: true })
37 |   @Field(() => [DeliveryOrderByInput], { nullable: true })
38 |   @Type(() => DeliveryOrderByInput)
39 |   orderBy?: Array<DeliveryOrderByInput>;
40 | 
41 |   @ApiProperty({
42 |     required: false,
43 |     type: Number,
44 |   })
45 |   @IsOptional()
46 |   @IsInt()
47 |   @Field(() => Number, { nullable: true })
48 |   @Type(() => Number)
49 |   skip?: number;
50 | 
51 |   @ApiProperty({
52 |     required: false,
53 |     type: Number,
54 |   })
55 |   @IsOptional()
56 |   @IsInt()
57 |   @Field(() => Number, { nullable: true })
58 |   @Type(() => Number)
59 |   take?: number;
60 | }
61 | 
62 | export { DeliveryFindManyArgs as DeliveryFindManyArgs };
63 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryFindUniqueArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryWhereUniqueInput } from "./DeliveryWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class DeliveryFindUniqueArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => DeliveryWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => DeliveryWhereUniqueInput)
26 |   @Field(() => DeliveryWhereUniqueInput, { nullable: false })
27 |   where!: DeliveryWhereUniqueInput;
28 | }
29 | 
30 | export { DeliveryFindUniqueArgs as DeliveryFindUniqueArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryListRelationFilter.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryWhereInput } from "./DeliveryWhereInput";
15 | import { ValidateNested, IsOptional } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @InputType()
19 | class DeliveryListRelationFilter {
20 |   @ApiProperty({
21 |     required: false,
22 |     type: () => DeliveryWhereInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => DeliveryWhereInput)
26 |   @IsOptional()
27 |   @Field(() => DeliveryWhereInput, {
28 |     nullable: true,
29 |   })
30 |   every?: DeliveryWhereInput;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: () => DeliveryWhereInput,
35 |   })
36 |   @ValidateNested()
37 |   @Type(() => DeliveryWhereInput)
38 |   @IsOptional()
39 |   @Field(() => DeliveryWhereInput, {
40 |     nullable: true,
41 |   })
42 |   some?: DeliveryWhereInput;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: () => DeliveryWhereInput,
47 |   })
48 |   @ValidateNested()
49 |   @Type(() => DeliveryWhereInput)
50 |   @IsOptional()
51 |   @Field(() => DeliveryWhereInput, {
52 |     nullable: true,
53 |   })
54 |   none?: DeliveryWhereInput;
55 | }
56 | export { DeliveryListRelationFilter as DeliveryListRelationFilter };
57 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryOrderByInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsOptional, IsEnum } from "class-validator";
15 | import { SortOrder } from "../../util/SortOrder";
16 | 
17 | @InputType({
18 |   isAbstract: true,
19 |   description: undefined,
20 | })
21 | class DeliveryOrderByInput {
22 |   @ApiProperty({
23 |     required: false,
24 |     enum: ["asc", "desc"],
25 |   })
26 |   @IsOptional()
27 |   @IsEnum(SortOrder)
28 |   @Field(() => SortOrder, {
29 |     nullable: true,
30 |   })
31 |   createdAt?: SortOrder;
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     enum: ["asc", "desc"],
36 |   })
37 |   @IsOptional()
38 |   @IsEnum(SortOrder)
39 |   @Field(() => SortOrder, {
40 |     nullable: true,
41 |   })
42 |   id?: SortOrder;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     enum: ["asc", "desc"],
47 |   })
48 |   @IsOptional()
49 |   @IsEnum(SortOrder)
50 |   @Field(() => SortOrder, {
51 |     nullable: true,
52 |   })
53 |   status?: SortOrder;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     enum: ["asc", "desc"],
58 |   })
59 |   @IsOptional()
60 |   @IsEnum(SortOrder)
61 |   @Field(() => SortOrder, {
62 |     nullable: true,
63 |   })
64 |   trackingId?: SortOrder;
65 | 
66 |   @ApiProperty({
67 |     required: false,
68 |     enum: ["asc", "desc"],
69 |   })
70 |   @IsOptional()
71 |   @IsEnum(SortOrder)
72 |   @Field(() => SortOrder, {
73 |     nullable: true,
74 |   })
75 |   updatedAt?: SortOrder;
76 | }
77 | 
78 | export { DeliveryOrderByInput as DeliveryOrderByInput };
79 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryUpdateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | 
16 | @InputType()
17 | class DeliveryUpdateInput {
18 |   @ApiProperty({
19 |     required: false,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @IsOptional()
24 |   @Field(() => String, {
25 |     nullable: true,
26 |   })
27 |   status?: string | null;
28 | 
29 |   @ApiProperty({
30 |     required: false,
31 |     type: String,
32 |   })
33 |   @IsString()
34 |   @IsOptional()
35 |   @Field(() => String, {
36 |     nullable: true,
37 |   })
38 |   trackingId?: string | null;
39 | }
40 | 
41 | export { DeliveryUpdateInput as DeliveryUpdateInput };
42 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryWhereInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { StringFilter } from "../../util/StringFilter";
15 | import { Type } from "class-transformer";
16 | import { IsOptional } from "class-validator";
17 | import { StringNullableFilter } from "../../util/StringNullableFilter";
18 | 
19 | @InputType()
20 | class DeliveryWhereInput {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: StringFilter,
24 |   })
25 |   @Type(() => StringFilter)
26 |   @IsOptional()
27 |   @Field(() => StringFilter, {
28 |     nullable: true,
29 |   })
30 |   id?: StringFilter;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: StringNullableFilter,
35 |   })
36 |   @Type(() => StringNullableFilter)
37 |   @IsOptional()
38 |   @Field(() => StringNullableFilter, {
39 |     nullable: true,
40 |   })
41 |   status?: StringNullableFilter;
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: StringNullableFilter,
46 |   })
47 |   @Type(() => StringNullableFilter)
48 |   @IsOptional()
49 |   @Field(() => StringNullableFilter, {
50 |     nullable: true,
51 |   })
52 |   trackingId?: StringNullableFilter;
53 | }
54 | 
55 | export { DeliveryWhereInput as DeliveryWhereInput };
56 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/DeliveryWhereUniqueInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString } from "class-validator";
15 | 
16 | @InputType()
17 | class DeliveryWhereUniqueInput {
18 |   @ApiProperty({
19 |     required: true,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @Field(() => String)
24 |   id!: string;
25 | }
26 | 
27 | export { DeliveryWhereUniqueInput as DeliveryWhereUniqueInput };
28 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/UpdateDeliveryArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { DeliveryWhereUniqueInput } from "./DeliveryWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { DeliveryUpdateInput } from "./DeliveryUpdateInput";
18 | 
19 | @ArgsType()
20 | class UpdateDeliveryArgs {
21 |   @ApiProperty({
22 |     required: true,
23 |     type: () => DeliveryWhereUniqueInput,
24 |   })
25 |   @ValidateNested()
26 |   @Type(() => DeliveryWhereUniqueInput)
27 |   @Field(() => DeliveryWhereUniqueInput, { nullable: false })
28 |   where!: DeliveryWhereUniqueInput;
29 | 
30 |   @ApiProperty({
31 |     required: true,
32 |     type: () => DeliveryUpdateInput,
33 |   })
34 |   @ValidateNested()
35 |   @Type(() => DeliveryUpdateInput)
36 |   @Field(() => DeliveryUpdateInput, { nullable: false })
37 |   data!: DeliveryUpdateInput;
38 | }
39 | 
40 | export { UpdateDeliveryArgs as UpdateDeliveryArgs };
41 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/delivery.module.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { Module } from "@nestjs/common";
13 | 
14 | @Module({
15 |   imports: [],
16 |   exports: [],
17 | })
18 | export class DeliveryModuleBase {}
19 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/base/delivery.service.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { PrismaService } from "../../prisma/prisma.service";
13 | import { Prisma, Delivery as PrismaDelivery } from "@prisma/client";
14 | 
15 | export class DeliveryServiceBase {
16 |   constructor(protected readonly prisma: PrismaService) {}
17 | 
18 |   async count(args: Omit<Prisma.DeliveryCountArgs, "select">): Promise<number> {
19 |     return this.prisma.delivery.count(args);
20 |   }
21 | 
22 |   async deliveries(
23 |     args: Prisma.DeliveryFindManyArgs
24 |   ): Promise<PrismaDelivery[]> {
25 |     return this.prisma.delivery.findMany(args);
26 |   }
27 |   async delivery(
28 |     args: Prisma.DeliveryFindUniqueArgs
29 |   ): Promise<PrismaDelivery | null> {
30 |     return this.prisma.delivery.findUnique(args);
31 |   }
32 |   async createDelivery(
33 |     args: Prisma.DeliveryCreateArgs
34 |   ): Promise<PrismaDelivery> {
35 |     return this.prisma.delivery.create(args);
36 |   }
37 |   async updateDelivery(
38 |     args: Prisma.DeliveryUpdateArgs
39 |   ): Promise<PrismaDelivery> {
40 |     return this.prisma.delivery.update(args);
41 |   }
42 |   async deleteDelivery(
43 |     args: Prisma.DeliveryDeleteArgs
44 |   ): Promise<PrismaDelivery> {
45 |     return this.prisma.delivery.delete(args);
46 |   }
47 | }
48 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/delivery.controller.ts:
--------------------------------------------------------------------------------
 1 | import * as common from "@nestjs/common";
 2 | import * as swagger from "@nestjs/swagger";
 3 | import { DeliveryService } from "./delivery.service";
 4 | import { DeliveryControllerBase } from "./base/delivery.controller.base";
 5 | 
 6 | @swagger.ApiTags("deliveries")
 7 | @common.Controller("deliveries")
 8 | export class DeliveryController extends DeliveryControllerBase {
 9 |   constructor(protected readonly service: DeliveryService) {
10 |     super(service);
11 |   }
12 | }
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/delivery.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { DeliveryModuleBase } from "./base/delivery.module.base";
 3 | import { DeliveryService } from "./delivery.service";
 4 | import { DeliveryController } from "./delivery.controller";
 5 | import { DeliveryResolver } from "./delivery.resolver";
 6 | 
 7 | @Module({
 8 |   imports: [DeliveryModuleBase],
 9 |   controllers: [DeliveryController],
10 |   providers: [DeliveryService, DeliveryResolver],
11 |   exports: [DeliveryService],
12 | })
13 | export class DeliveryModule {}
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/delivery.resolver.ts:
--------------------------------------------------------------------------------
 1 | import * as graphql from "@nestjs/graphql";
 2 | import { DeliveryResolverBase } from "./base/delivery.resolver.base";
 3 | import { Delivery } from "./base/Delivery";
 4 | import { DeliveryService } from "./delivery.service";
 5 | 
 6 | @graphql.Resolver(() => Delivery)
 7 | export class DeliveryResolver extends DeliveryResolverBase {
 8 |   constructor(protected readonly service: DeliveryService) {
 9 |     super(service);
10 |   }
11 | }
12 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/delivery/delivery.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { PrismaService } from "../prisma/prisma.service";
 3 | import { DeliveryServiceBase } from "./base/delivery.service.base";
 4 | 
 5 | @Injectable()
 6 | export class DeliveryService extends DeliveryServiceBase {
 7 |   constructor(protected readonly prisma: PrismaService) {
 8 |     super(prisma);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/errors.ts:
--------------------------------------------------------------------------------
 1 | import * as common from "@nestjs/common";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | 
 4 | export class ForbiddenException extends common.ForbiddenException {
 5 |   @ApiProperty()
 6 |   statusCode!: number;
 7 |   @ApiProperty()
 8 |   message!: string;
 9 | }
10 | 
11 | export class NotFoundException extends common.NotFoundException {
12 |   @ApiProperty()
13 |   statusCode!: number;
14 |   @ApiProperty()
15 |   message!: string;
16 | }
17 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/health/base/health.controller.base.ts:
--------------------------------------------------------------------------------
 1 | import { Get, HttpStatus, Res } from "@nestjs/common";
 2 | import { Response } from "express";
 3 | import { HealthService } from "../health.service";
 4 | 
 5 | export class HealthControllerBase {
 6 |   constructor(protected readonly healthService: HealthService) {}
 7 |   @Get("live")
 8 |   healthLive(@Res() response: Response): Response<void> {
 9 |     return response.status(HttpStatus.NO_CONTENT).send();
10 |   }
11 |   @Get("ready")
12 |   async healthReady(@Res() response: Response): Promise<Response<void>> {
13 |     const dbConnection = await this.healthService.isDbReady();
14 |     if (!dbConnection) {
15 |       return response.status(HttpStatus.NOT_FOUND).send();
16 |     }
17 |     return response.status(HttpStatus.NO_CONTENT).send();
18 |   }
19 | }
20 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/health/base/health.service.base.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { PrismaService } from "../../prisma/prisma.service";
 3 | 
 4 | @Injectable()
 5 | export class HealthServiceBase {
 6 |   constructor(protected readonly prisma: PrismaService) {}
 7 |   async isDbReady(): Promise<boolean> {
 8 |     try {
 9 |       await this.prisma.$runCommandRaw({
10 |         select: 1,
11 |       });
12 |       return true;
13 |     } catch (error) {
14 |       return false;
15 |     }
16 |   }
17 | }
18 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/health/health.controller.ts:
--------------------------------------------------------------------------------
 1 | import { Controller } from "@nestjs/common";
 2 | import { HealthControllerBase } from "./base/health.controller.base";
 3 | import { HealthService } from "./health.service";
 4 | 
 5 | @Controller("_health")
 6 | export class HealthController extends HealthControllerBase {
 7 |   constructor(protected readonly healthService: HealthService) {
 8 |     super(healthService);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/health/health.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { HealthController } from "./health.controller";
 3 | import { HealthService } from "./health.service";
 4 | 
 5 | @Module({
 6 |   controllers: [HealthController],
 7 |   providers: [HealthService],
 8 |   exports: [HealthService],
 9 | })
10 | export class HealthModule {}
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/health/health.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { PrismaService } from "../prisma/prisma.service";
 3 | import { HealthServiceBase } from "./base/health.service.base";
 4 | 
 5 | @Injectable()
 6 | export class HealthService extends HealthServiceBase {
 7 |   constructor(protected readonly prisma: PrismaService) {
 8 |     super(prisma);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/main.ts:
--------------------------------------------------------------------------------
 1 | import { ValidationPipe } from "@nestjs/common";
 2 | import { HttpAdapterHost, NestFactory } from "@nestjs/core";
 3 | import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
 4 | import { HttpExceptionFilter } from "./filters/HttpExceptions.filter";
 5 | import { AppModule } from "./app.module";
 6 | import { connectMicroservices } from "./connectMicroservices";
 7 | import {
 8 |   swaggerPath,
 9 |   swaggerDocumentOptions,
10 |   swaggerSetupOptions,
11 | } from "./swagger";
12 | 
13 | const { PORT = 3000 } = process.env;
14 | 
15 | async function main() {
16 |   const app = await NestFactory.create(AppModule, { cors: true });
17 | 
18 |   app.setGlobalPrefix("api");
19 |   app.useGlobalPipes(
20 |     new ValidationPipe({
21 |       transform: true,
22 |       forbidUnknownValues: false,
23 |     })
24 |   );
25 | 
26 |   const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);
27 | 
28 |   /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
29 |   Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
30 |     Object.values(path).forEach((method: any) => {
31 |       if (
32 |         Array.isArray(method.security) &&
33 |         method.security.includes("isPublic")
34 |       ) {
35 |         method.security = [];
36 |       }
37 |     });
38 |   });
39 | 
40 |   await connectMicroservices(app);
41 |   await app.startAllMicroservices();
42 | 
43 |   SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);
44 | 
45 |   const { httpAdapter } = app.get(HttpAdapterHost);
46 |   app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
47 | 
48 |   void app.listen(PORT);
49 | 
50 |   return app;
51 | }
52 | 
53 | module.exports = main();
54 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/prisma.util.spec.ts:
--------------------------------------------------------------------------------
 1 | import {
 2 |   isRecordNotFoundError,
 3 |   PRISMA_QUERY_INTERPRETATION_ERROR,
 4 | } from "./prisma.util";
 5 | 
 6 | describe("isRecordNotFoundError", () => {
 7 |   test("returns true for record not found error", () => {
 8 |     expect(
 9 |       isRecordNotFoundError(
10 |         Object.assign(
11 |           new Error(`Error occurred during query execution:
12 |         InterpretationError("Error for binding '0': RecordNotFound("Record to update not found.")")`),
13 |           {
14 |             code: PRISMA_QUERY_INTERPRETATION_ERROR,
15 |           }
16 |         )
17 |       )
18 |     ).toBe(true);
19 |   });
20 |   test("returns false for any other error", () => {
21 |     expect(isRecordNotFoundError(new Error())).toBe(false);
22 |   });
23 | });
24 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/prisma.util.ts:
--------------------------------------------------------------------------------
 1 | export const PRISMA_QUERY_INTERPRETATION_ERROR = "P2016";
 2 | export const PRISMA_RECORD_NOT_FOUND = "RecordNotFound";
 3 | 
 4 | export function isRecordNotFoundError(error: any): boolean {
 5 |   return (
 6 |     error instanceof Error &&
 7 |     "code" in error &&
 8 |     error.code === PRISMA_QUERY_INTERPRETATION_ERROR &&
 9 |     error.message.includes(PRISMA_RECORD_NOT_FOUND)
10 |   );
11 | }
12 | 
13 | export async function transformStringFieldUpdateInput<
14 |   T extends undefined | string | { set?: string }
15 | >(input: T, transform: (input: string) => Promise<string>): Promise<T> {
16 |   if (typeof input === "object" && typeof input?.set === "string") {
17 |     return { set: await transform(input.set) } as T;
18 |   }
19 |   if (typeof input === "object") {
20 |     if (typeof input.set === "string") {
21 |       return { set: await transform(input.set) } as T;
22 |     }
23 |     return input;
24 |   }
25 |   if (typeof input === "string") {
26 |     return (await transform(input)) as T;
27 |   }
28 |   return input;
29 | }
30 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/prisma/prisma.module.ts:
--------------------------------------------------------------------------------
 1 | import { Global, Module } from "@nestjs/common";
 2 | import { PrismaService } from "./prisma.service";
 3 | 
 4 | @Global()
 5 | @Module({
 6 |   providers: [PrismaService],
 7 |   exports: [PrismaService],
 8 | })
 9 | export class PrismaModule {}
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/prisma/prisma.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable, OnModuleInit, INestApplication } from "@nestjs/common";
 2 | import { PrismaClient } from "@prisma/client";
 3 | 
 4 | @Injectable()
 5 | export class PrismaService extends PrismaClient implements OnModuleInit {
 6 |   async onModuleInit() {
 7 |     await this.$connect();
 8 |   }
 9 | }
10 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/providers/secrets/base/secretsManager.service.base.spec.ts:
--------------------------------------------------------------------------------
 1 | import { ConfigService } from "@nestjs/config";
 2 | import { mock } from "jest-mock-extended";
 3 | import { SecretsManagerServiceBase } from "./secretsManager.service.base";
 4 | import { EnumSecretsNameKey } from "../secretsNameKey.enum";
 5 | 
 6 | describe("Testing the secrets manager base class", () => {
 7 |   const SECRET_KEY = "SECRET_KEY";
 8 |   const SECRET_VALUE = "SECRET_VALUE";
 9 |   const configService = mock<ConfigService>();
10 |   const secretsManagerServiceBase = new SecretsManagerServiceBase(
11 |     configService
12 |   );
13 |   beforeEach(() => {
14 |     configService.get.mockClear();
15 |   });
16 |   it("should return value from env", async () => {
17 |     //ARRANGE
18 |     configService.get.mockReturnValue(SECRET_VALUE);
19 |     //ACT
20 |     const result = await secretsManagerServiceBase.getSecret(
21 |       SECRET_KEY as unknown as EnumSecretsNameKey
22 |     );
23 |     //ASSERT
24 |     expect(result).toBe(SECRET_VALUE);
25 |   });
26 |   it("should return null for unknown keys", async () => {
27 |     //ARRANGE
28 |     configService.get.mockReturnValue(undefined);
29 |     //ACT
30 |     const result = await secretsManagerServiceBase.getSecret(
31 |       SECRET_KEY as unknown as EnumSecretsNameKey
32 |     );
33 |     //ASSERT
34 |     expect(result).toBeNull();
35 |   });
36 |   it("should throw an exception if getting null key", () => {
37 |     return expect(
38 |       secretsManagerServiceBase.getSecret(null as unknown as EnumSecretsNameKey)
39 |     ).rejects.toThrow();
40 |   });
41 | });
42 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/providers/secrets/base/secretsManager.service.base.ts:
--------------------------------------------------------------------------------
 1 | import { ConfigService } from "@nestjs/config";
 2 | import { EnumSecretsNameKey } from "../secretsNameKey.enum";
 3 | 
 4 | export interface ISecretsManager {
 5 |   getSecret: (key: EnumSecretsNameKey) => Promise<any | null>;
 6 | }
 7 | 
 8 | export class SecretsManagerServiceBase implements ISecretsManager {
 9 |   constructor(protected readonly configService: ConfigService) {}
10 |   async getSecret<T>(key: EnumSecretsNameKey): Promise<T | null> {
11 |     const value = this.configService.get(key.toString());
12 |     if (value) {
13 |       return value;
14 |     }
15 |     return null;
16 |   }
17 | }
18 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/providers/secrets/secretsManager.module.ts:
--------------------------------------------------------------------------------
1 | import { Module } from "@nestjs/common";
2 | import { SecretsManagerService } from "./secretsManager.service";
3 | 
4 | @Module({
5 |   providers: [SecretsManagerService],
6 |   exports: [SecretsManagerService],
7 | })
8 | export class SecretsManagerModule {}
9 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/providers/secrets/secretsManager.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { ConfigService } from "@nestjs/config";
 3 | import { SecretsManagerServiceBase } from "./base/secretsManager.service.base";
 4 | 
 5 | @Injectable()
 6 | export class SecretsManagerService extends SecretsManagerServiceBase {
 7 |   constructor(protected readonly configService: ConfigService) {
 8 |     super(configService);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/providers/secrets/secretsNameKey.enum.ts:
--------------------------------------------------------------------------------
1 | export enum EnumSecretsNameKey {}


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/serveStaticOptions.service.ts:
--------------------------------------------------------------------------------
 1 | import * as path from "path";
 2 | import { Injectable, Logger } from "@nestjs/common";
 3 | import { ConfigService } from "@nestjs/config";
 4 | import {
 5 |   ServeStaticModuleOptions,
 6 |   ServeStaticModuleOptionsFactory,
 7 | } from "@nestjs/serve-static";
 8 | 
 9 | const SERVE_STATIC_ROOT_PATH_VAR = "SERVE_STATIC_ROOT_PATH";
10 | const DEFAULT_STATIC_MODULE_OPTIONS_LIST: ServeStaticModuleOptions[] = [
11 |   {
12 |     serveRoot: "/swagger",
13 |     rootPath: path.join(__dirname, "swagger"),
14 |   },
15 | ];
16 | 
17 | @Injectable()
18 | export class ServeStaticOptionsService
19 |   implements ServeStaticModuleOptionsFactory
20 | {
21 |   private readonly logger = new Logger(ServeStaticOptionsService.name);
22 | 
23 |   constructor(private readonly configService: ConfigService) {}
24 | 
25 |   createLoggerOptions(): ServeStaticModuleOptions[] {
26 |     const serveStaticRootPath = this.configService.get(
27 |       SERVE_STATIC_ROOT_PATH_VAR
28 |     );
29 |     if (serveStaticRootPath) {
30 |       const resolvedPath = path.resolve(serveStaticRootPath);
31 |       this.logger.log(`Serving static files from ${resolvedPath}`);
32 |       return [
33 |         ...DEFAULT_STATIC_MODULE_OPTIONS_LIST,
34 |         { rootPath: resolvedPath, exclude: ["/api*", "/graphql"] },
35 |       ];
36 |     }
37 |     return DEFAULT_STATIC_MODULE_OPTIONS_LIST;
38 |   }
39 | }
40 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/swagger.ts:
--------------------------------------------------------------------------------
 1 | import { DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";
 2 | 
 3 | export const swaggerPath = "api";
 4 | 
 5 | export const swaggerDocumentOptions = new DocumentBuilder()
 6 |   .setTitle("DeliveryTracking")
 7 |   .setDescription(
 8 |     '\n\n## Congratulations! Your service resource is ready.\n  \nPlease note that all endpoints are secured with JWT Bearer authentication.\nBy default, your service resource comes with one user with the username "admin" and password "admin".\nLearn more in [our docs](https://docs.amplication.com)'
 9 |   )
10 |   .addBearerAuth()
11 |   .build();
12 | 
13 | export const swaggerSetupOptions: SwaggerCustomOptions = {
14 |   swaggerOptions: {
15 |     persistAuthorization: true,
16 |   },
17 |   customCssUrl: "../swagger/swagger.css",
18 |   customfavIcon: "../swagger/favicon.png",
19 |   customSiteTitle: "DeliveryTracking",
20 | };
21 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/swagger/favicon.png:
--------------------------------------------------------------------------------
1 | �PNG
2 | 
3 | ���
IHDR��� ��� ���szz���4IDATXG��Kl]W�����}�L�����n�NR�IP%P)��U��2�$D�1c cF���PU��"!J�J�#����#%�[Ǿ���й��sI�(q�'G:���k�Oq�eM��P�����q
ޏ�!%�$z��~��,-��A�/����L����/(�ɬ�|��o����zs��52r>�hn�KqGU�ݠ!)앴�ũ��%%~��Wk��}�H��@��<�M���!^����������
TAi��
�##�/�|�ܶ��R��tP�}�;Ph�n2~��������WE8(9`���1�J�M�1��J6��~n�J=����,-td,��b؏�q�àA�����y
��B|Y����&�͂��l�_6�M/�g�[��93q��L��cc�}W�nn�k�1R�0pDЇh5�/^�������?Ԕ�%;?_q>��ήkU�|��[K
])d�!��?d�/qP��~T�M��:g{�j�U��䮾�UZ�~�|Ǽl�{_��&��)���gC�vI����N2`�����y�����yI��ڶ��ԟ��J<�y�S���
�)@�{�� ���/J��xMo�[���_.�}�_AGm���v�)��0�Z���J�:���	���$�0V;�|��])�d�Jrx��b��)x �SȃFMZ
����(��e�3�N��:{z��z%?Bv&�o#����K�Ǟ���쏁]2���-����ð^������G�wb
J��!�o����^2� }�sg�~g�.��b�V��c������]�-���Vks��,[\������y'o�jyK��3s�Z�!k�yǖ+0>:����l#um=���J���z
��7/7���s�P��� ����*���'<���)��PP:�Ԯ��^���?�<���!=	:*�ѱe�O=6�Qn��<=j��2-�%E��6�l�>�<���s}���	�L���o�6?������h��p����#�]��$b�B����5����:�/O&F\�m�����!���2�i٠ĽQ�1�����"Ձ�!��}@w�X�"2JE�N����nC/Jkm��>O=�VS[�����R��Gz�M�~�ǐ;@%��~v���#��պٰ(���33m�
��Y5�P{���ń�.����R�X�q9Oա_�5l�L�7�XR��~�:�ԯ�'`��¶Ɩ���z��'H�sjޤp�
4 | q�j��8����F��
5 | �ٰ\�W�a�%Qw� c8v�L77��lj��߯�Rm����;�R�)���D��F���:�kad	\1,	������n�/U����IEND�B`�


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tests/health/health.service.spec.ts:
--------------------------------------------------------------------------------
 1 | import { mock } from "jest-mock-extended";
 2 | import { PrismaService } from "nestjs-prisma";
 3 | import { HealthServiceBase } from "../../health/base/health.service.base";
 4 | 
 5 | describe("Testing the HealthServiceBase", () => {
 6 |   //ARRANGE
 7 |   let prismaService: PrismaService;
 8 |   let healthServiceBase: HealthServiceBase;
 9 | 
10 |   describe("Testing the isDbReady function in HealthServiceBase class", () => {
11 |     beforeEach(() => {
12 |       prismaService = mock<PrismaService>();
13 |       healthServiceBase = new HealthServiceBase(prismaService);
14 |     });
15 |     it("should return true if allow connection to db", async () => {
16 |       //ARRANGE
17 |       prismaService.$runCommandRaw
18 |         //@ts-ignore
19 |         .mockReturnValue(Promise.resolve(true));
20 |       //ACT
21 |       const response = await healthServiceBase.isDbReady();
22 |       //ASSERT
23 |       expect(response).toBe(true);
24 |     });
25 |     it("should return false if db is not available", async () => {
26 |       //ARRANGE
27 |       prismaService.$runCommandRaw
28 |         //@ts-ignore
29 |         .mockReturnValue(Promise.reject(false));
30 |       //ACT
31 |       const response = await healthServiceBase.isDbReady();
32 |       //ASSERT
33 |       expect(response).toBe(false);
34 |     });
35 |   });
36 | });
37 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/CreateTrackingArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingCreateInput } from "./TrackingCreateInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class CreateTrackingArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => TrackingCreateInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => TrackingCreateInput)
26 |   @Field(() => TrackingCreateInput, { nullable: false })
27 |   data!: TrackingCreateInput;
28 | }
29 | 
30 | export { CreateTrackingArgs as CreateTrackingArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/DeleteTrackingArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class DeleteTrackingArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => TrackingWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => TrackingWhereUniqueInput)
26 |   @Field(() => TrackingWhereUniqueInput, { nullable: false })
27 |   where!: TrackingWhereUniqueInput;
28 | }
29 | 
30 | export { DeleteTrackingArgs as DeleteTrackingArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/Tracking.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ObjectType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsDate, IsString, IsOptional } from "class-validator";
15 | import { Type } from "class-transformer";
16 | 
17 | @ObjectType()
18 | class Tracking {
19 |   @ApiProperty({
20 |     required: true,
21 |   })
22 |   @IsDate()
23 |   @Type(() => Date)
24 |   @Field(() => Date)
25 |   createdAt!: Date;
26 | 
27 |   @ApiProperty({
28 |     required: true,
29 |     type: String,
30 |   })
31 |   @IsString()
32 |   @Field(() => String)
33 |   id!: string;
34 | 
35 |   @ApiProperty({
36 |     required: false,
37 |     type: String,
38 |   })
39 |   @IsString()
40 |   @IsOptional()
41 |   @Field(() => String, {
42 |     nullable: true,
43 |   })
44 |   location!: string | null;
45 | 
46 |   @ApiProperty({
47 |     required: false,
48 |     type: String,
49 |   })
50 |   @IsString()
51 |   @IsOptional()
52 |   @Field(() => String, {
53 |     nullable: true,
54 |   })
55 |   trackingId!: string | null;
56 | 
57 |   @ApiProperty({
58 |     required: true,
59 |   })
60 |   @IsDate()
61 |   @Type(() => Date)
62 |   @Field(() => Date)
63 |   updatedAt!: Date;
64 | }
65 | 
66 | export { Tracking as Tracking };
67 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingCountArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingWhereInput } from "./TrackingWhereInput";
15 | import { Type } from "class-transformer";
16 | 
17 | @ArgsType()
18 | class TrackingCountArgs {
19 |   @ApiProperty({
20 |     required: false,
21 |     type: () => TrackingWhereInput,
22 |   })
23 |   @Field(() => TrackingWhereInput, { nullable: true })
24 |   @Type(() => TrackingWhereInput)
25 |   where?: TrackingWhereInput;
26 | }
27 | 
28 | export { TrackingCountArgs as TrackingCountArgs };
29 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingCreateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | 
16 | @InputType()
17 | class TrackingCreateInput {
18 |   @ApiProperty({
19 |     required: false,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @IsOptional()
24 |   @Field(() => String, {
25 |     nullable: true,
26 |   })
27 |   location?: string | null;
28 | 
29 |   @ApiProperty({
30 |     required: false,
31 |     type: String,
32 |   })
33 |   @IsString()
34 |   @IsOptional()
35 |   @Field(() => String, {
36 |     nullable: true,
37 |   })
38 |   trackingId?: string | null;
39 | }
40 | 
41 | export { TrackingCreateInput as TrackingCreateInput };
42 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingWhereInput } from "./TrackingWhereInput";
15 | import { IsOptional, ValidateNested, IsInt } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { TrackingOrderByInput } from "./TrackingOrderByInput";
18 | 
19 | @ArgsType()
20 | class TrackingFindManyArgs {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: () => TrackingWhereInput,
24 |   })
25 |   @IsOptional()
26 |   @ValidateNested()
27 |   @Field(() => TrackingWhereInput, { nullable: true })
28 |   @Type(() => TrackingWhereInput)
29 |   where?: TrackingWhereInput;
30 | 
31 |   @ApiProperty({
32 |     required: false,
33 |     type: [TrackingOrderByInput],
34 |   })
35 |   @IsOptional()
36 |   @ValidateNested({ each: true })
37 |   @Field(() => [TrackingOrderByInput], { nullable: true })
38 |   @Type(() => TrackingOrderByInput)
39 |   orderBy?: Array<TrackingOrderByInput>;
40 | 
41 |   @ApiProperty({
42 |     required: false,
43 |     type: Number,
44 |   })
45 |   @IsOptional()
46 |   @IsInt()
47 |   @Field(() => Number, { nullable: true })
48 |   @Type(() => Number)
49 |   skip?: number;
50 | 
51 |   @ApiProperty({
52 |     required: false,
53 |     type: Number,
54 |   })
55 |   @IsOptional()
56 |   @IsInt()
57 |   @Field(() => Number, { nullable: true })
58 |   @Type(() => Number)
59 |   take?: number;
60 | }
61 | 
62 | export { TrackingFindManyArgs as TrackingFindManyArgs };
63 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingFindUniqueArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class TrackingFindUniqueArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => TrackingWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => TrackingWhereUniqueInput)
26 |   @Field(() => TrackingWhereUniqueInput, { nullable: false })
27 |   where!: TrackingWhereUniqueInput;
28 | }
29 | 
30 | export { TrackingFindUniqueArgs as TrackingFindUniqueArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingListRelationFilter.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingWhereInput } from "./TrackingWhereInput";
15 | import { ValidateNested, IsOptional } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @InputType()
19 | class TrackingListRelationFilter {
20 |   @ApiProperty({
21 |     required: false,
22 |     type: () => TrackingWhereInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => TrackingWhereInput)
26 |   @IsOptional()
27 |   @Field(() => TrackingWhereInput, {
28 |     nullable: true,
29 |   })
30 |   every?: TrackingWhereInput;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: () => TrackingWhereInput,
35 |   })
36 |   @ValidateNested()
37 |   @Type(() => TrackingWhereInput)
38 |   @IsOptional()
39 |   @Field(() => TrackingWhereInput, {
40 |     nullable: true,
41 |   })
42 |   some?: TrackingWhereInput;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: () => TrackingWhereInput,
47 |   })
48 |   @ValidateNested()
49 |   @Type(() => TrackingWhereInput)
50 |   @IsOptional()
51 |   @Field(() => TrackingWhereInput, {
52 |     nullable: true,
53 |   })
54 |   none?: TrackingWhereInput;
55 | }
56 | export { TrackingListRelationFilter as TrackingListRelationFilter };
57 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingOrderByInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsOptional, IsEnum } from "class-validator";
15 | import { SortOrder } from "../../util/SortOrder";
16 | 
17 | @InputType({
18 |   isAbstract: true,
19 |   description: undefined,
20 | })
21 | class TrackingOrderByInput {
22 |   @ApiProperty({
23 |     required: false,
24 |     enum: ["asc", "desc"],
25 |   })
26 |   @IsOptional()
27 |   @IsEnum(SortOrder)
28 |   @Field(() => SortOrder, {
29 |     nullable: true,
30 |   })
31 |   createdAt?: SortOrder;
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     enum: ["asc", "desc"],
36 |   })
37 |   @IsOptional()
38 |   @IsEnum(SortOrder)
39 |   @Field(() => SortOrder, {
40 |     nullable: true,
41 |   })
42 |   id?: SortOrder;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     enum: ["asc", "desc"],
47 |   })
48 |   @IsOptional()
49 |   @IsEnum(SortOrder)
50 |   @Field(() => SortOrder, {
51 |     nullable: true,
52 |   })
53 |   location?: SortOrder;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     enum: ["asc", "desc"],
58 |   })
59 |   @IsOptional()
60 |   @IsEnum(SortOrder)
61 |   @Field(() => SortOrder, {
62 |     nullable: true,
63 |   })
64 |   trackingId?: SortOrder;
65 | 
66 |   @ApiProperty({
67 |     required: false,
68 |     enum: ["asc", "desc"],
69 |   })
70 |   @IsOptional()
71 |   @IsEnum(SortOrder)
72 |   @Field(() => SortOrder, {
73 |     nullable: true,
74 |   })
75 |   updatedAt?: SortOrder;
76 | }
77 | 
78 | export { TrackingOrderByInput as TrackingOrderByInput };
79 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingUpdateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | 
16 | @InputType()
17 | class TrackingUpdateInput {
18 |   @ApiProperty({
19 |     required: false,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @IsOptional()
24 |   @Field(() => String, {
25 |     nullable: true,
26 |   })
27 |   location?: string | null;
28 | 
29 |   @ApiProperty({
30 |     required: false,
31 |     type: String,
32 |   })
33 |   @IsString()
34 |   @IsOptional()
35 |   @Field(() => String, {
36 |     nullable: true,
37 |   })
38 |   trackingId?: string | null;
39 | }
40 | 
41 | export { TrackingUpdateInput as TrackingUpdateInput };
42 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingWhereInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { StringFilter } from "../../util/StringFilter";
15 | import { Type } from "class-transformer";
16 | import { IsOptional } from "class-validator";
17 | import { StringNullableFilter } from "../../util/StringNullableFilter";
18 | 
19 | @InputType()
20 | class TrackingWhereInput {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: StringFilter,
24 |   })
25 |   @Type(() => StringFilter)
26 |   @IsOptional()
27 |   @Field(() => StringFilter, {
28 |     nullable: true,
29 |   })
30 |   id?: StringFilter;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: StringNullableFilter,
35 |   })
36 |   @Type(() => StringNullableFilter)
37 |   @IsOptional()
38 |   @Field(() => StringNullableFilter, {
39 |     nullable: true,
40 |   })
41 |   location?: StringNullableFilter;
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: StringNullableFilter,
46 |   })
47 |   @Type(() => StringNullableFilter)
48 |   @IsOptional()
49 |   @Field(() => StringNullableFilter, {
50 |     nullable: true,
51 |   })
52 |   trackingId?: StringNullableFilter;
53 | }
54 | 
55 | export { TrackingWhereInput as TrackingWhereInput };
56 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/TrackingWhereUniqueInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString } from "class-validator";
15 | 
16 | @InputType()
17 | class TrackingWhereUniqueInput {
18 |   @ApiProperty({
19 |     required: true,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @Field(() => String)
24 |   id!: string;
25 | }
26 | 
27 | export { TrackingWhereUniqueInput as TrackingWhereUniqueInput };
28 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/UpdateTrackingArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { TrackingWhereUniqueInput } from "./TrackingWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { TrackingUpdateInput } from "./TrackingUpdateInput";
18 | 
19 | @ArgsType()
20 | class UpdateTrackingArgs {
21 |   @ApiProperty({
22 |     required: true,
23 |     type: () => TrackingWhereUniqueInput,
24 |   })
25 |   @ValidateNested()
26 |   @Type(() => TrackingWhereUniqueInput)
27 |   @Field(() => TrackingWhereUniqueInput, { nullable: false })
28 |   where!: TrackingWhereUniqueInput;
29 | 
30 |   @ApiProperty({
31 |     required: true,
32 |     type: () => TrackingUpdateInput,
33 |   })
34 |   @ValidateNested()
35 |   @Type(() => TrackingUpdateInput)
36 |   @Field(() => TrackingUpdateInput, { nullable: false })
37 |   data!: TrackingUpdateInput;
38 | }
39 | 
40 | export { UpdateTrackingArgs as UpdateTrackingArgs };
41 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/tracking.module.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { Module } from "@nestjs/common";
13 | 
14 | @Module({
15 |   imports: [],
16 |   exports: [],
17 | })
18 | export class TrackingModuleBase {}
19 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/base/tracking.service.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { PrismaService } from "../../prisma/prisma.service";
13 | import { Prisma, Tracking as PrismaTracking } from "@prisma/client";
14 | 
15 | export class TrackingServiceBase {
16 |   constructor(protected readonly prisma: PrismaService) {}
17 | 
18 |   async count(args: Omit<Prisma.TrackingCountArgs, "select">): Promise<number> {
19 |     return this.prisma.tracking.count(args);
20 |   }
21 | 
22 |   async trackings(
23 |     args: Prisma.TrackingFindManyArgs
24 |   ): Promise<PrismaTracking[]> {
25 |     return this.prisma.tracking.findMany(args);
26 |   }
27 |   async tracking(
28 |     args: Prisma.TrackingFindUniqueArgs
29 |   ): Promise<PrismaTracking | null> {
30 |     return this.prisma.tracking.findUnique(args);
31 |   }
32 |   async createTracking(
33 |     args: Prisma.TrackingCreateArgs
34 |   ): Promise<PrismaTracking> {
35 |     return this.prisma.tracking.create(args);
36 |   }
37 |   async updateTracking(
38 |     args: Prisma.TrackingUpdateArgs
39 |   ): Promise<PrismaTracking> {
40 |     return this.prisma.tracking.update(args);
41 |   }
42 |   async deleteTracking(
43 |     args: Prisma.TrackingDeleteArgs
44 |   ): Promise<PrismaTracking> {
45 |     return this.prisma.tracking.delete(args);
46 |   }
47 | }
48 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/tracking.controller.ts:
--------------------------------------------------------------------------------
 1 | import * as common from "@nestjs/common";
 2 | import * as swagger from "@nestjs/swagger";
 3 | import { TrackingService } from "./tracking.service";
 4 | import { TrackingControllerBase } from "./base/tracking.controller.base";
 5 | 
 6 | @swagger.ApiTags("trackings")
 7 | @common.Controller("trackings")
 8 | export class TrackingController extends TrackingControllerBase {
 9 |   constructor(protected readonly service: TrackingService) {
10 |     super(service);
11 |   }
12 | }
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/tracking.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { TrackingModuleBase } from "./base/tracking.module.base";
 3 | import { TrackingService } from "./tracking.service";
 4 | import { TrackingController } from "./tracking.controller";
 5 | import { TrackingResolver } from "./tracking.resolver";
 6 | 
 7 | @Module({
 8 |   imports: [TrackingModuleBase],
 9 |   controllers: [TrackingController],
10 |   providers: [TrackingService, TrackingResolver],
11 |   exports: [TrackingService],
12 | })
13 | export class TrackingModule {}
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/tracking.resolver.ts:
--------------------------------------------------------------------------------
 1 | import * as graphql from "@nestjs/graphql";
 2 | import { TrackingResolverBase } from "./base/tracking.resolver.base";
 3 | import { Tracking } from "./base/Tracking";
 4 | import { TrackingService } from "./tracking.service";
 5 | 
 6 | @graphql.Resolver(() => Tracking)
 7 | export class TrackingResolver extends TrackingResolverBase {
 8 |   constructor(protected readonly service: TrackingService) {
 9 |     super(service);
10 |   }
11 | }
12 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/tracking/tracking.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { PrismaService } from "../prisma/prisma.service";
 3 | import { TrackingServiceBase } from "./base/tracking.service.base";
 4 | 
 5 | @Injectable()
 6 | export class TrackingService extends TrackingServiceBase {
 7 |   constructor(protected readonly prisma: PrismaService) {
 8 |     super(prisma);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/trackingModule/TrackDeliveryResponse.ts:
--------------------------------------------------------------------------------
 1 | import { ObjectType, Field } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { Type } from "class-transformer";
 4 | 
 5 | @ObjectType("TrackDeliveryResponseObject")
 6 | class TrackDeliveryResponse {
 7 |     @Field(() => String)
 8 |     @ApiProperty({
 9 |         required: true,
10 |         type: () => String
11 |     })
12 |     @Type(() => String)
13 |     status!: string;
14 | 
15 |     @Field(() => String)
16 |     @ApiProperty({
17 |         required: true,
18 |         type: () => String
19 |     })
20 |     @Type(() => String)
21 |     phoneNumber!: string;
22 | }
23 | 
24 | export { TrackDeliveryResponse as TrackDeliveryResponse };


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/types.ts:
--------------------------------------------------------------------------------
1 | import type { JsonValue } from "type-fest";
2 | 
3 | export type InputJsonValue = Omit<JsonValue, "null">;
4 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/CreateUserArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserCreateInput } from "./UserCreateInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class CreateUserArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => UserCreateInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => UserCreateInput)
26 |   @Field(() => UserCreateInput, { nullable: false })
27 |   data!: UserCreateInput;
28 | }
29 | 
30 | export { CreateUserArgs as CreateUserArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/DeleteUserArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class DeleteUserArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => UserWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => UserWhereUniqueInput)
26 |   @Field(() => UserWhereUniqueInput, { nullable: false })
27 |   where!: UserWhereUniqueInput;
28 | }
29 | 
30 | export { DeleteUserArgs as DeleteUserArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UpdateUserArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { UserUpdateInput } from "./UserUpdateInput";
18 | 
19 | @ArgsType()
20 | class UpdateUserArgs {
21 |   @ApiProperty({
22 |     required: true,
23 |     type: () => UserWhereUniqueInput,
24 |   })
25 |   @ValidateNested()
26 |   @Type(() => UserWhereUniqueInput)
27 |   @Field(() => UserWhereUniqueInput, { nullable: false })
28 |   where!: UserWhereUniqueInput;
29 | 
30 |   @ApiProperty({
31 |     required: true,
32 |     type: () => UserUpdateInput,
33 |   })
34 |   @ValidateNested()
35 |   @Type(() => UserUpdateInput)
36 |   @Field(() => UserUpdateInput, { nullable: false })
37 |   data!: UserUpdateInput;
38 | }
39 | 
40 | export { UpdateUserArgs as UpdateUserArgs };
41 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/User.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ObjectType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsDate, IsString, IsOptional } from "class-validator";
15 | import { Type } from "class-transformer";
16 | import { IsJSONValue } from "../../validators";
17 | import { GraphQLJSON } from "graphql-type-json";
18 | import { JsonValue } from "type-fest";
19 | 
20 | @ObjectType()
21 | class User {
22 |   @ApiProperty({
23 |     required: true,
24 |   })
25 |   @IsDate()
26 |   @Type(() => Date)
27 |   @Field(() => Date)
28 |   createdAt!: Date;
29 | 
30 |   @ApiProperty({
31 |     required: false,
32 |     type: String,
33 |   })
34 |   @IsString()
35 |   @IsOptional()
36 |   @Field(() => String, {
37 |     nullable: true,
38 |   })
39 |   email!: string | null;
40 | 
41 |   @ApiProperty({
42 |     required: false,
43 |     type: String,
44 |   })
45 |   @IsString()
46 |   @IsOptional()
47 |   @Field(() => String, {
48 |     nullable: true,
49 |   })
50 |   firstName!: string | null;
51 | 
52 |   @ApiProperty({
53 |     required: true,
54 |     type: String,
55 |   })
56 |   @IsString()
57 |   @Field(() => String)
58 |   id!: string;
59 | 
60 |   @ApiProperty({
61 |     required: false,
62 |     type: String,
63 |   })
64 |   @IsString()
65 |   @IsOptional()
66 |   @Field(() => String, {
67 |     nullable: true,
68 |   })
69 |   lastName!: string | null;
70 | 
71 |   @ApiProperty({
72 |     required: true,
73 |   })
74 |   @IsJSONValue()
75 |   @Field(() => GraphQLJSON)
76 |   roles!: JsonValue;
77 | 
78 |   @ApiProperty({
79 |     required: true,
80 |   })
81 |   @IsDate()
82 |   @Type(() => Date)
83 |   @Field(() => Date)
84 |   updatedAt!: Date;
85 | 
86 |   @ApiProperty({
87 |     required: true,
88 |     type: String,
89 |   })
90 |   @IsString()
91 |   @Field(() => String)
92 |   username!: string;
93 | }
94 | 
95 | export { User as User };
96 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserCountArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserWhereInput } from "./UserWhereInput";
15 | import { Type } from "class-transformer";
16 | 
17 | @ArgsType()
18 | class UserCountArgs {
19 |   @ApiProperty({
20 |     required: false,
21 |     type: () => UserWhereInput,
22 |   })
23 |   @Field(() => UserWhereInput, { nullable: true })
24 |   @Type(() => UserWhereInput)
25 |   where?: UserWhereInput;
26 | }
27 | 
28 | export { UserCountArgs as UserCountArgs };
29 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserCreateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | import { IsJSONValue } from "../../validators";
16 | import { GraphQLJSON } from "graphql-type-json";
17 | import { InputJsonValue } from "../../types";
18 | 
19 | @InputType()
20 | class UserCreateInput {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: String,
24 |   })
25 |   @IsString()
26 |   @IsOptional()
27 |   @Field(() => String, {
28 |     nullable: true,
29 |   })
30 |   email?: string | null;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: String,
35 |   })
36 |   @IsString()
37 |   @IsOptional()
38 |   @Field(() => String, {
39 |     nullable: true,
40 |   })
41 |   firstName?: string | null;
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: String,
46 |   })
47 |   @IsString()
48 |   @IsOptional()
49 |   @Field(() => String, {
50 |     nullable: true,
51 |   })
52 |   lastName?: string | null;
53 | 
54 |   @ApiProperty({
55 |     required: true,
56 |     type: String,
57 |   })
58 |   @IsString()
59 |   @Field(() => String)
60 |   password!: string;
61 | 
62 |   @ApiProperty({
63 |     required: true,
64 |   })
65 |   @IsJSONValue()
66 |   @Field(() => GraphQLJSON)
67 |   roles!: InputJsonValue;
68 | 
69 |   @ApiProperty({
70 |     required: true,
71 |     type: String,
72 |   })
73 |   @IsString()
74 |   @Field(() => String)
75 |   username!: string;
76 | }
77 | 
78 | export { UserCreateInput as UserCreateInput };
79 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserFindManyArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserWhereInput } from "./UserWhereInput";
15 | import { IsOptional, ValidateNested, IsInt } from "class-validator";
16 | import { Type } from "class-transformer";
17 | import { UserOrderByInput } from "./UserOrderByInput";
18 | 
19 | @ArgsType()
20 | class UserFindManyArgs {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: () => UserWhereInput,
24 |   })
25 |   @IsOptional()
26 |   @ValidateNested()
27 |   @Field(() => UserWhereInput, { nullable: true })
28 |   @Type(() => UserWhereInput)
29 |   where?: UserWhereInput;
30 | 
31 |   @ApiProperty({
32 |     required: false,
33 |     type: [UserOrderByInput],
34 |   })
35 |   @IsOptional()
36 |   @ValidateNested({ each: true })
37 |   @Field(() => [UserOrderByInput], { nullable: true })
38 |   @Type(() => UserOrderByInput)
39 |   orderBy?: Array<UserOrderByInput>;
40 | 
41 |   @ApiProperty({
42 |     required: false,
43 |     type: Number,
44 |   })
45 |   @IsOptional()
46 |   @IsInt()
47 |   @Field(() => Number, { nullable: true })
48 |   @Type(() => Number)
49 |   skip?: number;
50 | 
51 |   @ApiProperty({
52 |     required: false,
53 |     type: Number,
54 |   })
55 |   @IsOptional()
56 |   @IsInt()
57 |   @Field(() => Number, { nullable: true })
58 |   @Type(() => Number)
59 |   take?: number;
60 | }
61 | 
62 | export { UserFindManyArgs as UserFindManyArgs };
63 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserFindUniqueArgs.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { ArgsType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserWhereUniqueInput } from "./UserWhereUniqueInput";
15 | import { ValidateNested } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @ArgsType()
19 | class UserFindUniqueArgs {
20 |   @ApiProperty({
21 |     required: true,
22 |     type: () => UserWhereUniqueInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => UserWhereUniqueInput)
26 |   @Field(() => UserWhereUniqueInput, { nullable: false })
27 |   where!: UserWhereUniqueInput;
28 | }
29 | 
30 | export { UserFindUniqueArgs as UserFindUniqueArgs };
31 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserListRelationFilter.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { UserWhereInput } from "./UserWhereInput";
15 | import { ValidateNested, IsOptional } from "class-validator";
16 | import { Type } from "class-transformer";
17 | 
18 | @InputType()
19 | class UserListRelationFilter {
20 |   @ApiProperty({
21 |     required: false,
22 |     type: () => UserWhereInput,
23 |   })
24 |   @ValidateNested()
25 |   @Type(() => UserWhereInput)
26 |   @IsOptional()
27 |   @Field(() => UserWhereInput, {
28 |     nullable: true,
29 |   })
30 |   every?: UserWhereInput;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: () => UserWhereInput,
35 |   })
36 |   @ValidateNested()
37 |   @Type(() => UserWhereInput)
38 |   @IsOptional()
39 |   @Field(() => UserWhereInput, {
40 |     nullable: true,
41 |   })
42 |   some?: UserWhereInput;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: () => UserWhereInput,
47 |   })
48 |   @ValidateNested()
49 |   @Type(() => UserWhereInput)
50 |   @IsOptional()
51 |   @Field(() => UserWhereInput, {
52 |     nullable: true,
53 |   })
54 |   none?: UserWhereInput;
55 | }
56 | export { UserListRelationFilter as UserListRelationFilter };
57 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserUpdateInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString, IsOptional } from "class-validator";
15 | import { IsJSONValue } from "../../validators";
16 | import { GraphQLJSON } from "graphql-type-json";
17 | import { InputJsonValue } from "../../types";
18 | 
19 | @InputType()
20 | class UserUpdateInput {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: String,
24 |   })
25 |   @IsString()
26 |   @IsOptional()
27 |   @Field(() => String, {
28 |     nullable: true,
29 |   })
30 |   email?: string | null;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: String,
35 |   })
36 |   @IsString()
37 |   @IsOptional()
38 |   @Field(() => String, {
39 |     nullable: true,
40 |   })
41 |   firstName?: string | null;
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: String,
46 |   })
47 |   @IsString()
48 |   @IsOptional()
49 |   @Field(() => String, {
50 |     nullable: true,
51 |   })
52 |   lastName?: string | null;
53 | 
54 |   @ApiProperty({
55 |     required: false,
56 |     type: String,
57 |   })
58 |   @IsString()
59 |   @IsOptional()
60 |   @Field(() => String, {
61 |     nullable: true,
62 |   })
63 |   password?: string;
64 | 
65 |   @ApiProperty({
66 |     required: false,
67 |   })
68 |   @IsJSONValue()
69 |   @IsOptional()
70 |   @Field(() => GraphQLJSON, {
71 |     nullable: true,
72 |   })
73 |   roles?: InputJsonValue;
74 | 
75 |   @ApiProperty({
76 |     required: false,
77 |     type: String,
78 |   })
79 |   @IsString()
80 |   @IsOptional()
81 |   @Field(() => String, {
82 |     nullable: true,
83 |   })
84 |   username?: string;
85 | }
86 | 
87 | export { UserUpdateInput as UserUpdateInput };
88 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserWhereInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { StringNullableFilter } from "../../util/StringNullableFilter";
15 | import { Type } from "class-transformer";
16 | import { IsOptional } from "class-validator";
17 | import { StringFilter } from "../../util/StringFilter";
18 | 
19 | @InputType()
20 | class UserWhereInput {
21 |   @ApiProperty({
22 |     required: false,
23 |     type: StringNullableFilter,
24 |   })
25 |   @Type(() => StringNullableFilter)
26 |   @IsOptional()
27 |   @Field(() => StringNullableFilter, {
28 |     nullable: true,
29 |   })
30 |   email?: StringNullableFilter;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: StringNullableFilter,
35 |   })
36 |   @Type(() => StringNullableFilter)
37 |   @IsOptional()
38 |   @Field(() => StringNullableFilter, {
39 |     nullable: true,
40 |   })
41 |   firstName?: StringNullableFilter;
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: StringFilter,
46 |   })
47 |   @Type(() => StringFilter)
48 |   @IsOptional()
49 |   @Field(() => StringFilter, {
50 |     nullable: true,
51 |   })
52 |   id?: StringFilter;
53 | 
54 |   @ApiProperty({
55 |     required: false,
56 |     type: StringNullableFilter,
57 |   })
58 |   @Type(() => StringNullableFilter)
59 |   @IsOptional()
60 |   @Field(() => StringNullableFilter, {
61 |     nullable: true,
62 |   })
63 |   lastName?: StringNullableFilter;
64 | 
65 |   @ApiProperty({
66 |     required: false,
67 |     type: StringFilter,
68 |   })
69 |   @Type(() => StringFilter)
70 |   @IsOptional()
71 |   @Field(() => StringFilter, {
72 |     nullable: true,
73 |   })
74 |   username?: StringFilter;
75 | }
76 | 
77 | export { UserWhereInput as UserWhereInput };
78 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/UserWhereUniqueInput.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { InputType, Field } from "@nestjs/graphql";
13 | import { ApiProperty } from "@nestjs/swagger";
14 | import { IsString } from "class-validator";
15 | 
16 | @InputType()
17 | class UserWhereUniqueInput {
18 |   @ApiProperty({
19 |     required: true,
20 |     type: String,
21 |   })
22 |   @IsString()
23 |   @Field(() => String)
24 |   id!: string;
25 | }
26 | 
27 | export { UserWhereUniqueInput as UserWhereUniqueInput };
28 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/user.module.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { Module } from "@nestjs/common";
13 | 
14 | @Module({
15 |   imports: [],
16 |   exports: [],
17 | })
18 | export class UserModuleBase {}
19 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/base/user.service.base.ts:
--------------------------------------------------------------------------------
 1 | /*
 2 | ------------------------------------------------------------------------------ 
 3 | This code was generated by Amplication. 
 4 |  
 5 | Changes to this file will be lost if the code is regenerated. 
 6 | 
 7 | There are other ways to to customize your code, see this doc to learn more
 8 | https://docs.amplication.com/how-to/custom-code
 9 | 
10 | ------------------------------------------------------------------------------
11 |   */
12 | import { PrismaService } from "../../prisma/prisma.service";
13 | import { Prisma, User as PrismaUser } from "@prisma/client";
14 | 
15 | export class UserServiceBase {
16 |   constructor(protected readonly prisma: PrismaService) {}
17 | 
18 |   async count(args: Omit<Prisma.UserCountArgs, "select">): Promise<number> {
19 |     return this.prisma.user.count(args);
20 |   }
21 | 
22 |   async users(args: Prisma.UserFindManyArgs): Promise<PrismaUser[]> {
23 |     return this.prisma.user.findMany(args);
24 |   }
25 |   async user(args: Prisma.UserFindUniqueArgs): Promise<PrismaUser | null> {
26 |     return this.prisma.user.findUnique(args);
27 |   }
28 |   async createUser(args: Prisma.UserCreateArgs): Promise<PrismaUser> {
29 |     return this.prisma.user.create(args);
30 |   }
31 |   async updateUser(args: Prisma.UserUpdateArgs): Promise<PrismaUser> {
32 |     return this.prisma.user.update(args);
33 |   }
34 |   async deleteUser(args: Prisma.UserDeleteArgs): Promise<PrismaUser> {
35 |     return this.prisma.user.delete(args);
36 |   }
37 | }
38 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/user.controller.ts:
--------------------------------------------------------------------------------
 1 | import * as common from "@nestjs/common";
 2 | import * as swagger from "@nestjs/swagger";
 3 | import { UserService } from "./user.service";
 4 | import { UserControllerBase } from "./base/user.controller.base";
 5 | 
 6 | @swagger.ApiTags("users")
 7 | @common.Controller("users")
 8 | export class UserController extends UserControllerBase {
 9 |   constructor(protected readonly service: UserService) {
10 |     super(service);
11 |   }
12 | }
13 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/user.module.ts:
--------------------------------------------------------------------------------
 1 | import { Module } from "@nestjs/common";
 2 | import { UserModuleBase } from "./base/user.module.base";
 3 | import { UserService } from "./user.service";
 4 | import { UserController } from "./user.controller";
 5 | import { UserResolver } from "./user.resolver";
 6 | 
 7 | @Module({
 8 |   imports: [UserModuleBase],
 9 |   controllers: [UserController],
10 |   providers: [UserService, UserResolver],
11 |   exports: [UserService],
12 | })
13 | export class UserModule {}
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/user.resolver.ts:
--------------------------------------------------------------------------------
 1 | import * as graphql from "@nestjs/graphql";
 2 | import { UserResolverBase } from "./base/user.resolver.base";
 3 | import { User } from "./base/User";
 4 | import { UserService } from "./user.service";
 5 | 
 6 | @graphql.Resolver(() => User)
 7 | export class UserResolver extends UserResolverBase {
 8 |   constructor(protected readonly service: UserService) {
 9 |     super(service);
10 |   }
11 | }
12 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/user/user.service.ts:
--------------------------------------------------------------------------------
 1 | import { Injectable } from "@nestjs/common";
 2 | import { PrismaService } from "../prisma/prisma.service";
 3 | import { UserServiceBase } from "./base/user.service.base";
 4 | 
 5 | @Injectable()
 6 | export class UserService extends UserServiceBase {
 7 |   constructor(protected readonly prisma: PrismaService) {
 8 |     super(prisma);
 9 |   }
10 | }
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/BooleanFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | 
 6 | @InputType({
 7 |   isAbstract: true,
 8 |   description: undefined,
 9 | })
10 | export class BooleanFilter {
11 |   @ApiProperty({
12 |     required: false,
13 |     type: Boolean,
14 |   })
15 |   @IsOptional()
16 |   @Field(() => Boolean, {
17 |     nullable: true,
18 |   })
19 |   @Type(() => Boolean)
20 |   equals?: boolean;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: Boolean,
25 |   })
26 |   @IsOptional()
27 |   @Field(() => Boolean, {
28 |     nullable: true,
29 |   })
30 |   @Type(() => Boolean)
31 |   not?: boolean;
32 | }
33 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/BooleanNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | @InputType({
 6 |   isAbstract: true,
 7 |   description: undefined,
 8 | })
 9 | export class BooleanNullableFilter {
10 |   @ApiProperty({
11 |     required: false,
12 |     type: Boolean,
13 |   })
14 |   @IsOptional()
15 |   @Field(() => Boolean, {
16 |     nullable: true,
17 |   })
18 |   @Type(() => Boolean)
19 |   equals?: boolean | null;
20 | 
21 |   @ApiProperty({
22 |     required: false,
23 |     type: Boolean,
24 |   })
25 |   @IsOptional()
26 |   @Field(() => Boolean, {
27 |     nullable: true,
28 |   })
29 |   @Type(() => Boolean)
30 |   not?: boolean | null;
31 | }
32 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/DateTimeFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | @InputType({
 6 |   isAbstract: true,
 7 |   description: undefined,
 8 | })
 9 | export class DateTimeFilter {
10 |   @ApiProperty({
11 |     required: false,
12 |     type: Date,
13 |   })
14 |   @IsOptional()
15 |   @Field(() => Date, {
16 |     nullable: true,
17 |   })
18 |   @Type(() => Date)
19 |   equals?: Date;
20 | 
21 |   @ApiProperty({
22 |     required: false,
23 |     type: Date,
24 |   })
25 |   @IsOptional()
26 |   @Field(() => Date, {
27 |     nullable: true,
28 |   })
29 |   @Type(() => Date)
30 |   not?: Date;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: [Date],
35 |   })
36 |   @IsOptional()
37 |   @Field(() => [Date], {
38 |     nullable: true,
39 |   })
40 |   @Type(() => Date)
41 |   in?: Date[];
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: [Date],
46 |   })
47 |   @IsOptional()
48 |   @Field(() => [Date], {
49 |     nullable: true,
50 |   })
51 |   @Type(() => Date)
52 |   notIn?: Date[];
53 | 
54 |   @ApiProperty({
55 |     required: false,
56 |     type: Date,
57 |   })
58 |   @IsOptional()
59 |   @Field(() => Date, {
60 |     nullable: true,
61 |   })
62 |   @Type(() => Date)
63 |   lt?: Date;
64 | 
65 |   @ApiProperty({
66 |     required: false,
67 |     type: Date,
68 |   })
69 |   @IsOptional()
70 |   @Field(() => Date, {
71 |     nullable: true,
72 |   })
73 |   @Type(() => Date)
74 |   lte?: Date;
75 | 
76 |   @ApiProperty({
77 |     required: false,
78 |     type: Date,
79 |   })
80 |   @IsOptional()
81 |   @Field(() => Date, {
82 |     nullable: true,
83 |   })
84 |   @Type(() => Date)
85 |   gt?: Date;
86 | 
87 |   @ApiProperty({
88 |     required: false,
89 |     type: Date,
90 |   })
91 |   @IsOptional()
92 |   @Field(() => Date, {
93 |     nullable: true,
94 |   })
95 |   @Type(() => Date)
96 |   gte?: Date;
97 | }
98 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/DateTimeNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | @InputType({
 6 |   isAbstract: true,
 7 |   description: undefined,
 8 | })
 9 | export class DateTimeNullableFilter {
10 |   @ApiProperty({
11 |     required: false,
12 |     type: Date,
13 |   })
14 |   @IsOptional()
15 |   @Field(() => Date, {
16 |     nullable: true,
17 |   })
18 |   @Type(() => Date)
19 |   equals?: Date | null;
20 | 
21 |   @ApiProperty({
22 |     required: false,
23 |     type: [Date],
24 |   })
25 |   @IsOptional()
26 |   @Field(() => [Date], {
27 |     nullable: true,
28 |   })
29 |   @Type(() => Date)
30 |   in?: Date[] | null;
31 | 
32 |   @ApiProperty({
33 |     required: false,
34 |     type: [Date],
35 |   })
36 |   @IsOptional()
37 |   @Field(() => [Date], {
38 |     nullable: true,
39 |   })
40 |   @Type(() => Date)
41 |   notIn?: Date[] | null;
42 | 
43 |   @ApiProperty({
44 |     required: false,
45 |     type: Date,
46 |   })
47 |   @IsOptional()
48 |   @Field(() => Date, {
49 |     nullable: true,
50 |   })
51 |   @Type(() => Date)
52 |   lt?: Date;
53 | 
54 |   @ApiProperty({
55 |     required: false,
56 |     type: Date,
57 |   })
58 |   @IsOptional()
59 |   @Field(() => Date, {
60 |     nullable: true,
61 |   })
62 |   @Type(() => Date)
63 |   lte?: Date;
64 | 
65 |   @ApiProperty({
66 |     required: false,
67 |     type: Date,
68 |   })
69 |   @IsOptional()
70 |   @Field(() => Date, {
71 |     nullable: true,
72 |   })
73 |   @Type(() => Date)
74 |   gt?: Date;
75 | 
76 |   @ApiProperty({
77 |     required: false,
78 |     type: Date,
79 |   })
80 |   @IsOptional()
81 |   @Field(() => Date, {
82 |     nullable: true,
83 |   })
84 |   @Type(() => Date)
85 |   gte?: Date;
86 | 
87 |   @ApiProperty({
88 |     required: false,
89 |     type: Date,
90 |   })
91 |   @IsOptional()
92 |   @Field(() => Date, {
93 |     nullable: true,
94 |   })
95 |   @Type(() => Date)
96 |   not?: Date;
97 | }
98 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/FloatFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType, Float } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | 
 6 | @InputType({
 7 |   isAbstract: true,
 8 |   description: undefined,
 9 | })
10 | export class FloatFilter {
11 |   @ApiProperty({
12 |     required: false,
13 |     type: Number,
14 |   })
15 |   @IsOptional()
16 |   @Field(() => Float, {
17 |     nullable: true,
18 |   })
19 |   @Type(() => Number)
20 |   equals?: number;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: Number,
25 |   })
26 |   @IsOptional()
27 |   @Field(() => [Float], {
28 |     nullable: true,
29 |   })
30 |   @Type(() => Number)
31 |   in?: number[];
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     type: [Number],
36 |   })
37 |   @IsOptional()
38 |   @Field(() => [Float], {
39 |     nullable: true,
40 |   })
41 |   @Type(() => Number)
42 |   notIn?: number[];
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: Number,
47 |   })
48 |   @IsOptional()
49 |   @Field(() => Float, {
50 |     nullable: true,
51 |   })
52 |   @Type(() => Number)
53 |   lt?: number;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     type: Number,
58 |   })
59 |   @IsOptional()
60 |   @Field(() => Float, {
61 |     nullable: true,
62 |   })
63 |   @Type(() => Number)
64 |   lte?: number;
65 | 
66 |   @ApiProperty({
67 |     required: false,
68 |     type: Number,
69 |   })
70 |   @IsOptional()
71 |   @Field(() => Float, {
72 |     nullable: true,
73 |   })
74 |   @Type(() => Number)
75 |   gt?: number;
76 | 
77 |   @ApiProperty({
78 |     required: false,
79 |     type: Number,
80 |   })
81 |   @IsOptional()
82 |   @Field(() => Float, {
83 |     nullable: true,
84 |   })
85 |   @Type(() => Number)
86 |   gte?: number;
87 | 
88 |   @ApiProperty({
89 |     required: false,
90 |     type: Number,
91 |   })
92 |   @IsOptional()
93 |   @Field(() => Float, {
94 |     nullable: true,
95 |   })
96 |   @Type(() => Number)
97 |   not?: number;
98 | }
99 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/FloatNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType, Float } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | 
 6 | @InputType({
 7 |   isAbstract: true,
 8 |   description: undefined,
 9 | })
10 | export class FloatNullableFilter {
11 |   @ApiProperty({
12 |     required: false,
13 |     type: Number,
14 |   })
15 |   @IsOptional()
16 |   @Field(() => Float, {
17 |     nullable: true,
18 |   })
19 |   @Type(() => Number)
20 |   equals?: number | null;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: [Number],
25 |   })
26 |   @IsOptional()
27 |   @Field(() => [Float], {
28 |     nullable: true,
29 |   })
30 |   @Type(() => Number)
31 |   in?: number[] | null;
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     type: [Number],
36 |   })
37 |   @IsOptional()
38 |   @Field(() => [Float], {
39 |     nullable: true,
40 |   })
41 |   @Type(() => Number)
42 |   notIn?: number[] | null;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: Number,
47 |   })
48 |   @IsOptional()
49 |   @Field(() => Float, {
50 |     nullable: true,
51 |   })
52 |   @Type(() => Number)
53 |   lt?: number;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     type: Number,
58 |   })
59 |   @IsOptional()
60 |   @Field(() => Float, {
61 |     nullable: true,
62 |   })
63 |   @Type(() => Number)
64 |   lte?: number;
65 | 
66 |   @ApiProperty({
67 |     required: false,
68 |     type: Number,
69 |   })
70 |   @IsOptional()
71 |   @Field(() => Float, {
72 |     nullable: true,
73 |   })
74 |   @Type(() => Number)
75 |   gt?: number;
76 | 
77 |   @ApiProperty({
78 |     required: false,
79 |     type: Number,
80 |   })
81 |   @IsOptional()
82 |   @Field(() => Float, {
83 |     nullable: true,
84 |   })
85 |   @Type(() => Number)
86 |   gte?: number;
87 | 
88 |   @ApiProperty({
89 |     required: false,
90 |     type: Number,
91 |   })
92 |   @IsOptional()
93 |   @Field(() => Float, {
94 |     nullable: true,
95 |   })
96 |   @Type(() => Number)
97 |   not?: number;
98 | }
99 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/IntFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType, Int } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | 
 6 | @InputType({
 7 |   isAbstract: true,
 8 |   description: undefined,
 9 | })
10 | export class IntFilter {
11 |   @ApiProperty({
12 |     required: false,
13 |     type: Number,
14 |   })
15 |   @IsOptional()
16 |   @Field(() => Int, {
17 |     nullable: true,
18 |   })
19 |   @Type(() => Number)
20 |   equals?: number;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: [Number],
25 |   })
26 |   @IsOptional()
27 |   @Field(() => [Int], {
28 |     nullable: true,
29 |   })
30 |   @Type(() => Number)
31 |   in?: number[];
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     type: [Number],
36 |   })
37 |   @IsOptional()
38 |   @Field(() => [Int], {
39 |     nullable: true,
40 |   })
41 |   @Type(() => Number)
42 |   notIn?: number[];
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: Number,
47 |   })
48 |   @IsOptional()
49 |   @Field(() => Int, {
50 |     nullable: true,
51 |   })
52 |   @Type(() => Number)
53 |   lt?: number;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     type: Number,
58 |   })
59 |   @IsOptional()
60 |   @Field(() => Int, {
61 |     nullable: true,
62 |   })
63 |   @Type(() => Number)
64 |   lte?: number;
65 | 
66 |   @ApiProperty({
67 |     required: false,
68 |     type: Number,
69 |   })
70 |   @IsOptional()
71 |   @Field(() => Int, {
72 |     nullable: true,
73 |   })
74 |   @Type(() => Number)
75 |   gt?: number;
76 | 
77 |   @ApiProperty({
78 |     required: false,
79 |     type: Number,
80 |   })
81 |   @IsOptional()
82 |   @Field(() => Int, {
83 |     nullable: true,
84 |   })
85 |   @Type(() => Number)
86 |   gte?: number;
87 | 
88 |   @ApiProperty({
89 |     required: false,
90 |     type: Number,
91 |   })
92 |   @IsOptional()
93 |   @Field(() => Int, {
94 |     nullable: true,
95 |   })
96 |   @Type(() => Number)
97 |   not?: number;
98 | }
99 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/IntNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType, Int } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { Type } from "class-transformer";
 5 | 
 6 | @InputType({
 7 |   isAbstract: true,
 8 |   description: undefined,
 9 | })
10 | export class IntNullableFilter {
11 |   @ApiProperty({
12 |     required: false,
13 |     type: Number,
14 |   })
15 |   @IsOptional()
16 |   @Field(() => Int, {
17 |     nullable: true,
18 |   })
19 |   @Type(() => Number)
20 |   equals?: number | null;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: [Number],
25 |   })
26 |   @IsOptional()
27 |   @Field(() => [Int], {
28 |     nullable: true,
29 |   })
30 |   @Type(() => Number)
31 |   in?: number[] | null;
32 | 
33 |   @ApiProperty({
34 |     required: false,
35 |     type: [Number],
36 |   })
37 |   @IsOptional()
38 |   @Field(() => [Int], {
39 |     nullable: true,
40 |   })
41 |   @Type(() => Number)
42 |   notIn?: number[] | null;
43 | 
44 |   @ApiProperty({
45 |     required: false,
46 |     type: Number,
47 |   })
48 |   @IsOptional()
49 |   @Field(() => Int, {
50 |     nullable: true,
51 |   })
52 |   @Type(() => Number)
53 |   lt?: number;
54 | 
55 |   @ApiProperty({
56 |     required: false,
57 |     type: Number,
58 |   })
59 |   @IsOptional()
60 |   @Field(() => Int, {
61 |     nullable: true,
62 |   })
63 |   @Type(() => Number)
64 |   lte?: number;
65 | 
66 |   @ApiProperty({
67 |     required: false,
68 |     type: Number,
69 |   })
70 |   @IsOptional()
71 |   @Field(() => Int, {
72 |     nullable: true,
73 |   })
74 |   @Type(() => Number)
75 |   gt?: number;
76 | 
77 |   @ApiProperty({
78 |     required: false,
79 |     type: Number,
80 |   })
81 |   @IsOptional()
82 |   @Field(() => Int, {
83 |     nullable: true,
84 |   })
85 |   @Type(() => Number)
86 |   gte?: number;
87 | 
88 |   @ApiProperty({
89 |     required: false,
90 |     type: Number,
91 |   })
92 |   @IsOptional()
93 |   @Field(() => Int, {
94 |     nullable: true,
95 |   })
96 |   @Type(() => Number)
97 |   not?: number;
98 | }
99 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/JsonFilter.ts:
--------------------------------------------------------------------------------
 1 | import { Field, InputType } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | import { IsOptional } from "class-validator";
 4 | import { GraphQLJSONObject } from "graphql-type-json";
 5 | import { InputJsonValue } from "../types";
 6 | 
 7 | @InputType({
 8 |   isAbstract: true,
 9 |   description: undefined,
10 | })
11 | export class JsonFilter {
12 |   @ApiProperty({
13 |     required: false,
14 |     type: GraphQLJSONObject,
15 |   })
16 |   @IsOptional()
17 |   @Field(() => GraphQLJSONObject, {
18 |     nullable: true,
19 |   })
20 |   equals?: InputJsonValue;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: GraphQLJSONObject,
25 |   })
26 |   @IsOptional()
27 |   @Field(() => GraphQLJSONObject, {
28 |     nullable: true,
29 |   })
30 |   not?: InputJsonValue;
31 | }
32 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/JsonNullableFilter.ts:
--------------------------------------------------------------------------------
 1 | import type { JsonValue } from "type-fest";
 2 | import { Field, InputType } from "@nestjs/graphql";
 3 | import { ApiProperty } from "@nestjs/swagger";
 4 | import { IsOptional } from "class-validator";
 5 | import { GraphQLJSONObject } from "graphql-type-json";
 6 | 
 7 | @InputType({
 8 |   isAbstract: true,
 9 |   description: undefined,
10 | })
11 | export class JsonNullableFilter {
12 |   @ApiProperty({
13 |     required: false,
14 |     type: GraphQLJSONObject,
15 |   })
16 |   @IsOptional()
17 |   @Field(() => GraphQLJSONObject, {
18 |     nullable: true,
19 |   })
20 |   equals?: JsonValue;
21 | 
22 |   @ApiProperty({
23 |     required: false,
24 |     type: GraphQLJSONObject,
25 |   })
26 |   @IsOptional()
27 |   @Field(() => GraphQLJSONObject, {
28 |     nullable: true,
29 |   })
30 |   not?: JsonValue;
31 | }
32 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/MetaQueryPayload.ts:
--------------------------------------------------------------------------------
 1 | import { ObjectType, Field } from "@nestjs/graphql";
 2 | import { ApiProperty } from "@nestjs/swagger";
 3 | 
 4 | @ObjectType()
 5 | class MetaQueryPayload {
 6 |   @ApiProperty({
 7 |     required: true,
 8 |     type: [Number],
 9 |   })
10 |   @Field(() => Number)
11 |   count!: number;
12 | }
13 | export { MetaQueryPayload };
14 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/QueryMode.ts:
--------------------------------------------------------------------------------
 1 | import { registerEnumType } from "@nestjs/graphql";
 2 | 
 3 | export enum QueryMode {
 4 |   Default = "default",
 5 |   Insensitive = "insensitive",
 6 | }
 7 | registerEnumType(QueryMode, {
 8 |   name: "QueryMode",
 9 |   description: undefined,
10 | });
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/util/SortOrder.ts:
--------------------------------------------------------------------------------
 1 | import { registerEnumType } from "@nestjs/graphql";
 2 | 
 3 | export enum SortOrder {
 4 |   Asc = "asc",
 5 |   Desc = "desc",
 6 | }
 7 | registerEnumType(SortOrder, {
 8 |   name: "SortOrder",
 9 |   description: undefined,
10 | });
11 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/validators/index.ts:
--------------------------------------------------------------------------------
1 | export * from "./is-json-value-validator";
2 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/validators/is-json-value-validator.spec.ts:
--------------------------------------------------------------------------------
 1 | import { validate, ValidationError } from "class-validator";
 2 | import { IsJSONValue } from "./is-json-value-validator";
 3 | 
 4 | class TestClass {
 5 |   @IsJSONValue()
 6 |   jsonProperty: unknown;
 7 | }
 8 | 
 9 | describe("IsJSONValue", () => {
10 |   it("should validate a valid JSON string", async () => {
11 |     const testObj = new TestClass();
12 |     testObj.jsonProperty = '{"name": "John", "age": 30}';
13 |     const errors: ValidationError[] = await validate(testObj);
14 |     expect(errors.length).toBe(0);
15 |   });
16 | 
17 |   it("should not validate an invalid JSON string", async () => {
18 |     const testObj = new TestClass();
19 |     testObj.jsonProperty = '{name: "John", age: 30}';
20 |     const errors: ValidationError[] = await validate(testObj);
21 |     expect(errors.length).toBe(1);
22 |   });
23 | 
24 |   it("should not validate an invalid JSON string", async () => {
25 |     const testObj = new TestClass();
26 |     testObj.jsonProperty = "John";
27 |     const errors: ValidationError[] = await validate(testObj);
28 |     expect(errors.length).toBe(1);
29 |   });
30 | 
31 |   it("should validate a valid JSON object", async () => {
32 |     const testObj = new TestClass();
33 |     testObj.jsonProperty = { name: "John", age: 30 };
34 |     const errors: ValidationError[] = await validate(testObj);
35 |     expect(errors.length).toBe(0);
36 |   });
37 | 
38 |   it("should validate a valid JSON array", async () => {
39 |     const testObj = new TestClass();
40 |     testObj.jsonProperty = ["John", "30"];
41 |     const errors: ValidationError[] = await validate(testObj);
42 |     expect(errors.length).toBe(0);
43 |   });
44 | });
45 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/src/validators/is-json-value-validator.ts:
--------------------------------------------------------------------------------
 1 | import {
 2 |   ValidationArguments,
 3 |   registerDecorator,
 4 |   ValidationOptions,
 5 | } from "class-validator";
 6 | import isJSONValidator from "validator/lib/isJSON";
 7 | 
 8 | export function IsJSONValue(validationOptions?: ValidationOptions) {
 9 |   return function (object: Record<string, any>, propertyName: string) {
10 |     registerDecorator({
11 |       name: "IsJSONValue",
12 |       target: object.constructor,
13 |       propertyName: propertyName,
14 |       options: validationOptions,
15 |       validator: {
16 |         validate(value: any, args: ValidationArguments) {
17 |           if (typeof value === "string") {
18 |             return isJSONValidator(value);
19 |           }
20 | 
21 |           return isJSONValidator(JSON.stringify(value));
22 |         },
23 |         defaultMessage(args: ValidationArguments): string {
24 |           return `${args.property} must be a valid json`;
25 |         },
26 |       },
27 |     });
28 |   };
29 | }
30 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/tsconfig.build.json:
--------------------------------------------------------------------------------
1 | {
2 |   "extends": "./tsconfig.json",
3 |   "exclude": ["node_modules", "prisma", "test", "dist", "**/*spec.ts", "admin"]
4 | }
5 | 


--------------------------------------------------------------------------------
/apps/delivery-tracking-server/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "baseUrl": "./",
 4 |     "module": "commonjs",
 5 |     "declaration": false,
 6 |     "removeComments": true,
 7 |     "emitDecoratorMetadata": true,
 8 |     "experimentalDecorators": true,
 9 |     "target": "es2022",
10 |     "lib": ["es2023"],
11 |     "sourceMap": true,
12 |     "outDir": "./dist",
13 |     "incremental": true,
14 |     "esModuleInterop": true,
15 |     "allowSyntheticDefaultImports": true,
16 |     "resolveJsonModule": true,
17 |     "skipLibCheck": true,
18 |     "strict": true
19 |   },
20 |   "include": ["src"]
21 | }
22 | 


--------------------------------------------------------------------------------
