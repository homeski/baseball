#!/bin/bash

source ./creds.sh

auth_header="Authorization: Basic ${creds}"
date=`date +%Y%m%d`

curl "https://www.mysportsfeeds.com/api/feed/pull/mlb/2017-regular/overall_team_standings.json" -H "${auth_header}" > ./data/standings.json
curl https://www.mysportsfeeds.com/api/feed/pull/mlb/2017-regular/daily_game_schedule.json\?fordate\=${date} -H "${auth_header}" > ./data/schedule.json

