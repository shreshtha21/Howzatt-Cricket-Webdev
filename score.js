if(window.location.pathname.includes("setup.html")){
    document.getElementById("startMatch").addEventListener("click", () => {
        localStorage.clear();
        
        const team1 =document.getElementById("team1").value.trim();
        const team2 =document.getElementById("team2").value.trim();
        const tossWinner =document.getElementById("tossWinner").value;
        const tossDecision =document.getElementById("tossDecision").value;
    
        if(!team1 || !team2){
            alert("Please enter both team names.");
            return;
        }
    
        if ((tossWinner === "team1" && tossDecision === "bat" )|| (tossWinner === "team2" && tossDecision==="bowl")) {
            matchData = {
                team1,
                team2,
                tossWinner,
                tossDecision
            };
        } else {
            matchData = {
                team1: team2,
                team2: team1,
                tossWinner,
                tossDecision
            };
        }
        
    
        localStorage.setItem("matchData", JSON.stringify(matchData));
        window.location.href ="live.html";
    });
}

else{

let matchData = JSON.parse(localStorage.getItem("matchData"));
let score = 0;
let wickets = 0;
let balls = 0;
let totalballs = 0;
let overs = 0.0;
let striker = "";
let nonstriker = "";
let currentbowler = "";
let batters = {};
let bowlers = {};
let overslmt = 2.0;
let extras = {wides: 0,noballs: 0, byes: 0, legbyes: 0};
let currentinnings = 1;
let inningsData = [];
let target = 0;
let commentary =[]; 
let inn1score=0;
let inn1wickets=0;

const gameState = {
    score, 
    wickets, 
    balls, 
    totalballs, 
    overs,
    striker, 
    nonstriker, 
    currentbowler,
    batters, 
    bowlers, 
    extras, 
    currentinnings,
    inningsData, 
    target,
    matchData,
    inn1score,
    inn1wickets
};

function savegame() {
    const gameState = {
        score, 
        wickets, 
        balls, 
        totalballs, 
        overs,
        striker, 
        nonstriker, 
        currentbowler,
        batters, 
        bowlers, 
        extras, 
        currentinnings,
        inningsData, 
        target,
        matchData,
        inn1score,
        inn1wickets
    
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}


function rendercomm() {
    const commentlist = document.getElementById("commentlist");
 

    commentlist.innerHTML = "";
    commentary.forEach(line => {
        const li = document.createElement("li");
        li.textContent = line;
        commentlist.appendChild(li);
    });
}

function addcomment(txt) {
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] ${txt}`;
    commentary.unshift(entry);
    localStorage.setItem("commentary", JSON.stringify(commentary));
    rendercomm();
}


function loadgame() {
    const gameState = JSON.parse(localStorage.getItem("gameState"));
    if (gameState) {
        score = gameState.score;
        wickets = gameState.wickets;
        balls = gameState.balls;
        totalballs = gameState.totalballs;
        overs = gameState.overs;
        striker = gameState.striker;
        nonstriker = gameState.nonstriker;
        currentbowler = gameState.currentbowler;
        batters = gameState.batters;
        bowlers = gameState.bowlers;
        extras = gameState.extras;
        currentinnings = gameState.currentinnings;
        inningsData = gameState.inningsData;
        target = gameState.target;
        inn1score = gameState.inn1score;
        inn1wickets = gameState.inn1wickets;

        displayscore();
    } else {
        startgame();
    }
}

function startgame(){
    if(gameState.matchData.tossWinner==="team1" && gameState.matchData.tossDecision==="bat"){
    alert(`${gameState.matchData.team1} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    addcomment(`${gameState.matchData.team1} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    }

    else if(gameState.matchData.tossWinner==="team1" && gameState.matchData.tossDecision==="bowl"){
    alert(`${gameState.matchData.team2} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    addcomment(`${gameState.matchData.team2} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    
    }

    else if(gameState.matchData.tossWinner === "team2" && gameState.matchData.tossDecision==="bat"){
    alert(`${gameState.matchData.team1} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    addcomment(`${gameState.matchData.team1} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    }

    else if(gameState.matchData.tossWinner === "team2" && gameState.matchData.tossDecision==="bowl"){
    alert(`${gameState.matchData.team2} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    addcomment(`${gameState.matchData.team2} won the toss and chose to ${gameState.matchData.tossDecision}.`)
    }

    alert(`${gameState.matchData.team1} to bat.`)
    addcomment(`${gameState.matchData.team1} to bat.`)
    striker = prompt("Enter strike batter's name:");
    nonstriker = prompt("Enter non-strike batter's name:");
    currentbowler = prompt("Enter first bowler's name:");
    batters[striker] = {runs: 0, balls: 0,fours: 0, sixes: 0 };
    batters[nonstriker] = {runs: 0,balls: 0,fours: 0, sixes: 0 };
    bowlers[currentbowler] = {balls: 0,maidens: 0, runs: 0,wickets: 0 };
    
    displayscore();
    savegame();
}

function crrcalc(){
    return overs > 0 ? (score/ ((Math.floor(overs) + (((overs*10) % 10)/6)))).toFixed(2) : "0.00";
}

function rrrcalc(){
    const remballs = (overslmt * 6) - totalballs;
    const removrs = remballs / 6;
    return removrs > 0 ? ((target - score) / removrs).toFixed(2) : "0.00";
}



function updateScore(runs) {
    score += runs;
    balls++;
    totalballs++;
    overs = (Math.floor(totalballs / 6)) + (totalballs % 6) / 10;

    batters[striker].runs += runs;
    batters[striker].balls ++;
    if(runs === 4) batters[striker].fours++;
    if(runs === 6) batters[striker].sixes++;
    bowlers[currentbowler].balls++;
    bowlers[currentbowler].runs += runs;
   
    if(runs>1){
        addcomment(`${striker} scores ${runs} runs.`);
        }
        else if(runs===0){
            addcomment(`${striker} played a dot ball.`);
        }
        else if(runs===4){
            addcomment(`${striker} scores 4 runs. BOUNDARY!`)
        }
        else if(runs===6){
            addcomment(`${striker} scores 6 runs. What a shot!`)
        }
        else{
            addcomment(`${striker} scores ${runs} run.`);
        }
    displayscore();
    if(runs%2 !== 0) swapstrike();
    if(balls % 6 === 0 && balls < overslmt * 6) changebowler();
    if(balls === overslmt * 6 || totalballs >= overslmt * 6) endinni();
    if(currentinnings === 2){
        const ballsbowl = (Math.floor(overs) * 6) + ((overs * 10) % 10);
        const ballsleftt = (overslmt * 6) - ballsbowl;
        const runsreqd = target - score;
        let chase= `Need ${runsreqd} runs in ${ballsleftt} balls`;
        document.getElementById("chasebox").innerHTML = `${chase}`;
        document.getElementById("chasebox").style.background = "yellow";
        document.getElementById("chasebox").style.color = "black";
        document.getElementById("chasebox").style.display="block";
        document.getElementById("chasebox").style.fontSize="25px";
    }
    if(currentinnings === 2 && score >=target){
        endinni(true);
    }
    savegame();

    
}

function swapstrike(){
    [striker, nonstriker] = [nonstriker, striker];
    upbattable();
}

function extraBall(type){
    score++;
    bowlers[currentbowler].runs++;

    if (type === 'wide') extras.wides++;
    if (type === 'no') {
        extras.noballs++;
        batters[striker].balls++;
        const input = prompt("Runs scored on free hit? Type 'W' for wicket.");
        if(input.toLowerCase() === 'w'){
            wickets++;
           
            let newBatter = prompt("Enter next batter's name:");
            batters[newBatter] ={runs: 0, balls: 0, fours: 0, sixes: 0};
            striker = newBatter;
        } 
        else{
            const noballrun = parseInt(input);
            if(!isNaN(noballrun) && noballrun >=0 && noballrun<=6){
                score += noballrun;
                batters[striker].runs += noballrun;
                if(noballrun === 4) batters[striker].fours++;
                if(noballrun === 6) batters[striker].sixes++;
                bowlers[currentbowler].runs += noballrun;
                if(noballrun % 2 !== 0) swapstrike();
                addcomment(`Extra: Free hit - ${noballrun} runs scored.`)
            }
            else{
                alert("ENTER A VALID INPUT");
                score--;
                bowlers[currentbowler].runs--;
                extras.noballs--;
                batters[striker].balls--;
            }
        }
    }
    if(type==="wide"){
        addcomment(`Extra: Wide by ${currentbowler}`);
    }
    else if(type === "no"){
    }
    if(currentinnings === 2){
        const ballsbowl = (Math.floor(overs) * 6) + ((overs * 10) % 10);
        const ballsleftt = (overslmt * 6) - ballsbowl;
        const runsreqd = target - score;
        let chase= `Need ${runsreqd} runs in ${ballsleftt} balls`;
        document.getElementById("chasebox").innerHTML = `${chase}`;
        document.getElementById("chasebox").style.background = "yellow";
        document.getElementById("chasebox").style.color = "black";
        document.getElementById("chasebox").style.display="block";
        document.getElementById("chasebox").style.fontSize="25px";
    }
    if(currentinnings === 2 && score >=target){
        endinni(true);
    }
    displayscore();

    savegame();
}
/*
document.getElementById("byeButton").addEventListener("click", function() {
    updateExtras("bye");
});

document.getElementById("legByeButton").addEventListener("click", function() {
    updateExtras("legbye");
}); html pe hi daal diya
*/
function updateExtras(type){
    let runs =prompt("Enter the number of runs scored:");
    runs =parseInt(runs); 
    if(!isNaN(runs) && runs >= 0 && runs<=6){
    score +=runs;
    balls++;
    totalballs++;
    overs = (Math.floor(totalballs / 6)) +(totalballs % 6) / 10;
    batters[striker].balls ++;
    bowlers[currentbowler].balls++;
    if(runs % 2 !== 0) swapstrike();
    if(type === "bye"){
        extras.byes += runs;
        addcomment(`Extra: Bye - ${runs} run(s)`);
    } 
    else if(type === "legbye"){
        extras.legbyes += runs;
        addcomment(`Extra: Leg Bye - ${runs} run(s)`);
    }

    displayscore();
    savegame();
}
else{
    alert("ENTER A VALID INPUT")
}
if(totalballs%6===0) changebowler();
if(currentinnings === 2){
    const ballsbowl = (Math.floor(overs) * 6) + ((overs * 10) % 10);
    const ballsleftt = (overslmt * 6) - ballsbowl;
    const runsreqd = target - score;
    let chase= `Need ${runsreqd} runs in ${ballsleftt} balls`;
    document.getElementById("chasebox").innerHTML = `${chase}`;
    document.getElementById("chasebox").style.background = "yellow";
    document.getElementById("chasebox").style.color = "black";
    document.getElementById("chasebox").style.display="block";
    document.getElementById("chasebox").style.fontSize="25px";
}
if(currentinnings === 2 && score >=target){
    endinni(true);
}
}

function displayscore(){
    const teamname = currentinnings === 1 ? matchData.team1: matchData.team2;
    const teamdusra = currentinnings === 1 ?matchData.team2 :matchData.team1;

    let display = `${teamname} ${score}/${wickets} (${overs.toFixed(1)}) vs. ${teamdusra}`;
    if(currentinnings=== 2){
        const inn1scoree = gameState.inn1score;
        const inn1wickett = gameState.inn1wickets;
         display += ` ${inn1scoree}/${inn1wickett} (${overslmt}) | Target: ${target}`;
    }
    document.getElementById("scoreDisplay").textContent = display;

    const crr = crrcalc();
    const rrr = currentinnings === 2 ? rrrcalc() : "-";
    document.getElementById("rrdisplay").textContent = `CRR: ${crr} | RRR: ${rrr}`;

    upbattable();
    upbowlers();
}
 


function upbattable(){
    const strike =batters[striker];
    const notstrike =batters[nonstriker];
    const sr = (b) => b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";

    document.getElementById("strikeBatter").innerHTML =
        `<td>${striker}*</td>
        <td>${strike.runs}</td>
        <td>${strike.balls}</td>
        <td>${strike.fours}</td>
        <td>${strike.sixes}</td>
        <td>${sr(strike)}</td>`;

    document.getElementById("nonStrikeBatter").innerHTML =
        `<td>${nonstriker}</td>
        <td>${notstrike.runs}</td>
        <td>${notstrike.balls}</td>
        <td>${notstrike.fours}</td>
        <td>${notstrike.sixes}</td>
        <td>${sr(notstrike)}</td>`;
}

function upbowlers(){
    const b = bowlers[currentbowler];
    const ovr = (Math.floor(b.balls / 6)) + (b.balls % 6) / 10;
    const eco = b.balls ? (b.runs / (b.balls / 6)).toFixed(2) : "0.00";
    
    document.getElementById("bowlerStats").textContent =
        `Bowler: ${currentbowler} | Overs: ${ovr.toFixed(1)} | Runs: ${b.runs} | Wickets: ${b.wickets} | Economy: ${eco}`;
}

function wicket(){
    wickets++;
    batters[striker].balls++;
    bowlers[currentbowler].balls++;
    bowlers[currentbowler].wickets++;
    addcomment(`${striker} is OUT!`);

    let newBatter =prompt("Enter next batter's name:");
    batters[newBatter] ={ runs: 0, balls: 0, fours: 0, sixes: 0 };
    striker =newBatter;

    balls++;
    totalballs++;
    overs = (Math.floor(totalballs/6)) + (totalballs % 6)/10;
    displayscore();

    if(totalballs%6===0){
        setTimeout(() => {
        alert("Over Completed")
        }, 750)
    }

    if(currentinnings === 2 && score>target){
        endinni(true);
        return;
    }

    if(totalballs >= overslmt*6) endinni();
    if(wickets>=10) endinni();
    savegame();
}

function changebowler() {
    if(totalballs >= overslmt * 6) return;

    // Check if the last over was a maiden
    if(bowlers[currentbowler].balls % 6 === 0){
        const thisoverrruns = lastovrruns(currentbowler);
        if(thisoverrruns===0){
            bowlers[currentbowler].maidens++;
        }
    }

    setTimeout(() => {
        currentbowler = prompt("Enter new bowler's name:");
        if (!bowlers[currentbowler]) {
            bowlers[currentbowler] = { balls: 0, runs: 0, wickets: 0, maidens: 0 };
        }
        swapstrike();
        balls = 0;
        savegame();
        addcomment(`${currentbowler} to bowl the next.`);

    }, 500);
}

function lastovrruns(bowlerName){
    const balls = bowlers[bowlerName].balls;
    const runs = bowlers[bowlerName].runs;
    const prevball = balls - 6;
    const prevovr = Math.floor(prevball / 6);
    const prevruns = bowlers[bowlerName]._oversRuns?.[prevovr] || 0;

    const thisoverrruns = runs - prevruns;

    if(!bowlers[bowlerName]._oversRuns){
        bowlers[bowlerName]._oversRuns = {};
    }
    bowlers[bowlerName]._oversRuns[prevovr + 1] = runs;
    return thisoverrruns;
}


function endinni(won = false){
    const teamname = currentinnings === 1 ? matchData.team1 : matchData.team2;
    alert(`${teamname}'s innings over${won ? " - and they won!" : "!"}`);

    inningsData.push({
        team: teamname,
        score, 
        wickets, 
        overs: overs.toFixed(1),
        batters, 
        bowlers, 
        extras
    });

    if(currentinnings ===1){
        currentinnings = 2;
        document.getElementById("chasebox").style.display = "block";
        addcomment(`Innings over: ${teamname} scored ${score}/${wickets} in ${overs.toFixed(1)} overs.`);
        gameState.inn1score = score;
        gameState.inn1wickets = wickets;
        target = score+1;
        score = 0; 
        wickets = 0; 
        balls = 0; 
        totalballs = 0; 
        overs = 0.0;
        batters = {}; bowlers = {};
        extras = { wides: 0, noballs: 0, byes: 0, legbyes: 0 };

            alert(`${matchData.team2} needs ${target} to win.`);  



            striker = prompt("Enter striker batter's name:");
            nonstriker = prompt("Enter non-striker batter's name:");
            currentbowler = prompt("Enter first bowler's name:"); 
 

        batters[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
        batters[nonstriker] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
        bowlers[currentbowler] = { balls: 0, runs: 0, wickets: 0 };

        displayscore();
    } 
    else{
        localStorage.setItem("inningsData", JSON.stringify(inningsData));
        alert("Match Over!");
        location.href = "summary.html";
    }
    savegame();
}

window.onload = function(){
    if (window.location.pathname.includes("scorecard.html")) {
        makesc();
        return;
    }

    if (window.location.pathname.includes("summary.html")) {
        makesumm();
        return;
    }

    loadgame();
};

if(window.location.pathname.includes("scorecard.html") || window.location.pathname.includes("summary.html")){
document.getElementById("resetmatch").addEventListener("click", resetfn);
}

document.getElementById("back")?.addEventListener("click", () => {
    window.location.href = "live.html";
});




function makesc(){
    const inningsData= JSON.parse(localStorage.getItem("inningsData")) || [];
    const gameState =JSON.parse(localStorage.getItem("gameState"));
    const container= document.getElementById("sccontainer");

    if(!container) return;

    inningsData.forEach((inn, index) => {
        const title = `Innings ${index + 1}: ${inn.team}`;
        const html = geninnhtml(title, inn.batters, inn.bowlers, inn.extras, inn.score, inn.wickets, inn.overs);
        container.innerHTML += html;
    });

    if(gameState && Object.keys(gameState.batters).length > 0){
        const title = `Innings ${gameState.currentinnings} (in progress): ${gameState.currentinnings === 1 ? gameState.matchData.team1 : gameState.matchData.team2}`;
        const html = geninnhtml(title, gameState.batters, gameState.bowlers, gameState.extras, gameState.score, gameState.wickets, gameState.overs.toFixed(1));
        container.innerHTML += html;
    }

    if(container.innerHTML===""){
        container.innerHTML = "<p>No match data found.</p>";
    }
}


function geninnhtml(title, batters, bowlers, extras, score, wickets, overs){
    let html = `<h2>${title} - ${score}/${wickets} (${overs} overs)</h2>`;

    html += `<h3>Batting</h3>
        <table border="1">
          <tr>
          <th>Batter</th>
          <th>Runs</th>
          <th>Balls</th>
          <th>4s</th>
          <th>6s</th>
          <th>SR</th>
          </tr>`;

    for (const [name, stats] of Object.entries(batters)) {
        const sr = stats.balls ? ((stats.runs / stats.balls) * 100).toFixed(1) : "0.0";
        html += `<tr>
                    <td>${name}</td>
                    <td>${stats.runs}</td>
                    <td>${stats.balls}</td>
                    <td>${stats.fours}</td>
                    <td>${stats.sixes}</td>
                    <td>${sr}</td>
                </tr>`;
    }

    html += `</table>`;

    html += `<h3>Bowling</h3>
        <table border="1">
          <tr>
            <th>Bowler</th>
            <th>Overs</th>
            <th>Maidens</th>
            <th>Runs</th>
            <th>Wickets</th>
            <th>Economy</th>
          </tr>`;

    for (const [name, stats] of Object.entries(bowlers)) {
        const overs = (Math.floor(stats.balls / 6)) + (stats.balls % 6) / 10;
        const eco = stats.balls ? (stats.runs / (stats.balls / 6)).toFixed(2) : "0.00";
        html += `<tr>
                    <td>${name}</td>
                    <td>${overs.toFixed(1)}</td>
                    <td>${stats.maidens || 0}</td>
                    <td>${stats.runs}</td>
                    <td>${stats.wickets}</td>
                    <td>${eco}</td>
                </tr>`;
    }

    html += `</table>`;
    html += `<p><strong>Extras:</strong> Wides - ${extras.wides}, No Balls - ${extras.noballs}, Byes - ${extras.byes}, LegByes- ${extras.legbyes}</p><hr/>`;

    return html;
}

if(window.location.pathname.includes("scorecard.html") || window.location.pathname.includes("summary.html")){
    document.getElementById("resetmatch").addEventListener("click", resetfn);
    }

function makesumm() {
    const data= JSON.parse(localStorage.getItem("inningsData"));
    const container =document.getElementById("summaryContainer");

    if(!container || !data || data.length < 2){
        if(container) container.innerHTML = "<p>Match data incomplete.</p>";
        return;
    }

    localStorage.removeItem("inningsData");
    localStorage.removeItem("gameState");
    localStorage.removeItem("matchData");

    const [team1Innings, team2Innings]=data;
    const team1Total = team1Innings.score;
    const team2Total = team2Innings.score;

    let result = "";
    if(team2Total>team1Total){
        const winby = 10 - team2Innings.wickets;
        const totalballsin = 6 * overslmt; 
        const ballsused = (Math.floor(team2Innings.overs) * 6) + ((team2Innings.overs*10) % 10);
        const ballsleft = totalballsin - ballsused;

        result = `${team2Innings.team} wins by ${winby} wicket${winby === 1 ? "" : "s"} (${ballsleft} ball${ballsleft === 1 ? "" : "s"} left)!`;
    } 
    else if(team2Total < team1Total){
        const margin = team1Total - team2Total;
        result = `${team1Innings.team} wins by ${margin} run${margin === 1 ? "" : "s"}!`;
    } 
    else{
        result = "Match tied!";
    }

    container.innerHTML =
        `<h2>Result: ${result}</h2>

        <h3>${team1Innings.team} Innings</h3>
        <p>Score: ${team1Innings.score}/${team1Innings.wickets} in ${team1Innings.overs} overs</p>
        <p>Extras - Wides: ${team1Innings.extras.wides}, No Balls: ${team1Innings.extras.noballs}, Byes: ${team1Innings.extras.byes}, Legbyes: ${team1Innings.extras.legbyes}</p>

        <h3>${team2Innings.team} Innings</h3>
        <p>Score: ${team2Innings.score}/${team2Innings.wickets} in ${team2Innings.overs} overs</p>
        <p>Extras - Wides: ${team2Innings.extras.wides}, No Balls: ${team2Innings.extras.noballs}, Byes: ${team2Innings.extras.byes}, Legbyes: ${team2Innings.extras.legbyes}</p>
        `;
}

window.onload = function() {
    if(window.location.pathname.includes("scorecard.html")){
        makesc();
        return;
    }

    if(window.location.pathname.includes("summary.html")){
        makesumm();
        return;
    }

    const savedcomm = JSON.parse(localStorage.getItem("commentary"));
    if (savedcomm) commentary = savedcomm;
    rendercomm();
    loadgame();
};

if(window.location.pathname.includes("scorecard.html") || window.location.pathname.includes("summary.html")){
    document.getElementById("resetmatch").addEventListener("click", resetfn);
    }


if(window.location.pathname.includes("scorecard.html")){
document.getElementById("back").addEventListener("click", () => {
    window.location.href = "live.html";
});
}

function resetfn() {
    localStorage.clear();
  //  localStorage.clear(savedcomm);
 //   localStorage.clear(matchData);
  //  localStorage.clear(inningsData);
    window.location.href = "setup.html";
}
}