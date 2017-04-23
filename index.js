#!/usr/bin/node

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
});
var moment = require('moment');
var Mustache = require('mustache');

parser.addArgument(
	[ '-a', '--action' ],
	{
		help: 'what to do...',
		required: true,
		choices: ['all', 'rate', 'stats']
	}
);
parser.addArgument(
	[ '-d', '--date' ],
	{
		help: 'single date to parse',
	}
);
var args = parser.parseArgs();

function main() {
	var date = args.date;
	if (!date)
		date = moment().format('YYYYMMDD');

	teams = getTeams(date);
	games = getGames(date, teams);

	switch (args.action) {
		case 'all':
			printGames(teams, games);
			break;
		case 'rate':
			break;
		case 'stats':
		default:
			break;
	}
}

main();

////////////////////
//
// getGames(teams)
// getTeams()
// printGames(teams, games)
// calcStats(teams) 

function getGames(date, teams) {
	games = {};
	
	file = 'schedule_'+ date + '.json';
	schedule = require('./scripts/data/' + file);

  	schedule.dailygameschedule.gameentry.forEach(function(entry) {
  		games[entry.id] = {
			awayID: 	entry.awayTeam.ID,
			homeID: 	entry.homeTeam.ID,
			loc: 		entry.location,
			rating:	rateGame(teams[entry.awayTeam.ID], teams[entry.homeTeam.ID])
		};
	});

	return games;
}

function rateGame(away, home) {
	var rating = {
		favorite:			null,
		underdog:			null,
		runDifference:		0,
		pitcherFriendly: 	0,
		homeTeam: 			0,
		betterDefense:		0
	}

	if (away.wins > home.wins) {
		rating.favorite = away;
		rating.underdog = home;
	} else if (home.wins > away.wins) {
		rating.favorite = home;
		rating.underdog = away;
	} else {
		return null;
	}

	if (rating.favorite.rs > rating.underdog.rs)
		rating.runDifference = (rating.favorite.rs - rating.underdog.rs);

	if (rating.favorite.name === home.name)
		rating.homeTeam = 1;

	if (rating.favorite.ra < rating.underdog.ra)
		rating.betterDefense = (rating.favorite.ra - rating.underdog.ra); 

	return rating;
}

function getTeams(date) {
  	teams = {};
	
	file = 'standings_'+ date + '.json';
	standings = require('./scripts/data/' + file);

	standings.overallteamstandings.teamstandingsentry.forEach(function(entry) {
		teams[entry.team.ID] = {
			city: entry.team.City,
			name: entry.team.Name,
			wins:	parseInt(entry.stats.Wins['#text']),
			loss: parseInt(entry.stats.Losses['#text']),
			pct:  entry.stats.WinPct['#text'],
			rs:   parseInt(entry.stats.RunsFor['#text']),
			ra:	parseInt(entry.stats.RunsAgainst['#text'])
      };
  	});

  	return teams;
}

function printGames(teams, games) {
	for (var k in games) {
   	var render = {
			away: 	teams[games[k].awayID],
			home: 	teams[games[k].homeID],
			loc:  	games[k].loc
   	};

		var output = Mustache.render("({{away.wins}}-{{away.loss}} {{away.rs}}) {{away.name}} @ {{home.name}} ({{home.wins}}-{{home.loss}} {{home.rs}})", render);
		console.log(output);
		console.log(games[k].rating);
	}
}

function calcStats(teams) {
	var stats = {};
	var avgRuns, i, sum;
	
	rsSum = 0;
	raSum = 0;
	i = Object.keys(teams).length;
	
	for (var k in teams) {
		rsSum += teams[k].rs;
		raSum += teams[k].ra;
	}

	stats = {
		avgRunsScored:		parseInt(rsSum / i),
		avgRunsAgainst:	parseInt(raSum / i)
	}

	return stats;
}

