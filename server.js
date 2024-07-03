//server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the "photos" directory
app.use("/photos", express.static(path.join(__dirname, "photos")));

const sportsArray = [
  {
    displayName: "FOOTBALL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/football.jpg",
    name: "football",
    handleDirectResult: false,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "BASKETBALL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Basketball.jpg",
    name: "basketball",
    handleDirectResult: false,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "BASEBALL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Baseball.jpg",
    name: "baseball",
    handleDirectResult: false,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "HOCKEY",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Hockey.jpg",
    name: "hockey",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "TENNIS",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Tennis.jpg",
    name: "tennis",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "AMERICAN FOOTBALL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/American Football.jpg",
    name: "american-football",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "AUSSIE RULES",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Aussie Rules.jpg",
    name: "aussie-rules",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "BADMINTON",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/badminton_cleanup.jpg",
    name: "badminton",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "BOXING",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Boxing.jpg",
    name: "boxing",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "CRICKET",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Cricket.jpg",
    name: "cricket",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "DARTS",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Darts.jpg",
    name: "darts",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "ESPORTS",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/esports.jpg",
    name: "esports",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "FUTSAL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Futsal.jpg",
    name: "futsal",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "HANDBALL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Handball.jpg",
    name: "handball",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "MMA",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/MMA.jpg",
    name: "mma",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "RUGBY LEAGUE",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Rugby League.jpg",
    name: "rugby-league",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "RUGBY UNION",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Rugby Union.jpg",
    name: "rugby-union",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "TABLE TENNIS",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/table tennis.jpg",
    name: "table-tennis",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "VOLLEYBALL",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Volleyball.jpg",
    name: "volleyball",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
  {
    displayName: "WATER POLO",
    logoUrl: "https://backend-beryl-seven-78.vercel.app/photos/Water Polo.jpg",
    name: "water-polo",
    handleDirectResult: true,
    partialSum: 2,
    enabled: true,
  },
];

// Create an index for quick lookup
const sportsIndex = {};
sportsArray.forEach((sport) => {
  sportsIndex[sport.name] = sport;
});

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//SCRAPE SPORTS
async function scrapeSports() {
  return sportsArray.filter((sport) => sport.enabled);
}

app.get("/api/scrapeSports", async (req, res) => {
  try {
    //console.time("scrapeSports"); // Start the timer
    const data = await scrapeSports();
    //console.timeEnd("scrapeSports"); // End the timer and log the elapsed time
    res.json(data);
  } catch (error) {
    console.error("Error scraping OddsPortal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//////////////////////////////////////////////////////////

//SCRAPE COUNTRIES
async function scrapeCountries(sport) {
  try {
    const response = await fetch(`https://www.oddsportal.com/${sport}/`);
    const htmlContent = await response.text();

    const countriesWithLeagues = [];

    const spanPattern =
      /<div class="[^">]*[\s\S]*?<span class="[^">]*">(.*?)<\/span>/gs;

    let match;
    while ((match = spanPattern.exec(htmlContent)) !== null) {
      const countryData = match[0];
      const logoMatch = countryData.match(/<img.*?src="(.*?)"/);
      const logoUrl = logoMatch ? logoMatch[1] : null;
      const countryName = match[1].trim();

      let leagues = [];

      // Find the next sibling div containing leagues
      const nextDivIndex = htmlContent.indexOf(
        '<div class="flex"',
        match.index + 1
      );
      if (nextDivIndex !== -1) {
        const endIndex = htmlContent.indexOf("</div>", nextDivIndex);
        const nextDiv = htmlContent.substring(nextDivIndex, endIndex);
        const leagueItems = nextDiv.match(/<li[^>]*>(.*?)<\/li>/gs);
        if (leagueItems) {
          for (const item of leagueItems) {
            const labelMatch = item.match(/<a[^>]*?>(.*?)<\/a>/);
            const label = labelMatch
              ? labelMatch[1].replace(/\([^()]*\)/g, "").trim()
              : null;
            const valueMatch = item.match(/<a.*?href="(.*?)"/);
            const value = valueMatch ? valueMatch[1] : null;
            leagues.push({ label, value });
          }
        }
      }

      countriesWithLeagues.push({ countryName, logoUrl, leagues });
    }

    return countriesWithLeagues;
  } catch (error) {
    console.error("Error occurred while scraping:", error);
    return [];
  }
}

app.get("/api/scrapeCountries", async (req, res) => {
  try {
    const sport = req.query.sport;
    if (!sport) {
      throw new Error("Sport parameter is required");
    }
    //console.time("scrapeCountries"); // Start the timer
    const data = await scrapeCountries(sport);
    //console.timeEnd("scrapeCountries");
    res.json(data);
  } catch (error) {
    console.error("Error scraping countries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//////////////////////////////////////////////////////////

//SCRAPE MATCHES
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to validate JSON
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Helper function to perform fetch with retries
async function fetchWithRetries(url, options, timeout, retries, delay) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, options, timeout);
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      console.warn(`Retrying fetch... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};

async function scrapeMatches(league) {
  const matchesData = [];

  try {
    const response = await fetchWithTimeout(league, {}, 20000); // Increased timeout
    const htmlContent = await response.text();

    const eventIDs = [];
    let matchesOdds;
    const divPattern = /<div class="min-h-\[86px\]">(.*?)<\/div>/gs;
    let match;

    while ((match = divPattern.exec(htmlContent)) !== null) {
      const divContent = match[1];
      const eventIDMatches = divContent.match(/encodeEventId&quot;:&quot;([^&]*)&quot;/g);
      const oddsRequestMatches = divContent.match(/:odds-request="({.*?})"/);

      if (eventIDMatches) {
        for (const eventIDMatch of eventIDMatches) {
          const eventID = eventIDMatch.match(/encodeEventId&quot;:&quot;([^&]*)&quot;/)[1];
          eventIDs.push(eventID);
        }
      }
      if (oddsRequestMatches && oddsRequestMatches.length > 0) {
        const oddsRequestString = oddsRequestMatches[1].replace(/&quot;/g, '"');
        if (isValidJSON(oddsRequestString)) {
          const oddsRequestObject = JSON.parse(oddsRequestString);
          const oddsRequestEndpoint = oddsRequestObject.url;
          const oddsRequestURL = "https://www.oddsportal.com" + oddsRequestEndpoint;
          const responseOdds = await fetchWithRetries(oddsRequestURL, {}, 20000, MAX_RETRIES, RETRY_DELAY);

          if (responseOdds.ok) {
            const oddsContent = await responseOdds.text();
            matchesOdds = JSON.parse(oddsContent);
          } else {
            console.error("Failed to fetch odds data:", responseOdds.status, responseOdds.statusText);
          }
        } else {
          console.error("Invalid JSON in odds request string:", oddsRequestString);
        }
      } else {
        console.log("No :odds-request attribute found.");
      }
    }

    await Promise.all(
      eventIDs.map(async (eventID) => {
        const matchData = {};
        const matchOdds = matchesOdds.d.oddsData[eventID].odds;
        const href = league + eventID;
        matchData.href = href;

        try {
          const response = await fetchWithRetries(href, {}, 50000, MAX_RETRIES, RETRY_DELAY);

          if (!response.ok) {
            throw new Error("Failed to fetch page source");
          }
          const htmlContent = await response.text();

          const startStartDateIndex = htmlContent.indexOf("startDate&quot;:") + "startDate&quot;:".length;
          const endStartDateIndex = htmlContent.indexOf(",", startStartDateIndex);
          if (startStartDateIndex !== -1 && endStartDateIndex !== -1) {
            const startDate = htmlContent.slice(startStartDateIndex, endStartDateIndex);
            matchData.startDateTimestamp = startDate;
          } else {
            console.log("Could not find startDate");
          }

          const startScriptIndex = htmlContent.indexOf('<script type="application/ld+json">') + '<script type="application/ld+json">'.length;
          const endScriptIndex = htmlContent.indexOf("</script>", startScriptIndex);
          const jsonLDContent = htmlContent.slice(startScriptIndex, endScriptIndex);
          const eventData = JSON.parse(jsonLDContent);

          matchData.homeTeamName = eventData.homeTeam.name;
          matchData.homeTeamLogo = eventData.homeTeam.image;
          matchData.awayTeamName = eventData.awayTeam.name;
          matchData.awayTeamLogo = eventData.awayTeam.image;
          matchData.eventStatus = eventData.eventStatus;
          matchData.odds = matchOdds.map((oddsItem) => oddsItem.avgOdds);
        } catch (error) {
          console.error("Error fetching page source:", error);
        }

        matchesData.push(matchData);
      })
    );

    return matchesData;
  } catch (error) {
    console.error("Error scraping matches:", error);
    return [];
  }
}

app.get("/api/scrapeMatches", async (req, res) => {
  try {
    const league = req.query.league;
    if (!league) {
      throw new Error("league parameter is required");
    }
    const data = await scrapeMatches(league);
    res.json(data);
  } catch (error) {
    console.error("Error scraping matches:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////////////////////////////////////////////

function extractSportNameFromUrl(url) {
  const urlParts = url.split("/");
  return urlParts.find((part) => sportsIndex[part]);
}

//SCRAPE MATCH RESULT /
async function scrapeMatchResult(matchUrl) {
  try {
    const sportName = extractSportNameFromUrl(matchUrl);
    const sportObject = sportsIndex[sportName];

    if (!sportObject) {
      throw new Error(`Sport ${sportName} not found`);
    }

    const matchData = {};
    const response = await fetch(matchUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch match page source");
    }

    const htmlContent = await response.text();

    if (matchData.eventStatus !== "Scheduled") {
      const startPartialResultIndex =
        htmlContent.indexOf("partialresult&quot;:&quot;") +
        "partialresult&quot;:&quot;".length;
      const endPartialResultIndex = htmlContent.indexOf(
        "&quot;",
        startPartialResultIndex
      );

      if (startPartialResultIndex !== -1 && endPartialResultIndex !== -1) {
        const partialResult = htmlContent.slice(
          startPartialResultIndex,
          endPartialResultIndex
        );
        matchData.partialResult = partialResult;
      } else {
        console.log("Could not find partialresult");
      }

      const startHomeResultIndex =
        htmlContent.indexOf("homeResult&quot;:&quot;") +
        "homeResult&quot;:&quot;".length;
      const endHomeResultIndex = htmlContent.indexOf(
        "&quot;",
        startHomeResultIndex
      );

      if (startHomeResultIndex !== -1 && endHomeResultIndex !== -1) {
        const homeResult = htmlContent.slice(
          startHomeResultIndex,
          endHomeResultIndex
        );
        matchData.homeResult = homeResult;
      } else {
        console.log("Could not find homeResult");
      }

      const startAwayResultIndex =
        htmlContent.indexOf("awayResult&quot;:&quot;") +
        "awayResult&quot;:&quot;".length;
      const endAwayResultIndex = htmlContent.indexOf(
        "&quot;",
        startAwayResultIndex
      );

      if (startAwayResultIndex !== -1 && endAwayResultIndex !== -1) {
        const awayResult = htmlContent.slice(
          startAwayResultIndex,
          endAwayResultIndex
        );
        matchData.awayResult = awayResult;
      } else {
        console.log("Could not find awayResult");
      }
    }

    const { partialResult, homeResult, awayResult } = matchData;
    console.log("Match Result", matchData);
    let homeScore, awayScore;

    const checkPartial =
      partialResult && sportObject && sportObject.handleDirectResult === false;

    if (homeResult === "" && awayResult === "") {
      homeScore = "";
      awayScore = "";
    } else if (homeResult === undefined && awayResult === undefined) {
      homeScore = undefined;
      awayScore = undefined;
    } else if (checkPartial) {
      const partialSum = sportObject.partialSum || 2;
      const results = partialResult
        .split(",")
        .map((ratio) => ratio.split(":").map(Number));

      homeScore = results
        .slice(0, partialSum)
        .reduce((sum, scores) => sum + scores[0], 0);
      awayScore = results
        .slice(0, partialSum)
        .reduce((sum, scores) => sum + scores[1], 0);
    } else {
      homeScore = parseInt(homeResult, 10);
      awayScore = parseInt(awayResult, 10);
    }

    return { homeScore, awayScore };
  } catch (error) {
    console.error("Error scraping match result:", error);
    return { homeScore: undefined, awayScore: undefined };
  }
}

app.get("/api/scrapeMatchResult", async (req, res) => {
  try {
    const match = req.query.match;

    if (!match) {
      throw new Error("match parameter is required");
    }
    const data = await scrapeMatchResult(match);
    res.json(data);
  } catch (error) {
    console.error("Error match result:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////////////////////////////////////////////
