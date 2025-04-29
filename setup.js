document.getElementById("startMatch").addEventListener("click", () => {
    const team1 = document.getElementById("team1").value.trim();
    const team2 = document.getElementById("team2").value.trim();
    const tossWinner = document.getElementById("tossWinner").value;
    const tossDecision = document.getElementById("tossDecision").value;

    if (!team1 || !team2) {
        alert("Please enter both team names.");
        return;
    }

    const matchData = {
        team1,
        team2,
        tossWinner: tossWinner === "team1" ? team1 : team2,
        tossDecision
    };

    localStorage.setItem("matchData", JSON.stringify(matchData));
    window.location.href = "live.html";
});