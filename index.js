#!/usr/bin/node

var schedule = require('./data/schedule.json');
var standings = require('./data/standings.json');

var Mustache = require('mustache');

function getGames(teams) {
	games = {};

  	schedule.dailygameschedule.gameentry.forEach(function(entry) {
  		games[entry.id] = {
			away: 		teams[entry.awayTeam.ID].name,
			awayWin:		teams[entry.awayTeam.ID].win,
			awayLoss:	teams[entry.awayTeam.ID].loss,
			home: 		teams[entry.homeTeam.ID].name,
			homeWin:	 	teams[entry.homeTeam.ID].win,
			homeLoss: 	teams[entry.homeTeam.ID].loss,
			loc: 			entry.location
		}
	});

	return games;
}

function getStandings() {
  	teams = {};

	standings.overallteamstandings.teamstandingsentry.forEach(function(entry) {
		teams[entry.team.ID] = {
			city: entry.team.City,
			name: entry.team.Name,
			win:	entry.stats.Wins['#text'],
			loss: entry.stats.Losses['#text']
      };
  	});

  	return teams;
}

var teams = getStandings();
var games = getGames(teams);

for (var k in games) {
	var output = Mustache.render("({{awayWin}}-{{awayLoss}}) {{away}} @ {{home}} ({{homeWin}}-{{homeLoss}})", games[k]);
	console.log(output);
}


