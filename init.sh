#!/bin/bash
mongo gabriel --eval 'db.game.drop()'
mongo gabriel --eval 'db.session.drop()'
mongo gabriel --eval 'db.user.drop()'
mongoimport --db gabriel --collection game --jsonArray --file games.json
mongoimport --db gabriel --collection session --jsonArray --file sessions.json
mongoimport --db gabriel --collection user --jsonArray --file users.json