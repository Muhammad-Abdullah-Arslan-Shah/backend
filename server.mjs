import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "photos" directory
app.use("/photos", express.static(path.join(__dirname, "photos")));

const allowedOrigins = ["https://sports-perdiction-app.vercel.app"];

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

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

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//SCRAPE SPORTS
async function scrapeSports() {
  return sportsArray.filter((sport) => sport.enabled);
}

app.get("/api/scrapeSports", async (req, res) => {
  try {
    const data = await scrapeSports();
    res.json(data);
  } catch (error) {
    console.error("Error scraping sports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//SCRAPE COUNTRIES
async function scrapeCountries(sport) {
  try {
    const response = await fetch(`https://www.oddsportal.com/${sport}/`);
    const htmlContent = await response.text();

    const countriesWithLeagues = [];
    const spanPattern = /<div class="[^">]*[\s\S]*?<span class="[^">]*">(.*?)<\/span>/gs;

    let match;
    while ((match = spanPattern.exec(htmlContent)) !== null) {
      const countryData = match[0];
      const logoMatch = countryData.match(/<img.*?src="(.*?)"/);
      const logoUrl = logoMatch ? logoMatch[1] : null;
      const countryName = match[1].trim();

      let leagues = [];

      // Find the next sibling div containing leagues
      const nextDivIndex = htmlContent.indexOf('<div class="flex"', match.index + 1);
      if (nextDivIndex !== -1) {
        const endIndex = htmlContent.indexOf("</div>", nextDivIndex);
        const nextDiv = htmlContent.substring(nextDivIndex, endIndex);
        const leagueItems = nextDiv.match(/<li[^>]*>(.*?)<\/li>/gs);
        if (leagueItems) {
          for (const item of leagueItems) {
            const labelMatch = item.match(/<a[^>]*?>(.*?)<\/a>/);
            const label = labelMatch ? labelMatch[1].replace(/\([^()]*\)/g, "").trim() : null;
            const valueMatch = item.match(/<a.*?href="(.*?)"/);
            const value = valueMatch ? `https://www.oddsportal.com${valueMatch[1]}` : null;
            if (label && value) {
              leagues.push({ label, value });
            }
          }
        }
      }

      countriesWithLeagues.push({ country: countryName, logoUrl, leagues });
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

    const data = await scrapeCountries(sport);
    res.json(data);
  } catch (error) {
    console.error("Error scraping countries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//SCRAPE LEAGUES
async function scrapeLeagues(url) {
  try {
    const response = await fetch(url);
    const htmlContent = await response.text();

    const leaguesWithMatches = [];
    const liPattern = /<li[^>]*>(.*?)<\/li>/gs;

    let match;
    while ((match = liPattern.exec(htmlContent)) !== null) {
      const liContent = match[1];
      const spanMatch = liContent.match(/<span[^>]*>(.*?)<\/span>/);
      const aMatch = liContent.match(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/);
      const spanText = spanMatch ? spanMatch[1].replace(/\([^()]*\)/g, "").trim() : null;
      const aText = aMatch ? aMatch[2].replace(/\([^()]*\)/g, "").trim() : null;
      const leagueUrl = aMatch ? `https://www.oddsportal.com${aMatch[1]}` : null;
      const fullText = `${spanText} ${aText}`.trim();

      if (fullText && leagueUrl) {
        leaguesWithMatches.push({ label: fullText, value: leagueUrl });
      }
    }

    return leaguesWithMatches;
  } catch (error) {
    console.error("Error occurred while scraping:", error);
    return [];
  }
}

app.get("/api/scrapeLeagues", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      throw new Error("URL parameter is required");
    }

    const data = await scrapeLeagues(url);
    res.json(data);
  } catch (error) {
    console.error("Error scraping leagues:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//SCRAPE MATCHES
async function scrapeMatches(url) {
  try {
    const response = await fetch(url);
    const htmlContent = await response.text();

    const matches = [];
    const tablePattern = /<table[^>]*class="table-main"[^>]*>(.*?)<\/table>/gs;
    const tableMatch = tablePattern.exec(htmlContent);

    if (tableMatch) {
      const tableContent = tableMatch[1];
      const rowPattern = /<tr[^>]*>(.*?)<\/tr>/gs;

      let rowMatch;
      while ((rowMatch = rowPattern.exec(tableContent)) !== null) {
        const rowContent = rowMatch[1];
        const datePattern = /<td[^>]*class="table-time"[^>]*>(.*?)<\/td>/;
        const teamPattern = /<td[^>]*class="name[^>]*>(.*?)<\/td>/;
        const timeMatch = datePattern.exec(rowContent);
        const teamsMatch = teamPattern.exec(rowContent);

        if (timeMatch && teamsMatch) {
          const time = timeMatch[1].trim();
          const teams = teamsMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
          matches.push({ time, teams });
        }
      }
    }

    return matches;
  } catch (error) {
    console.error("Error occurred while scraping:", error);
    return [];
  }
}

app.get("/api/scrapeMatches", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      throw new Error("URL parameter is required");
    }

    const data = await scrapeMatches(url);
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