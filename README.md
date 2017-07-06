# Hi, I'm 🔥🔥Witches' Brew🔥🔥

I'm a party game for bad witches.

You can gather a 2-4 friends and have fun!

## How to play

You can play Witches' Brew on desktop or mobile.
* Go to http://playwitchesbrew.com
* Click 'live deliciously' to establish a new coven.
* Invite your friends to join your coven by sending them the URL link, or just enter their phone number in the invitation form in the waiting room, an invitation link will be sent to your friends via sms.
* Follow the commands given by wizard, Work together to add ingredients to the cauldron by dragging. Finish the potion to cast a spell onto the evil wizard before time runs out!

## Configuration on local machine

Create a GitHub repo and clone it. After you have a repo on your machine:

```sh
npm install

create a secrets file that contains your own firebase auth info (we named ours "witches_brew.env.js")

create a secrets file that contains your own twilio auth info (we named ours "secrets.js")

npm run dev
```

Game will be running on localhost:5000

And then you'll have me! If I change – which I probably will – you can get the most recent
version by doing this again:

```sh
git fetch witchesbrew
git merge witchesbrew/master
```


## My anatomy

`/app` has the React setup. `main.jsx` is the entry point.

`/fire` has the Firebase config.

`/functions` is where your [cloud functions](https://firebase.google.com/preview/functions/write-firebase-functions) live.

`/bin` has scripts. (Right now it has *one* script that creates a useful symlink.)

`/public` has all visual assets

## Conventions

I use `require` and `module.exports` in `.js` files.

I use `import` and `export` in `.jsx` files, unless `require` makes for cleaner code.

I use two spaces, no semi-colons, and generally prefer a less strict version of
[NPM's funny coding style](https://docs.npmjs.com/misc/coding-style). My lint config is
in [eslintrc.js](eslintrc.js).

## Licensing
This software is protected under the standard MIT License.
