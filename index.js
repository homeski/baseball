#!/usr/bin/node

var schedule = require('./data/schedule.json');
var standings = require('./data/standings.json');

var Mustache = require('mustache');

function getGames(teams) {
	games = {};

  	schedule.dailygameschedule.gameentry.forEach(function(entry) {
  		games[entry.id] = {
			awayID: 		entry.awayTeam.ID,
			homeID: 		entry.homeTeam.ID,
			loc: 			entry.location
		};
	});

	return games;
}

function getStandings() {
  	teams = {};

	standings.overallteamstandings.teamstandingsentry.forEach(function(entry) {
		teams[entry.team.ID] = {
			city: entry.team.City,
			name: entry.team.Name,
			win:	parseInt(entry.stats.Wins['#text']),
			loss: parseInt(entry.stats.Losses['#text']),
			pct:  entry.stats.WinPct['#text'],
			rs:   parseInt(entry.stats.RunsFor['#text']),
			ra:	parseInt(entry.stats.RunsAgainst['#text'])
      };
  	});

  	return teams;
}


// returns true if better team (by wins)
// has also scored more runs on the season
//
// return false otherwise or if teams have same wins
function rateMatchup(team1, team2) {
	var fav = team1.win >= team2.win ? team1 : team2;
	var dog = team1.win >= team2.win ? team2 : team1;

	if (fav.win == dog.win)
		return false;
	
	if (fav.rs > dog.rs)
		return true;

	return false;
}

var teams = getStandings();
var games = getGames(teams);

for (var k in games) {
   var render = {
		away: 	teams[games[k].awayID],
		home: 	teams[games[k].homeID],
		loc:  	games[k].loc
   };
	
	if (rateMatchup(render.away, render.home)) {
		var output = Mustache.render("({{away.win}}-{{away.loss}} {{away.rs}}) {{away.name}} @ {{home.name}} ({{home.win}}-{{home.loss}} {{home.rs}})", render);
		console.log(output);
	}
}


