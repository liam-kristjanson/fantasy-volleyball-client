# Fantasy Volleyball
This is a simple web application I am developing to gain experience with the MERN stack. My objective with this project is to create a fantasy sports experience (think fantasy football, basketball, hockey)
for the Canada West Men's Volleyball conference.

## Repository Setup
I am using a Monorepository setup. The frontend consists of a react typescript application bundled with Vite. The backend consists of a Node JS API that handles authentication, user requests, data uploads, and data administration.
The backend seperates business logic and request handling by splitting these responsibilities between Model and Controller modules.

## Authentication
User account information is stored securely using bcrypt to create salted hashes for passwords, protecting user data at rest. The backend is stateless, using JSON Web Tokens to authenticate subsequent requests
after a successful login. These tokens are expired after a fixed interval, and destroyed on logout.

## Completed Features
- Store and provide access to player information including season points totals, individual match scores, positions, teams etc.
- Stateless authentication using bcrypt and JWT
- Ability to "Sign" players to user's roster.
- Creation of a lineup consisting of valid position players.
- Matchups between fantasy teams in the same league each week, with a winner decided.
- Tracking of wins and losses of each fantasy team in each league.

## WIP Features
- Admin panel to upload match data, manage volleyball data, accounts, and leagues
- Automatic creation of matchup schedules for each fantasy league.

## Future Features
- Ability for users to "trade" players with other memebers of the same fantasy league
- Ability for each fantasy league to hold a "draft" where players are initially assigned to individual fantasy teams.
- Creation of fantasy leagues and associated accounts by users.
- More control over league settings for league admins (max players, draft settings etc)
- Expansion to other sports and leagues, including Women's Volleyball, Basketball, Football?
 
