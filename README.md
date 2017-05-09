# data
- daily cron job that grabs the standings
- daily cron job that grabs schedule for the next two weeks
- daily cron job that grabs the outcomes of previous day's games
- daily cron job to scrape the projected starters for the next 7 days

# actions
- daily cron job that rates games for the current date
- daily ratings and guesses are saved in a database

# interface
- console will show the current week's matchups, ratings, and projected starters
- pitchers with two starts in a week are highlighted
- show history of correct/incorrect guesses

# API

## retrieve all games for the current week
## this will be a custom object that had game info, projected starters, and ratings
/getWeeklyMatchups
